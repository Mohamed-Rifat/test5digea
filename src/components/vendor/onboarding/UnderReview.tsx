"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarOff,
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { useToast } from "@/components/providers/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useVendorContext } from "@/context/VendorContext";
import { getCurrentVendor } from "@/features/vendors/api";
import { formatDateTime } from "@/lib/format";
import { normalizeExternalUrl } from "@/lib/safe-url";
import { readMarker } from "@/lib/vendor-pending-edit";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { TranslationKey } from "@/locales";
import type { Vendor } from "@/types/vendor";

import JourneyStepper from "./JourneyStepper";
import { AboutContent } from "./OnboardingAbout";
import { delay } from "./motion";

// How often we quietly ask the server whether the admin has decided yet.
const AUTO_CHECK_MS = 30_000;

const DAYS: { key: string; labelKey: TranslationKey }[] = [
  { key: "sat", labelKey: "vendor.profile.days.sat" },
  { key: "sun", labelKey: "vendor.profile.days.sun" },
  { key: "mon", labelKey: "vendor.profile.days.mon" },
  { key: "tue", labelKey: "vendor.profile.days.tue" },
  { key: "wed", labelKey: "vendor.profile.days.wed" },
  { key: "thu", labelKey: "vendor.profile.days.thu" },
  { key: "fri", labelKey: "vendor.profile.days.fri" },
];

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

