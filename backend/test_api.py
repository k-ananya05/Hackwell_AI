import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
USERNAME = "demo_doctor"
PASSWORD = "demo123"

class HackwellAPITester:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.token = None
        self.headers = {}
    
    def login(self, username=USERNAME, password=PASSWORD):
        """Login and get access token"""
        print("🔐 Logging in...")
        
        # For FastAPI, we need to send as form data
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            params={"username": username, "password": password}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
            print("✅ Login successful!")
            return True
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return False
    
    def test_health_check(self):
        """Test health check endpoint"""
        print("\n🏥 Testing health check...")
        
        response = requests.get(f"{self.base_url}/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    
    def test_patients_list(self):
        """Test patients list endpoint"""
        print("\n👥 Testing patients list...")
        
        response = requests.get(
            f"{self.base_url}/api/patients/",
            headers=self.headers
        )
        
        if response.status_code == 200:
            patients = response.json()
            print(f"✅ Found {len(patients)} patients")
            if patients:
                print(f"   First patient: {patients[0]['name']} ({patients[0]['patient_id']})")
        else:
            print(f"❌ Patients list failed: {response.status_code} - {response.text}")
    
    def test_patient_details(self, patient_id="P001"):
        """Test patient details endpoint"""
        print(f"\n🔍 Testing patient details for {patient_id}...")
        
        response = requests.get(
            f"{self.base_url}/api/patients/{patient_id}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            patient = response.json()
            print(f"✅ Patient details: {patient['name']}, Age: {patient['age']}, Risk: {patient['risk_level']}")
        else:
            print(f"❌ Patient details failed: {response.status_code} - {response.text}")
    
    def test_risk_prediction(self, patient_id="P001"):
        """Test risk prediction endpoint"""
        print(f"\n🎯 Testing risk prediction for {patient_id}...")
        
        response = requests.post(
            f"{self.base_url}/api/predictions/{patient_id}/predict",
            headers=self.headers,
            params={"prediction_type": "deterioration", "prediction_window": 90}
        )
        
        if response.status_code == 200:
            prediction = response.json()
            print(f"✅ Prediction successful:")
            print(f"   Risk Score: {prediction['risk_score']}")
            print(f"   Risk Level: {prediction['risk_level']}")
            print(f"   Confidence: {prediction['confidence']}")
            return prediction['prediction_id']
        else:
            print(f"❌ Risk prediction failed: {response.status_code} - {response.text}")
            return None
    
    def test_prediction_explanation(self, patient_id="P001"):
        """Test prediction explanation endpoint"""
        print(f"\n🧠 Testing prediction explanation for {patient_id}...")
        
        response = requests.get(
            f"{self.base_url}/api/explainability/patient/{patient_id}/latest-explanation",
            headers=self.headers
        )
        
        if response.status_code == 200:
            explanation = response.json()
            print(f"✅ Explanation generated:")
            print(f"   Risk Level: {explanation['risk_level']}")
            print(f"   Top Factors: {explanation['key_factors'][:3]}")
            print(f"   Recommendation: {explanation['recommendation']}")
        else:
            print(f"❌ Explanation failed: {response.status_code} - {response.text}")
    
    def test_analytics_overview(self):
        """Test analytics overview endpoint"""
        print("\n📊 Testing analytics overview...")
        
        response = requests.get(
            f"{self.base_url}/api/analytics/overview",
            headers=self.headers
        )
        
        if response.status_code == 200:
            analytics = response.json()
            print(f"✅ Analytics overview:")
            print(f"   Total Patients: {analytics['total_patients']}")
            print(f"   Active Cases: {analytics['active_cases']}")
            print(f"   Critical Alerts: {analytics['critical_alerts']}")
            print(f"   Recovery Rate: {analytics['recovery_rate']}%")
        else:
            print(f"❌ Analytics overview failed: {response.status_code} - {response.text}")
    
    def test_data_entry(self):
        """Test data entry endpoint"""
        print("\n📝 Testing data entry...")
        
        sample_data = {
            "patient_id": "TEST001",
            "age": 55,
            "gender": "Female",
            "height": 165.0,
            "weight": 70.0,
            "chronic_conditions": ["Diabetes", "Hypertension"],
            "systolic_bp": 140.0,
            "diastolic_bp": 90.0,
            "heart_rate": 80.0,
            "fasting_glucose": 120.0,
            "hba1c": 7.2,
            "exercise_minutes": 30.0,
            "stress_level": 6.0
        }
        
        response = requests.post(
            f"{self.base_url}/api/data-entry/submit",
            headers=self.headers,
            json=sample_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Data entry successful:")
            print(f"   Status: {result['status']}")
            if 'prediction' in result:
                pred = result['prediction']
                print(f"   Auto-prediction: {pred['risk_level']} risk")
        else:
            print(f"❌ Data entry failed: {response.status_code} - {response.text}")
    
    def test_model_status(self):
        """Test model status endpoint"""
        print("\n🤖 Testing model status...")
        
        response = requests.get(
            f"{self.base_url}/api/predictions/model-status",
            headers=self.headers
        )
        
        if response.status_code == 200:
            status = response.json()
            print(f"✅ Model status:")
            print(f"   Model Loaded: {status['model_loaded']}")
            print(f"   Model Version: {status['model_version']}")
            print(f"   Feature Count: {status['feature_count']}")
            print(f"   Accuracy: {status['model_performance']['accuracy']}")
        else:
            print(f"❌ Model status failed: {response.status_code} - {response.text}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Hackwell AI API Tests")
        print("=" * 50)
        
        # Test health check (no auth required)
        self.test_health_check()
        
        # Login first
        if not self.login():
            print("❌ Cannot continue tests without authentication")
            return
        
        # Run authenticated tests
        self.test_patients_list()
        self.test_patient_details()
        self.test_risk_prediction()
        self.test_prediction_explanation()
        self.test_analytics_overview()
        self.test_data_entry()
        self.test_model_status()
        
        print("\n" + "=" * 50)
        print("🎉 API Tests Completed!")

def main():
    """Main test function"""
    tester = HackwellAPITester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
