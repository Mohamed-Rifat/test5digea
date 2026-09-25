"use client";

import { Heart, ListOrdered } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { RoadmapFilter } from "@/components/roadmap/roadmapUtils";

interface JourneyFilterHeaderProps {
  filter: RoadmapFilter;
  onChange: (filter: RoadmapFilter) => void;
  counts: Record<RoadmapFilter, number>;
}

/** "Your journey" heading + all / remaining / completed tabs. */
export function JourneyFilterHeader({ filter, onChange, counts }: JourneyFilterHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#a9773c]">
          <Heart size={14} fill="currentColor" aria-hidden="true" />
          {t("roadmap.main.journeyLabel")}
        </p>
        <h2
          id="journey-title"
          className="mt-1 text-2xl font-bold text-[#30251f] sm:text-3xl"
        >
          {t("roadmap.main.journeyHeading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#8b7e76] sm:text-base">
          {t("roadmap.journey.sub")}
        </p>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#a9773c]">
          <ListOrdered size={14} aria-hidden="true" />
          {t("roadmap.order.note")}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={t("roadmap.filter.label")}
        className="inline-flex shrink-0 rounded-2xl bg-white p-1 ring-1 ring-[#ebe2da]"
      >
        {(
          [
            ["all", t("roadmap.filter.all"), counts.all],
            [
              "remaining",
              t("roadmap.filter.remaining"),
              counts.remaining,
            ],
            [
              "completed",
              t("roadmap.filter.completed"),
              counts.completed,
            ],
          ] as [RoadmapFilter, string, number][]
        ).map(([key, label, count]) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition sm:px-3.5 ${
                active
                  ? "bg-[#30251f] text-white shadow-sm"
                  : "text-[#6f635b] hover:bg-[#f7f1eb] hover:text-[#30251f]"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active
                    ? "bg-white/15 text-white"
                    : "bg-[#f3ece5] text-[#8b7e76]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
