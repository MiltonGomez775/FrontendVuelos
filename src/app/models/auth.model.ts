export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'PASSENGER' | 'OPERATOR' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}
