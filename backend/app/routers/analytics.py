from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from typing import Dict
from ..database import tasks_collection, mood_logs_collection, sleep_logs_collection, user_skills_collection
from ..auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard", response_model=Dict)
async def get_dashboard_analytics(
    days: int = 7,
    current_user: dict = Depends(get_current_user)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Tasks analytics
    total_tasks = await tasks_collection.count_documents({"user_id": current_user["id"]})
    completed_tasks = await tasks_collection.count_documents({
        "user_id": current_user["id"],
        "completed": True
    })
    pending_tasks = total_tasks - completed_tasks
    
    recent_completed = await tasks_collection.count_documents({
        "user_id": current_user["id"],
        "completed": True,
        "updated_at": {"$gte": start_date}
    })
    
    # Mood analytics
    mood_logs = []
    async for log in mood_logs_collection.find({
        "user_id": current_user["id"],
        "created_at": {"$gte": start_date}
    }):
        mood_logs.append(log)
    
    avg_mood = sum(log.get("mood_score", 0) for log in mood_logs) / len(mood_logs) if mood_logs else 0
    avg_focus = sum(log.get("focus_level", 0) for log in mood_logs) / len(mood_logs) if mood_logs else 0
    
    # Sleep analytics
    sleep_logs = []
    async for log in sleep_logs_collection.find({
        "user_id": current_user["id"],
        "created_at": {"$gte": start_date}
    }):
        sleep_logs.append(log)
    
    total_sleep = sum(log.get("hours_slept", 0) for log in sleep_logs)
    avg_sleep = total_sleep / len(sleep_logs) if sleep_logs else 0
    total_sleep_debt = sum(log.get("sleep_debt", 0) for log in sleep_logs)
    
    # Skills analytics
    total_skills = await user_skills_collection.count_documents({"user_id": current_user["id"]})
    total_practice_time = 0
    async for skill in user_skills_collection.find({"user_id": current_user["id"]}):
        total_practice_time += skill.get("total_practice_time", 0)
    
    return {
        "tasks": {
            "total": total_tasks,
            "completed": completed_tasks,
            "pending": pending_tasks,
            "completed_this_period": recent_completed,
            "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        },
        "mood": {
            "average_mood_score": round(avg_mood, 1),
            "average_focus_level": round(avg_focus, 1),
            "logs_count": len(mood_logs)
        },
        "sleep": {
            "average_hours": round(avg_sleep, 1),
            "total_sleep_debt": round(total_sleep_debt, 1),
            "logs_count": len(sleep_logs)
        },
        "skills": {
            "total_skills": total_skills,
            "total_practice_minutes": total_practice_time
        },
        "gamification": {
            "total_points": current_user.get("total_points", 0),
            "current_streak": current_user.get("current_streak", 0),
            "longest_streak": current_user.get("longest_streak", 0),
            "level": current_user.get("level", 1)
        }
    }

@router.get("/productivity-trends", response_model=Dict)
async def get_productivity_trends(
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    daily_stats = {}
    for i in range(days):
        day = start_date + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        completed = await tasks_collection.count_documents({
            "user_id": current_user["id"],
            "completed": True,
            "updated_at": {"$gte": day_start, "$lt": day_end}
        })
        
        daily_stats[day.strftime("%Y-%m-%d")] = {
            "completed_tasks": completed
        }
    
    return {"daily_productivity": daily_stats}
