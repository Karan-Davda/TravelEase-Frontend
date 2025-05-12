
// Token management utilities
export interface AuthResponse {
  token: string;
  role: string;
  redirectTo: string;
}

export const saveAuthData = (data: AuthResponse): void => {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('userRole', data.role);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

// Add auth header to API requests
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};
