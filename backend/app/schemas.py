from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    preferred_deep_work_start: Optional[int] = None
    preferred_deep_work_end: Optional[int] = None
    daily_sleep_goal: Optional[float] = None

class UserResponse(UserBase):
    id: str
    bio: Optional[str] = None
    total_points: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    level: int = 1
    created_at: datetime

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "other"
    priority: str = "medium"
    estimated_duration: int = 30
    cognitive_load: int = 5
    is_deep_work: bool = False
    scheduled_date: Optional[datetime] = None
    scheduled_start_time: Optional[datetime] = None
    scheduled_end_time: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    estimated_duration: Optional[int] = None
    cognitive_load: Optional[int] = None
    is_deep_work: Optional[bool] = None
    scheduled_date: Optional[datetime] = None
    scheduled_start_time: Optional[datetime] = None
    scheduled_end_time: Optional[datetime] = None
    completed: Optional[bool] = None
    order: Optional[int] = None

class TaskResponse(TaskBase):
    id: str
    user_id: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Mood Log Schemas
class MoodLogBase(BaseModel):
    mood_score: int = Field(ge=1, le=10)
    focus_level: int = Field(ge=1, le=10)
    energy_level: int = Field(ge=1, le=10)
    stress_level: int = Field(ge=1, le=10)
    notes: Optional[str] = None

class MoodLogCreate(MoodLogBase):
    pass

class MoodLogResponse(MoodLogBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Sleep Log Schemas
class SleepLogBase(BaseModel):
    hours_slept: float
    quality: int = Field(ge=1, le=10)
    notes: Optional[str] = None

class SleepLogCreate(SleepLogBase):
    pass

class SleepLogResponse(SleepLogBase):
    id: str
    user_id: str
    sleep_debt: float = 0
    created_at: datetime

    class Config:
        from_attributes = True

# Skill Schemas
class SkillBase(BaseModel):
    skill_name: str
    target_level: int = 10

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: str
    user_id: str
    current_level: int = 1
    total_practice_time: int = 0
    created_at: datetime
    last_practiced: Optional[datetime] = None

    class Config:
        from_attributes = True

# Achievement Schemas
class AchievementBase(BaseModel):
    name: str
    description: str
    icon: str = "🏆"
    points: int = 10
    category: str = "general"

class AchievementResponse(AchievementBase):
    id: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Campus Event Schemas
class CampusEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "general"
    event_date: datetime
    location: Optional[str] = None

class CampusEventCreate(CampusEventBase):
    pass

class CampusEventResponse(CampusEventBase):
    id: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
