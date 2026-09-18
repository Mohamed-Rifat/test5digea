"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSessionCountdown } from "@/lib/useSessionCountdown";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Number of seconds before the session expires when the warning appears.
 * Change this value if you want the warning to appear earlier or later
 * (for example, 300 for five minutes).
 */
const WARNING_THRESHOLD_SECONDS = 60;

export default function SessionExpiryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const secondsLeft = useSessionCountdown(
    isAuthenticated ? user?.expiration : null
  );

  const hasLoggedOutRef = useRef(false);

  useEffect(() => {
    hasLoggedOutRef.current = false;
  }, [user?.token]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (secondsLeft === null) return;

    if (secondsLeft <= 0 && !hasLoggedOutRef.current) {
      hasLoggedOutRef.current = true;
      logout();
      toast("Your session has expired. Please log in again.", "error");
      router.replace("/login");
    }
  }, [secondsLeft, isAuthenticated, logout, router, toast]);

  const showWarning =
    isAuthenticated &&
    secondsLeft !== null &&
    secondsLeft > 0 &&
    secondsLeft <= WARNING_THRESHOLD_SECONDS;

  const handleLoginNow = () => {
    hasLoggedOutRef.current = true;
    logout();
    router.replace("/login");
  };

  return (
    <>
      {children}

      {showWarning && (
        <div
          className="fixed inset-0 z-1000 flex items-end justify-center bg-black/30 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0"
          role="alertdialog"
          aria-live="assertive"
          aria-labelledby="session-expiry-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/70 bg-white p-6 text-center shadow-[0_18px_55px_rgba(48,37,31,0.25)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <AlertTriangle size={24} />
            </div>

            <h2
              id="session-expiry-title"
              className="text-base font-semibold text-[#30251f]"
            >
              Your session is about to expire
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6b5f57]">
              You will be automatically logged out in{" "}
              <span className="font-bold text-[#a47e43]">
                {secondsLeft}
              </span>{" "}
              seconds because your session is about to expire.
            </p>

            <button
              type="button"
              onClick={handleLoginNow}
              className="mt-5 w-full rounded-xl bg-[#a47e43] py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f6c37]"
            >
              Log in again now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
