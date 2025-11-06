from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List
from ..database import user_skills_collection, achievements_collection, user_achievements_collection
from ..schemas import SkillCreate, SkillResponse, AchievementResponse
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.post("/", response_model=SkillResponse, status_code=201)
async def create_skill(
    skill_data: SkillCreate,
    current_user: dict = Depends(get_current_user)
):
    skill_dict = skill_data.dict()
    skill_dict["user_id"] = current_user["id"]
    skill_dict["current_level"] = 1
    skill_dict["total_practice_time"] = 0
    skill_dict["created_at"] = datetime.utcnow()
    skill_dict["last_practiced"] = None
    
    result = await user_skills_collection.insert_one(skill_dict)
    skill_dict["id"] = str(result.inserted_id)
    skill_dict.pop("_id", None)
    
    return skill_dict

@router.get("/", response_model=List[SkillResponse])
async def get_skills(current_user: dict = Depends(get_current_user)):
    skills = []
    async for skill in user_skills_collection.find({"user_id": current_user["id"]}).sort("created_at", -1):
        skill["id"] = str(skill["_id"])
        skill.pop("_id", None)
        skills.append(skill)
    
    return skills

@router.put("/{skill_id}/practice", response_model=SkillResponse)
async def log_practice(
    skill_id: str,
    minutes: int,
    current_user: dict = Depends(get_current_user)
):
    skill = await user_skills_collection.find_one({
        "_id": ObjectId(skill_id),
        "user_id": current_user["id"]
    })
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    new_total = skill.get("total_practice_time", 0) + minutes
    new_level = (new_total // 60) + 1  # Level up every 60 minutes
    
    await user_skills_collection.update_one(
        {"_id": ObjectId(skill_id)},
        {
            "$set": {
                "total_practice_time": new_total,
                "current_level": new_level,
                "last_practiced": datetime.utcnow()
            }
        }
    )
    
    updated_skill = await user_skills_collection.find_one({"_id": ObjectId(skill_id)})
    updated_skill["id"] = str(updated_skill["_id"])
    updated_skill.pop("_id", None)
    
    return updated_skill

@router.get("/achievements", response_model=List[AchievementResponse])
async def get_achievements(current_user: dict = Depends(get_current_user)):
    # Get all available achievements
    all_achievements = []
    async for achievement in achievements_collection.find():
        achievement["id"] = str(achievement["_id"])
        achievement.pop("_id", None)
        
        # Check if user has this achievement
        user_achievement = await user_achievements_collection.find_one({
            "user_id": current_user["id"],
            "achievement_id": achievement["id"]
        })
        
        achievement["unlocked"] = user_achievement is not None
        if user_achievement:
            achievement["unlocked_at"] = user_achievement.get("unlocked_at")
        
        all_achievements.append(achievement)
    
    return all_achievements
