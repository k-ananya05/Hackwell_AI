"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, TokenManager } from '@/lib/api';

interface User {
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = TokenManager.getToken();
      
      if (token) {
        try {
          // You can add a /api/auth/me endpoint to get current user
          // For now, we'll assume the user is authenticated if token exists
          setUser({
            username: 'demo_doctor',
            email: 'demo@hackwell.ai',
            full_name: 'Demo Doctor',
            role: 'doctor'
          });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          TokenManager.removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await apiClient.login(username, password);
      
      // Set user data (in real app, you'd get this from /api/auth/me)
      setUser({
        username,
        email: `${username}@hackwell.ai`,
        full_name: username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'doctor'
      });
    } catch (error) {
      console.error('Login failed:', error)
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
