"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { loginPathFor } from "@/lib/auth-utils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(loginPathFor(pathname));
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    pathname,
  ]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ded5ce] border-t-[#30251f]" />
      </div>
    );
  }

  return <>{children}</>;
}