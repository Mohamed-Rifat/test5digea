"use client";

import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { delay } from "../motion";

import type { UnderReviewState } from "./useUnderReview";

/** Animated status banner with the check-now button. */
export function UnderReviewHero({ review }: { review: UnderReviewState }) {
  const { t } = useLanguage();
  const { refreshing, checkStatus, lastCheckedLabel, vendor } = review;

  return (
    <section
      className="onb-rise relative mt-8 overflow-hidden rounded-4xl border border-[#e9dfd8] bg-white shadow-[0_15px_55px_rgba(48,37,31,0.07)]"
      style={delay(80)}
    >
      <div className="relative h-1.5 overflow-hidden bg-linear-to-r from-[#30251f] via-[#b99a62] to-[#30251f]">
        <div className="onb-sweep absolute inset-y-0 start-0 w-1/3 bg-linear-to-r from-transparent via-white/60 to-transparent" />
      </div>

      <div className="pointer-events-none absolute -end-24 -top-28 h-72 w-72 rounded-full bg-[#faf5ee]" />
      <div className="pointer-events-none absolute -bottom-32 -start-24 h-64 w-64 rounded-full border-40 border-[#faf8f6]" />

      <div className="relative flex flex-col items-center gap-8 p-6 text-center sm:p-10 lg:flex-row lg:text-start">
        {/* Animated status icon */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <span className="onb-ring absolute inset-3 rounded-full border-2 border-[#d9bd85]" />
          <span
            className="onb-ring absolute inset-3 rounded-full border-2 border-[#d9bd85]"
            style={delay(1400)}
          />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#faf5ee] to-white shadow-[0_10px_30px_rgba(164,126,67,0.18)] ring-1 ring-[#eadfce]">
            <svg
              viewBox="0 0 24 24"
              width="38"
              height="38"
              fill="none"
              stroke="#a47e43"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="onb-flip"
              aria-hidden="true"
            >
              <path d="M6 2h12M6 22h12" />
              <path d="M7 2v4.5a5 5 0 0 0 1.6 3.7L12 12l-3.4 1.8A5 5 0 0 0 7 17.5V22" />
              <path d="M17 2v4.5a5 5 0 0 1-1.6 3.7L12 12l3.4 1.8A5 5 0 0 1 17 17.5V22" />
              <path d="M9.5 20h5" />
            </svg>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43] rtl:tracking-normal">
            {t("vendorOnboarding.review.eyebrow")}
          </p>

          <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f] rtl:leading-snug sm:text-4xl">
            {t("vendorOnboarding.review.title")}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81746d] sm:text-[15px] sm:leading-8">
            {t("vendorOnboarding.review.subtitle", {
              name: vendor.businessName || t("vendor.profile.defaultName"),
            })}
          </p>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              {t("vendorOnboarding.review.statusLabel")}:{" "}
              {t("vendorOnboarding.review.statusValue")}
            </span>

            <button
              type="button"
              onClick={() => void checkStatus(true)}
              disabled={refreshing}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.14)] transition hover:-translate-y-0.5 hover:bg-[#45362d] disabled:translate-y-0 disabled:opacity-70"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "onb-spin"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              />
              {refreshing
                ? t("vendorOnboarding.review.refreshing")
                : t("vendorOnboarding.review.refresh")}
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[#9b8f86]">
            {lastCheckedLabel && (
              <span className="me-2 font-semibold text-[#756b65]">
                {t("vendorOnboarding.review.lastChecked", {
                  time: lastCheckedLabel,
                })}
                {" · "}
              </span>
            )}
            {t("vendorOnboarding.review.autoCheck")}
          </p>
        </div>
      </div>
    </section>
  );
}
