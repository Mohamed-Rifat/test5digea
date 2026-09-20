import api from "@/lib/axios";
import type {
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "@/types/auth";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/Auth/login",
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/Auth/register",
    data
  );

  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<void> => {
  await api.post("/api/Auth/forgot-password", data);
};

export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<void> => {
  await api.post("/api/Auth/verify-otp", data);
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<void> => {
  await api.post("/api/Auth/reset-password", data);
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  await api.post("/api/Auth/change-password", data);
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>("/api/Auth/me");

  return response.data;
};
