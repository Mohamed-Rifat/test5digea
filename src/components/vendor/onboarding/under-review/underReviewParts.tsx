"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeExternalUrl } from "@/lib/safe-url";
import type { TranslationKey } from "@/locales";

// How often we quietly ask the server whether the admin has decided yet.
export const AUTO_CHECK_MS = 30_000;

export const DAYS: { key: string; labelKey: TranslationKey }[] = [
  { key: "sat", labelKey: "vendor.profile.days.sat" },
  { key: "sun", labelKey: "vendor.profile.days.sun" },
  { key: "mon", labelKey: "vendor.profile.days.mon" },
  { key: "tue", labelKey: "vendor.profile.days.tue" },
  { key: "wed", labelKey: "vendor.profile.days.wed" },
  { key: "thu", labelKey: "vendor.profile.days.thu" },
  { key: "fri", labelKey: "vendor.profile.days.fri" },
];

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

export const parseJson = <T extends object>(json: string): T => {
  try {
    return json ? (JSON.parse(json) as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

export const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white shadow-[0_10px_40px_rgba(48,37,31,0.04)]";

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b8171] rtl:tracking-normal">
      {children}
    </p>
  );
}

export function InfoRow({
  icon,
  label,
  value,
  ltr = false,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  ltr?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f2ef] text-[#806a5b]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#9b8171]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#40352f]">
          {value ? (
            ltr ? (
              <span dir="ltr" className="inline-block">
                {value}
              </span>
            ) : (
              value
            )
          ) : (
            t("vendor.profile.notProvided")
          )}
        </p>
      </div>
    </div>
  );
}

export function SocialPill({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
}) {
  const safeHref = href ? normalizeExternalUrl(href) : "";

  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#eee7e2] bg-[#fcfaf8] px-4 py-2 text-xs font-semibold text-[#40352f] transition hover:-translate-y-0.5 hover:border-[#d9c9be] hover:bg-white hover:shadow-[0_8px_20px_rgba(48,37,31,0.07)]"
    >
      {icon}
      {label}
    </a>
  );
}
