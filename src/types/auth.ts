export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  fullName: string;
  token: string;
  expiration: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface JwtPayload {
  sub: string;

  email: string;

  exp: number;

  iss: string;

  aud: string;

  role?: string;

  [key: string]: unknown;
}