"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function CountdownTimer({ eventDate }: { eventDate: string }) {
  const { t } = useLanguage();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const target = new Date(eventDate).getTime();
  const diff =
    now === null || Number.isNaN(target) ? 0 : Math.max(0, target - now);

  const values = [
    {
      key: "days",
      label: t("roadmap.hero.units.days"),
      value: Math.floor(diff / 86400000),
    },
    {
      key: "hours",
      label: t("roadmap.hero.units.hours"),
      value: Math.floor((diff % 86400000) / 3600000),
    },
    {
      key: "minutes",
      label: t("roadmap.hero.units.minutes"),
      value: Math.floor((diff % 3600000) / 60000),
    },
    {
      key: "seconds",
      label: t("roadmap.hero.units.seconds"),
      value: Math.floor((diff % 60000) / 1000),
    },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      role="timer"
      aria-live="off"
    >
      {values.map(({ key, label, value }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] px-1 py-3 text-center backdrop-blur-xl sm:py-4"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <div
            dir="ltr"
            className="text-2xl font-semibold leading-none tabular-nums text-white sm:text-3xl"
          >
            {now === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[11px] font-medium text-white/55 sm:text-xs">
            {label}
          </div>
          {key === "seconds" && (
            <span className="absolute end-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#e2b777]" />
          )}
        </div>
      ))}
    </div>
  );
}
