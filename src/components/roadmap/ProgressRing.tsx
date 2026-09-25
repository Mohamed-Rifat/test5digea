"use client";

import { useLanguage } from "@/context/LanguageContext";

import { GOLD } from "@/components/roadmap/roadmapUtils";

export function ProgressRing({
  progress,
  size = 112,
}: {
  progress: number;
  size?: number;
}) {
  const { t } = useLanguage();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.min(100, Math.max(0, progress));
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#efe7df"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-[#30251f]">
          {safe}%
        </span>
        <span className="text-[11px] font-medium text-[#9a8d84]">
          {t("roadmap.progressRing.complete")}
        </span>
      </div>
    </div>
  );
}
