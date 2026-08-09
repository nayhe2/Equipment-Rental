import axiosInstance from './axiosInstance';

export interface AuthResponse {
  token?: string;
  message?: string;
}

export const login = async (data: { username: string; password: string }): Promise<string> => {
  const response = await axiosInstance.post('/api/auth/login', data);
  // Jeśli backend zwraca token jako czysty tekst:
  const token = typeof response.data === 'string' ? response.data : response.data.token;
  if (token) {
    localStorage.setItem('jwt_token', token);
  }
  return token;
};

export const register = async (data: { username: string; password: string }): Promise<string> => {
  const response = await axiosInstance.post('/api/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('jwt_token');
};

export const getStoredAuthToken = async (): Promise<string | null> => {
  return localStorage.getItem('jwt_token');
};