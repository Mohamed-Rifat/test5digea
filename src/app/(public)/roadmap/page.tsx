"use client";

import {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  Sparkles,
  Store,
  Target,
  X,
  Camera,
  Music2,
  Utensils,
  Gem,
  Flower2,
  CakeSlice,
  Shirt,
  Heart,
  Car,
  MoreHorizontal,
  MessageSquarePlus,
  AlertCircle,
  HeartHandshake,
} from "lucide-react";

import { Tooltip } from "@mui/material";

import AuthGuard from "@/components/guards/AuthGuard";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/format";
import { RoadmapItemStatus } from "@/types/roadmap";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { authStorage } from "@/lib/auth-storage";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

/* =========================================================
   CONSTANTS
========================================================= */

const GOLD = "#b27a3d";

const CATEGORY_ICONS: Record<string, ElementType> = {
  photography: Camera,
  photographer: Camera,
  venue: Gem,
  decoration: Flower2,
  catering: Utensils,
  cake: CakeSlice,
  music: Music2,
  dress: Shirt,
  transport: Car,
};

const FALLBACK_ICONS = [
  Camera,
  Gem,
  Flower2,
  Utensils,
  CakeSlice,
  Music2,
  Shirt,
  Car,
  MoreHorizontal,
];

/* =========================================================
   HELPERS
========================================================= */

const getCategoryIcon = (
  name: string | undefined,
  index: number
): ElementType => {
  const safeName = (name ?? "").toLowerCase();

  const matched = Object.keys(CATEGORY_ICONS).find((key) =>
    safeName.includes(key)
  );

  return matched
    ? CATEGORY_ICONS[matched]
    : FALLBACK_ICONS[index % FALLBACK_ICONS.length];
};

const getRoadmapItemKey = (
  item: {
    id?: string | null;
    categoryId?: string | number | null;
    categoryName?: string | null;
  },
  index: number
) => {
  if (item.id) {
    return `roadmap-${item.id}`;
  }

  if (
    item.categoryId !== null &&
    item.categoryId !== undefined &&
    item.categoryId !== ""
  ) {
    return `category-${item.categoryId}-${index}`;
  }

  return `fallback-${item.categoryName ?? "category"}-${index}`;
};

const getCurrentUserName = () => {
  try {
    const auth = authStorage.get() as
      | {
        name?: string;
        fullName?: string;
        userName?: string;
        username?: string;
        user?: {
          name?: string;
          fullName?: string;
          userName?: string;
        };
      }
      | null;

    return (
      auth?.fullName ||
      auth?.name ||
      auth?.userName ||
      auth?.username ||
      auth?.user?.fullName ||
      auth?.user?.name ||
      auth?.user?.userName ||
      "You"
    );
  } catch {
    return "You";
  }
};

const getFirstName = (name: string | null | undefined) => {
  const trimmed = (name ?? "").trim();

  if (!trimmed) {
    return "You";
  }

  return trimmed.split(/\s+/)[0];
};

/* =========================================================
   GENDER-AWARE COPY
   ---------------------------------------------------------
   The signed-in user's gender (from GET /api/Auth/me) tells us
   whether they're the groom (planning with a bride) or the
   bride (planning with a groom), so the roadmap can speak to
   them — and about their partner — in the right voice, with a
   small stylistic touch either way.
========================================================= */

type JourneyGender = "Male" | "Female" | null | undefined;

const getJourneyCopy = (
  gender: JourneyGender,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
) => {
  const normalized = (gender ?? "").toLowerCase();

  const touch =
    normalized === "male"
      ? ("groom" as const)
      : normalized === "female"
        ? ("bride" as const)
        : ("neutral" as const);

  const accentColor =
    touch === "groom" ? "#a9773c" : touch === "bride" ? "#c68a72" : "#b27a3d";

  return {
    isSpecified: touch !== "neutral",
    touch,
    accentColor,
    partnerLabel: t(`roadmap.create.${touch}.partnerLabel`),
    partnerPlaceholder: t(`roadmap.create.${touch}.partnerPlaceholder`),
    partnerFallback: t(`roadmap.create.${touch}.partnerFallback`),
    eyebrow: t(`roadmap.create.${touch}.eyebrow`),
    heading: t("roadmap.create.heading"),
    subheading: t(`roadmap.create.${touch}.subheading`),
    noDateReassurance: t(`roadmap.create.${touch}.noDateReassurance`),
    partnerHeaderFallback: t(`roadmap.create.${touch}.partnerHeaderFallback`),
  };
};

/* =========================================================
   COUNTDOWN
========================================================= */

