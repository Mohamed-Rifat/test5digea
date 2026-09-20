"use client";

import { AlertTriangle, Clock3 } from "lucide-react";
import { Tooltip } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import type { TranslationKey } from "@/locales";
import {
  formatSessionClock,
  type SessionAlertLevel,
} from "@/lib/session-warning";

const MESSAGE_KEY: Record<SessionAlertLevel, TranslationKey> = {
  notice: "common.sessionCountdown.notice",
  warning: "common.sessionCountdown.warning",
  danger: "common.sessionCountdown.danger",
};

/**
 * Header/navbar countdown shown during the last hour of a session.
 * Blinks (yellow -> orange -> red) and explains itself in a tooltip.
 * Renders nothing when there is more than an hour left.
 */
export default function SessionCountdownBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Keep the pill at h-9 on every breakpoint (public navbar buttons). */
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const { secondsLeft, level } = useSessionExpiry();

  if (level === null || secondsLeft === null) return null;

  const time = formatSessionClock(secondsLeft);
  const Icon = level === "danger" ? AlertTriangle : Clock3;

  return (
    <Tooltip
      arrow
      title={
        <span className="block max-w-56 text-center leading-5">
          <span className="block font-semibold">
            {t("common.sessionCountdown.tooltipTitle", { time })}
          </span>
          <span className="block">{t(MESSAGE_KEY[level])}</span>
        </span>
      }
    >
      <div
        role="timer"
        tabIndex={0}
        data-level={level}
        aria-label={t("common.sessionCountdown.ariaLabel", { time })}
        className={[
          "session-badge flex h-9 shrink-0 cursor-default items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold tabular-nums sm:px-3 sm:text-[13px]",
          compact ? "" : "sm:h-10",
          className,
        ].join(" ")}
      >
        <Icon size={14} className="hidden shrink-0 sm:block" />
        <span dir="ltr">{time}</span>
      </div>
    </Tooltip>
  );
}
