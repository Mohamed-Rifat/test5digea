"use client";

import type { ReactNode } from "react";
import { AuthProvider as AuthContextProvider } from "@/context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
