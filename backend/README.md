# Hackwell AI - Risk Prediction Engine Backend

This is the backend API for the Hackwell AI Risk Prediction Engine, designed to forecast whether chronic care patients are at risk of deterioration within the next 90 days.

## Features

- **Patient Management**: Complete CRUD operations for patient data
- **Risk Prediction**: AI-driven risk assessment using machine learning models
- **Explainability**: Detailed explanations of AI predictions using SHAP-like values
- **Analytics Dashboard**: Comprehensive analytics and insights
- **Data Entry**: Streamlined data entry for patient vitals, labs, medications, and lifestyle factors
- **Authentication**: Secure JWT-based authentication system

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **PostgreSQL**: Production database (SQLite for development)
- **Pydantic**: Data validation using Python type annotations
- **scikit-learn**: Machine learning library for risk prediction models
- **SHAP**: Model explainability and interpretation
- **JWT**: JSON Web Tokens for authentication

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Patient Management
- `GET /api/patients/` - List all patients (with filtering)
- `POST /api/patients/` - Create new patient
- `GET /api/patients/{patient_id}` - Get patient details
- `PUT /api/patients/{patient_id}` - Update patient
- `DELETE /api/patients/{patient_id}` - Delete patient
- `GET /api/patients/{patient_id}/vitals` - Get patient vital signs
- `GET /api/patients/{patient_id}/labs` - Get patient lab results
- `GET /api/patients/{patient_id}/medications` - Get patient medications
- `GET /api/patients/{patient_id}/lifestyle` - Get patient lifestyle logs
- `GET /api/patients/{patient_id}/notes` - Get clinical notes
- `GET /api/patients/{patient_id}/predictions` - Get risk predictions

### Data Entry
- `POST /api/data-entry/submit` - Submit comprehensive patient data
- `POST /api/data-entry/vitals/{patient_id}` - Add vital signs
- `POST /api/data-entry/labs/{patient_id}` - Add lab results
- `POST /api/data-entry/lifestyle/{patient_id}` - Add lifestyle data

### Risk Predictions
- `POST /api/predictions/{patient_id}/predict` - Create risk prediction
- `GET /api/predictions/{patient_id}/predictions` - Get patient predictions
- `GET /api/predictions/{patient_id}/latest-prediction` - Get latest prediction
- `GET /api/predictions/high-risk` - Get high-risk patients
- `POST /api/predictions/batch-predict` - Batch predict for multiple patients
- `GET /api/predictions/model-status` - Get ML model status
- `GET /api/predictions/evaluation-metrics` - Get model performance metrics

### Analytics
- `GET /api/analytics/overview` - Dashboard overview statistics
- `GET /api/analytics/patient-volume` - Patient volume trends
- `GET /api/analytics/condition-distribution` - Condition distribution
- `GET /api/analytics/risk-distribution` - Risk level distribution
- `GET /api/analytics/recovery-trends` - Recovery rate trends
- `GET /api/analytics/model-performance` - ML model performance
- `GET /api/analytics/predictions-summary` - Predictions summary
- `GET /api/analytics/alerts` - Current high-priority alerts

### Explainability
- `GET /api/explainability/prediction/{prediction_id}` - Explain specific prediction
- `GET /api/explainability/patient/{patient_id}/latest-explanation` - Latest prediction explanation
- `GET /api/explainability/global-features` - Global feature importance
- `GET /api/explainability/ai-insights` - AI insights with explanations
- `GET /api/explainability/model-interpretability` - Model interpretability info
- `GET /api/explainability/feature-analysis/{feature_name}` - Detailed feature analysis
- `POST /api/explainability/generate-report/{patient_id}` - Generate explanation report

## Quick Start

### 1. Setup Environment

```bash
# Clone the repository
cd Hackwell_AI/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Update DATABASE_URL, SECRET_KEY, etc.
```

### 3. Setup Database and Demo Data

```bash
# Run setup script to create tables and demo data
python setup_demo.py
```

### 4. Start the Server

```bash
# Option 1: Using the start script
./start.sh

# Option 2: Direct uvicorn command
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Access the API

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### 6. Demo Login

Use these credentials to test the API:
- **Username**: `demo_doctor`
- **Password**: `demo123`

## Data Models

### Patient
- Demographics (age, gender, contact info)
- Physical measurements (height, weight, BMI)
- Chronic conditions
- Family history

### Vital Signs
- Blood pressure (systolic/diastolic)
- Heart rate
- Blood oxygen saturation
- Body temperature
- Respiratory rate

### Lab Results
- Glucose levels (fasting, HbA1c)
- Cholesterol (LDL, HDL, triglycerides)
- Kidney function (creatinine, eGFR)
- Blood count (hemoglobin)
- Cardiac markers (BNP)

### Medications
- Current medications with dosage
- Adherence rates
- Side effects
- Missed doses tracking

### Lifestyle Factors
- Exercise duration
- Sleep patterns
- Stress levels
- Smoking and alcohol usage

### Risk Predictions
- Risk scores (0-1 probability)
- Risk levels (low, medium, high)
- Confidence scores
- Feature importance (SHAP values)
- Prediction explanations

## Machine Learning Pipeline

### 1. Feature Engineering
- Demographic features
- Vital signs trends
- Lab result patterns
- Medication adherence
- Lifestyle factors
- Chronic condition encodings

### 2. Model Training
- Gradient Boosting models (XGBoost/LightGBM)
- Cross-validation for robust performance
- Hyperparameter optimization
- Feature selection

### 3. Model Evaluation
- AUROC and AUPRC metrics
- Confusion matrix analysis
- Calibration plots
- Fairness metrics

### 4. Explainability
- SHAP (SHapley Additive exPlanations)
- Global and local feature importance
- Partial dependence plots
- Clinical rule extraction

## Deployment

### Production Environment

1. **Database**: Use PostgreSQL for production
2. **Environment Variables**: Set production values in `.env`
3. **SSL**: Configure HTTPS certificates
4. **Load Balancing**: Use nginx or similar
5. **Monitoring**: Set up logging and monitoring

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## API Response Examples

### Patient List Response
```json
{
  "patients": [
    {
      "id": 1,
      "patient_id": "P001",
      "name": "John Smith",
      "age": 45,
      "gender": "Male",
      "risk_level": "low",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Risk Prediction Response
```json
{
  "prediction_id": 123,
  "risk_score": 0.25,
  "risk_level": "low",
  "confidence": 0.87,
  "prediction_type": "deterioration",
  "prediction_window": 90,
  "feature_importance": {
    "systolic_bp": 0.15,
    "hba1c": 0.12,
    "age": 0.10
  }
}
```

### Explanation Response
```json
{
  "prediction_id": 123,
  "patient_id": "P001",
  "global_features": [
    {
      "name": "systolic_bp",
      "importance": 0.18,
      "description": "Systolic blood pressure - higher values increase risk"
    }
  ],
  "local_features": [
    {
      "feature_name": "systolic_bp",
      "importance": 0.15,
      "description": "Systolic blood pressure reading moderately increases the risk",
      "direction": "increases"
    }
  ],
  "key_factors": [
    "Stable vitals",
    "Good medication compliance",
    "Regular exercise habits"
  ],
  "recommendation": "Continue current treatment plan with routine monitoring"
}
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via ORM
- Input validation with Pydantic
- Rate limiting (to be implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Note**: This is a demo implementation for the Hackwell AI challenge. In a production environment, additional security measures, monitoring, and testing would be required.
