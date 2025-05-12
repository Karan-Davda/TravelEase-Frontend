
// Base API URL
const API_BASE_URL = 'http://localhost:3000/api';

// Auth Endpoints
const AUTH = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  SIGNUP: {
    USER: `${API_BASE_URL}/auth/signup`,
    AGENCY: `${API_BASE_URL}/auth/signup/agency`,
    GUIDE: `${API_BASE_URL}/auth/signup/guide`,
  },
};

import { getAuthHeaders, AuthResponse } from '@/utils/authUtils';

// Generic fetch function with error handling
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data as T;
}

// Authentication Service
export const authService = {
  // Login user
  login: (identifier: string, password: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  // Login with Google
  googleLogin: (token: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(AUTH.GOOGLE_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
  
  // Logout user
  logout: (): Promise<{ success: boolean }> => {
    return fetchApi(AUTH.LOGOUT, {
      method: 'POST',
    });
  },
  
  // Signup user
  signupUser: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    return fetchApi(AUTH.SIGNUP.USER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Signup travel agency
  signupAgency: (agencyData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    agencyName: string;
    licenseNumber: string;
    address: string;
  }) => {
    return fetchApi(AUTH.SIGNUP.AGENCY, {
      method: 'POST',
      body: JSON.stringify(agencyData),
    });
  },
  
  // Signup tour guide
  signupGuide: (guideData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    experience: number;
    languages: string[];
    certifications: string[];
    specialties: string[];
  }) => {
    return fetchApi(AUTH.SIGNUP.GUIDE, {
      method: 'POST',
      body: JSON.stringify(guideData),
    });
  },
};

export default {
  auth: authService,
};
