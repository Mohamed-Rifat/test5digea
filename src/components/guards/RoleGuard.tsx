"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getHomePath,
  type UserRole,
} from "@/lib/auth-utils";

import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    role,
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // User is not logged in
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // User is logged in but doesn't have permission
    if (!role || !allowedRoles.includes(role)) {
      router.replace(getHomePath(role));
    }
  }, [
    role,
    isAuthenticated,
    isLoading,
    allowedRoles,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ded5ce] border-t-[#30251f]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
