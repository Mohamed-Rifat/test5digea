
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { LoginResponse } from "@/types/auth";
import { authStorage } from "@/lib/auth-storage";
import {
  getRoleFromToken,
  type UserRole,
} from "@/lib/auth-utils";

interface AuthContextValue {
  user: LoginResponse | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isUser: boolean;
  setAuth: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    return authStorage.get();
  });

  const [isLoading] = useState(false);

  const role: UserRole | null = user?.token
    ? getRoleFromToken(user.token)
    : null;

  const isAuthenticated = !!user;
  const isAdmin = role === "Admin";
  const isVendor = role === "Vendor";
  const isUser = role === "User";
  const setAuth = (data: LoginResponse) => {
    authStorage.set(data);
    setUser(data);
  };

  const logout = () => {
    authStorage.remove();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        isAdmin,
        isVendor,
        isUser,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
