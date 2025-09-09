import asyncio
import sys
import os
from datetime import datetime, timedelta
import random

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine
from app.models import Base, User, Patient, VitalSigns, LabResult, Medication, LifestyleLog, ModelPerformance
from app.core.security import get_password_hash

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def create_demo_user():
    """Create demo users for testing"""
    db = SessionLocal()
    
    try:
        # Create first demo user (existing)
        existing_user = db.query(User).filter(User.username == "demo_doctor").first()
        if not existing_user:
            demo_user = User(
                email="doctor@hackwell.ai",
                username="demo_doctor",
                full_name="Dr. Demo Smith",
                role="doctor",
                hashed_password=get_password_hash("demo123"),
                is_active=True
            )
            db.add(demo_user)
            print("Demo user 'demo_doctor' created successfully!")
        else:
            print("Demo user 'demo_doctor' already exists!")
        
        # Create second demo user with email login
        existing_user2 = db.query(User).filter(User.email == "demo@hackwell.ai").first()
        if not existing_user2:
            demo_user2 = User(
                email="demo@hackwell.ai",
                username="demo_user",
                full_name="Demo User",
                role="doctor",
                hashed_password=get_password_hash("demo123"),
                is_active=True
            )
            db.add(demo_user2)
            print("Demo user 'demo_user' created successfully!")
        else:
            print("Demo user with email 'demo@hackwell.ai' already exists!")
        
        db.commit()
        print("\nLogin credentials:")
        print("Option 1: username=demo_doctor, password=demo123")
        print("Option 2: username=demo_user, password=demo123")
        
    except Exception as e:
        print(f"Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()

def create_demo_patients():
    """Create demo patients with sample data"""
    db = SessionLocal()
    
    try:
        # Check if patients already exist
        existing_patients = db.query(Patient).count()
        if existing_patients > 0:
            print(f"Found {existing_patients} existing patients. Skipping demo data creation.")
            return
        
        # Demo patient data
        demo_patients = [
            {
                "patient_id": "P001",
                "name": "John Smith",
                "age": 45,
                "gender": "Male",
                "date_of_birth": "1979-03-15",
                "phone": "+1 (555) 123-4567",
                "email": "john.smith@email.com",
                "address": "123 Main St, Anytown, ST 12345",
                "height": 175.0,
                "weight": 80.0,
                "chronic_conditions": ["Hypertension"],
                "family_history": "Father had heart disease",
                "status": "active",
                "risk_level": "low"
            },
            {
                "patient_id": "P002",
                "name": "Sarah Johnson",
                "age": 32,
                "gender": "Female",
                "date_of_birth": "1992-08-22",
                "phone": "+1 (555) 234-5678",
                "email": "sarah.johnson@email.com",
                "address": "456 Oak Ave, Somewhere, ST 23456",
                "height": 165.0,
                "weight": 68.0,
                "chronic_conditions": ["Type 2 Diabetes"],
                "family_history": "Mother had diabetes",
                "status": "active",
                "risk_level": "medium"
            },
            {
                "patient_id": "P003",
                "name": "Michael Brown",
                "age": 67,
                "gender": "Male",
                "date_of_birth": "1957-12-10",
                "phone": "+1 (555) 345-6789",
                "email": "michael.brown@email.com",
                "address": "789 Pine St, Elsewhere, ST 34567",
                "height": 180.0,
                "weight": 90.0,
                "chronic_conditions": ["Cardiac Arrhythmia", "Hypertension"],
                "family_history": "Multiple heart conditions in family",
                "status": "active",
                "risk_level": "high"
            }
        ]
        
        created_patients = []
        for patient_data in demo_patients:
            patient = Patient(**patient_data)
            db.add(patient)
            created_patients.append(patient)
        
        db.commit()
        
        # Add sample vital signs, lab results, medications, and lifestyle data
        for patient in created_patients:
            db.refresh(patient)
            create_sample_data_for_patient(db, patient)
        
        print(f"Created {len(demo_patients)} demo patients with sample data!")
        
    except Exception as e:
        print(f"Error creating demo patients: {e}")
        db.rollback()
    finally:
        db.close()

def create_sample_data_for_patient(db, patient):
    """Create sample medical data for a patient"""
    
    # Create multiple vital signs entries
    for i in range(5):
        date_offset = timedelta(days=i * 7)  # Weekly readings
        vitals = VitalSigns(
            patient_id=patient.id,
            systolic_bp=random.randint(110, 160),
            diastolic_bp=random.randint(70, 100),
            heart_rate=random.randint(60, 100),
            blood_oxygen=random.randint(95, 100),
            body_temperature=random.uniform(36.0, 37.5),
            respiratory_rate=random.randint(12, 20),
            weight=patient.weight + random.uniform(-2, 2),
            recorded_at=datetime.utcnow() - date_offset
        )
        db.add(vitals)
    
    # Create lab results
    for i in range(3):
        date_offset = timedelta(days=i * 30)  # Monthly labs
        lab_result = LabResult(
            patient_id=patient.id,
            fasting_glucose=random.randint(80, 140),
            hba1c=random.uniform(5.0, 8.0),
            ldl_cholesterol=random.randint(80, 160),
            hdl_cholesterol=random.randint(35, 80),
            triglycerides=random.randint(100, 250),
            creatinine=random.uniform(0.8, 1.5),
            hemoglobin=random.uniform(12.0, 16.0),
            test_date=datetime.utcnow() - date_offset
        )
        db.add(lab_result)
    
    # Create medications
    medications = ["Lisinopril", "Metformin", "Atorvastatin", "Aspirin"]
    for i, med_name in enumerate(medications[:2]):  # 2 medications per patient
        medication = Medication(
            patient_id=patient.id,
            name=med_name,
            dosage=f"{random.choice([5, 10, 20, 40])}mg",
            frequency="Once daily",
            start_date=datetime.utcnow() - timedelta(days=random.randint(30, 365)),
            adherence_rate=random.uniform(70, 95),
            missed_doses_per_week=random.randint(0, 3),
            is_active=True
        )
        db.add(medication)
    
    # Create lifestyle logs
    for i in range(10):
        date_offset = timedelta(days=i * 3)  # Every 3 days
        lifestyle = LifestyleLog(
            patient_id=patient.id,
            exercise_minutes=random.randint(0, 60),
            sleep_duration=random.uniform(6, 9),
            stress_level=random.randint(1, 10),
            smoking_status=random.choice(["never", "former", "current"]),
            alcohol_usage=random.choice(["none", "moderate", "heavy"]),
            log_date=datetime.utcnow() - date_offset
        )
        db.add(lifestyle)
    
    db.commit()

def create_model_performance_data():
    """Create sample model performance data"""
    db = SessionLocal()
    
    try:
        # Check if performance data already exists
        existing_performance = db.query(ModelPerformance).count()
        if existing_performance > 0:
            print("Model performance data already exists!")
            return
        
        # Create sample performance data
        models = [
            {
                "model_name": "Risk Prediction Model",
                "model_version": "1.0.0",
                "accuracy": 0.942,
                "precision": 0.889,
                "recall": 0.867,
                "f1_score": 0.878,
                "auc_roc": 0.923,
                "auc_prc": 0.891,
                "evaluation_date": datetime.utcnow() - timedelta(days=7),
                "dataset_size": 1000,
                "feature_count": 17,
                "hyperparameters": {"n_estimators": 100, "max_depth": 8}
            },
            {
                "model_name": "Treatment Response Model",
                "model_version": "1.0.0",
                "accuracy": 0.897,
                "precision": 0.856,
                "recall": 0.834,
                "f1_score": 0.845,
                "auc_roc": 0.901,
                "auc_prc": 0.867,
                "evaluation_date": datetime.utcnow() - timedelta(days=5),
                "dataset_size": 800,
                "feature_count": 15,
                "hyperparameters": {"n_estimators": 150, "max_depth": 6}
            },
            {
                "model_name": "Readmission Prediction",
                "model_version": "1.0.0",
                "accuracy": 0.915,
                "precision": 0.878,
                "recall": 0.845,
                "f1_score": 0.861,
                "auc_roc": 0.912,
                "auc_prc": 0.883,
                "evaluation_date": datetime.utcnow() - timedelta(days=3),
                "dataset_size": 1200,
                "feature_count": 20,
                "hyperparameters": {"n_estimators": 200, "max_depth": 10}
            }
        ]
        
        for model_data in models:
            performance = ModelPerformance(**model_data)
            db.add(performance)
        
        db.commit()
        print(f"Created {len(models)} model performance records!")
        
    except Exception as e:
        print(f"Error creating model performance data: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main setup function"""
    print("Starting Hackwell AI Backend Setup...")
    
    # Create database tables
    create_tables()
    
    # Create demo user
    create_demo_user()
    
    # Create demo patients
    create_demo_patients()
    
    # Create model performance data
    create_model_performance_data()
    
    print("\nSetup completed successfully!")
    print("\nYou can now:")
    print("1. Start the API server: python main.py")
    print("2. Access the API docs: http://localhost:8000/docs")
    print("3. Login with: username=demo_doctor, password=demo123")

if __name__ == "__main__":
    main()
