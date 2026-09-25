"use client";

import { CalendarDays, Sparkles, Gem, Flower2, Heart } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

import { CountdownTimer } from "@/components/roadmap/CountdownTimer";
import { type JourneyGender, getCurrentUserName, getFirstName, getJourneyCopy } from "@/components/roadmap/roadmapUtils";

const HERO_IMAGE =
  "https://cdn.prod.website-files.com/6718e262328596ea787524a5/6732673cc4f81ec0ef5c928d_AdobeStock_198831835_optimized_4000.jpeg";

export function RoadmapHero({
  partnerName,
  eventDate,
  progress,
  gender,
}: {
  partnerName: string;
  eventDate: string;
  progress: number;
  gender?: JourneyGender;
}) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const copy = getJourneyCopy(gender, t);

  const firstUserName = getFirstName(user?.fullName || getCurrentUserName());
  const firstPartnerName = getFirstName(partnerName || copy.partnerFallback);

  const hasEventDate =
    Boolean(eventDate) && !Number.isNaN(new Date(eventDate).getTime());
  const dateText = hasEventDate
    ? formatDate(eventDate, LANGUAGE_DATE_LOCALE[language])
    : "";

  return (
    <section className="relative isolate overflow-hidden bg-[#1f1613]">
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_30%] opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(24,16,13,0.55)_0%,rgba(24,16,13,0.78)_55%,rgba(24,16,13,0.96)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(226,183,119,0.18),transparent_45%)] rtl:bg-[radial-gradient(circle_at_80%_20%,rgba(226,183,119,0.18),transparent_45%)]" />

      <div className="mx-auto grid lg:max-w-10/12 items-center gap-10 px-5 pb-28 pt-14 sm:px-8 sm:pb-32 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-36 lg:pt-24">
        {/* Couple */}
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e2b777]/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#ecc98f] backdrop-blur sm:text-sm">
            <Sparkles size={14} aria-hidden="true" />
            {copy.eyebrow}
          </span>

          <h1 className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:justify-start lg:text-7xl">
            <span className="animate-[heroNameIn_0.9s_ease-out_both]">
              {firstUserName}
            </span>
            <span
              className="relative inline-flex shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#d9a363]/25 blur-md" />
              <Heart
                fill="#d9a363"
                strokeWidth={0}
                className="relative h-9 w-9 animate-[heartBeat_2.4s_ease-in-out_infinite] text-[#d9a363] drop-shadow-[0_0_18px_rgba(224,160,88,0.7)] sm:h-11 sm:w-11 lg:h-14 lg:w-14"
              />
              {copy.touch !== "neutral" && (
                <span
                  className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/25 bg-[#241916]"
                  style={{ color: copy.accentColor }}
                >
                  {copy.touch === "groom" ? (
                    <Gem size={12} />
                  ) : (
                    <Flower2 size={12} />
                  )}
                </span>
              )}
            </span>
            <span className="animate-[heroNameIn_0.9s_0.15s_ease-out_both] text-[#f1d4a6]">
              {firstPartnerName}
            </span>
          </h1>

          <p className="mt-5 text-base text-white/70 sm:text-lg">
            {t("roadmap.hero.tagline")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {hasEventDate ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
                <CalendarDays
                  size={16}
                  className="text-[#e2b777]"
                  aria-hidden="true"
                />
                {t("roadmap.hero.weddingOn", { date: dateText })}
              </span>
            ) : (
              <a
                href="#plan-details"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
              >
                <CalendarDays
                  size={16}
                  className="text-[#e2b777]"
                  aria-hidden="true"
                />
                {t("roadmap.overview.setDate")}
              </a>
            )}
          </div>
        </div>

        {/* Countdown card */}
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-black/25 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />

            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-white/80">
              <Heart
                size={13}
                fill="currentColor"
                className="text-[#e0ad70]"
                aria-hidden="true"
              />
              {hasEventDate
                ? t("roadmap.hero.countdownUntil")
                : t("roadmap.hero.countdownYourBigDay")}
            </p>

            {hasEventDate ? (
              <div className="mt-5">
                <CountdownTimer eventDate={eventDate} />
              </div>
            ) : (
              <p className="mt-5 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-relaxed text-white/75">
                <CalendarDays
                  size={16}
                  className="mt-0.5 shrink-0 text-[#dfb477]"
                  aria-hidden="true"
                />
                {copy.noDateReassurance}
              </p>
            )}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-white/70">
                  {t("roadmap.hero.progressLabel")}
                </span>
                <span className="font-bold tabular-nums text-[#ecc98f]">
                  {progress}%
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={t("roadmap.hero.progressLabel")}
              >
                <div
                  className="relative h-full overflow-hidden rounded-full bg-linear-to-r from-[#a26c48] via-[#c9914f] to-[#ecc383] transition-[width] duration-1000 rtl:bg-linear-to-l"
                  style={{ width: `${progress}%` }}
                >
                  <span className="absolute inset-y-0 left-0 w-1/3 min-w-8 animate-[progressShimmer_2.4s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent rtl:[animation-direction:reverse]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