const parseJson = <T extends object>(json: string): T => {
  try {
    return json ? (JSON.parse(json) as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

const CARD =
  "rounded-4xl border border-[#e8dfd8] bg-white shadow-[0_10px_40px_rgba(48,37,31,0.04)]";

/**
 * Stage 2 of onboarding: "your details are under review".
 * Read-only on purpose — no edit button, the vendor just sees what they sent,
 * where the request stands, and everything about us while they wait.
 */
export default function UnderReview({ vendor }: { vendor: Vendor }) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { pendingSubmitted, refreshSilently } = useVendorContext();

  const locale = LANGUAGE_DATE_LOCALE[language];

  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // What the vendor sent (the pending copy when the server keeps one).
  const data = vendor.pendingChanges ?? pendingSubmitted ?? vendor;

  const socialLinks = useMemo(
    () => parseJson<SocialLinks>(data.socialLinksJson),
    [data.socialLinksJson]
  );
  const workingHours = useMemo(
    () => parseJson<Record<string, string>>(data.workingHoursJson),
    [data.workingHoursJson]
  );

  const submittedAt = readMarker(vendor.id)?.submittedAt || vendor.updatedAt;

  /**
   * Asks the server for the current status.
   *
   * It talks to the API directly instead of going through the shared vendor
   * hook: a failed background check must never replace this page with the
   * "couldn't load your account" screen. Only when the status really moved
   * (approved / rejected / …) do we hand over to the shared state, which makes
   * the layout swap this page for the welcome screen or the form.
   */
  const checkStatus = useCallback(
    async (manual: boolean) => {
      try {
        if (manual) setRefreshing(true);

        const fresh = await getCurrentVendor();

        setLastChecked(new Date());

        if (fresh.status !== vendor.status) {
          await refreshSilently();
        } else if (manual) {
          toast(t("vendorOnboarding.review.stillPending"), "info");
        }
      } catch {
        if (manual) toast(t("vendorOnboarding.review.checkFailed"), "error");
      } finally {
        if (manual) setRefreshing(false);
      }
    },
    [vendor.status, refreshSilently, toast, t]
  );

  // Quiet background check while the tab is open.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === "visible") void checkStatus(false);
    };

    const timer = window.setInterval(check, AUTO_CHECK_MS);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [checkStatus]);

  const lastCheckedLabel = lastChecked
    ? new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }).format(lastChecked)
    : "";

  const hasSocial = Boolean(
    socialLinks.instagram ||
      socialLinks.facebook ||
      socialLinks.tiktok ||
      socialLinks.website
  );

  return (
    <main className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:py-10">
      <JourneyStepper current={2} />

      {/* ============================================================
          STATUS HERO
      ============================================================ */}
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
                  className={refreshing ? "onb-spin" : "transition-transform duration-500 group-hover:rotate-180"}
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

      {/* ============================================================
          TIMELINE + WHAT'S NEXT   |   WHAT YOU SENT
      ============================================================ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
        <div className="space-y-6">
          {/* Timeline */}
          <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(160)}>
            <h2 className="font-serif text-xl font-light text-[#30251f]">
              {t("vendorOnboarding.review.timelineTitle")}
            </h2>

            <ol className="mt-6">
              {/* 1 — submitted */}
              <li className="relative flex gap-4 pb-8">
                <span className="onb-fill absolute start-4.25 top-9 bottom-0 w-0.5 rounded-full bg-[#b99a62]" style={delay(500)} />

                <span className="onb-pop relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b99a62] text-white" style={delay(250)}>
                  <Check size={17} strokeWidth={3} />
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#30251f]">
                    {t("vendorOnboarding.review.timelineSubmitted")}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#81746d]">
                    {t("vendorOnboarding.review.timelineSubmittedText")}
                  </p>
                  {submittedAt && (
                    <p className="mt-1 text-[11px] font-semibold text-[#a47e43]">
                      {t("vendorOnboarding.review.timelineSubmittedAt", {
                        date: formatDateTime(submittedAt, locale),
                      })}
                    </p>
                  )}
                </div>
              </li>

              {/* 2 — under review (active) */}
              <li className="relative flex gap-4 pb-8">
                <span className="absolute start-4.25 top-9 bottom-0 w-0.5 overflow-hidden rounded-full bg-[#eee5df]">
                  <span className="onb-sweep absolute inset-x-0 top-0 block h-1/3 bg-linear-to-b from-transparent via-[#b99a62] to-transparent" />
                </span>

                {/* pop-in and pulse are separate elements: two animations
                    can't share one element's `animation` property */}
                <span className="onb-pop relative shrink-0" style={delay(450)}>
                  <span className="onb-dot flex h-9 w-9 items-center justify-center rounded-full bg-[#30251f] text-white">
                    <Clock3 size={16} />
                  </span>
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#30251f]">
                    {t("vendorOnboarding.review.timelineReview")}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#81746d]">
                    {t("vendorOnboarding.review.timelineReviewText")}
                  </p>
                </div>
              </li>

              {/* 3 — decision (upcoming) */}
              <li className="relative flex gap-4">
                <span className="onb-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#d9ccc2] bg-white text-[#b3a69e]" style={delay(650)}>
                  <ShieldCheck size={16} />
                </span>

                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-[#9b8f86]">
                    {t("vendorOnboarding.review.timelineDecision")}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#a3958c]">
                    {t("vendorOnboarding.review.timelineDecisionText")}
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* What happens next */}
          <section className={`onb-rise ${CARD} p-6 sm:p-8`} style={delay(240)}>
            <h2 className="font-serif text-xl font-light text-[#30251f]">
              {t("vendorOnboarding.review.nextTitle")}
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-emerald-800">
                  {t("vendorOnboarding.review.nextApproved")}
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm leading-6 text-amber-800">
                  {t("vendorOnboarding.review.nextRejected")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* What the vendor sent (read only) */}
        <section className={`onb-rise ${CARD} overflow-hidden`} style={delay(200)}>
          <div className="flex items-start justify-between gap-3 border-b border-[#f0e9e4] bg-[#fcfaf8] px-6 py-5 sm:px-8">
            <div>
              <h2 className="font-serif text-xl font-light text-[#30251f]">
                {t("vendorOnboarding.review.dataTitle")}
              </h2>
              <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-[#81746d]">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43]" />
                {t("vendorOnboarding.review.dataLocked")}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#faf5ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a47e43] rtl:tracking-normal">
              {t("vendorOnboarding.review.readOnly")}
            </span>
          </div>

          <div className="space-y-7 p-6 sm:p-8">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#30251f] shadow-md ring-1 ring-[#eadfce]">
                {vendor.profileImageUrl ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={vendor.profileImageUrl}
                    alt={data.businessName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                    {data.businessName?.charAt(0)?.toUpperCase() || "V"}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-[#30251f]">
                  {data.businessName}
                </p>
                {data.slogan && (
                  <p className="mt-0.5 text-sm text-[#756b65]">{data.slogan}</p>
                )}
              </div>
            </div>

            {data.bio && (
              <div>
                <Label>{t("vendor.profile.fields.about")}</Label>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#756b65]">
                  {data.bio}
                </p>
              </div>
            )}

            {/* Contact */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label={t("vendor.profile.fields.location")}
                value={data.location}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label={t("vendor.profile.fields.phone")}
                value={data.contactPhone}
                ltr
              />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  label={t("vendor.profile.fields.email")}
                  value={data.contactEmail}
                  ltr
                />
              </div>
            </div>

            {/* Social */}
            {hasSocial && (
              <div>
                <Label>{t("vendor.profile.social.title")}</Label>

                <div className="mt-3 flex flex-wrap gap-2">
                  <SocialPill
                    icon={<FaInstagram className="h-4 w-4" />}
                    label="Instagram"
                    href={socialLinks.instagram}
                  />
                  <SocialPill
                    icon={<FaFacebookF className="h-4 w-4" />}
                    label="Facebook"
                    href={socialLinks.facebook}
                  />
                  <SocialPill
                    icon={<FaTiktok className="h-4 w-4" />}
                    label="TikTok"
                    href={socialLinks.tiktok}
                  />
                  <SocialPill
                    icon={<Globe2 className="h-4 w-4" />}
                    label={t("vendor.profile.fields.website")}
                    href={socialLinks.website}
                  />
                </div>
              </div>
            )}

            {/* Working hours */}
            {DAYS.some(({ key }) => workingHours[key]) && (
              <div>
                <Label>{t("vendor.profile.hours.title")}</Label>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {DAYS.filter(({ key }) => workingHours[key]).map(
                    ({ key, labelKey }) => {
                      const isOff = workingHours[key] === "OFF";

                      return (
                        <div
                          key={key}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs ${
                            isOff
                              ? "border border-dashed border-rose-200 bg-rose-50/50 text-rose-500"
                              : "bg-[#fcfaf8] text-[#40352f]"
                          }`}
                        >
                          <span className="font-semibold">{t(labelKey)}</span>

                          {isOff ? (
                            <span className="inline-flex items-center gap-1 font-medium">
                              <CalendarOff className="h-3.5 w-3.5" />
                              {t("vendor.profile.dayOff")}
                            </span>
                          ) : (
                            <span dir="ltr" className="font-medium text-[#756b65]">
                              {workingHours[key]}
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ============================================================
          ABOUT US · THE IDEA · STEPS · PERKS · POLICY
      ============================================================ */}
      <div className="mt-10">
        <AboutContent />
      </div>
    </main>
  );
}

// ================================================================
// SUB-COMPONENTS
// ================================================================

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b8171] rtl:tracking-normal">
      {children}
    </p>
  );
}

function InfoRow({
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

function SocialPill({
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
