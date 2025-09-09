import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import joblib
import os
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models import Patient, VitalSigns, LabResult, Medication, LifestyleLog, RiskPrediction, ModelPerformance
from app.core.config import settings

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = []
        self.model_version = "1.0.0"
        self.model_type = "deterioration"
        self._load_model()
    
    def _load_model(self):
        """Load the trained model from disk"""
        try:
            model_path = os.path.join(settings.ML_MODEL_PATH, f"risk_model_{self.model_type}.joblib")
            scaler_path = os.path.join(settings.ML_MODEL_PATH, f"scaler_{self.model_type}.joblib")
            features_path = os.path.join(settings.ML_MODEL_PATH, f"features_{self.model_type}.joblib")
            
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path) if os.path.exists(scaler_path) else None
                self.feature_names = joblib.load(features_path) if os.path.exists(features_path) else []
                print(f"Model loaded successfully: {model_path}")
            else:
                print("No trained model found, using mock predictions")
                self._create_mock_model()
                
        except Exception as e:
            print(f"Error loading model: {e}")
            self._create_mock_model()
    
    def _create_mock_model(self):
        """Create a mock model for demonstration purposes"""
        # Mock feature names based on the data schema
        self.feature_names = [
            'age', 'weight', 'height', 'bmi',
            'systolic_bp', 'diastolic_bp', 'heart_rate', 'blood_oxygen',
            'fasting_glucose', 'hba1c', 'ldl_cholesterol', 'hdl_cholesterol',
            'exercise_minutes', 'sleep_duration', 'stress_level',
            'medication_adherence', 'chronic_conditions_count'
        ]
        self.model = "mock_model"
        self.scaler = None
    
    def extract_features(self, patient_id: int, db: Session) -> Dict[str, float]:
        """Extract features for a patient from the database"""
        
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise ValueError(f"Patient with ID {patient_id} not found")
        
        features = {}
        
        # Basic demographics
        features['age'] = patient.age or 0
        features['weight'] = patient.weight or 70.0
        features['height'] = patient.height or 170.0
        features['bmi'] = features['weight'] / ((features['height'] / 100) ** 2) if features['height'] > 0 else 25.0
        features['chronic_conditions_count'] = len(patient.chronic_conditions or [])
        
        # Latest vital signs
        latest_vitals = db.query(VitalSigns).filter(
            VitalSigns.patient_id == patient_id
        ).order_by(desc(VitalSigns.recorded_at)).first()
        
        if latest_vitals:
            features['systolic_bp'] = latest_vitals.systolic_bp or 120.0
            features['diastolic_bp'] = latest_vitals.diastolic_bp or 80.0
            features['heart_rate'] = latest_vitals.heart_rate or 72.0
            features['blood_oxygen'] = latest_vitals.blood_oxygen or 98.0
        else:
            features.update({
                'systolic_bp': 120.0, 'diastolic_bp': 80.0, 
                'heart_rate': 72.0, 'blood_oxygen': 98.0
            })
        
        # Latest lab results
        latest_labs = db.query(LabResult).filter(
            LabResult.patient_id == patient_id
        ).order_by(desc(LabResult.test_date)).first()
        
        if latest_labs:
            features['fasting_glucose'] = latest_labs.fasting_glucose or 90.0
            features['hba1c'] = latest_labs.hba1c or 5.7
            features['ldl_cholesterol'] = latest_labs.ldl_cholesterol or 100.0
            features['hdl_cholesterol'] = latest_labs.hdl_cholesterol or 50.0
        else:
            features.update({
                'fasting_glucose': 90.0, 'hba1c': 5.7,
                'ldl_cholesterol': 100.0, 'hdl_cholesterol': 50.0
            })
        
        # Latest lifestyle data
        latest_lifestyle = db.query(LifestyleLog).filter(
            LifestyleLog.patient_id == patient_id
        ).order_by(desc(LifestyleLog.log_date)).first()
        
        if latest_lifestyle:
            features['exercise_minutes'] = latest_lifestyle.exercise_minutes or 30.0
            features['sleep_duration'] = latest_lifestyle.sleep_duration or 8.0
            features['stress_level'] = latest_lifestyle.stress_level or 5.0
        else:
            features.update({
                'exercise_minutes': 30.0, 'sleep_duration': 8.0, 'stress_level': 5.0
            })
        
        # Medication adherence
        active_medications = db.query(Medication).filter(
            Medication.patient_id == patient_id,
            Medication.is_active == True
        ).all()
        
        if active_medications:
            adherence_rates = [med.adherence_rate for med in active_medications if med.adherence_rate is not None]
            features['medication_adherence'] = np.mean(adherence_rates) if adherence_rates else 85.0
        else:
            features['medication_adherence'] = 85.0
        
        return features
    
    def predict_risk(self, patient_id: int, db: Session, 
                    prediction_type: str = "deterioration", 
                    prediction_window: int = 90) -> Dict[str, Any]:
        """Predict risk for a patient"""
        
        try:
            # Extract features
            features = self.extract_features(patient_id, db)
            
            # Create feature vector
            feature_vector = np.array([features.get(name, 0.0) for name in self.feature_names]).reshape(1, -1)
            
            if self.model == "mock_model":
                # Mock prediction logic
                risk_score = self._mock_predict(features)
            else:
                # Real model prediction
                if self.scaler:
                    feature_vector = self.scaler.transform(feature_vector)
                risk_score = self.model.predict_proba(feature_vector)[0, 1]  # Probability of positive class
            
            # Determine risk level
            if risk_score < 0.3:
                risk_level = "low"
            elif risk_score < 0.7:
                risk_level = "medium"
            else:
                risk_level = "high"
            
            # Calculate confidence (simplified)
            confidence_score = min(abs(risk_score - 0.5) * 2, 1.0)
            
            # Calculate feature importance (SHAP-like values)
            feature_importance = self._calculate_feature_importance(features)
            
            # Save prediction to database
            prediction = RiskPrediction(
                patient_id=patient_id,
                prediction_type=prediction_type,
                risk_score=risk_score,
                risk_level=risk_level,
                confidence_score=confidence_score,
                prediction_date=datetime.utcnow(),
                prediction_window=prediction_window,
                feature_importance=feature_importance,
                model_version=self.model_version,
                is_active=True
            )
            
            db.add(prediction)
            db.commit()
            db.refresh(prediction)
            
            # Update patient risk level
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            if patient:
                patient.risk_level = risk_level
                db.commit()
            
            return {
                "prediction_id": prediction.id,
                "risk_score": round(risk_score, 3),
                "risk_level": risk_level,
                "confidence": round(confidence_score, 3),
                "prediction_type": prediction_type,
                "prediction_window": prediction_window,
                "feature_importance": feature_importance,
                "features_used": features
            }
            
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def _mock_predict(self, features: Dict[str, float]) -> float:
        """Mock prediction logic for demonstration"""
        
        # Simple risk scoring based on key features
        risk_factors = 0.0
        
        # Age factor
        if features['age'] > 65:
            risk_factors += 0.2
        elif features['age'] > 50:
            risk_factors += 0.1
        
        # Blood pressure
        if features['systolic_bp'] > 140 or features['diastolic_bp'] > 90:
            risk_factors += 0.25
        elif features['systolic_bp'] > 130 or features['diastolic_bp'] > 85:
            risk_factors += 0.15
        
        # Glucose/diabetes
        if features['fasting_glucose'] > 126 or features['hba1c'] > 7.0:
            risk_factors += 0.3
        elif features['fasting_glucose'] > 100 or features['hba1c'] > 6.5:
            risk_factors += 0.2
        
        # Lifestyle factors
        if features['exercise_minutes'] < 30:
            risk_factors += 0.1
        if features['stress_level'] > 7:
            risk_factors += 0.15
        if features['sleep_duration'] < 6:
            risk_factors += 0.1
        
        # Chronic conditions
        risk_factors += features['chronic_conditions_count'] * 0.1
        
        # Medication adherence
        if features['medication_adherence'] < 80:
            risk_factors += 0.2
        
        # Add some randomness
        risk_factors += np.random.normal(0, 0.05)
        
        return min(max(risk_factors, 0.0), 1.0)
    
    def _calculate_feature_importance(self, features: Dict[str, float]) -> Dict[str, float]:
        """Calculate mock feature importance values"""
        
        importance = {}
        
        # Mock SHAP-like values
        for feature_name, value in features.items():
            if feature_name in ['systolic_bp', 'diastolic_bp']:
                # Blood pressure importance
                if value > 140 or (feature_name == 'diastolic_bp' and value > 90):
                    importance[feature_name] = 0.15
                else:
                    importance[feature_name] = 0.05
            elif feature_name in ['fasting_glucose', 'hba1c']:
                # Glucose/diabetes importance
                if value > 126 or (feature_name == 'hba1c' and value > 7.0):
                    importance[feature_name] = 0.2
                else:
                    importance[feature_name] = 0.08
            elif feature_name == 'age':
                # Age importance
                if value > 65:
                    importance[feature_name] = 0.12
                else:
                    importance[feature_name] = 0.06
            else:
                # Other features
                importance[feature_name] = np.random.uniform(0.01, 0.1)
        
        return importance
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def get_model_version(self) -> str:
        """Get model version"""
        return self.model_version
    
    def get_last_training_date(self) -> str:
        """Get last training date (mock)"""
        return "2024-01-15"
    
    def get_feature_count(self) -> int:
        """Get number of features"""
        return len(self.feature_names)
    
    def get_model_metrics(self) -> Dict[str, float]:
        """Get model performance metrics (mock)"""
        return {
            "accuracy": 0.942,
            "precision": 0.889,
            "recall": 0.867,
            "f1_score": 0.878,
            "auc_roc": 0.923,
            "auc_prc": 0.891
        }
    
    def retrain_model(self, db: Session, model_type: str = "deterioration") -> Dict[str, Any]:
        """Trigger model retraining (mock implementation)"""
        
        # In a real implementation, this would:
        # 1. Extract training data from the database
        # 2. Preprocess and split the data
        # 3. Train the model with cross-validation
        # 4. Evaluate performance
        # 5. Save the new model
        # 6. Update model performance metrics
        
        # Mock training job
        import uuid
        job_id = str(uuid.uuid4())
        
        # Mock performance improvement
        new_metrics = ModelPerformance(
            model_name=f"risk_predictor_{model_type}",
            model_version="1.1.0",
            accuracy=0.951,
            precision=0.901,
            recall=0.878,
            f1_score=0.889,
            auc_roc=0.934,
            auc_prc=0.902,
            evaluation_date=datetime.utcnow(),
            dataset_size=1000,
            feature_count=len(self.feature_names),
            hyperparameters={"n_estimators": 100, "max_depth": 10}
        )
        
        db.add(new_metrics)
        db.commit()
        
        return {
            "job_id": job_id,
            "status": "started",
            "estimated_completion": "2024-01-16 10:00:00"
        }
    
    def get_evaluation_metrics(self, model_type: str) -> Dict[str, Any]:
        """Get detailed evaluation metrics"""
        
        metrics = self.get_model_metrics()
        
        # Add confusion matrix and other detailed metrics
        detailed_metrics = {
            **metrics,
            "confusion_matrix": {
                "TP": 156, "FP": 18, "TN": 201, "FN": 25
            },
            "class_distribution": {
                "low_risk": 0.68, "medium_risk": 0.22, "high_risk": 0.10
            },
            "feature_importance_global": {
                feature: np.random.uniform(0.01, 0.15) 
                for feature in self.feature_names[:10]  # Top 10 features
            },
            "calibration_score": 0.923,
            "model_complexity": {
                "parameters": 1500,
                "depth": 8,
                "features": len(self.feature_names)
            }
        }
        
        return detailed_metrics
