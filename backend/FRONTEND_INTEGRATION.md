# Frontend Integration Guide

This guide explains how to integrate your Next.js frontend with the Hackwell AI backend API.

## API Base URL

For local development:
```typescript
const API_BASE_URL = "http://localhost:8000";
```

For production:
```typescript
const API_BASE_URL = "https://your-api-domain.com";
```

## Authentication

### 1. Login Function

```typescript
// lib/auth.ts
interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}
```

### 2. Token Storage

```typescript
// lib/auth.ts
export function storeToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export function removeToken() {
  localStorage.removeItem('access_token');
}
```

### 3. API Client with Authentication

```typescript
// lib/api.ts
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
  }
}

export const apiClient = new APIClient(API_BASE_URL);
```

## Data Types

```typescript
// types/patient.ts
export interface Patient {
  id: number;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  address?: string;
  height?: number;
  weight?: number;
  chronic_conditions: string[];
  family_history?: string;
  status: string;
  risk_level: string;
  created_at: string;
  updated_at?: string;
}

export interface RiskPrediction {
  id: number;
  patient_id: number;
  prediction_type: string;
  risk_score: number;
  risk_level: string;
  confidence_score: number;
  prediction_date: string;
  prediction_window: number;
  feature_importance: Record<string, number>;
  model_version: string;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  total_patients: number;
  active_cases: number;
  critical_alerts: number;
  recovery_rate: number;
}
```

## API Functions

### Patient Management

```typescript
// lib/patients.ts
export async function getPatients(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  status?: string;
  risk_level?: string;
}): Promise<Patient[]> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `/api/patients/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return apiClient.get<Patient[]>(url);
}

export async function getPatient(patientId: string): Promise<Patient> {
  return apiClient.get<Patient>(`/api/patients/${patientId}`);
}

export async function createPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
  return apiClient.post<Patient>('/api/patients/', patientData);
}

export async function updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient> {
  return apiClient.put<Patient>(`/api/patients/${patientId}`, updates);
}

export async function deletePatient(patientId: string): Promise<void> {
  return apiClient.delete(`/api/patients/${patientId}`);
}
```

### Risk Predictions

```typescript
// lib/predictions.ts
export async function createRiskPrediction(
  patientId: string,
  predictionType: string = 'deterioration',
  predictionWindow: number = 90
): Promise<any> {
  const params = new URLSearchParams({
    prediction_type: predictionType,
    prediction_window: predictionWindow.toString(),
  });

  return apiClient.post<any>(`/api/predictions/${patientId}/predict?${params.toString()}`, {});
}

export async function getPatientPredictions(patientId: string): Promise<RiskPrediction[]> {
  return apiClient.get<RiskPrediction[]>(`/api/predictions/${patientId}/predictions`);
}

export async function getLatestPrediction(patientId: string): Promise<RiskPrediction> {
  return apiClient.get<RiskPrediction>(`/api/predictions/${patientId}/latest-prediction`);
}
```

### Analytics

```typescript
// lib/analytics.ts
export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return apiClient.get<AnalyticsOverview>('/api/analytics/overview');
}

export async function getPatientVolumeData(): Promise<any[]> {
  return apiClient.get<any[]>('/api/analytics/patient-volume');
}

export async function getConditionDistribution(): Promise<any[]> {
  return apiClient.get<any[]>('/api/analytics/condition-distribution');
}

export async function getRiskDistribution(): Promise<any[]> {
  return apiClient.get<any[]>('/api/analytics/risk-distribution');
}
```

### Data Entry

```typescript
// lib/dataEntry.ts
export interface PatientDataEntry {
  patient_id: string;
  age: number;
  gender: string;
  height?: number;
  weight?: number;
  chronic_conditions?: string[];
  family_history?: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  blood_oxygen?: number;
  body_temp?: number;
  respiratory_rate?: number;
  fasting_glucose?: number;
  hba1c?: number;
  ldl_cholesterol?: number;
  hdl_cholesterol?: number;
  triglycerides?: number;
  creatinine?: number;
  hemoglobin?: number;
  current_medications?: string;
  missed_doses?: number;
  side_effects?: string;
  exercise_minutes?: number;
  sleep_duration?: number;
  stress_level?: number;
  smoking_status?: string;
  alcohol_usage?: string;
}

export async function submitPatientData(data: PatientDataEntry): Promise<any> {
  return apiClient.post<any>('/api/data-entry/submit', data);
}
```

### Explainability

```typescript
// lib/explainability.ts
export async function getPatientExplanation(patientId: string): Promise<any> {
  return apiClient.get<any>(`/api/explainability/patient/${patientId}/latest-explanation`);
}

export async function getAIInsights(): Promise<any> {
  return apiClient.get<any>('/api/explainability/ai-insights');
}

export async function getGlobalFeatures(): Promise<any> {
  return apiClient.get<any>('/api/explainability/global-features');
}
```

## React Hooks for Data Fetching

```typescript
// hooks/usePatients.ts
import { useState, useEffect } from 'react';
import { getPatients, Patient } from '@/lib/patients';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  return { patients, loading, error, refetch: () => fetchPatients() };
}
```

```typescript
// hooks/useAnalytics.ts
import { useState, useEffect } from 'react';
import { getAnalyticsOverview, AnalyticsOverview } from '@/lib/analytics';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await getAnalyticsOverview();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { analytics, loading, error };
}
```

## Example Component Integration

```tsx
// components/PatientListWithAPI.tsx
'use client';

import { usePatients } from '@/hooks/usePatients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PatientListWithAPI() {
  const { patients, loading, error } = usePatients();

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <Card key={patient.id}>
          <CardHeader>
            <CardTitle>{patient.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p>ID: {patient.patient_id}</p>
                <p>Age: {patient.age}</p>
                <p>Conditions: {patient.chronic_conditions.join(', ')}</p>
              </div>
              <Badge variant={patient.risk_level === 'high' ? 'destructive' : 'default'}>
                {patient.risk_level} risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
// lib/error-handler.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): string {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 500:
        return 'Server error occurred. Please try again later';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  
  return 'Network error. Please check your connection';
}
```

## Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing the Integration

1. Start the backend server: `cd backend && ./start.sh`
2. Update your frontend components to use the API functions
3. Test authentication flow
4. Test patient data fetching and display
5. Test form submissions for data entry
6. Test risk predictions and explanations

## Next Steps

1. Add proper error boundaries for API errors
2. Implement loading states and skeletons
3. Add optimistic updates for better UX
4. Implement real-time updates using WebSockets
5. Add data caching strategies
6. Implement proper logout functionality
7. Add form validation that matches API schemas
