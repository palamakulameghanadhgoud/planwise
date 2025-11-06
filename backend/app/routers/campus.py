from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List, Optional
from ..database import campus_events_collection
from ..schemas import CampusEventCreate, CampusEventResponse
from ..auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/campus", tags=["campus"])

@router.post("/events", response_model=CampusEventResponse, status_code=201)
async def create_event(
    event_data: CampusEventCreate,
    current_user: dict = Depends(get_current_user)
):
    event_dict = event_data.dict()
    event_dict["created_by"] = current_user["id"]
    event_dict["created_at"] = datetime.utcnow()
    
    result = await campus_events_collection.insert_one(event_dict)
    event_dict["id"] = str(result.inserted_id)
    event_dict.pop("_id", None)
    
    return event_dict

@router.get("/events", response_model=List[CampusEventResponse])
async def get_events(
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if category:
        query["category"] = category
    
    events = []
    async for event in campus_events_collection.find(query).sort("event_date", 1):
        event["id"] = str(event["_id"])
        event.pop("_id", None)
        events.append(event)
    
    return events

@router.get("/events/{event_id}", response_model=CampusEventResponse)
async def get_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    event = await campus_events_collection.find_one({"_id": ObjectId(event_id)})
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event["id"] = str(event["_id"])
    event.pop("_id", None)
    
    return event

@router.delete("/events/{event_id}", status_code=204)
async def delete_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    event = await campus_events_collection.find_one({"_id": ObjectId(event_id)})
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Only creator can delete
    if event.get("created_by") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    await campus_events_collection.delete_one({"_id": ObjectId(event_id)})
    
    return None
