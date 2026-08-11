import axiosInstance from "./axiosInstance";

export interface AuthResponse {
  token?: string;
  message?: string;
}

export interface DecodedToken {
  sub: string;
  role?: string;
  iat: number;
  exp: number;
}

const TOKEN_KEY = "jwt_token";

// wyłącznie do odczytu roli/nazwy użytkownika na potrzeby UI.
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const login = async (data: {
  username: string;
  password: string;
}): Promise<string> => {
  const response = await axiosInstance.post("/api/auth/login", data);
  const token =
    typeof response.data === "string" ? response.data : response.data.token;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  return token;
};

export const register = async (data: {
  username: string;
  password: string;
}): Promise<string> => {
  const response = await axiosInstance.post("/api/auth/register", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export const getStoredAuthToken = async (): Promise<string | null> => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getStoredUserRole = async (): Promise<string | null> => {
  const token = await getStoredAuthToken();
  if (!token) return null;
  return decodeToken(token)?.role ?? null;
};
