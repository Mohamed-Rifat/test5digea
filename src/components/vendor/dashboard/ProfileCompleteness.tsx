"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { LinearProgress } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import {
  getVendorProfileCompleteness,
  type ProfileCheckKey,
} from "@/lib/vendor-profile-completeness";
import type { Vendor } from "@/types/vendor";

const LABEL_KEYS: Record<ProfileCheckKey, TranslationKey> = {
  image: "vendor.dashboard.profile.items.image",
  slogan: "vendor.dashboard.profile.items.slogan",
  bio: "vendor.dashboard.profile.items.bio",
  location: "vendor.dashboard.profile.items.location",
  phone: "vendor.dashboard.profile.items.phone",
  email: "vendor.dashboard.profile.items.email",
  categories: "vendor.dashboard.profile.items.categories",
  gallery: "vendor.dashboard.profile.items.gallery",
  hours: "vendor.dashboard.profile.items.hours",
  social: "vendor.dashboard.profile.items.social",
};

const MAX_MISSING_SHOWN = 5;

/**
 * Profile completeness card: a percentage plus the fields the vendor has
 * not filled in yet, each linking to the page where it is edited.
 */
export default function ProfileCompleteness({ vendor }: { vendor: Vendor }) {
  const { t } = useLanguage();

  const { checks, done, total, percent } = getVendorProfileCompleteness(vendor);

  const missing = checks.filter((check) => !check.done);
  const isComplete = missing.length === 0;
  const hiddenMissing = Math.max(0, missing.length - MAX_MISSING_SHOWN);

  const color = isComplete ? "#10b981" : "#a47e43";

  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#30251f]">
            {t("vendor.dashboard.profile.title")}
          </h3>
          <p className="text-xs text-[#9b8f86]">
            {t("vendor.dashboard.profile.subtitle")}
          </p>
        </div>

        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color }}
          dir="ltr"
        >
          {percent}%
        </span>
      </div>

      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label={t("vendor.dashboard.profile.title")}
        sx={{
          height: 6,
          borderRadius: "6px",
          backgroundColor: "#f0eae5",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: "6px",
          },
        }}
      />

      <p className="mt-1.5 text-[11px] text-[#9a8d85]">
        {t("vendor.dashboard.profile.ofDone", { done, total })}
      </p>

      {isComplete ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-800">
              {t("vendor.dashboard.profile.completeTitle")}
            </p>
            <p className="mt-0.5 text-xs text-emerald-700">
              {t("vendor.dashboard.profile.completeText")}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2 mt-4 text-xs font-medium text-[#756b65]">
            {t("vendor.dashboard.profile.missing")}
          </p>

          <ul className="space-y-1.5">
            {missing.slice(0, MAX_MISSING_SHOWN).map((check) => (
              <li key={check.key}>
                <Link
                  href={check.href}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[#fcfaf8] px-3 py-2 text-xs text-[#5f544d] transition hover:bg-[#f5eee9] hover:text-[#30251f]"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9b79c]" />
                    {t(LABEL_KEYS[check.key])}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[#b5a89e] rtl:rotate-180"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {hiddenMissing > 0 && (
            <p className="mt-1.5 text-[11px] text-[#9a8d85]">
              {t("vendor.dashboard.attention.more", { count: hiddenMissing })}
            </p>
          )}

          <Link
            href="/vendor/profile"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#30251f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#463831]"
          >
            {t("vendor.dashboard.profile.completeCta")}
          </Link>
        </>
      )}
    </div>
  );
}
