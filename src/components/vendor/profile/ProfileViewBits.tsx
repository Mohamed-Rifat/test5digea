"use client";

import { useLanguage } from "@/context/LanguageContext";
import { normalizeExternalUrl } from "@/lib/safe-url";

/**
 * Information row component for displaying contact details
 */
export function InfoRow({
  icon,
  label,
  value,
  ltr = false,
}: {
  icon: React.ReactNode;
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
        <p className="mt-1 wrap-break-word text-sm font-medium text-[#40352f]">
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

/**
 * Social media card component
 */
export function SocialCard({
  icon,
  label,
  handle,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  handle: string;
  href: string;
}) {
  // Only ever link to http(s) addresses.
  const safeHref = normalizeExternalUrl(href);

  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-2xl border border-[#eee7e2] bg-[#fcfaf8] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9c9be] hover:bg-white hover:shadow-[0_12px_30px_rgba(48,37,31,0.07)]"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#40352f] shadow-sm transition group-hover:scale-105">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#30251f]">{label}</p>
          <p
            dir="ltr"
            className="mt-1 max-w-45 truncate text-xs text-[#756b65] text-start"
          >
            {handle}
          </p>
        </div>
      </div>

      <span className="text-lg text-[#b09a8c] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
        →
      </span>
    </a>
  );
}
