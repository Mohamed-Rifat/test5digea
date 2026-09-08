import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
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