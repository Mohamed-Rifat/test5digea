"use client";

import { createElement, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Sparkles, Heart, PartyPopper } from "lucide-react";
import type { RoadmapItem } from "@/types/roadmap";
import { useLanguage } from "@/context/LanguageContext";

import { ProgressRing } from "@/components/roadmap/ProgressRing";
import { STATE_STYLES, type StepState, getCategoryIcon, getStepState } from "@/components/roadmap/roadmapUtils";

export function RoadmapOverview({
  items,
  progress,
  eventDate,
  nextItem,
  onMarkNextDone,
  onOpenLetter,
}: {
  items: RoadmapItem[];
  progress: number;
  eventDate: string;
  nextItem: RoadmapItem | null;
  onMarkNextDone: (item: RoadmapItem) => void;
  onOpenLetter?: () => void;
}) {
  const { t, isArabic, localize } = useLanguage();

  const counts = items.reduce(
    (acc, item) => {
      acc[getStepState(item)] += 1;
      return acc;
    },
    { completed: 0, selected: 0, todo: 0 } as Record<StepState, number>,
  );

  const target = eventDate ? new Date(eventDate).getTime() : NaN;
  const [today] = useState(() => Date.now());
  const daysLeft = Number.isNaN(target)
    ? null
    : Math.max(0, Math.ceil((target - today) / 86400000));

  const stats: { key: StepState; label: string; value: number }[] = [
    {
      key: "completed",
      label: t("roadmap.overview.completed"),
      value: counts.completed,
    },
    {
      key: "selected",
      label: t("roadmap.overview.selected"),
      value: counts.selected,
    },
    {
      key: "todo",
      label: t("roadmap.overview.notStarted"),
      value: counts.todo,
    },
  ];

  return (
    <section
      aria-label={t("roadmap.overview.progress")}
      className="relative z-10 -mt-20 grid gap-4 sm:-mt-24 lg:grid-cols-[1.2fr_1fr]"
    >
      {/* Progress */}
      <div className="rounded-[28px] border border-[#ebe2da] bg-white p-5 shadow-[0_24px_60px_rgba(48,37,31,0.10)] sm:p-7">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
          <ProgressRing progress={progress} size={104} />

          <div className="w-full flex-1">
            <p className="text-sm font-semibold text-[#a9773c]">
              {t("roadmap.overview.progress")}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#30251f] sm:text-2xl">
              {t("roadmap.progress.heading")}
            </h2>
            <p className="mt-1 text-sm text-[#8b7e76]">
              {t("roadmap.progress.subheading", {
                completed: counts.completed,
                total: items.length,
              })}
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl bg-[#faf7f4] px-3 py-2.5 ring-1 ring-[#f0e8e1]"
            >
              <dt className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[#8b7e76]">
                <span
                  className={`h-2 w-2 rounded-full ${STATE_STYLES[stat.key].dot}`}
                  aria-hidden="true"
                />
                {stat.label}
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-[#30251f]">
                {stat.value}
              </dd>
            </div>
          ))}

          <div className="rounded-2xl bg-[#30251f] px-3 py-2.5 text-white">
            <dt className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-white/65">
              <CalendarDays size={12} aria-hidden="true" />
              {daysLeft === null
                ? t("roadmap.overview.noDate")
                : t("roadmap.overview.daysLeft")}
            </dt>
            <dd className="mt-1 text-xl font-bold tabular-nums">
              {daysLeft === null ? (
                <a
                  href="#plan-details"
                  className="text-sm font-semibold text-[#ecc98f] underline-offset-4 hover:underline"
                >
                  {t("roadmap.overview.setDate")}
                </a>
              ) : (
                daysLeft
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Next step */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#30221d] p-5 text-white shadow-[0_24px_60px_rgba(48,37,31,0.18)] ring-1 ring-white/10 sm:p-7">
        <div className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[#d5a05e]/15 blur-3xl" />

        {nextItem ? (
          <div className="relative flex h-full flex-col">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#e7c089]">
              <Sparkles size={15} aria-hidden="true" />
              {t("roadmap.next.label")}
            </p>

            <div className="mt-4 flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ecc98f] ring-1 ring-white/15">
                {createElement(
                  getCategoryIcon(
                    nextItem.categoryName,
                    items.indexOf(nextItem),
                  ),
                  {
                    size: 22,
                    strokeWidth: 1.6,
                    "aria-hidden": true,
                  },
                )}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-xl font-bold">
                  {localize(nextItem.categoryName)}
                </h3>
                <p className="text-xs text-white/55">
                  {t("roadmap.cardExtra.stepOf", {
                    number: items.indexOf(nextItem) + 1,
                    total: items.length,
                  })}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {t("roadmap.next.hint", { category: localize(nextItem.categoryName) })}
            </p>

            <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
              <Link
                href={`/vendors?categoryId=${encodeURIComponent(String(nextItem.categoryId))}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e7c089] px-5 text-sm font-bold text-[#30221d] transition hover:bg-[#f0cf9f]"
              >
                {t("roadmap.next.cta")}
                <ArrowRight
                  size={16}
                  className={isArabic ? "rotate-180" : ""}
                  aria-hidden="true"
                />
              </Link>
              <button
                type="button"
                onClick={() => onMarkNextDone(nextItem)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-white"
              >
                <Check size={16} aria-hidden="true" />
                {t("roadmap.next.markDone")}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col items-start justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
              <PartyPopper size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-bold">
              {t("roadmap.next.allDoneTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              {t("roadmap.next.allDoneBody")}
            </p>
            {onOpenLetter && (
              <button
                type="button"
                onClick={onOpenLetter}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#e7c089] px-4 py-2.5 text-sm font-bold text-[#30221d] transition hover:bg-[#f0cf9f]"
              >
                <Heart size={15} fill="currentColor" aria-hidden="true" />
                {t("roadmap.next.seeMessage")}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
