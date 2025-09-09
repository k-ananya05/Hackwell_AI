from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any
from app.database import SessionLocal
from app.models import Patient, RiskPrediction
from app.routers.auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/insights")
def get_ai_insights(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get AI insights with explanations for high-confidence predictions"""
    
    # Return mock AI insights data
    insights = [
        {
            "id": 1,
            "type": "Deterioration Prediction",
            "patient": "John Smith (P001)",
            "confidence": 92.5,
            "prediction": "High risk of deterioration",
            "factors": ["Elevated heart rate trend", "Decreased medication adherence", "Recent lab abnormalities"],
            "recommendation": "Increase monitoring frequency and schedule immediate follow-up",
            "status": "urgent"
        },
        {
            "id": 2,
            "type": "Readmission Risk",
            "patient": "Sarah Johnson (P002)",
            "confidence": 87.3,
            "prediction": "Medium risk of readmission",
            "factors": ["Multiple comorbidities", "Social determinants", "Previous readmission history"],
            "recommendation": "Enhanced discharge planning and home health services",
            "status": "pending"
        },
        {
            "id": 3,
            "type": "Medication Response",
            "patient": "Michael Brown (P003)",
            "confidence": 89.1,
            "prediction": "Low medication response expected",
            "factors": ["Genetic markers", "Drug interactions", "Metabolism rate"],
            "recommendation": "Consider alternative medication or dosage adjustment",
            "status": "active"
        }
    ]
    
    return {"insights": insights[:limit]}

@router.get("/model-performance")
def get_model_performance(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get model performance metrics"""
    
    # Return mock model performance data
    performance_data = [
        {
            "model_name": "Patient Deterioration Model",
            "accuracy": 0.92,
            "precision": 0.89,
            "recall": 0.94,
            "f1_score": 0.91,
            "auc_roc": 0.96,
            "last_updated": "2025-09-08T10:00:00Z",
            "status": "active"
        },
        {
            "model_name": "Readmission Risk Model",
            "accuracy": 0.88,
            "precision": 0.85,
            "recall": 0.91,
            "f1_score": 0.88,
            "auc_roc": 0.93,
            "last_updated": "2025-09-07T15:30:00Z",
            "status": "active"
        },
        {
            "model_name": "Medication Response Model",
            "accuracy": 0.86,
            "precision": 0.83,
            "recall": 0.89,
            "f1_score": 0.86,
            "auc_roc": 0.91,
            "last_updated": "2025-09-06T12:45:00Z",
            "status": "active"
        }
    ]
    
    return {"models": performance_data}

@router.get("/metrics")
def get_ai_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get overall AI system metrics"""
    
    # Return mock AI metrics
    metrics = {
        "total_predictions": 1247,
        "successful_predictions": 1189,
        "accuracy_rate": 95.3,
        "models_deployed": 3,
        "active_alerts": 8,
        "processed_this_week": 89,
        "improvement_over_last_month": 2.1,
        "confidence_distribution": {
            "high": 67,
            "medium": 28,
            "low": 5
        },
        "prediction_types": {
            "deterioration": 45,
            "readmission": 35,
            "medication_response": 20
        }
    }
    
    return {"metrics": metrics}
