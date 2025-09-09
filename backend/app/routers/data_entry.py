from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import SessionLocal
from app.models import Patient, VitalSigns, LabResult, Medication, LifestyleLog
from app.schemas import PatientDataEntry
from app.routers.auth import get_current_user
from app.ml.risk_predictor import RiskPredictor

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/submit")
def submit_patient_data(
    data: PatientDataEntry,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Submit comprehensive patient data for ML analysis
    """
    try:
        # Check if patient exists, create if not
        patient = db.query(Patient).filter(Patient.patient_id == data.patient_id).first()
        
        if not patient:
            # Create new patient
            patient = Patient(
                patient_id=data.patient_id,
                name="Patient " + data.patient_id,  # Default name
                age=data.age,
                gender=data.gender,
                height=data.height,
                weight=data.weight,
                chronic_conditions=data.chronic_conditions or [],
                family_history=data.family_history
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
        else:
            # Update existing patient
            patient.age = data.age
            patient.gender = data.gender
            patient.height = data.height
            patient.weight = data.weight
            patient.chronic_conditions = data.chronic_conditions or []
            patient.family_history = data.family_history
            db.commit()
        
        current_time = datetime.utcnow()
        
        # Add vital signs if provided
        if any([data.systolic_bp, data.diastolic_bp, data.heart_rate, data.blood_oxygen]):
            vitals = VitalSigns(
                patient_id=patient.id,
                systolic_bp=data.systolic_bp,
                diastolic_bp=data.diastolic_bp,
                heart_rate=data.heart_rate,
                blood_oxygen=data.blood_oxygen,
                body_temperature=data.body_temp,
                respiratory_rate=data.respiratory_rate,
                weight=data.weight,
                recorded_at=current_time
            )
            db.add(vitals)
        
        # Add lab results if provided
        if any([data.fasting_glucose, data.hba1c, data.ldl_cholesterol]):
            lab_result = LabResult(
                patient_id=patient.id,
                fasting_glucose=data.fasting_glucose,
                hba1c=data.hba1c,
                ldl_cholesterol=data.ldl_cholesterol,
                hdl_cholesterol=data.hdl_cholesterol,
                triglycerides=data.triglycerides,
                creatinine=data.creatinine,
                hemoglobin=data.hemoglobin,
                test_date=current_time
            )
            db.add(lab_result)
        
        # Add medication information if provided
        if data.current_medications:
            # Parse medication string and create entries
            # For now, create a single entry with the full string
            medication = Medication(
                patient_id=patient.id,
                name=data.current_medications,
                dosage="As prescribed",
                frequency="As prescribed",
                start_date=current_time,
                missed_doses_per_week=data.missed_doses or 0,
                side_effects=data.side_effects,
                is_active=True
            )
            db.add(medication)
        
        # Add lifestyle data if provided
        if any([data.exercise_minutes, data.sleep_duration, data.stress_level]):
            lifestyle = LifestyleLog(
                patient_id=patient.id,
                exercise_minutes=data.exercise_minutes,
                sleep_duration=data.sleep_duration,
                stress_level=data.stress_level,
                smoking_status=data.smoking_status,
                alcohol_usage=data.alcohol_usage,
                log_date=current_time
            )
            db.add(lifestyle)
        
        db.commit()
        
        # Trigger ML prediction
        risk_predictor = RiskPredictor()
        try:
            prediction_result = risk_predictor.predict_risk(patient.id, db)
            
            return {
                "message": "Patient data submitted successfully",
                "patient_id": data.patient_id,
                "prediction": prediction_result,
                "status": "success"
            }
        except Exception as e:
            # Data was saved, but prediction failed
            return {
                "message": "Patient data submitted successfully, but prediction failed",
                "patient_id": data.patient_id,
                "error": str(e),
                "status": "partial_success"
            }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error submitting patient data: {str(e)}")

@router.post("/vitals/{patient_id}")
def add_vital_signs(
    patient_id: str,
    vitals_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Add new vital signs for a patient"""
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    vitals = VitalSigns(
        patient_id=patient.id,
        systolic_bp=vitals_data.get('systolic_bp'),
        diastolic_bp=vitals_data.get('diastolic_bp'),
        heart_rate=vitals_data.get('heart_rate'),
        blood_oxygen=vitals_data.get('blood_oxygen'),
        body_temperature=vitals_data.get('body_temperature'),
        respiratory_rate=vitals_data.get('respiratory_rate'),
        weight=vitals_data.get('weight'),
        recorded_at=datetime.utcnow()
    )
    
    db.add(vitals)
    db.commit()
    
    return {"message": "Vital signs added successfully", "vitals_id": vitals.id}

@router.post("/labs/{patient_id}")
def add_lab_results(
    patient_id: str,
    lab_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Add new lab results for a patient"""
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    lab_result = LabResult(
        patient_id=patient.id,
        fasting_glucose=lab_data.get('fasting_glucose'),
        hba1c=lab_data.get('hba1c'),
        ldl_cholesterol=lab_data.get('ldl_cholesterol'),
        hdl_cholesterol=lab_data.get('hdl_cholesterol'),
        triglycerides=lab_data.get('triglycerides'),
        creatinine=lab_data.get('creatinine'),
        egfr=lab_data.get('egfr'),
        hemoglobin=lab_data.get('hemoglobin'),
        bnp=lab_data.get('bnp'),
        test_date=datetime.utcnow()
    )
    
    db.add(lab_result)
    db.commit()
    
    return {"message": "Lab results added successfully", "lab_id": lab_result.id}

@router.post("/lifestyle/{patient_id}")
def add_lifestyle_log(
    patient_id: str,
    lifestyle_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Add new lifestyle log for a patient"""
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    lifestyle = LifestyleLog(
        patient_id=patient.id,
        exercise_minutes=lifestyle_data.get('exercise_minutes'),
        sleep_duration=lifestyle_data.get('sleep_duration'),
        diet_quality_score=lifestyle_data.get('diet_quality_score'),
        stress_level=lifestyle_data.get('stress_level'),
        smoking_status=lifestyle_data.get('smoking_status'),
        alcohol_usage=lifestyle_data.get('alcohol_usage'),
        log_date=datetime.utcnow()
    )
    
    db.add(lifestyle)
    db.commit()
    
    return {"message": "Lifestyle log added successfully", "log_id": lifestyle.id}
