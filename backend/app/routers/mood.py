from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from typing import List
from ..database import mood_logs_collection
from ..schemas import MoodLogCreate, MoodLogResponse
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/mood", tags=["mood"])

@router.post("/", response_model=MoodLogResponse, status_code=201)
async def log_mood(
    mood_data: MoodLogCreate,
    current_user: dict = Depends(get_current_user)
):
    mood_dict = mood_data.dict()
    mood_dict["user_id"] = current_user["id"]
    mood_dict["created_at"] = datetime.utcnow()
    
    result = await mood_logs_collection.insert_one(mood_dict)
    mood_dict["id"] = str(result.inserted_id)
    mood_dict.pop("_id", None)
    
    return mood_dict

@router.get("/", response_model=List[MoodLogResponse])
async def get_mood_logs(
    days: int = 7,
    current_user: dict = Depends(get_current_user)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    logs = []
    async for log in mood_logs_collection.find({
        "user_id": current_user["id"],
        "created_at": {"$gte": start_date}
    }).sort("created_at", -1):
        log["id"] = str(log["_id"])
        log.pop("_id", None)
        logs.append(log)
    
    return logs

@router.get("/latest", response_model=MoodLogResponse)
async def get_latest_mood(current_user: dict = Depends(get_current_user)):
    log = await mood_logs_collection.find_one(
        {"user_id": current_user["id"]},
        sort=[("created_at", -1)]
    )
    
    if not log:
        raise HTTPException(status_code=404, detail="No mood logs found")
    
    log["id"] = str(log["_id"])
    log.pop("_id", None)
    
    return log
