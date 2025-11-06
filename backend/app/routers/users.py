from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from ..database import users_collection
from ..schemas import UserResponse, UserUpdate
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_data = user_update.dict(exclude_unset=True)
    
    if update_data:
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
        
        updated_user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
        updated_user["id"] = str(updated_user["_id"])
        updated_user.pop("_id", None)
        updated_user.pop("hashed_password", None)
        
        return updated_user
    
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["id"] = str(user["_id"])
    user.pop("_id", None)
    user.pop("hashed_password", None)
    
    return user
