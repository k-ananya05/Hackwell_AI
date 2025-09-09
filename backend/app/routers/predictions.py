from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime
from app.database import SessionLocal
from app.models import Patient, RiskPrediction
from app.schemas import RiskPrediction as RiskPredictionSchema
from app.routers.auth import get_current_user
from app.ml.risk_predictor import RiskPredictor

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{patient_id}/predict")
def create_risk_prediction(
    patient_id: str,
    prediction_type: str = "deterioration",
    prediction_window: int = 90,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new risk prediction for a patient"""
    
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    try:
        risk_predictor = RiskPredictor()
        prediction_result = risk_predictor.predict_risk(
            patient.id, 
            db, 
            prediction_type=prediction_type,
            prediction_window=prediction_window
        )
        
        return prediction_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/{patient_id}/predictions", response_model=List[RiskPredictionSchema])
def get_patient_predictions(
    patient_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all predictions for a patient"""
    
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    predictions = db.query(RiskPrediction).filter(
        RiskPrediction.patient_id == patient.id
    ).order_by(desc(RiskPrediction.prediction_date)).limit(limit).all()
    
    return predictions

@router.get("/{patient_id}/latest-prediction", response_model=RiskPredictionSchema)
def get_latest_prediction(
    patient_id: str,
    prediction_type: str = "deterioration",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get the latest prediction for a patient"""
    
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    prediction = db.query(RiskPrediction).filter(
        RiskPrediction.patient_id == patient.id,
        RiskPrediction.prediction_type == prediction_type,
        RiskPrediction.is_active == True
    ).order_by(desc(RiskPrediction.prediction_date)).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="No predictions found for this patient")
    
    return prediction

@router.get("/high-risk", response_model=List[dict])
def get_high_risk_patients(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get patients with high risk predictions"""
    
    # Get latest predictions for each patient with high risk
    high_risk_predictions = db.query(RiskPrediction).filter(
        RiskPrediction.risk_level == "high",
        RiskPrediction.is_active == True
    ).order_by(desc(RiskPrediction.risk_score)).limit(limit).all()
    
    result = []
    for prediction in high_risk_predictions:
        patient = db.query(Patient).filter(Patient.id == prediction.patient_id).first()
        if patient:
            result.append({
                "patient": {
                    "id": patient.patient_id,
                    "name": patient.name,
                    "age": patient.age,
                    "risk_level": patient.risk_level
                },
                "prediction": {
                    "risk_score": prediction.risk_score,
                    "confidence": prediction.confidence_score,
                    "prediction_type": prediction.prediction_type,
                    "prediction_date": prediction.prediction_date,
                    "window_days": prediction.prediction_window
                }
            })
    
    return result

@router.post("/batch-predict")
def batch_predict_risk(
    patient_ids: List[str] = None,
    prediction_type: str = "deterioration",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Run batch predictions for multiple patients or all patients"""
    
    if patient_ids:
        patients = db.query(Patient).filter(Patient.patient_id.in_(patient_ids)).all()
    else:
        # Run for all active patients
        patients = db.query(Patient).filter(Patient.status == "active").all()
    
    risk_predictor = RiskPredictor()
    results = []
    errors = []
    
    for patient in patients:
        try:
            prediction_result = risk_predictor.predict_risk(
                patient.id, 
                db, 
                prediction_type=prediction_type
            )
            results.append({
                "patient_id": patient.patient_id,
                "prediction": prediction_result,
                "status": "success"
            })
        except Exception as e:
            errors.append({
                "patient_id": patient.patient_id,
                "error": str(e),
                "status": "failed"
            })
    
    return {
        "total_patients": len(patients),
        "successful_predictions": len(results),
        "failed_predictions": len(errors),
        "results": results,
        "errors": errors
    }

@router.get("/model-status")
def get_model_status(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get current status of ML models"""
    
    risk_predictor = RiskPredictor()
    
    return {
        "model_loaded": risk_predictor.is_model_loaded(),
        "model_version": risk_predictor.get_model_version(),
        "last_training_date": risk_predictor.get_last_training_date(),
        "supported_prediction_types": [
            "deterioration",
            "readmission",
            "medication_response"
        ],
        "feature_count": risk_predictor.get_feature_count(),
        "model_performance": risk_predictor.get_model_metrics()
    }

@router.post("/retrain-model")
def retrain_model(
    model_type: str = "deterioration",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Trigger model retraining (admin only)"""
    
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        risk_predictor = RiskPredictor()
        result = risk_predictor.retrain_model(db, model_type)
        
        return {
            "message": "Model retraining initiated",
            "model_type": model_type,
            "training_job_id": result.get("job_id"),
            "status": "started"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@router.get("/evaluation-metrics")
def get_evaluation_metrics(
    model_type: str = "deterioration",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get detailed evaluation metrics for the model"""
    
    risk_predictor = RiskPredictor()
    
    try:
        metrics = risk_predictor.get_evaluation_metrics(model_type)
        
        return {
            "model_type": model_type,
            "metrics": metrics,
            "evaluation_date": datetime.utcnow(),
            "model_version": risk_predictor.get_model_version()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metrics: {str(e)}")
