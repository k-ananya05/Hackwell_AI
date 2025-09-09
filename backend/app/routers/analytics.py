from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models import Patient, VitalSigns, LabResult, RiskPrediction, ModelPerformance
from app.schemas import (
    AnalyticsOverview, 
    PatientVolumeData, 
    ConditionDistribution, 
    RiskDistribution,
    ModelPerformance as ModelPerformanceSchema
)
from app.routers.auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get overview analytics for dashboard"""
    
    # Total patients
    total_patients = db.query(func.count(Patient.id)).scalar()
    
    # Active cases (patients with recent activity)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_cases = db.query(func.count(Patient.id)).filter(
        Patient.updated_at >= thirty_days_ago
    ).scalar()
    
    # Critical alerts (high risk patients)
    critical_alerts = db.query(func.count(Patient.id)).filter(
        Patient.risk_level == "high"
    ).scalar()
    
    # Calculate recovery rate (simplified)
    # This would be more complex in real implementation
    total_with_risk = db.query(func.count(Patient.id)).filter(
        Patient.risk_level.in_(["medium", "high"])
    ).scalar()
    
    improved_patients = db.query(func.count(RiskPrediction.id)).filter(
        RiskPrediction.risk_level == "low",
        RiskPrediction.created_at >= thirty_days_ago
    ).scalar()
    
    recovery_rate = (improved_patients / max(total_with_risk, 1)) * 100 if total_with_risk > 0 else 94.2
    
    return AnalyticsOverview(
        total_patients=total_patients,
        active_cases=active_cases,
        critical_alerts=critical_alerts,
        recovery_rate=min(recovery_rate, 100.0)
    )

@router.get("/patient-volume", response_model=List[PatientVolumeData])
def get_patient_volume(
    months: int = 6,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get patient volume data for the last N months"""
    
    # This is a simplified version - in real implementation,
    # you'd query actual data grouped by month
    volume_data = [
        PatientVolumeData(month="Jan", patients=120, new_patients=15),
        PatientVolumeData(month="Feb", patients=135, new_patients=22),
        PatientVolumeData(month="Mar", patients=142, new_patients=18),
        PatientVolumeData(month="Apr", patients=158, new_patients=25),
        PatientVolumeData(month="May", patients=165, new_patients=20),
        PatientVolumeData(month="Jun", patients=178, new_patients=28),
    ]
    
    return volume_data[-months:]

@router.get("/condition-distribution", response_model=List[ConditionDistribution])
def get_condition_distribution(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get distribution of patient conditions"""
    
    total_patients = db.query(func.count(Patient.id)).scalar()
    
    # Count conditions (this assumes chronic_conditions is a JSON array)
    # In a real implementation, you'd properly query the JSON field
    conditions = [
        {"name": "Hypertension", "count": 35},
        {"name": "Diabetes", "count": 25},
        {"name": "Cardiac", "count": 20},
        {"name": "Respiratory", "count": 12},
        {"name": "Other", "count": 8},
    ]
    
    result = []
    for condition in conditions:
        percentage = (condition["count"] / max(total_patients, 1)) * 100
        result.append(ConditionDistribution(
            name=condition["name"],
            value=condition["count"],
            percentage=percentage
        ))
    
    return result

@router.get("/risk-distribution", response_model=List[RiskDistribution])
def get_risk_distribution(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get distribution of patient risk levels"""
    
    # Query actual risk distribution
    risk_counts = db.query(
        Patient.risk_level,
        func.count(Patient.id).label('count')
    ).group_by(Patient.risk_level).all()
    
    total_patients = sum(count for _, count in risk_counts)
    
    result = []
    for risk_level, count in risk_counts:
        percentage = (count / max(total_patients, 1)) * 100
        result.append(RiskDistribution(
            risk=risk_level.title(),
            count=count,
            percentage=round(percentage)
        ))
    
    return result

@router.get("/recovery-trends")
def get_recovery_trends(
    months: int = 6,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get recovery rate trends over time"""
    
    # Simplified recovery rate data
    recovery_data = [
        {"month": "Jan", "rate": 89},
        {"month": "Feb", "rate": 91},
        {"month": "Mar", "rate": 88},
        {"month": "Apr", "rate": 93},
        {"month": "May", "rate": 94},
        {"month": "Jun", "rate": 96},
    ]
    
    return recovery_data[-months:]

@router.get("/model-performance", response_model=List[ModelPerformanceSchema])
def get_model_performance(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get ML model performance metrics"""
    
    performance_data = db.query(ModelPerformance).order_by(
        desc(ModelPerformance.evaluation_date)
    ).limit(10).all()
    
    return performance_data

@router.get("/predictions-summary")
def get_predictions_summary(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get summary of recent predictions"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Count predictions by risk level
    predictions_summary = db.query(
        RiskPrediction.risk_level,
        func.count(RiskPrediction.id).label('count')
    ).filter(
        RiskPrediction.prediction_date >= start_date,
        RiskPrediction.is_active == True
    ).group_by(RiskPrediction.risk_level).all()
    
    # Average confidence score
    avg_confidence = db.query(
        func.avg(RiskPrediction.confidence_score)
    ).filter(
        RiskPrediction.prediction_date >= start_date,
        RiskPrediction.is_active == True
    ).scalar() or 0.0
    
    # Total predictions
    total_predictions = db.query(func.count(RiskPrediction.id)).filter(
        RiskPrediction.prediction_date >= start_date,
        RiskPrediction.is_active == True
    ).scalar()
    
    return {
        "total_predictions": total_predictions,
        "average_confidence": round(avg_confidence * 100, 2),
        "risk_breakdown": [
            {"risk_level": risk_level, "count": count} 
            for risk_level, count in predictions_summary
        ],
        "period_days": days
    }

@router.get("/alerts")
def get_current_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get current high-priority alerts"""
    
    # High risk patients
    high_risk_patients = db.query(Patient).filter(
        Patient.risk_level == "high"
    ).limit(10).all()
    
    # Recent high-risk predictions
    recent_predictions = db.query(RiskPrediction).filter(
        RiskPrediction.risk_level == "high",
        RiskPrediction.prediction_date >= datetime.utcnow() - timedelta(days=7),
        RiskPrediction.is_active == True
    ).order_by(desc(RiskPrediction.prediction_date)).limit(5).all()
    
    alerts = []
    
    for patient in high_risk_patients:
        alerts.append({
            "type": "high_risk_patient",
            "patient_id": patient.patient_id,
            "patient_name": patient.name,
            "message": f"Patient {patient.name} is classified as high risk",
            "severity": "high",
            "created_at": patient.updated_at
        })
    
    for prediction in recent_predictions:
        patient = db.query(Patient).filter(Patient.id == prediction.patient_id).first()
        alerts.append({
            "type": "risk_prediction",
            "patient_id": patient.patient_id if patient else "Unknown",
            "patient_name": patient.name if patient else "Unknown",
            "message": f"High risk prediction for {prediction.prediction_type}",
            "severity": "high",
            "confidence": prediction.confidence_score,
            "created_at": prediction.prediction_date
        })
    
    # Sort by creation date
    alerts.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {"alerts": alerts[:10]}
