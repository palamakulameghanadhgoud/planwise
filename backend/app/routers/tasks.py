from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List, Optional
from ..database import tasks_collection, users_collection
from ..schemas import TaskCreate, TaskUpdate, TaskResponse
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Point calculation based on priority
PRIORITY_MULTIPLIERS = {
    "low": 1.0,      # Base points
    "medium": 1.5,   # 50% bonus
    "high": 2.0,     # 100% bonus (double)
    "urgent": 3.0    # 200% bonus (triple)
}

def calculate_task_points(task: dict) -> int:
    """Calculate points for completing a task based on priority, duration, and cognitive load"""
    base_points = task.get("estimated_duration", 30) // 10  # Base: 1 point per 10 minutes
    
    # Apply priority multiplier
    priority = task.get("priority", "medium")
    priority_multiplier = PRIORITY_MULTIPLIERS.get(priority, 1.0)
    
    # Bonus for deep work
    deep_work_bonus = 5 if task.get("is_deep_work", False) else 0
    
    # Bonus for high cognitive load (8-10)
    cognitive_load = task.get("cognitive_load", 5)
    cognitive_bonus = 3 if cognitive_load >= 8 else 0
    
    # Calculate total points
    total_points = int((base_points * priority_multiplier) + deep_work_bonus + cognitive_bonus)
    
    # Minimum 1 point for any completed task
    return max(1, total_points)


@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    task_dict = task_data.dict()
    task_dict["user_id"] = current_user["id"]
    task_dict["completed"] = False
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()
    
    result = await tasks_collection.insert_one(task_dict)
    task_dict["id"] = str(result.inserted_id)
    task_dict.pop("_id", None)
    
    return task_dict

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    completed: Optional[bool] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {"user_id": current_user["id"]}
    if completed is not None:
        query["completed"] = completed
    
    tasks = []
    async for task in tasks_collection.find(query).sort("created_at", -1):
        task["id"] = str(task["_id"])
        task.pop("_id", None)
        tasks.append(task)
    
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    task = await tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": current_user["id"]
    })
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task["id"] = str(task["_id"])
    task.pop("_id", None)
    
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    task = await tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": current_user["id"]
    })
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # If marking complete, add points based on priority and other factors
    if "completed" in update_data and update_data["completed"] and not task.get("completed"):
        points = calculate_task_points(task)
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$inc": {"total_points": points}}
        )
        update_data["completed_at"] = datetime.utcnow()
    
    # If marking incomplete, remove points
    elif "completed" in update_data and not update_data["completed"] and task.get("completed"):
        points = calculate_task_points(task)
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$inc": {"total_points": -points}}
        )
        update_data["completed_at"] = None
    
    await tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )
    
    updated_task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    updated_task["id"] = str(updated_task["_id"])
    updated_task.pop("_id", None)
    
    return updated_task

@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await tasks_collection.delete_one({
        "_id": ObjectId(task_id),
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return None
