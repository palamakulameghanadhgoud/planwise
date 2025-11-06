from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from typing import List
from ..database import sleep_logs_collection, users_collection
from ..schemas import SleepLogCreate, SleepLogResponse
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/sleep", tags=["sleep"])

@router.post("/", response_model=SleepLogResponse, status_code=201)
async def log_sleep(
    sleep_data: SleepLogCreate,
    current_user: dict = Depends(get_current_user)
):
    sleep_dict = sleep_data.dict()
    sleep_dict["user_id"] = current_user["id"]
    sleep_dict["created_at"] = datetime.utcnow()
    
    # Calculate sleep debt
    user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
    daily_goal = user.get("daily_sleep_goal", 8.0)
    sleep_debt = max(0, daily_goal - sleep_dict["hours_slept"])
    sleep_dict["sleep_debt"] = sleep_debt
    
    result = await sleep_logs_collection.insert_one(sleep_dict)
    sleep_dict["id"] = str(result.inserted_id)
    sleep_dict.pop("_id", None)
    
    return sleep_dict

@router.get("/", response_model=List[SleepLogResponse])
async def get_sleep_logs(
    days: int = 7,
    current_user: dict = Depends(get_current_user)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    logs = []
    async for log in sleep_logs_collection.find({
        "user_id": current_user["id"],
        "created_at": {"$gte": start_date}
    }).sort("created_at", -1):
        log["id"] = str(log["_id"])
        log.pop("_id", None)
        logs.append(log)
    
    return logs

@router.get("/debt", response_model=dict)
async def get_sleep_debt(
    days: int = 7,
    current_user: dict = Depends(get_current_user)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    total_debt = 0
    count = 0
    async for log in sleep_logs_collection.find({
        "user_id": current_user["id"],
        "created_at": {"$gte": start_date}
    }):
        total_debt += log.get("sleep_debt", 0)
        count += 1
    
    avg_debt = total_debt / count if count > 0 else 0
    
    return {
        "total_sleep_debt": total_debt,
        "average_sleep_debt": avg_debt,
        "days_tracked": count
    }
