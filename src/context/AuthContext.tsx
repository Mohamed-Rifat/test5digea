
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { LoginResponse } from "@/types/auth";
import { authStorage, parseAuth } from "@/lib/auth-storage";
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

const subscribeNothing = () => () => {};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  // Raw localStorage string: stable between reads, null on the server.
  const raw = useSyncExternalStore(
    authStorage.subscribe,
    authStorage.getRaw,
    () => null,
  );

  // false on the server and during hydration, true afterwards.
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

  const user = useMemo(() => parseAuth(raw), [raw]);
  const isLoading = !hydrated;

  /**
   * Get the current user's role from the JWT.
   */
  const role: UserRole | null = user?.token
    ? getRoleFromToken(user.token)
    : null;

  const isAuthenticated = !!user;
  const isAdmin = role === "Admin";
  const isVendor = role === "Vendor";
  const isUser = role === "User";

  /** Save authentication data (also syncs other open tabs). */
  const setAuth = useCallback((data: LoginResponse) => {
    authStorage.set(data);
  }, []);

  /** Logout user (also logs out other open tabs). */
  const logout = useCallback(() => {
    authStorage.remove();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthenticated,
      isLoading,
      isAdmin,
      isVendor,
      isUser,
      setAuth,
      logout,
    }),
    [user, role, isAuthenticated, isLoading, isAdmin, isVendor, isUser, setAuth, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
