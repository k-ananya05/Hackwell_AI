// API Configuration and Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for API responses
export interface Patient {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

// Auth token management
class TokenManager {
  private static TOKEN_KEY = 'hackwell_auth_token';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error)
      return null;
    }
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error)
    }
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error)
    }
  }
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(
      `/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    );
    
    TokenManager.setToken(response.access_token);
    return response;
  }

  logout(): void {
    TokenManager.removeToken();
  }

  // Patients
  async getPatients(skip: number = 0, limit: number = 100): Promise<Patient[]> {
    return this.request<Patient[]>(`/api/patients?skip=${skip}&limit=${limit}`);
  }

  async getPatient(patientId: string): Promise<Patient> {
    return this.request<Patient>(`/api/patients/${patientId}`);
  }

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    return this.request<Patient>('/api/patients/', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  }

  // Patient details
  async getPatientVitals(patientId: string, limit: number = 10): Promise<any[]> {
    return this.request<any[]>(`/api/patients/${patientId}/vitals?limit=${limit}`);
  }

  async getPatientMedications(patientId: string, activeOnly: boolean = true): Promise<any[]> {
    return this.request<any[]>(`/api/patients/${patientId}/medications?active_only=${activeOnly}`);
  }

  async getPatientNotes(patientId: string, limit: number = 10): Promise<any[]> {
    return this.request<any[]>(`/api/patients/${patientId}/notes?limit=${limit}`);
  }

  // Predictions
  async getPrediction(patientId: string): Promise<any> {
    return this.request(`/api/predictions/predict/${patientId}`);
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request('/api/analytics/overview');
  }
  
  // Explainability
  async getAIInsights(): Promise<any[]> {
    return this.request('/api/explainability/insights');
  }
  
  async getModelPerformance(): Promise<any[]> {
    return this.request('/api/explainability/model-performance');
  }
  
  async getAIMetrics(): Promise<any> {
    return this.request('/api/explainability/metrics');
  }
  
  // User settings
  async getUserProfile(): Promise<any> {
    return this.request('/api/user/profile');
  }
  
  async updateUserProfile(data: any): Promise<any> {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async getUserSettings(): Promise<any> {
    return this.request('/api/user/settings');
  }
  
  async updateUserSettings(data: any): Promise<any> {
    return this.request('/api/user/settings', {
      method: 'PUT', 
      body: JSON.stringify(data)
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export { TokenManager };
