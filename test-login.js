// Simple script to test login functionality
const testLogin = async () => {
  try {
    console.log('Testing login API...');
    
    // Test login
    const loginResponse = await fetch('http://localhost:8000/api/auth/login?username=demo_doctor&password=demo123', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);
    
    // Test protected endpoint
    const token = loginData.access_token;
    const patientsResponse = await fetch('http://localhost:8000/api/patients', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!patientsResponse.ok) {
      throw new Error(`Patients API failed: ${patientsResponse.status}`);
    }
    
    const patientsData = await patientsResponse.json();
    console.log('Patients data:', patientsData);
    
    // Test analytics
    const analyticsResponse = await fetch('http://localhost:8000/api/analytics/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!analyticsResponse.ok) {
      throw new Error(`Analytics API failed: ${analyticsResponse.status}`);
    }
    
    const analyticsData = await analyticsResponse.json();
    console.log('Analytics data:', analyticsData);
    
    console.log('All tests passed! Backend integration is working.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testLogin();
