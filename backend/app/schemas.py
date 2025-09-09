from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = "doctor"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Patient schemas
class PatientBase(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    date_of_birth: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    chronic_conditions: Optional[List[str]] = []
    family_history: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    chronic_conditions: Optional[List[str]] = None
    family_history: Optional[str] = None
    status: Optional[str] = None
    risk_level: Optional[str] = None

class Patient(PatientBase):
    id: int
    status: str
    risk_level: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Vital Signs schemas
class VitalSignsBase(BaseModel):
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    heart_rate: Optional[float] = None
    blood_oxygen: Optional[float] = None
    body_temperature: Optional[float] = None
    respiratory_rate: Optional[float] = None
    weight: Optional[float] = None
    recorded_at: datetime

class VitalSignsCreate(VitalSignsBase):
    patient_id: int

class VitalSigns(VitalSignsBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Lab Results schemas
class LabResultBase(BaseModel):
    fasting_glucose: Optional[float] = None
    hba1c: Optional[float] = None
    ldl_cholesterol: Optional[float] = None
    hdl_cholesterol: Optional[float] = None
    triglycerides: Optional[float] = None
    creatinine: Optional[float] = None
    egfr: Optional[float] = None
    hemoglobin: Optional[float] = None
    bnp: Optional[float] = None
    test_date: datetime

class LabResultCreate(LabResultBase):
    patient_id: int

class LabResult(LabResultBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Medication schemas
class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    start_date: datetime
    end_date: Optional[datetime] = None
    adherence_rate: Optional[float] = None
    missed_doses_per_week: Optional[int] = None
    side_effects: Optional[str] = None
    is_active: bool = True

class MedicationCreate(MedicationBase):
    patient_id: int

class Medication(MedicationBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Lifestyle Log schemas
class LifestyleLogBase(BaseModel):
    exercise_minutes: Optional[float] = None
    sleep_duration: Optional[float] = None
    diet_quality_score: Optional[float] = None
    stress_level: Optional[float] = None
    smoking_status: Optional[str] = None
    alcohol_usage: Optional[str] = None
    log_date: datetime

class LifestyleLogCreate(LifestyleLogBase):
    patient_id: int

class LifestyleLog(LifestyleLogBase):
    id: int
    patient_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Risk Prediction schemas
class RiskPredictionBase(BaseModel):
    prediction_type: str
    risk_score: float
    risk_level: str
    confidence_score: float
    prediction_window: int
    feature_importance: Optional[Dict[str, Any]] = None
    model_version: str

class RiskPredictionCreate(RiskPredictionBase):
    patient_id: int

class RiskPrediction(RiskPredictionBase):
    id: int
    patient_id: int
    prediction_date: datetime
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Clinical Note schemas
class ClinicalNoteBase(BaseModel):
    note_type: str
    content: str
    visit_date: datetime

class ClinicalNoteCreate(ClinicalNoteBase):
    patient_id: int
    provider_id: int

class ClinicalNote(ClinicalNoteBase):
    id: int
    patient_id: int
    provider_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Data Entry Schema (Combined form data)
class PatientDataEntry(BaseModel):
    # Demographics
    patient_id: str
    age: int
    gender: str
    height: Optional[float] = None
    weight: Optional[float] = None
    chronic_conditions: Optional[List[str]] = []
    family_history: Optional[str] = None
    
    # Vitals
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    heart_rate: Optional[float] = None
    blood_oxygen: Optional[float] = None
    body_temp: Optional[float] = None
    respiratory_rate: Optional[float] = None
    
    # Lab Results
    fasting_glucose: Optional[float] = None
    hba1c: Optional[float] = None
    ldl_cholesterol: Optional[float] = None
    hdl_cholesterol: Optional[float] = None
    triglycerides: Optional[float] = None
    creatinine: Optional[float] = None
    hemoglobin: Optional[float] = None
    
    # Medication
    current_medications: Optional[str] = None
    missed_doses: Optional[int] = None
    side_effects: Optional[str] = None
    
    # Lifestyle
    exercise_minutes: Optional[float] = None
    sleep_duration: Optional[float] = None
    stress_level: Optional[float] = None
    smoking_status: Optional[str] = None
    alcohol_usage: Optional[str] = None

# Analytics schemas
class AnalyticsOverview(BaseModel):
    total_patients: int
    active_cases: int
    critical_alerts: int
    recovery_rate: float
    
class PatientVolumeData(BaseModel):
    month: str
    patients: int
    new_patients: int
    
class ConditionDistribution(BaseModel):
    name: str
    value: int
    percentage: float
    
class RiskDistribution(BaseModel):
    risk: str
    count: int
    percentage: float

# Model Performance schemas
class ModelPerformanceCreate(BaseModel):
    model_name: str
    model_version: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float
    auc_prc: float
    dataset_size: int
    feature_count: int
    hyperparameters: Optional[Dict[str, Any]] = None

class ModelPerformance(BaseModel):
    id: int
    model_name: str
    model_version: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float
    auc_prc: float
    evaluation_date: datetime
    dataset_size: int
    feature_count: int
    hyperparameters: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Explainability schemas
class FeatureImportance(BaseModel):
    feature_name: str
    importance: float
    description: str

class PredictionExplanation(BaseModel):
    prediction_id: int
    patient_id: int
    prediction_type: str
    risk_score: float
    confidence: float
    global_features: List[FeatureImportance]
    local_features: List[FeatureImportance]
    recommendation: str
    factors: List[str]
