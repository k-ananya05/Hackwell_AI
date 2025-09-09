from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import SessionLocal
from app.models import User
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for user settings
class UserProfile(BaseModel):
    full_name: str
    email: str
    phone: str
    department: str
    license: str

class UserSettings(BaseModel):
    notifications: Dict[str, Any] = {}
    preferences: Dict[str, Any] = {}
    security: Dict[str, Any] = {}

@router.get("/profile")
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile information"""
    return {
        "full_name": current_user.full_name or "Dr. Demo User",
        "email": current_user.email or "demo@hackwell.ai",
        "phone": "+1 (555) 123-4567",
        "department": "Cardiology",
        "license": "MD123456789"
    }

@router.put("/profile")
def update_user_profile(
    profile: UserProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    # Update user fields
    current_user.full_name = profile.full_name
    current_user.email = profile.email
    
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

@router.get("/settings")
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user settings and preferences"""
    # For now, return default settings
    # In a real app, you'd store these in the database
    return {
        "notifications": {
            "email": True,
            "push": False,
            "sms": True,
            "criticalAlerts": True,
            "weeklyReports": False
        },
        "preferences": {
            "theme": "light",
            "language": "en",
            "timezone": "America/New_York",
            "dateFormat": "MM/DD/YYYY",
            "defaultView": "dashboard"
        },
        "security": {
            "twoFactor": True,
            "sessionTimeout": "30",
            "passwordExpiry": "90",
            "loginAlerts": True
        }
    }

@router.put("/settings")
def update_user_settings(
    settings: UserSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user settings and preferences"""
    # For now, just return success
    # In a real app, you'd store these in the database
    return {"message": "Settings updated successfully"}