function CountdownTimer({ eventDate }: { eventDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(eventDate).getTime();

    if (Number.isNaN(target)) {
      return;
    }

    const update = () => {
      const diff = Math.max(0, target - Date.now());

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, [eventDate]);

  const values = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {values.map(([label, value]) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5.5 px-1.5 py-3 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#dfb477]/30 hover:bg-white/8.5 sm:px-2.5 sm:py-4"
        >
          {/* top shine */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

          {/* glow */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-[#d9a365]/10 blur-2xl transition-all duration-500 group-hover:bg-[#d9a365]/20" />

          <div
            key={`${label}-${value}`}
            className="relative text-center font-serif text-[22px] font-light leading-none tracking-[-0.03em] text-white sm:text-[28px] animate-[countdownTick_0.45s_ease-out]"
          >
            {String(value).padStart(2, "0")}
          </div>

          <div className="relative mt-1.5 text-center text-[6px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[7px]">
            {label}
          </div>

          {label === "Seconds" && (
            <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-[#dfb477]" />
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   ROMANTIC HERO
========================================================= */

function RomanticHero({
  partnerName,
  eventDate,
  progress,
  coverImageUrl,
  gender,
}: {
  partnerName: string;
  eventDate: string;
  progress: number;
  /** Optional real photo (e.g. the couple's engagement photo) to use as the
   * hero background instead of the abstract gradient. Pass a URL from your
   * own storage/CDN — nothing is fetched automatically. */
  coverImageUrl?: string;
  /** Signed-in user's gender ("Male" / "Female"), used to personalize the
   * partner fallback name and the missing-date message. */
  gender?: JourneyGender;
}) {
  const { t } = useLanguage();
  const [userName, setUserName] = useState("You");

  useEffect(() => {
    setUserName(getCurrentUserName());
  }, []);

  const copy = getJourneyCopy(gender, t);

  const firstUserName = getFirstName(userName);
  const firstPartnerName = getFirstName(partnerName || copy.partnerFallback);

  const hasEventDate = Boolean(eventDate) && !Number.isNaN(new Date(eventDate).getTime());

  return (
    <section className="relative isolate min-h-140 overflow-hidden bg-[#241916] shadow-[0_35px_100px_rgba(48,34,29,0.3)] sm:min-h-160 lg:min-h-180">
  {/* =====================================================
      BACKGROUND — full-width romantic cover image
  ====================================================== */}

  {coverImageUrl ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverImageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Romantic dark overlay — keeps the photo visible */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,13,11,0.78),rgba(30,19,16,0.34)_45%,rgba(20,13,11,0.72))]" />

      {/* Soft cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_15%,rgba(20,13,11,0.18)_55%,rgba(20,13,11,0.58)_100%)]" />
    </>
  ) : (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,174,105,0.22),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(165,91,67,0.2),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(126,74,68,0.22),transparent_50%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(27,17,15,0.98),rgba(62,38,31,0.72),rgba(27,18,16,0.98))]" />
    </>
  )}

  {/* =====================================================
      SIDE LIGHTS
  ====================================================== */}

  <div className="pointer-events-none absolute -left-40 top-[30%] h-96 w-96 rounded-full bg-[#a85e4e]/10 blur-[110px]" />

  <div className="pointer-events-none absolute -right-40 top-[12%] h-96 w-96 rounded-full bg-[#c98c61]/10 blur-[110px]" />

  <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e5b878]/4 blur-[100px]" />

  {/* =====================================================
      DECORATIVE RINGS
  ====================================================== */}

  <div className="pointer-events-none absolute left-[5%] top-[16%] h-44 w-44 rounded-full border border-white/[0.035] sm:h-64 sm:w-64" />

  <div className="pointer-events-none absolute -right-22.5 top-[20%] h-64 w-64 rounded-full border border-[#dfb477]/6 sm:h-96 sm:w-96" />

  <div className="pointer-events-none absolute -bottom-32.5 left-[20%] h-80 w-80 rounded-full border border-white/2.5" />

  <div className="pointer-events-none absolute -bottom-45 right-[15%] h-96 w-96 rounded-full border border-[#e2b777]/2.5" />

  {/* =====================================================
      FLOATING LOVE DETAILS
  ====================================================== */}

  <div className="pointer-events-none absolute left-[6%] top-[18%] animate-[float_5s_ease-in-out_infinite] text-[#e5b878]/40">
    <Heart size={16} fill="currentColor" />
  </div>

  <div className="pointer-events-none absolute left-[12%] top-[70%] animate-[float_7s_ease-in-out_infinite_1s] text-[#dba86d]/20">
    <Sparkles size={13} />
  </div>

  <div className="pointer-events-none absolute right-[8%] top-[12%] animate-[float_6s_ease-in-out_infinite_1s] text-white/20">
    <Heart size={12} fill="currentColor" />
  </div>

  <div className="pointer-events-none absolute right-[6%] bottom-[16%] animate-[float_5s_ease-in-out_infinite_1.5s] text-[#e5b878]/20">
    <Heart size={16} fill="currentColor" />
  </div>

  <div className="pointer-events-none absolute left-[42%] top-[16%] animate-[float_6s_ease-in-out_infinite] text-[#e5b878]/20">
    <Heart size={11} fill="currentColor" />
  </div>

  <div className="pointer-events-none absolute right-[28%] bottom-[18%] animate-[float_7s_ease-in-out_infinite_1.5s] text-white/15">
    <Sparkles size={12} />
  </div>

  {/* =====================================================
      TINY STARS
  ====================================================== */}

  <div className="pointer-events-none absolute left-[30%] top-[12%] h-1 w-1 animate-pulse rounded-full bg-[#e4b979]" />

  <div className="pointer-events-none absolute right-[34%] top-[10%] h-1 w-1 animate-pulse rounded-full bg-white/40" />

  <div className="pointer-events-none absolute left-[38%] bottom-[22%] h-1 w-1 animate-pulse rounded-full bg-[#e4b979]/70" />

  {/* =====================================================
      CONTENT
  ====================================================== */}

  <div className="relative mx-auto flex min-h-140 max-w-375 items-center px-5 py-16 sm:min-h-160 sm:px-8 sm:py-20 lg:min-h-180 lg:px-14 lg:py-24">
    <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_auto] lg:gap-16">

      {/* =================================================
          LEFT — couple names
      ================================================== */}

      <div className="text-center lg:text-left">

        {/* Small journey label */}
        <div className="flex items-center justify-center gap-3 lg:justify-start">
          <div className="flex items-center gap-2.5">
            <Sparkles
              size={12}
              className="text-[#e2bb84]/90"
            />

            <span className="text-4xl font-semibold uppercase tracking-[0.45em] text-[#e2bb84] sm:text-2xl">
              {copy.eyebrow}
            </span>
          </div>

          <span className="hidden h-px w-14 bg-linear-to-r from-[#d7aa70]/60 to-transparent sm:block lg:hidden" />
        </div>

        {/* =================================================
            NAMES
        ================================================== */}

        <div className="mt-7 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-3 lg:justify-start lg:gap-x-5">

          <h1 className="animate-[heroNameLeft_1s_ease-out] font-serif text-[46px] font-light italic leading-none tracking-[-0.04em] text-white drop-shadow-[0_5px_25px_rgba(0,0,0,0.3)] sm:text-[62px] lg:text-8xl">
            {firstUserName}
          </h1>

          {/* Heart */}
          <div className="relative mb-2 shrink-0 sm:mb-3 lg:mb-4">

            <div className="absolute inset-0 animate-ping rounded-full bg-[#d9a363]/20 blur-md" />

            <Heart
              size={24}
              fill="#d9a363"
              strokeWidth={0}
              className="relative animate-[heartBeat_2s_ease-in-out_infinite] text-[#d9a363] drop-shadow-[0_0_18px_rgba(224,160,88,0.8)] sm:h-9 sm:w-9 lg:h-18 lg:w-18"
            />

            {/* Small gendered touch — a groom's ring for him, a bride's
                bloom for her — riding along the heart. */}
            {copy.touch !== "neutral" && (
              <div
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-[#241916] shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                style={{ color: copy.accentColor }}
              >
                {copy.touch === "groom" ? (
                  <Gem size={10} className="sm:size-3 lg:size-3.5" />
                ) : (
                  <Flower2 size={10} className="sm:size-3 lg:size-3.5" />
                )}
              </div>
            )}
          </div>

          <h1 className="animate-[heroNameRight_1s_ease-out] font-serif text-[46px] font-light italic leading-none tracking-[-0.04em] text-white drop-shadow-[0_5px_25px_rgba(0,0,0,0.3)] sm:text-[62px] lg:text-[78px]">
            {firstPartnerName}
          </h1>
        </div>

        {/* Romantic tagline */}
        <p className="mt-6 text-[8px] font-medium uppercase tracking-[0.4em] text-white/55 sm:text-lg">
          {t("roadmap.hero.tagline")}
        </p>

        {/* Small journey indicator */}
        <div className="mt-8 hidden items-center gap-2 lg:flex">

          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d9a866]/60" />

            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d9a866]" />
          </span>

          <span className="text-[14px] font-medium uppercase tracking-[0.28em] text-white/40">
            {t("roadmap.hero.stepsCloser")}
          </span>
        </div>

        {/* Decorative line */}
        <div className="mx-auto mt-8 h-px w-20 bg-linear-to-r from-transparent via-[#d9a866]/60 to-transparent lg:mx-0" />
      </div>

      {/* =================================================
          RIGHT — COUNTDOWN CARD
      ================================================== */}

      <div className="mx-auto w-full max-w-95 lg:mx-0">

        <div className="relative overflow-hidden rounded-[30px] border border-white/[0.14] bg-black/18 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-7">

          {/* Glass shine */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />

          <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-[#e4b477]/10 blur-[65px]" />

          <div className="relative">

            {/* Title */}
            <div className="flex items-center justify-center gap-2">

              <Heart
                size={11}
                fill="currentColor"
                className="text-[#e0ad70]"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/65">
                {hasEventDate
                  ? t("roadmap.hero.countdownUntil")
                  : t("roadmap.hero.countdownYourBigDay")}
              </span>

              <Heart
                size={11}
                fill="currentColor"
                className="text-[#e0ad70]"
              />
            </div>

            {hasEventDate ? (
              <>
                {/* Countdown */}
                <div className="mt-5">
                  <CountdownTimer eventDate={eventDate} />
                </div>

                {/* Event date */}
                <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3">

                  <CalendarDays
                    size={13}
                    className="text-[#dfb477]"
                  />

                  <span className="text-[9px] font-medium tracking-wide text-white/80 sm:text-[10px]">
                    {formatDate(eventDate)}
                  </span>
                </div>
              </>
            ) : (
              /* No date yet — a warm, gender-aware reassurance instead of a
                 broken 00:00:00:00 countdown. */
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <CalendarDays
                  size={14}
                  className="mt-0.5 shrink-0 text-[#dfb477]"
                />

                <p className="text-left text-[9px] leading-relaxed text-white/75 sm:text-[10px]">
                  {copy.noDateReassurance}
                </p>
              </div>
            )}

            {/* Progress */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  {t("roadmap.hero.progressLabel")}
                </span>

                <span className="font-serif text-xs text-[#e0b477]">
                  {progress}%
                </span>
              </div>

              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">

                <div
                  className="relative h-full rounded-full bg-linear-to-r from-[#9b674d] via-[#c68e51] to-[#ebc383] shadow-[0_0_16px_rgba(225,178,108,0.4)] transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-y-0 right-0 w-14 animate-[progressShimmer_2s_linear_infinite] bg-linear-to-r from-transparent via-white/55 to-transparent" />
                </div>
              </div>
            </div>

            {/* Tiny romantic footer */}
            <div className="mt-5 flex items-center justify-center gap-2">

              <span className="h-px w-8 bg-white/10" />

              <Heart
                size={8}
                fill="currentColor"
                className="text-[#d9a363]/70"
              />

              <span className="text-[7px] uppercase tracking-[0.25em] text-white/30">
                {t("roadmap.hero.footerTagline")}
              </span>

              <Heart
                size={8}
                fill="currentColor"
                className="text-[#d9a363]/70"
              />

              <span className="h-px w-8 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

/* =========================================================
   ROADMAP PATH
========================================================= */

function JourneyPath({
  items,
  onReview,
  actionLoading,
  onComplete,
  onUncomplete,
  onRemove,
  onRequestExternalComplete,
  onCompletedWithVendor,
}: {
  items: any[];
  onReview: (item: any) => void;
  actionLoading: string | null;
  onComplete: (categoryId: string | number) => Promise<boolean>;
  onUncomplete: (categoryId: string | number) => Promise<boolean>;
  onRemove: (categoryId: string | number) => Promise<boolean>;
  onRequestExternalComplete: (item: any) => void;
  onCompletedWithVendor: (item: any) => void;
}) {
  const orderedRows = useMemo(() => {
    const result: any[][] = [];

    for (let i = 0; i < items.length; i += 3) {
      const row = items.slice(i, i + 3);

      const rowIndex = result.length;

      if (rowIndex % 2 === 1) {
        row.reverse();
      }

      result.push(row);
    }

    return result;
  }, [items]);

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [box, setBox] = useState({ width: 0, height: 0 });
  const [roadPaths, setRoadPaths] = useState<string[]>([]);

  // The connecting "road" is measured directly from the actual rendered
  // card rows (instead of a fixed/guessed viewBox), so it always lines up
  // with the cards no matter how tall a row grows or how many rows there
  // are — including further down the page.
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const width = containerRect.width;
      const height = container.scrollHeight;

      setBox({ width, height });

      const centers = rowRefs.current
        .slice(0, orderedRows.length)
        .map((el) => {
          if (!el) return 0;
          const rect = el.getBoundingClientRect();
          return rect.top - containerRect.top + rect.height / 2;
        });

      const inset = Math.min(80, width * 0.07);
      const paths: string[] = [];

      for (let i = 0; i < centers.length - 1; i += 1) {
        const y = centers[i];
        const nextY = centers[i + 1];
        const mid = (y + nextY) / 2;
        const leftToRight = i % 2 === 0;

        const left = inset;
        const right = width - inset;

        const d = leftToRight
          ? `M ${left} ${y} C ${left - 50} ${y} ${left - 50} ${mid} ${left} ${mid} L ${right} ${mid} C ${right + 50} ${mid} ${right + 50} ${nextY} ${right} ${nextY}`
          : `M ${right} ${y} C ${right + 50} ${y} ${right + 50} ${mid} ${right} ${mid} L ${left} ${mid} C ${left - 50} ${mid} ${left - 50} ${nextY} ${left} ${nextY}`;

        paths.push(d);
      }

      setRoadPaths(paths);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    rowRefs.current.forEach((el) => el && ro.observe(el));

    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [orderedRows]);

  return (
    <div ref={containerRef} className="relative">
      {/* desktop road — drawn to the container's real pixel size, so it
          never drifts out of alignment with the cards below it */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <svg
          width={box.width || undefined}
          height={box.height || undefined}
          className="overflow-visible"
        >
          <defs>
            <linearGradient
              id="journeyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#c28b58" />
              <stop offset="35%" stopColor="#e1b67e" />
              <stop offset="65%" stopColor="#bd8791" />
              <stop offset="100%" stopColor="#a97a9e" />
            </linearGradient>

            <filter id="roadGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {roadPaths.map((d, rowIndex) => (
            <g key={`path-${rowIndex}`}>
              <path
                d={d}
                fill="none"
                stroke="#e9dcd0"
                strokeWidth="34"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d={d}
                fill="none"
                stroke="url(#journeyGradient)"
                strokeWidth="3"
                strokeDasharray="10 10"
                strokeLinecap="round"
                filter="url(#roadGlow)"
                className="animate-[dashMove_4s_linear_infinite]"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="relative space-y-5 lg:space-y-12">
        {orderedRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            ref={(el) => {
              rowRefs.current[rowIndex] = el;
            }}
            className={`grid gap-5 lg:grid-cols-3 lg:items-center lg:gap-12 ${rowIndex % 2 === 1
                ? "lg:[&>*:first-child]:order-3 lg:[&>*:last-child]:order-1"
                : ""
              }`}
          >
            {row.map((item) => {
              const originalIndex = items.indexOf(item);

              return (
                <JourneyCard
                  key={getRoadmapItemKey(item, originalIndex)}
                  item={item}
                  index={originalIndex}
                  onReview={onReview}
                  actionLoading={actionLoading}
                  onComplete={onComplete}
                  onUncomplete={onUncomplete}
                  onRemove={onRemove}
                  onRequestExternalComplete={onRequestExternalComplete}
                  onCompletedWithVendor={onCompletedWithVendor}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   JOURNEY CARD
========================================================= */

function JourneyCard({
  item,
  index,
  onReview,
  actionLoading,
  onComplete,
  onUncomplete,
  onRemove,
  onRequestExternalComplete,
  onCompletedWithVendor,
}: {
  item: any;
  index: number;
  onReview: (item: any) => void;
  actionLoading: string | null;
  onComplete: (categoryId: string | number) => Promise<boolean>;
  onUncomplete: (categoryId: string | number) => Promise<boolean>;
  onRemove: (categoryId: string | number) => Promise<boolean>;
  onRequestExternalComplete: (item: any) => void;
  onCompletedWithVendor: (item: any) => void;
}) {
  const { t, isArabic } = useLanguage();
  const isCompleted = item.status === RoadmapItemStatus.Completed;
  const isSelected = item.status === RoadmapItemStatus.VendorSelected;
  const hasVendor = Boolean(item.selectedVendorId);

  const Icon = getCategoryIcon(item.categoryName, index);
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`group relative ${isCompleted ? "lg:-translate-y-2" : "lg:hover:-translate-y-3"
        }`}
    >
      {/* mobile connector */}
      <div className="absolute left-7 top-full z-0 h-5 w-px bg-linear-to-b from-[#cba77b] to-transparent lg:hidden" />

      <div
        className={`relative z-10 overflow-hidden rounded-[30px] border bg-white p-4 shadow-[0_14px_40px_rgba(65,46,37,0.07)] transition-all duration-500 sm:p-5 ${isCompleted
            ? "border-emerald-200 bg-emerald-50/40 shadow-[0_18px_50px_rgba(45,120,75,0.12)]"
            : isSelected
              ? "border-[#e5cfaa] bg-[#fffdf8]"
              : "border-[#e9ded4] hover:border-[#cda875] hover:shadow-[0_22px_55px_rgba(80,55,42,0.14)]"
          }`}
      >
        {/* top accent */}
        <div
          className={`absolute left-0 right-0 top-0 h-0.5 ${isCompleted
              ? "bg-linear-to-r from-transparent via-emerald-400 to-transparent"
              : "bg-linear-to-r from-transparent via-[#c79655] to-transparent opacity-60"
            }`}
        />

        {/* subtle inner glow */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-3xl ${isCompleted
              ? "bg-emerald-300/10"
              : "bg-[#d6a05e]/8"
            }`}
        />

        <div className="relative flex items-start gap-4">
          {/* icon */}
          <div
            className={`relative flex h-14.5 w-14.5 shrink-0 items-center justify-center rounded-[20px] transition-all duration-500 group-hover:scale-[1.04] ${isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : isSelected
                  ? "bg-[#f5e6cf] text-[#a97532]"
                  : "bg-[#f7eee6] text-[#a77a43]"
              }`}
          >
            <Icon size={23} strokeWidth={1.5} />

            {/* number */}
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#30251f] text-[7px] font-bold tracking-wide text-white shadow-md">
              {number}
            </span>
          </div>

          {/* content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[7px] font-bold uppercase tracking-[0.2em] ${isCompleted
                    ? "text-emerald-600"
                    : isSelected
                      ? "text-[#a87532]"
                      : "text-[#b29e8c]"
                  }`}
              >
                {isCompleted
                  ? t("roadmap.card.status.completed")
                  : isSelected
                    ? t("roadmap.card.status.vendorSelected")
                    : t("roadmap.card.status.step", { number })}
              </span>

              {isCompleted && (
                <CheckCircle2
                  size={16}
                  strokeWidth={1.7}
                  className="shrink-0 text-emerald-500"
                />
              )}
            </div>

            <h3 className="mt-1.5 truncate font-serif text-[22px] font-normal leading-tight tracking-tight text-[#30251f] sm:text-[24px]">
              {item.categoryName}
            </h3>

            {hasVendor ? (
              <div className="mt-2.5 flex min-w-0 items-center gap-1.5">
                <Store
                  size={12}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#ae7d3e]"
                />

                <span className="truncate text-[10px] font-medium tracking-[0.01em] text-[#8d6d4c]">
                  {item.selectedVendorName}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-[10px] leading-[1.6] text-[#9a8c82]">
                {t("roadmap.card.noVendorHint")}
              </p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-[#eee6df] pt-3">
          <div className="flex items-center gap-1.5">
            <Tooltip
              title={
                isCompleted
                  ? t("roadmap.card.tooltip.reopen")
                  : hasVendor
                    ? t("roadmap.card.tooltip.markComplete")
                    : t("roadmap.card.tooltip.markCompleteExternal")
              }
              arrow
            >
              <span>
                <button
                  type="button"
                  disabled={actionLoading === `complete-${item.categoryId}`}
                  onClick={async () => {
                    if (isCompleted) {
                      await onUncomplete(item.categoryId);
                      return;
                    }

                    if (!hasVendor) {
                      // No vendor selected from our platform — ask the
                      // couple whether they'd like to tell us about the
                      // provider they used outside 5digea before we
                      // mark this step complete.
                      onRequestExternalComplete(item);
                      return;
                    }

                    const ok = await onComplete(item.categoryId);

                    if (ok) {
                      onCompletedWithVendor(item);
                    }
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${isCompleted
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "border-[#e6ddd5] bg-white text-[#8e8179] hover:-translate-y-0.5 hover:border-[#ae7d43] hover:text-[#ae7d43]"
                    }`}
                >
                  {actionLoading === `complete-${item.categoryId}` ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isCompleted ? (
                    <Check size={15} />
                  ) : (
                    <Circle size={15} />
                  )}
                </button>
              </span>
            </Tooltip>

            {isCompleted && hasVendor && item.id && (
              <Tooltip title={t("roadmap.card.tooltip.writeReview")} arrow>
                <button
                  type="button"
                  onClick={() => onReview(item)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6ddd5] bg-white text-[#81756d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ae7d43] hover:text-[#ae7d43]"
                >
                  <MessageSquarePlus size={14} />
                </button>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/vendors?categoryId=${encodeURIComponent(
                String(item.categoryId)
              )}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#30251f] px-3 text-[9px] font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#46342a] hover:shadow-md sm:px-4"
            >
              {hasVendor
                ? t("roadmap.card.action.change")
                : t("roadmap.card.action.explore")}

              <ArrowRight size={12} className={isArabic ? "rotate-180" : ""} />
            </Link>

            {hasVendor && (
              <Tooltip title={t("roadmap.card.tooltip.removeVendor")} arrow>
                <button
                  type="button"
                  disabled={
                    actionLoading === `remove-${item.categoryId}`
                  }
                  onClick={() => onRemove(item.categoryId)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfd8] bg-white text-[#a2948b] transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  {actionLoading === `remove-${item.categoryId}` ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <X size={14} />
                  )}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function ProgressRing({ progress }: { progress: number }) {
  const { t } = useLanguage();
  const radius = 43;
  const circumference = 2 * Math.PI * radius;

  const safeProgress = Math.min(100, Math.max(0, progress));

  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#eee5dd"
          strokeWidth="7"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl tracking-[-0.02em] text-[#30251f]">
          {safeProgress}%
        </span>

        <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[#a59a92]">
          {t("roadmap.progressRing.complete")}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   EXTERNAL VENDOR SUGGESTION MODAL
   Shown when the couple marks a step complete without having
   selected a vendor from our platform (i.e. they booked
   somewhere else). Lets them optionally tell us about the
   provider so we can consider inviting them to join.
========================================================= */

function ExternalVendorModal({
  categoryName,
  submitting,
  onSkip,
  onSubmit,
}: {
  categoryName: string;
  submitting: boolean;
  onSkip: () => void;
  onSubmit: (data: { vendorName: string; phone: string; link: string }) => void;
}) {
  const { t } = useLanguage();
  const [vendorName, setVendorName] = useState("");
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-[#30221d] px-6 py-8 text-center">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <HeartHandshake size={24} className="text-[#d9a363]" />
            </div>

            <h3 className="mt-4 font-serif text-2xl font-light text-white">
              {t("roadmap.externalModal.title")}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/60">
              {t("roadmap.externalModal.bodyBefore")}{" "}
              <span className="font-medium text-white/80">
                {categoryName}
              </span>{" "}
              {t("roadmap.externalModal.bodyAfter")}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-7">
          <div>
            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#766b64]">
              {t("roadmap.externalModal.fields.vendorName.label")}
            </label>

            <input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder={t("roadmap.externalModal.fields.vendorName.placeholder")}
              className="w-full rounded-xl border border-[#e2d8cf] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#766b64]">
              {t("roadmap.externalModal.fields.phone.label")}
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("roadmap.externalModal.fields.phone.placeholder")}
              className="w-full rounded-xl border border-[#e2d8cf] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#766b64]">
              {t("roadmap.externalModal.fields.link.label")}
            </label>

            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={t("roadmap.externalModal.fields.link.placeholder")}
              className="w-full rounded-xl border border-[#e2d8cf] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onSkip}
              disabled={submitting}
              className="h-11 rounded-xl border border-[#e3d9d1] px-5 text-xs font-semibold text-[#766a62] transition hover:bg-[#f8f4f0] disabled:opacity-60"
            >
              {t("roadmap.externalModal.buttons.skip")}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() =>
                onSubmit({
                  vendorName: vendorName.trim(),
                  phone: phone.trim(),
                  link: link.trim(),
                })
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] px-5 text-xs font-semibold text-white transition hover:bg-[#46332a] disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {t("roadmap.externalModal.buttons.send")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW PROMPT MODAL
   Shown right after a step with a platform vendor is marked
   complete, so the couple can choose to review now or later.
========================================================= */

function ReviewPromptModal({
  categoryName,
  onReviewNow,
  onLater,
}: {
  categoryName: string;
  onReviewNow: () => void;
  onLater: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={26} className="text-emerald-500" />
        </div>

        <h3 className="mt-4 font-serif text-2xl font-light text-[#30251f]">
          {t("roadmap.reviewPrompt.heading", { category: categoryName })}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#8b7e76]">
          {t("roadmap.reviewPrompt.body")}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onReviewNow}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] text-xs font-semibold text-white transition hover:bg-[#46332a]"
          >
            <MessageSquarePlus size={14} />
            {t("roadmap.reviewPrompt.reviewNow")}
          </button>

          <button
            type="button"
            onClick={onLater}
            className="h-11 rounded-xl border border-[#e3d9d1] text-xs font-semibold text-[#766a62] transition hover:bg-[#f8f4f0]"
          >
            {t("roadmap.reviewPrompt.later")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CREATE ROADMAP
========================================================= */

function CreateRoadmapForm({
  onCreate,
  loading,
  gender,
}: {
  onCreate: (data: {
    partnerName: string;
    eventDate: string;
  }) => Promise<boolean>;
  loading: boolean;
  /** Signed-in user's gender ("Male" / "Female"), used to personalize the
   * copy below — who we ask about, and how we reassure them if a detail
   * isn't ready yet. */
  gender?: JourneyGender;
}) {
  const { t, isArabic } = useLanguage();
  const [partnerName, setPartnerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [formError, setFormError] = useState("");

  const copy = getJourneyCopy(gender, t);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setFormError("");

    // Neither field is required to begin the journey — a name or a date
    // that isn't settled yet shouldn't block someone from starting. We
    // simply carry forward whatever has been filled in.
    await onCreate({
      partnerName: partnerName.trim(),
      eventDate: eventDate ? new Date(eventDate).toISOString() : "",
    });
  };

  return (
    <div className="min-h-screen bg-[#fbf8f4] px-4 py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[36px] border border-[#e5d9cf] bg-white shadow-[0_25px_80px_rgba(48,37,31,0.12)]">
        <div className="relative overflow-hidden bg-[#30221d] px-7 py-12 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />

          <div className="relative">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <Heart size={27} fill="#d9a363" className="text-[#d9a363]" />

              {/* Small gendered touch on the entry screen too. */}
              {copy.touch !== "neutral" && (
                <div
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#30221d] bg-[#fbf8f4] shadow-sm"
                  style={{ color: copy.accentColor }}
                >
                  {copy.touch === "groom" ? (
                    <Gem size={12} />
                  ) : (
                    <Flower2 size={12} />
                  )}
                </div>
              )}
            </div>

            <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#dcb078]">
              {copy.eyebrow}
            </p>

            <h1 className="mt-3 font-serif text-4xl font-light text-white sm:text-6xl">
              {copy.heading}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55">
              {copy.subheading}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10">
          <div>
            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#766b64]">
              {copy.partnerLabel}
              <span className="ml-1 normal-case tracking-normal text-[#b3a89f]">
                {t("roadmap.create.optional")}
              </span>
            </label>

            <div className="relative">
              <Heart
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b39a86]"
              />

              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={copy.partnerPlaceholder}
                className="w-full rounded-2xl border border-[#e2d8cf] bg-[#fcfaf8] py-4 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#766b64]">
              {t("roadmap.create.weddingDateLabel")}
              <span className="ml-1 normal-case tracking-normal text-[#b3a89f]">
                {t("roadmap.create.optional")}
              </span>
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b39a86]"
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-2xl border border-[#e2d8cf] bg-[#fcfaf8] py-4 pl-11 pr-4 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
              />
            </div>

            {!eventDate && (
              <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8b7e76]">
                <Sparkles size={12} className="mt-0.5 shrink-0 text-[#b17c42]" />
                {copy.noDateReassurance}
              </p>
            )}
          </div>

          {formError && (
            <div className="flex gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs text-red-600">
              <AlertCircle size={15} className="shrink-0" />
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#30221d] text-sm font-semibold text-white transition hover:bg-[#46332a] hover:shadow-lg disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {t("roadmap.create.submit.creating")}
              </>
            ) : (
              <>
                <Heart size={17} />
                {t("roadmap.create.submit.button")}
                <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function RoadmapSummary({
  roadmap,
  onUpdate,
  updating,
  gender,
}: {
  roadmap: NonNullable<ReturnType<typeof useRoadmap>["roadmap"]>;
  onUpdate: (data: {
    partnerName: string;
    eventDate: string;
  }) => Promise<boolean>;
  updating: boolean;
  /** Signed-in user's gender ("Male" / "Female"), used to personalize
   * labels and fallbacks the same way as the rest of the journey. */
  gender?: JourneyGender;
}) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const copy = getJourneyCopy(gender, t);

  const [editing, setEditing] = useState(false);

  const [partnerName, setPartnerName] = useState(roadmap.partnerName);

  const [eventDate, setEventDate] = useState(
    roadmap.eventDate ? roadmap.eventDate.slice(0, 10) : ""
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Same as the initial setup: neither detail is required to save —
    // couples fill these in whenever they're ready.
    const ok = await onUpdate({
      partnerName: partnerName.trim(),
      eventDate: eventDate ? new Date(eventDate).toISOString() : "",
    });

    if (ok) {
      setEditing(false);
      toast(t("roadmap.summary.toast.updated"), "success");
    } else {
      toast(t("roadmap.summary.toast.updateFailed"), "error");
    }
  };

  return (
    <section
      id="plan-details"
      className="mt-10 overflow-hidden rounded-[30px] border border-[#e8ded5] bg-white shadow-sm"
    >
      {!editing ? (
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7eee5]">
              <CalendarDays size={19} className="text-[#a9773c]" />
            </div>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#a9773c]">
                {t("roadmap.summary.label")}
              </p>

              <h3 className="mt-1 font-serif text-xl tracking-[-0.015em] text-[#30251f]">
                {roadmap.partnerName
                  ? t("roadmap.summary.planningWith", { name: roadmap.partnerName })
                  : copy.partnerHeaderFallback}
              </h3>

              <p className="mt-1 text-xs text-[#9a8d84]">
                {roadmap.eventDate && formatDate(roadmap.eventDate)
                  ? formatDate(roadmap.eventDate)
                  : t("roadmap.summary.dateComingSoon")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e2d8cf] px-4 text-xs font-semibold text-[#685c54] transition hover:border-[#b17c42] hover:text-[#a9773c]"
          >
            <Pencil size={13} />
            {t("roadmap.summary.editButton")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#a9773c]">
                {t("roadmap.summary.editEyebrow")}
              </p>

              <h3 className="mt-1 font-serif text-xl text-[#30251f]">
                {t("roadmap.summary.label")}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4dad2] text-[#9b8e85] hover:bg-[#f8f4f0]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder={copy.partnerPlaceholder}
              className="w-full rounded-xl border border-[#e2d9d2] bg-[#fcfaf8] px-4 py-3 text-sm outline-none focus:border-[#a9773c]"
            />

            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-[#e2d9d2] bg-[#fcfaf8] px-4 py-3 text-sm outline-none focus:border-[#a9773c]"
            />
          </div>

          {!eventDate && (
            <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8b7e76]">
              <Sparkles size={12} className="mt-0.5 shrink-0 text-[#a9773c]" />
              {copy.noDateReassurance}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-10 rounded-xl border border-[#e3d9d1] px-5 text-xs font-semibold text-[#766a62]"
            >
              {t("roadmap.summary.cancel")}
            </button>

            <button
              type="submit"
              disabled={updating}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#30221d] px-5 text-xs font-semibold text-white"
            >
              {updating && (
                <Loader2 size={14} className="animate-spin" />
              )}

              {updating
                ? t("roadmap.summary.saving")
                : t("roadmap.summary.saveChanges")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* =========================================================
   MAIN CONTENT
========================================================= */

function RoadmapContent() {
  const {
    roadmap,
    loading,
    error,
    actionLoading,
    create,
    update,
    removeVendor,
    complete,
    uncomplete,
  } = useRoadmap();

  // Signed-in user's gender (Male/Female) — powers the personalized copy
  // and small stylistic touches across the roadmap.
  const { currentUser } = useCurrentUser();
  const gender = currentUser?.gender as JourneyGender;

  const { toast } = useToast();
  const { t } = useLanguage();

  const [reviewItem, setReviewItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);

  // Step being completed without a platform vendor — pending the
  // "tell us about the external provider" modal.
  const [externalCompleteItem, setExternalCompleteItem] = useState<any | null>(
    null
  );
  const [externalSubmitting, setExternalSubmitting] = useState(false);

  // Step that was just completed WITH a platform vendor — pending the
  // "review now or later" prompt.
  const [reviewPromptItem, setReviewPromptItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf8f4]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfd6] bg-white shadow-sm">
            <Loader2 size={25} className="animate-spin text-[#ae7b40]" />
          </div>

          <p className="mt-5 font-serif text-xl text-[#30251f]">
            {t("roadmap.loading.title")}
          </p>

          <p className="mt-1 text-xs text-[#a3978f]">
            {t("roadmap.loading.subtitle")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf8f4] px-4">
        <div className="max-w-md rounded-[30px] border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={28} className="mx-auto text-red-500" />

          <h2 className="mt-4 font-serif text-2xl text-[#30251f]">
            {t("roadmap.errorState.title")}
          </h2>

          <p className="mt-2 text-sm text-[#8b7e76]">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <CreateRoadmapForm
        onCreate={create}
        loading={actionLoading === "create"}
        gender={gender}
      />
    );
  }

  const totalItems = roadmap.items.length;

  const completedItems = roadmap.items.filter(
    (item) => item.status === RoadmapItemStatus.Completed
  ).length;

  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const nextItem = roadmap.items.find(
    (item) => item.status !== RoadmapItemStatus.Completed
  );

  const handleAction = async (
    action: () => Promise<boolean>,
    success: string,
    failure: string
  ) => {
    const ok = await action();

    toast(ok ? success : failure, ok ? "success" : "error");

    return ok;
  };

  // Called when the "mark complete" button is pressed on a step that has
  // no platform vendor selected — opens the external-vendor modal instead
  // of completing immediately.
  const handleRequestExternalComplete = (item: any) => {
    setExternalCompleteItem(item);
  };

  // Finalizes completion for a step booked outside 5digea, optionally
  // sending along whatever vendor details the couple chose to share.
  const finalizeExternalComplete = async (feedback?: {
    vendorName: string;
    phone: string;
    link: string;
  }) => {
    if (!externalCompleteItem) {
      return;
    }

    setExternalSubmitting(true);

    if (feedback && (feedback.vendorName || feedback.phone || feedback.link)) {
      // TODO: wire this up to the real endpoint once it exists, e.g.
      // await roadmapApi.suggestExternalVendor(externalCompleteItem.categoryId, feedback)
      console.log(
        "External vendor suggestion for category",
        externalCompleteItem.categoryId,
        feedback
      );
    }

    const ok = await complete(String(externalCompleteItem.categoryId));

    toast(
      ok
        ? t("roadmap.toast.categoryCompleted")
        : t("roadmap.toast.categoryCompleteFailed"),
      ok ? "success" : "error"
    );

    setExternalSubmitting(false);
    setExternalCompleteItem(null);
  };

  // Called after a step WITH a platform vendor is successfully marked
  // complete — opens the "review now or later" prompt.
  const handleCompletedWithVendor = (item: any) => {
    if (item.id) {
      setReviewPromptItem({ id: item.id, categoryName: item.categoryName });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf8f4]">
      <RomanticHero
        partnerName={roadmap.partnerName}
        eventDate={roadmap.eventDate}
        progress={progress}
        coverImageUrl="https://cdn.prod.website-files.com/6718e262328596ea787524a5/6732673cc4f81ec0ef5c928d_AdobeStock_198831835_optimized_4000.jpeg"
        gender={gender}
      />

      <div className="relative mx-auto px-4 pb-12 sm:px-6 lg:max-w-10/12 lg:px-10">
        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="mx-auto max-w-3xl pb-8 pt-10 text-center lg:pt-14">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c6975e]" />

            <Heart
              size={13}
              fill="currentColor"
              className="text-[#b17c42]"
            />

            <span className="h-px w-8 bg-[#c6975e]" />
          </div>

          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#ad7a40]">
            {t("roadmap.main.eyebrow")}
          </p>

          <h2 className="mt-2 font-serif text-4xl font-light tracking-[-0.03em] text-[#30251f] sm:text-5xl">
            {t("roadmap.main.heading")}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-[#8d8179]">
            {t("roadmap.main.subheading")}
          </p>
        </section>


        {/* =====================================================
            JOURNEY
        ====================================================== */}

        <section>
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <Heart
                  size={13}
                  fill="currentColor"
                  className="text-[#b17c42]"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#b17c42]">
                  {t("roadmap.main.journeyLabel")}
                </span>
              </div>

              <h2 className="mt-1 font-serif text-3xl font-light tracking-tight text-[#30251f] sm:text-4xl">
                {t("roadmap.main.journeyHeading")}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-[#e5dad1] bg-white px-4 py-2 text-xs shadow-sm">
                <strong className="text-[#30251f]">
                  {completedItems}
                </strong>

                <span className="mx-1 text-[#b3a69d]">/</span>

                <span className="text-[#8e827a]">{totalItems}</span>

                <span className="ml-1 text-[8px] uppercase tracking-[0.12em] text-[#a79b93]">
                  {t("roadmap.main.completedLabel")}
                </span>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#e5dad1] bg-white sm:flex">
                <span className="text-[10px] font-bold text-[#ad783c]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          <JourneyPath
            items={roadmap.items}
            actionLoading={actionLoading}
            onReview={(item) => {
              if (item.id) {
                setReviewItem({
                  id: item.id,
                  categoryName: item.categoryName,
                });
              }
            }}
            onComplete={(categoryId) =>
              handleAction(
                () => complete(String(categoryId)),
                t("roadmap.toast.categoryCompleted"),
                t("roadmap.toast.categoryCompleteFailed")
              )
            }
            onUncomplete={(categoryId) =>
              handleAction(
                () => uncomplete(String(categoryId)),
                t("roadmap.toast.categoryReopened"),
                t("roadmap.toast.categoryReopenFailed")
              )
            }
            onRemove={(categoryId) =>
              handleAction(
                () => removeVendor(String(categoryId)),
                t("roadmap.toast.vendorRemoved"),
                t("roadmap.toast.vendorRemoveFailed")
              )
            }
            onRequestExternalComplete={handleRequestExternalComplete}
            onCompletedWithVendor={handleCompletedWithVendor}
          />
        </section>

        {/* =====================================================
            PROGRESS + MESSAGE
        ====================================================== */}

        <section className="mt-14 grid gap-5 lg:grid-cols-[1fr_330px]">
          <div className="rounded-[30px] border border-[#e8ded5] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#ad783c]" />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#ad783c]">
                    {t("roadmap.progress.label")}
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f]">
                  {t("roadmap.progress.heading")}
                </h3>

                <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#8b7e76]">
                  {t("roadmap.progress.subheading", {
                    completed: completedItems,
                    total: totalItems,
                  })}
                </p>
              </div>

              <ProgressRing progress={progress} />
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#eee7e1]">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#a56f48] via-[#b78245] to-[#e0b77b] transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[9px] text-[#9c9088]">
              <span>
                {t("roadmap.progress.completedCount", { count: completedItems })}
              </span>

              <span>
                {t("roadmap.progress.remainingCount", {
                  count: totalItems - completedItems,
                })}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] bg-[#30221d] p-7 text-white">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#d5a05e]/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8aa6d]/30 bg-[#d8aa6d]/10">
                <Heart
                  size={19}
                  fill="currentColor"
                  className="text-[#d8aa6d]"
                />
              </div>

              <h3 className="mt-5 font-serif text-2xl font-light tracking-[-0.02em]">
                {t("roadmap.progress.enjoyHeading")}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-white/50">
                {t("roadmap.progress.enjoyBody")}
              </p>

              <div className="mt-6 flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#d9ac70]">
                <span>{t("roadmap.progress.oneStepCloser")}</span>

                <Heart size={11} fill="currentColor" />
              </div>
            </div>
          </div>
        </section>

        <RoadmapSummary
          roadmap={roadmap}
          onUpdate={update}
          updating={actionLoading === "update"}
          gender={gender}
        />

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#e8ded5] bg-[#faf7f3] p-4">
          <HeartHandshake
            size={16}
            className="mt-0.5 shrink-0 text-[#ae7a3f]"
          />

          <p className="text-[10px] leading-relaxed text-[#847970]">
            {t("roadmap.footer.flexibleNote")}
          </p>
        </div>
      </div>

      {reviewItem && (
        <WriteReviewModal
          roadmapItemId={reviewItem.id}
          categoryName={reviewItem.categoryName}
          onClose={() => setReviewItem(null)}
        />
      )}

      {externalCompleteItem && (
        <ExternalVendorModal
          categoryName={externalCompleteItem.categoryName}
          submitting={externalSubmitting}
          onSkip={() => finalizeExternalComplete()}
          onSubmit={(data) => finalizeExternalComplete(data)}
        />
      )}

      {reviewPromptItem && (
        <ReviewPromptModal
          categoryName={reviewPromptItem.categoryName}
          onReviewNow={() => {
            setReviewItem({
              id: reviewPromptItem.id,
              categoryName: reviewPromptItem.categoryName,
            });
            setReviewPromptItem(null);
          }}
          onLater={() => setReviewPromptItem(null)}
        />
      )}
    </main>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RoadmapPage() {
  return (
    <AuthGuard>
      <RoadmapContent />

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-14px) rotate(5deg);
          }
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }

          10% {
            transform: scale(1.12);
          }

          20% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.08);
          }

          45%,
          100% {
            transform: scale(1);
          }
        }

        @keyframes heroNameLeft {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes heroNameRight {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes countdownTick {
          0% {
            opacity: 0;
            transform: translateY(-7px) scale(0.96);
            filter: blur(2px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes slowSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progressShimmer {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(220%);
          }
        }

        @keyframes dashMove {
          to {
            stroke-dashoffset: -80;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </AuthGuard>
  );
}