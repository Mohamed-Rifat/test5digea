"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/context/AuthContext";

/**
 * The auth provider is server-render safe: on the server (and during the
 * first hydration pass) it reports `isLoading: true` with no user, then reads
 * the saved session from localStorage on the client. This lets every public
 * page be fully server-rendered for SEO instead of shipping an empty shell.
 */
export default function AuthProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
