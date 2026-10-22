export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  flag?: boolean;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export interface UserProfile {
  id: number;
  nombre?: string;
  apellido?: string;
  email: string;
  kind: "student" | "user";
}

export interface TokenPayload {
  sub: string;
  email: string;
  kind?: string;
  jti: string;
  exp: number;
  iat: number;
}