"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clock3,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import TextWithSlots from "@/components/shared/TextWithSlots";
import type { TranslationKey } from "@/locales";
import { useSessionCountdown } from "@/lib/useSessionCountdown";
import { useToast } from "@/components/providers/ToastProvider";
import { SessionExpiryContext } from "@/context/SessionExpiryContext";
import {
  SESSION_DANGER_SECONDS,
  getSessionAlertLevel,
} from "@/lib/session-warning";

/**
 * Session warning thresholds
 *
 * 10 minutes:
 * Show a normal warning that can be dismissed.
 *
 * 2 minutes:
 * Show a stronger warning that can still be dismissed.
 *
 * 30 seconds:
 * Show a mandatory final warning that cannot be dismissed.
 */
const WARNING_THRESHOLD_SECONDS = SESSION_DANGER_SECONDS;
const CRITICAL_THRESHOLD_SECONDS = 120;
const FINAL_THRESHOLD_SECONDS = 30;

type SessionWarningStage = "warning" | "critical" | "final" | null;

export default function SessionExpiryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const secondsLeft = useSessionCountdown(
    isAuthenticated ? user?.expiration : null
  );

  /**
   * Last-hour warning level (yellow -> orange -> red), shared with the
   * Admin/Vendor header countdown through context.
   */
  const alertLevel = getSessionAlertLevel(
    isAuthenticated ? secondsLeft : null
  );

  const sessionExpiryValue = useMemo(
    () => ({ secondsLeft, level: alertLevel }),
    [secondsLeft, alertLevel]
  );

  /**
   * Blinking screen border for every signed-in role (User, Vendor, Admin).
   */
  const showFrame = alertLevel !== null;

  /**
   * Prevent multiple automatic logout calls.
   */
  const hasLoggedOutRef = useRef(false);

  /**
   * Whether the user dismissed the 10-minute warning.
   */
  const [warningDismissed, setWarningDismissed] = useState(false);

  /**
   * Whether the user dismissed the 2-minute critical warning.
   */
  const [criticalDismissed, setCriticalDismissed] = useState(false);

  /**
   * Reset everything whenever a new session/token is created.
   */
  useEffect(() => {
    hasLoggedOutRef.current = false;
    setWarningDismissed(false);
    setCriticalDismissed(false);
  }, [user?.token]);

  /**
   * Automatically logout when the session expires.
   */
  useEffect(() => {
    if (!isAuthenticated) return;
    if (secondsLeft === null) return;

    if (secondsLeft <= 0 && !hasLoggedOutRef.current) {
      hasLoggedOutRef.current = true;

      logout();

      toast(t("auth.sessionExpired"), "error");

      router.replace("/login");
    }
  }, [
    secondsLeft,
    isAuthenticated,
    logout,
    router,
    toast,
    t,
  ]);

  /**
   * Determine which warning stage should be active.
   */
  const warningStage: SessionWarningStage =
    isAuthenticated &&
    secondsLeft !== null &&
    secondsLeft > 0
      ? secondsLeft <= FINAL_THRESHOLD_SECONDS
        ? "final"
        : secondsLeft <= CRITICAL_THRESHOLD_SECONDS
          ? criticalDismissed
            ? null
            : "critical"
          : secondsLeft <= WARNING_THRESHOLD_SECONDS
            ? warningDismissed
              ? null
              : "warning"
            : null
      : null;

  /**
   * Close the current dismissible warning.
   *
   * The final 30-second warning cannot be dismissed,
   * so this function does nothing during the final stage.
   */
  const handleDismiss = useCallback(() => {
    if (warningStage === "warning") {
      setWarningDismissed(true);
      return;
    }

    if (warningStage === "critical") {
      setCriticalDismissed(true);
    }
  }, [warningStage]);

  /**
   * Logout immediately.
   */
  const handleLogoutNow = () => {
    if (hasLoggedOutRef.current) return;

    hasLoggedOutRef.current = true;

    logout();
    router.replace("/login");
  };

  /**
   * Handle Escape key.
   *
   * Escape works for the 10-minute and 2-minute warnings.
   * It is intentionally disabled during the final 30 seconds.
   */
  useEffect(() => {
    if (
      warningStage !== "warning" &&
      warningStage !== "critical"
    ) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      handleDismiss();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [warningStage, handleDismiss]);

  /**
   * Don't render anything if there is no active warning.
   */
  const showWarning = warningStage !== null;

  const isFinalWarning = warningStage === "final";
  const isCriticalWarning = warningStage === "critical";

  return (
    <SessionExpiryContext.Provider value={sessionExpiryValue}>
      {children}

      {/* Blinking full-screen border during the last hour of any session */}
      {showFrame && (
        <div
          aria-hidden="true"
          data-level={alertLevel}
          className="session-frame pointer-events-none fixed inset-0 z-2000"
        />
      )}

      {showWarning && (
        <div
          className={[
            "fixed inset-0 z-1000 flex items-end justify-center px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0",
            isFinalWarning
              ? "bg-black/50"
              : "bg-black/30",
          ].join(" ")}
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
          aria-labelledby="session-expiry-title"
        >
          <div
            className={[
              "relative w-full max-w-sm rounded-2xl border bg-white p-6 text-center shadow-[0_18px_55px_rgba(48,37,31,0.25)]",
              isFinalWarning
                ? "border-red-200"
                : isCriticalWarning
                  ? "border-amber-200"
                  : "border-white/70",
            ].join(" ")}
          >
            {/* Close button for 10-minute and 2-minute warnings */}
            {!isFinalWarning && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label={t("common.sessionExpiry.dismiss")}
                className="absolute inset-e-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8b7d74] transition hover:bg-[#f5eee9] hover:text-[#30251f]"
              >
                <X size={18} />
              </button>
            )}

            {/* Icon */}
            <div
              className={[
                "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
                isFinalWarning
                  ? "bg-red-50 text-red-500"
                  : isCriticalWarning
                    ? "bg-amber-50 text-amber-500"
                    : "bg-amber-50 text-amber-500",
              ].join(" ")}
            >
              {isFinalWarning ? (
                <Clock3 size={27} />
              ) : (
                <AlertTriangle size={26} />
              )}
            </div>

            {/* Title */}
            <h2
              id="session-expiry-title"
              className={[
                "text-base font-semibold",
                isFinalWarning
                  ? "text-red-700"
                  : "text-[#30251f]",
              ].join(" ")}
            >
              {isFinalWarning
                ? t("common.sessionExpiry.titleFinal")
                : isCriticalWarning
                  ? t("common.sessionExpiry.titleCritical")
                  : t("common.sessionExpiry.titleWarning")}
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-[#6b5f57]">
              {isFinalWarning ? (
                <>
                  <TextWithSlots
                    text={t("common.sessionExpiry.finalText")}
                    slots={{
                      time: (
                        <span className="font-bold text-red-600">
                          {formatRemainingTime(secondsLeft, t, language)}
                        </span>
                      ),
                    }}
                  />
                  <br />
                  {t("common.sessionExpiry.saveData")}
                </>
              ) : isCriticalWarning ? (
                <>
                  <TextWithSlots
                    text={t("common.sessionExpiry.criticalText")}
                    slots={{
                      time: (
                        <span className="font-bold text-[#a47e43]">
                          {formatRemainingTime(secondsLeft, t, language)}
                        </span>
                      ),
                    }}
                  />
                  <br />
                  {t("common.sessionExpiry.saveData")}
                </>
              ) : (
                <>
                  <TextWithSlots
                    text={t("common.sessionExpiry.warningText")}
                    slots={{
                      time: (
                        <span className="font-bold text-[#a47e43]">
                          {formatRemainingTime(secondsLeft, t, language)}
                        </span>
                      ),
                    }}
                  />
                  <br />
                  {t("common.sessionExpiry.canContinue")}
                </>
              )}
            </p>

            {/* Countdown */}
            <div
              className={[
                "mx-auto mt-5 flex w-fit min-w-24 items-center justify-center rounded-xl px-5 py-3",
                isFinalWarning
                  ? "bg-red-50"
                  : "bg-[#f5eee9]",
              ].join(" ")}
            >
              <span
                className={[
                  "text-2xl font-bold tabular-nums",
                  isFinalWarning
                    ? "text-red-600"
                    : "text-[#a47e43]",
                ].join(" ")}
              >
                {formatCountdown(secondsLeft)}
              </span>
            </div>

            {/* Final warning */}
            {isFinalWarning ? (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleLogoutNow}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a47e43] py-3 text-sm font-semibold text-white transition hover:bg-[#8f6c37] focus:outline-none focus:ring-2 focus:ring-[#a47e43]/30"
                >
                  <LogOut size={17} />
                  {t("common.sessionExpiry.logoutNow")}
                </button>

                <p className="mt-3 text-xs text-[#8b7d74]">
                  {t("common.sessionExpiry.finalNote")}
                </p>
              </div>
            ) : (
              /* Dismissible warnings */
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 rounded-xl border border-[#e5ddd7] bg-white py-2.5 text-sm font-semibold text-[#6b5f57] transition hover:bg-[#faf8f6] hover:text-[#30251f]"
                >
                  {t("common.cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleLogoutNow}
                  className="flex-1 rounded-xl bg-[#a47e43] py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f6c37]"
                >
                  {t("common.sessionExpiry.logoutNow")}
                </button>
              </div>
            )}

            {/* ESC hint */}
            {!isFinalWarning && (
              <p className="mt-3 text-xs text-[#9a8d84]">
                <TextWithSlots
                  text={t("common.sessionExpiry.escHint")}
                  slots={{
                    key: (
                      <kbd className="rounded border border-[#ddd3cc] bg-[#faf8f6] px-1.5 py-0.5 font-medium">
                        Esc
                      </kbd>
                    ),
                  }}
                />
              </p>
            )}
          </div>
        </div>
      )}
    </SessionExpiryContext.Provider>
  );
}

type Translate = (
  key: TranslationKey,
  params?: Record<string, string | number>
) => string;

type PluralCategory = "one" | "two" | "few" | "many" | "other";

/**
 * "1 minute" / "دقيقتين" / "5 دقايق" — picks the right plural form for the
 * active language (Arabic has one / two / few / many, English one / other).
 */
function formatUnit(
  unit: "minute" | "second",
  count: number,
  t: Translate,
  language: string
): string {
  const raw = new Intl.PluralRules(language).select(count);
  const category: PluralCategory = raw === "zero" ? "other" : raw;

  return t(`common.duration.${unit}.${category}` as const, { count });
}

/**
 * Format a duration like:
 *
 * 600  -> "10 minutes"          / "10 دقايق"
 * 120  -> "2 minutes"           / "دقيقتين"
 * 90   -> "1 minute 30 seconds" / "دقيقة و30 ثانية"
 * 30   -> "30 seconds"          / "30 ثانية"
 */
function formatRemainingTime(
  seconds: number | null,
  t: Translate,
  language: string
): string {
  if (seconds === null || seconds <= 0) {
    return formatUnit("second", 0, t, language);
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return formatUnit("second", remainingSeconds, t, language);
  }

  if (remainingSeconds === 0) {
    return formatUnit("minute", minutes, t, language);
  }

  return t("common.duration.join", {
    first: formatUnit("minute", minutes, t, language),
    second: formatUnit("second", remainingSeconds, t, language),
  });
}

/**
 * Format the final countdown:
 *
 * 30 -> "30"
 * 9  -> "09"
 * 0  -> "00"
 */
function formatCountdown(
  seconds: number | null
): string {
  if (seconds === null || seconds <= 0) {
    return "00";
  }

  return String(seconds).padStart(2, "0");
}