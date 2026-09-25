"use client";

import type { ReactNode } from "react";
import { CheckCircle2, HeartHandshake, Sparkles, Users } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface OutsideVendorsSectionProps {
  count: number;
  /** How many outside vendors still have to be shared with us. */
  pending: number;
  children: ReactNode;
}

/** Highlighted block listing steps completed with vendors found elsewhere. */
export function OutsideVendorsSection({ count, pending, children }: OutsideVendorsSectionProps) {
  const { t } = useLanguage();

  return (
      <div
        data-testid="outside-section"
        className="mb-8 overflow-hidden rounded-[28px] border border-[#ecd9bf] bg-gradient-to-br from-[#fffaf2] via-white to-[#fdf3e6] p-5 shadow-[0_12px_40px_-24px_rgba(140,100,50,0.45)] sm:p-7"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#30221d] text-[#e2b877] shadow-md">
              <HeartHandshake size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-[#30251f] sm:text-xl">
                {t("roadmap.outside.title")}{" "}
                <span className="text-sm font-semibold text-[#8b7e76]">
                  ({count})
                </span>
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6f6259]">
                {t("roadmap.outside.sub")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#8c6a3c]">
                {(["perk1", "perk2", "perk3"] as const).map((perk) => (
                  <li
                    key={perk}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f6e9d6] px-3 py-1"
                  >
                    <Sparkles size={12} aria-hidden="true" />
                    {t(`roadmap.outside.${perk}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p
            className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              pending > 0
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {pending > 0 ? (
              <Users size={13} aria-hidden="true" />
            ) : (
              <CheckCircle2 size={13} aria-hidden="true" />
            )}
            {pending > 0
              ? t("roadmap.outside.pending", {
                  count: pending,
                })
              : t("roadmap.outside.allSent")}
          </p>
        </div>
        <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</ul>
      </div>
  );
}
