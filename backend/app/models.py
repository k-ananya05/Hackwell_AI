from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="doctor")  # doctor, admin, nurse
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True)  # Public ID like P001
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    date_of_birth = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(Text)
    emergency_contact = Column(String)  # Added for frontend compatibility
    medical_history = Column(Text)  # Added for frontend compatibility
    height = Column(Float)  # cm
    weight = Column(Float)  # kg
    chronic_conditions = Column(JSON)  # List of conditions
    family_history = Column(Text)
    status = Column(String, default="active")  # active, inactive, discharged
    risk_level = Column(String, default="low")  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vitals = relationship("VitalSigns", back_populates="patient", cascade="all, delete-orphan")
    lab_results = relationship("LabResult", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    lifestyle_logs = relationship("LifestyleLog", back_populates="patient", cascade="all, delete-orphan")
    predictions = relationship("RiskPrediction", back_populates="patient", cascade="all, delete-orphan")
    clinical_notes = relationship("ClinicalNote", back_populates="patient", cascade="all, delete-orphan")

class VitalSigns(Base):
    __tablename__ = "vital_signs"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    systolic_bp = Column(Float)
    diastolic_bp = Column(Float)
    heart_rate = Column(Float)
    blood_oxygen = Column(Float)
    body_temperature = Column(Float)
    respiratory_rate = Column(Float)
    weight = Column(Float)
    recorded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    patient = relationship("Patient", back_populates="vitals")

class LabResult(Base):
    __tablename__ = "lab_results"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    fasting_glucose = Column(Float)
    hba1c = Column(Float)
    ldl_cholesterol = Column(Float)
    hdl_cholesterol = Column(Float)
    triglycerides = Column(Float)
    creatinine = Column(Float)
    egfr = Column(Float)
    hemoglobin = Column(Float)
    bnp = Column(Float)
    test_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    patient = relationship("Patient", back_populates="lab_results")

class Medication(Base):
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    name = Column(String)
    dosage = Column(String)
    frequency = Column(String)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True), nullable=True)
    adherence_rate = Column(Float)  # 0-100%
    missed_doses_per_week = Column(Integer)
    side_effects = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    patient = relationship("Patient", back_populates="medications")

class LifestyleLog(Base):
    __tablename__ = "lifestyle_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    exercise_minutes = Column(Float)
    sleep_duration = Column(Float)
    diet_quality_score = Column(Float)  # 1-10
    stress_level = Column(Float)  # 1-10
    smoking_status = Column(String)  # never, former, current
    alcohol_usage = Column(String)
    log_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    patient = relationship("Patient", back_populates="lifestyle_logs")

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    prediction_type = Column(String)  # deterioration, readmission, etc.
    risk_score = Column(Float)  # 0-1 probability
    risk_level = Column(String)  # low, medium, high
    confidence_score = Column(Float)  # Model confidence 0-1
    prediction_date = Column(DateTime(timezone=True))
    prediction_window = Column(Integer)  # Days (e.g., 90 for 90-day prediction)
    feature_importance = Column(JSON)  # SHAP values or feature importance
    model_version = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    patient = relationship("Patient", back_populates="predictions")

class ClinicalNote(Base):
    __tablename__ = "clinical_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    provider_id = Column(Integer, ForeignKey("users.id"))
    note_type = Column(String)  # visit, phone_call, emergency, etc.
    content = Column(Text)
    visit_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="clinical_notes")
    provider = relationship("User")

class ModelPerformance(Base):
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String)
    model_version = Column(String)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    auc_roc = Column(Float)
    auc_prc = Column(Float)
    evaluation_date = Column(DateTime(timezone=True))
    dataset_size = Column(Integer)
    feature_count = Column(Integer)
    hyperparameters = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
