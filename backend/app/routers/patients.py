from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from app.database import SessionLocal
from app.models import Patient, VitalSigns, LabResult, Medication, LifestyleLog, ClinicalNote, RiskPrediction
from app.schemas import (
    Patient as PatientSchema, 
    PatientCreate, 
    PatientUpdate,
    VitalSigns as VitalSignsSchema,
    LabResult as LabResultSchema,
    Medication as MedicationSchema,
    LifestyleLog as LifestyleLogSchema,
    ClinicalNote as ClinicalNoteSchema,
    RiskPrediction as RiskPredictionSchema
)
from app.routers.auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[PatientSchema])
def get_patients(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Patient)
    
    if search:
        query = query.filter(
            (Patient.name.ilike(f"%{search}%")) |
            (Patient.patient_id.ilike(f"%{search}%"))
        )
    
    if status:
        query = query.filter(Patient.status == status)
    
    if risk_level:
        query = query.filter(Patient.risk_level == risk_level)
    
    patients = query.offset(skip).limit(limit).all()
    return patients

@router.post("/", response_model=PatientSchema)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if patient_id already exists
    existing_patient = db.query(Patient).filter(Patient.patient_id == patient.patient_id).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient ID already exists")
    
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/{patient_id}", response_model=PatientSchema)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientSchema)
def update_patient(
    patient_id: str,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}

# Vital Signs endpoints
@router.get("/{patient_id}/vitals", response_model=List[VitalSignsSchema])
def get_patient_vitals(
    patient_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    vitals = db.query(VitalSigns).filter(
        VitalSigns.patient_id == patient.id
    ).order_by(desc(VitalSigns.recorded_at)).limit(limit).all()
    
    return vitals

# Lab Results endpoints
@router.get("/{patient_id}/labs", response_model=List[LabResultSchema])
def get_patient_labs(
    patient_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    labs = db.query(LabResult).filter(
        LabResult.patient_id == patient.id
    ).order_by(desc(LabResult.test_date)).limit(limit).all()
    
    return labs

# Medications endpoints
@router.get("/{patient_id}/medications", response_model=List[MedicationSchema])
def get_patient_medications(
    patient_id: str,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    query = db.query(Medication).filter(Medication.patient_id == patient.id)
    
    if active_only:
        query = query.filter(Medication.is_active == True)
    
    medications = query.order_by(desc(Medication.start_date)).all()
    return medications

# Lifestyle logs endpoints
@router.get("/{patient_id}/lifestyle", response_model=List[LifestyleLogSchema])
def get_patient_lifestyle(
    patient_id: str,
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    lifestyle = db.query(LifestyleLog).filter(
        LifestyleLog.patient_id == patient.id
    ).order_by(desc(LifestyleLog.log_date)).limit(limit).all()
    
    return lifestyle

# Clinical notes endpoints
@router.get("/{patient_id}/notes", response_model=List[ClinicalNoteSchema])
def get_patient_notes(
    patient_id: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    notes = db.query(ClinicalNote).filter(
        ClinicalNote.patient_id == patient.id
    ).order_by(desc(ClinicalNote.visit_date)).limit(limit).all()
    
    return notes

# Risk predictions endpoints
@router.get("/{patient_id}/predictions", response_model=List[RiskPredictionSchema])
def get_patient_predictions(
    patient_id: str,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    query = db.query(RiskPrediction).filter(RiskPrediction.patient_id == patient.id)
    
    if active_only:
        query = query.filter(RiskPrediction.is_active == True)
    
    predictions = query.order_by(desc(RiskPrediction.prediction_date)).all()
    return predictions

# Patient statistics
@router.get("/{patient_id}/stats")
def get_patient_stats(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get latest vital signs
    latest_vitals = db.query(VitalSigns).filter(
        VitalSigns.patient_id == patient.id
    ).order_by(desc(VitalSigns.recorded_at)).first()
    
    # Get latest lab results
    latest_labs = db.query(LabResult).filter(
        LabResult.patient_id == patient.id
    ).order_by(desc(LabResult.test_date)).first()
    
    # Get active medications count
    active_medications = db.query(func.count(Medication.id)).filter(
        Medication.patient_id == patient.id,
        Medication.is_active == True
    ).scalar()
    
    # Get latest risk prediction
    latest_prediction = db.query(RiskPrediction).filter(
        RiskPrediction.patient_id == patient.id,
        RiskPrediction.is_active == True
    ).order_by(desc(RiskPrediction.prediction_date)).first()
    
    return {
        "patient": patient,
        "latest_vitals": latest_vitals,
        "latest_labs": latest_labs,
        "active_medications_count": active_medications,
        "latest_prediction": latest_prediction
    }
