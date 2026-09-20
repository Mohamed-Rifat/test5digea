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

export type Gender = "Male" | "Female";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  // ISO calendar date, e.g. "1995-03-15" (no time / timezone).
  dateOfBirth: string;
  gender: Gender;
}

// GET /api/Auth/me
export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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