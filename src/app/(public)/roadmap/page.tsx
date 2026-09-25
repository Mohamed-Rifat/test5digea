"use client";

import {
  createElement,
  FormEvent,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ElementType,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  MessageSquareText,
  AlertCircle,
  HeartHandshake,
  PartyPopper,
  ListOrdered,
  Building2,
  Palette,
  ClipboardList,
  Plane,
  Gift,
  Send,
  Users,
} from "lucide-react";

import { Tooltip } from "@mui/material";

import AuthGuard from "@/components/guards/AuthGuard";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDate } from "@/lib/format";
import { RoadmapItemStatus, type RoadmapItem } from "@/types/roadmap";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import ViewReviewModal from "@/components/reviews/ViewReviewModal";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";
import type { MyReview } from "@/features/reviews/hooks/useMyReviews";
import { authStorage } from "@/lib/auth-storage";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { submitContactMessage } from "@/features/contactMessages/api";
import {
  ContactMessageType,
  encodeMessageDetails,
} from "@/features/contactMessages/types";
import { useLanguage } from "@/context/LanguageContext";
import { getApiErrorMessage } from "@/lib/error";
import { useAuth } from "@/context/AuthContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { TranslationKey } from "@/locales";
import { SITE_URL } from "@/lib/site";

/* =========================================================
   CONSTANTS
========================================================= */

const GOLD = "#b27a3d";

const CATEGORY_ICONS: Record<string, ElementType> = {
  photo: Camera,
  تصوير: Camera,
  مصور: Camera,
  venue: Building2,
  hall: Building2,
  hotel: Building2,
  قاع: Building2,
  decor: Flower2,
  ديكور: Flower2,
  flower: Flower2,
  cater: Utensils,
  food: Utensils,
  cake: CakeSlice,
  music: Music2,
  dj: Music2,
  band: Music2,
  dance: Music2,
  dress: Shirt,
  suit: Shirt,
  فستان: Shirt,
  makeup: Palette,
  ميكب: Palette,
  car: Car,
  عربي: Car,
  ring: Gem,
  accessor: Gem,
  planner: ClipboardList,
  honeymoon: Plane,
  gift: Gift,
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
  index: number,
): ElementType => {
  const safeName = (name ?? "").toLowerCase();

  const matched = Object.keys(CATEGORY_ICONS).find((key) =>
    safeName.includes(key),
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
  index: number,
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
    const auth = authStorage.get() as {
      name?: string;
      fullName?: string;
      userName?: string;
      username?: string;
      user?: {
        name?: string;
        fullName?: string;
        userName?: string;
      };
    } | null;

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
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
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
   SHARED UI HELPERS
========================================================= */

type StepState = "completed" | "selected" | "todo";

const getStepState = (item: RoadmapItem): StepState =>
  item.status === RoadmapItemStatus.Completed
    ? "completed"
    : item.status === RoadmapItemStatus.VendorSelected || item.selectedVendorId
      ? "selected"
      : "todo";

/* ---------------------------------------------------------
   Recommended booking order: what couples usually need to lock
   in first (venue & planner → rings & outfits → photo & beauty →
   decor & entertainment → extras). Matched on the category name
   (English or Arabic); unknown categories keep the API order and
   come after the known ones.
--------------------------------------------------------- */
const PRIORITY_GROUPS: string[][] = [
  [
    "hall",
    "venue",
    "hotels & resort",
    "resort",
    "beach",
    "outdoor",
    "قاع",
    "قاعة",
    "فندق",
    "قاعات",
  ],
  ["planner", "planning", "منظم", "تنظيم"],
  ["engagement", "rings", "خاتم", "دبل", "شبك"],
  ["bridal dress", "dress", "فستان", "فساتين"],
  ["suit", "بدل", "groom"],
  ["photo", "video", "تصوير", "مصور"],
  ["makeup", "hair", "beauty", "ميكب", "مكياج", "كوافير"],
  ["decor", "flower", "ديكور", "ورد"],
  ["dj", "band", "music", "dance", "singer", "زفة", "موسيق", "رقص"],
  ["cater", "food", "cake", "buffet", "أكل", "تورت", "بوفيه"],
  ["car", "limo", "عربي", "سيار"],
  ["accessor", "shoe", "henna", "hena", "اكسسوار", "حذاء", "حنة", "حنه"],
  ["gift", "هدايا", "هدية"],
  ["honeymoon", "hotel booking", "travel", "شهر العسل", "سفر"],
];

const getCategoryPriority = (name: string | null | undefined) => {
  const n = (name ?? "").toLowerCase();
  const index = PRIORITY_GROUPS.findIndex((keywords) =>
    keywords.some((keyword) => n.includes(keyword)),
  );
  return index === -1 ? PRIORITY_GROUPS.length : index;
};

/** Items in recommended booking order (stable for equal priority). */
const sortByPriority = (items: RoadmapItem[]) =>
  items
    .map((item, apiIndex) => ({
      item,
      apiIndex,
      p: getCategoryPriority(item.categoryName),
    }))
    .sort((a, b) => a.p - b.p || a.apiIndex - b.apiIndex)
    .map(({ item }) => item);

type RoadmapFilter = "all" | "remaining" | "completed";

const REFERRALS_KEY = "5digea-roadmap-referrals";
/** categoryId -> external vendor name the couple told us about. */
const readReferrals = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(REFERRALS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};
const FILTER_STORAGE_KEY = "5digea-roadmap-filter";

const readStoredFilter = (): RoadmapFilter => {
  try {
    const value = window.localStorage.getItem(FILTER_STORAGE_KEY);
    return value === "remaining" || value === "completed" ? value : "all";
  } catch {
    return "all";
  }
};

const STATE_STYLES: Record<
  StepState,
  { dot: string; pill: string; tile: string; card: string }
> = {
  completed: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    tile: "bg-emerald-50 text-emerald-600",
    card: "border-emerald-200/80 bg-white",
  },
  selected: {
    dot: "bg-[#c08a4a]",
    pill: "bg-[#fbf1e3] text-[#94652d] ring-1 ring-[#ecd6b5]",
    tile: "bg-[#f8ecdc] text-[#a06d31]",
    card: "border-[#ecdcc6] bg-white",
  },
  todo: {
    dot: "bg-[#cfc3b8]",
    pill: "bg-[#f5f0eb] text-[#7d7068] ring-1 ring-[#e8dfd7]",
    tile: "bg-[#f6f0ea] text-[#9a7a55]",
    card: "border-[#ebe2da] bg-white",
  },
};

/** Current number of columns for the journey grid (1 / 2 / 3). */
function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getColumns() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 768px)").matches) return 2;
  return 1;
}

function useJourneyColumns() {
  return useSyncExternalStore(subscribeToResize, getColumns, () => 3);
}

/* =========================================================
   COUNTDOWN
========================================================= */

function CountdownTimer({ eventDate }: { eventDate: string }) {
  const { t } = useLanguage();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const target = new Date(eventDate).getTime();
  const diff =
    now === null || Number.isNaN(target) ? 0 : Math.max(0, target - now);

  const values = [
    {
      key: "days",
      label: t("roadmap.hero.units.days"),
      value: Math.floor(diff / 86400000),
    },
    {
      key: "hours",
      label: t("roadmap.hero.units.hours"),
      value: Math.floor((diff % 86400000) / 3600000),
    },
    {
      key: "minutes",
      label: t("roadmap.hero.units.minutes"),
      value: Math.floor((diff % 3600000) / 60000),
    },
    {
      key: "seconds",
      label: t("roadmap.hero.units.seconds"),
      value: Math.floor((diff % 60000) / 1000),
    },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      role="timer"
      aria-live="off"
    >
      {values.map(({ key, label, value }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] px-1 py-3 text-center backdrop-blur-xl sm:py-4"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <div
            dir="ltr"
            className="text-2xl font-semibold leading-none tabular-nums text-white sm:text-3xl"
          >
            {now === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[11px] font-medium text-white/55 sm:text-xs">
            {label}
          </div>
          {key === "seconds" && (
            <span className="absolute end-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#e2b777]" />
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

const HERO_IMAGE =
  "https://cdn.prod.website-files.com/6718e262328596ea787524a5/6732673cc4f81ec0ef5c928d_AdobeStock_198831835_optimized_4000.jpeg";

function RoadmapHero({
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

/* =========================================================
   PROGRESS RING
========================================================= */

function ProgressRing({
  progress,
  size = 112,
}: {
  progress: number;
  size?: number;
}) {
  const { t } = useLanguage();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.min(100, Math.max(0, progress));
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#efe7df"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-[#30251f]">
          {safe}%
        </span>
        <span className="text-[11px] font-medium text-[#9a8d84]">
          {t("roadmap.progressRing.complete")}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   OVERVIEW (progress + next step)
========================================================= */

function RoadmapOverview({
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

/* =========================================================
   JOURNEY PATH
   Cards are laid out as a "snake": every second row runs in the
   opposite direction (flex-row-reverse follows the page direction,
   so it mirrors automatically between Arabic and English). The
   road is drawn from the real, measured card positions, so it
   always follows the cards in reading order.
========================================================= */

type JourneyHandlers = {
  actionLoading: string | null;
  onReview: (item: RoadmapItem) => void;
  onComplete: (categoryId: string | number) => Promise<boolean>;
  onUncomplete: (categoryId: string | number) => Promise<boolean>;
  onRemove: (categoryId: string | number) => Promise<boolean>;
  onRequestExternalComplete: (item: RoadmapItem) => void;
  onCompletedWithVendor: (item: RoadmapItem) => void;
  /** The couple's existing review for this step's vendor, if any. */
  reviewOf: (item: RoadmapItem) => MyReview | undefined;
  /** Name of the outside vendor the couple reported for this step, if any. */
  referralOf: (item: RoadmapItem) => string | undefined;
  onViewReview: (review: MyReview) => void;
  /** Share an outside vendor's details for a step that's already done. */
  onShareExternal?: (item: RoadmapItem) => void;
};

type RoadSegment = { d: string; done: boolean };

function JourneyPath({
  items,
  nextItem,
  numberOf,
  total,
  ...handlers
}: {
  items: RoadmapItem[];
  nextItem: RoadmapItem | null;
  /** 1-based step number of an item in the full, ordered roadmap. */
  numberOf: (item: RoadmapItem) => number;
  total: number;
} & JourneyHandlers) {
  const { dir } = useLanguage();
  const columns = useJourneyColumns();

  const rows = useMemo(() => {
    const result: RoadmapItem[][] = [];
    for (let i = 0; i < items.length; i += columns)
      result.push(items.slice(i, i + columns));
    return result;
  }, [items, columns]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [segments, setSegments] = useState<RoadSegment[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const c = container.getBoundingClientRect();
      setBox({ width: c.width, height: c.height });

      if (columns === 1) {
        setSegments([]);
        return;
      }

      const points = items.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - c.left + r.width / 2,
          y: r.top - c.top + r.height / 2,
          w: r.width,
        };
      });

      const next: RoadSegment[] = [];
      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i];
        const b = points[i + 1];
        if (!a || !b) continue;
        const done = items[i].status === RoadmapItemStatus.Completed;

        if (Math.abs(a.y - b.y) < 4) {
          next.push({ d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, done });
        } else {
          // U-turn outside the row, on the side where this row ends.
          const side = a.x > c.width / 2 ? 1 : -1;
          const edge = a.x + side * (a.w / 2 + 34);
          next.push({
            d: `M ${a.x} ${a.y} C ${edge} ${a.y} ${edge} ${b.y} ${b.x} ${b.y}`,
            done,
          });
        }
      }
      setSegments(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [items, columns, dir]);

  return (
    <div ref={containerRef} className="relative">
      {columns > 1 && box.width > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={box.width}
          height={box.height}
          aria-hidden="true"
        >
          {segments.map((s, i) => (
            <g key={i}>
              <path
                d={s.d}
                fill="none"
                stroke="#efe6dd"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d={s.d}
                fill="none"
                stroke={s.done ? GOLD : "#cdb9a5"}
                strokeWidth={s.done ? 4 : 2.5}
                strokeLinecap="round"
                strokeDasharray={s.done ? undefined : "2 10"}
                className={
                  s.done ? undefined : "animate-[dashMove_3s_linear_infinite]"
                }
              />
            </g>
          ))}
        </svg>
      )}

      {columns === 1 ? (
        /* Mobile: vertical timeline on the start side */
        <ol className="relative space-y-4 ps-9">
          <span
            className="absolute bottom-6 start-[15px] top-6 w-0.5 rounded-full bg-linear-to-b from-[#d8b98f] via-[#e7d9cb] to-[#efe6dd]"
            aria-hidden="true"
          />
          {items.map((item, index) => (
            <li key={getRoadmapItemKey(item, index)} className="relative">
              <span
                className={`absolute -start-9 top-6 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#fbf8f4] text-[11px] font-bold text-white ${
                  getStepState(item) === "completed"
                    ? "bg-emerald-500"
                    : getStepState(item) === "selected"
                      ? "bg-[#c08a4a]"
                      : "bg-[#30251f]"
                }`}
                aria-hidden="true"
              >
                {getStepState(item) === "completed" ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  numberOf(item)
                )}
              </span>
              <JourneyCard
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                item={item}
                index={numberOf(item) - 1}
                total={total}
                isNext={nextItem === item}
                {...handlers}
              />
            </li>
          ))}
        </ol>
      ) : (
        <div className="relative space-y-10 px-2 lg:space-y-14 lg:px-6">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`flex items-stretch gap-8 lg:gap-12 ${rowIndex % 2 === 1 ? "flex-row-reverse" : ""}`}
            >
              {row.map((item) => {
                const index = items.indexOf(item);
                return (
                  <div
                    key={getRoadmapItemKey(item, index)}
                    className="min-w-0 flex-1 basis-0"
                  >
                    <JourneyCard
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      item={item}
                      index={numberOf(item) - 1}
                      total={total}
                      isNext={nextItem === item}
                      {...handlers}
                    />
                  </div>
                );
              })}
              {Array.from({ length: columns - row.length }).map((_, i) => (
                <div
                  key={`spacer-${i}`}
                  className="min-w-0 flex-1 basis-0"
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   JOURNEY CARD
========================================================= */

function JourneyCard({
  ref,
  item,
  index,
  total,
  isNext,
  actionLoading,
  onReview,
  onComplete,
  onUncomplete,
  onRemove,
  onRequestExternalComplete,
  onCompletedWithVendor,
  reviewOf,
  onViewReview,
  referralOf,
  onShareExternal,
}: {
  ref?: React.Ref<HTMLElement>;
  item: RoadmapItem;
  index: number;
  total: number;
  isNext: boolean;
} & JourneyHandlers) {
  const { t, isArabic, localize } = useLanguage();
  const state = getStepState(item);
  const styles = STATE_STYLES[state];
  const isCompleted = state === "completed";
  const hasVendor = Boolean(item.selectedVendorId);
  const myReview = reviewOf(item);
  const referral = referralOf(item);
  const completing =
    actionLoading === `complete-${item.categoryId}` ||
    actionLoading === `uncomplete-${item.categoryId}`;
  const removing = actionLoading === `remove-${item.categoryId}`;

  const statusLabel = isCompleted
    ? t("roadmap.card.status.completed")
    : state === "selected"
      ? t("roadmap.card.status.vendorSelected")
      : isNext
        ? t("roadmap.cardExtra.nextUp")
        : t("roadmap.cardExtra.notStarted");

  const handleToggle = async () => {
    if (isCompleted) {
      await onUncomplete(item.categoryId);
      return;
    }
    if (!hasVendor) {
      onRequestExternalComplete(item);
      return;
    }
    const ok = await onComplete(item.categoryId);
    if (ok) onCompletedWithVendor(item);
  };

  return (
    <article
      ref={ref}
      aria-label={`${t("roadmap.cardExtra.stepOf", { number: index + 1, total })}: ${localize(item.categoryName)}`}
      className={`group relative flex h-full flex-col rounded-3xl border p-5 shadow-[0_10px_30px_rgba(65,46,37,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(65,46,37,0.12)] ${styles.card} ${
        isNext
          ? "ring-2 ring-[#d9ab6b] ring-offset-2 ring-offset-[#fbf8f4]"
          : ""
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-end gap-2 md:justify-between">
        <span className="hidden h-7 min-w-7 items-center justify-center rounded-full bg-[#30251f] px-2 text-xs font-bold tabular-nums text-white md:inline-flex">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isNext && state === "todo"
              ? "bg-[#30251f] text-[#ecc98f]"
              : styles.pill
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={13} aria-hidden="true" />
          ) : isNext && state === "todo" ? (
            <Sparkles size={12} aria-hidden="true" />
          ) : (
            <span
              className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
              aria-hidden="true"
            />
          )}
          {statusLabel}
        </span>
      </div>

      {/* body */}
      <div className="mt-4 flex flex-1 items-start gap-3.5">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${styles.tile}`}
        >
          {createElement(getCategoryIcon(item.categoryName, index), {
            size: 22,
            strokeWidth: 1.6,
            "aria-hidden": true,
          })}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-snug text-[#30251f]">
            {localize(item.categoryName)}
          </h3>
          {hasVendor ? (
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-[#8d6d4c]">
              <Store size={14} className="shrink-0" aria-hidden="true" />
              <span className="shrink-0 text-[#a3968d]">
                {t("roadmap.cardExtra.bookedWith")}
              </span>
              <Link
                href={`/vendors/${item.selectedVendorId}`}
                className="truncate font-semibold underline-offset-4 hover:underline"
              >
                {item.selectedVendorName}
              </Link>
            </p>
          ) : isCompleted ? (
            <div className="mt-1 space-y-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-[#8d6d4c]">
                <Store size={14} className="shrink-0" aria-hidden="true" />
                {t("roadmap.external.bookedOutsideDone")}
              </p>
              {referral ? (
                <p className="flex min-w-0 items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2
                    size={13}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {t("roadmap.external.referralSent")}: {referral}
                  </span>
                </p>
              ) : (
                onShareExternal && (
                  <button
                    type="button"
                    onClick={() => onShareExternal(item)}
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#30221d] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#46332a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b17c42]/25"
                  >
                    <Send size={12} className="rtl:-scale-x-100" aria-hidden="true" />
                    {t("roadmap.external.sendDetails")}
                  </button>
                )
              )}
            </div>
          ) : (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#9a8c82]">
              {t("roadmap.card.noVendorHint")}
            </p>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#f1ebe5] pt-4">
        <Link
          href={`/vendors?categoryId=${encodeURIComponent(String(item.categoryId))}`}
          aria-label={
            hasVendor
              ? t("roadmap.cardExtra.changeVendor")
              : t("roadmap.cardExtra.findVendor")
          }
          className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition ${
            hasVendor
              ? "border border-[#e6ddd5] bg-white text-[#5f544d] hover:border-[#c49a64] hover:text-[#8f6330]"
              : "bg-[#30251f] text-white hover:bg-[#46342a]"
          }`}
        >
          {hasVendor
            ? t("roadmap.card.action.change")
            : t("roadmap.cardExtra.findVendor")}
          <ArrowRight
            size={15}
            className={isArabic ? "rotate-180" : ""}
            aria-hidden="true"
          />
        </Link>

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
          <button
            type="button"
            disabled={completing}
            onClick={handleToggle}
            aria-pressed={isCompleted}
            className={`inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition disabled:opacity-60 ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                : hasVendor
                  ? "bg-[#30251f] text-white hover:bg-[#46342a]"
                  : "border border-[#e6ddd5] bg-white text-[#5f544d] hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {completing ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : isCompleted ? (
              <CheckCircle2 size={15} aria-hidden="true" />
            ) : (
              <Circle size={15} aria-hidden="true" />
            )}
            {isCompleted
              ? t("roadmap.cardExtra.done")
              : t("roadmap.cardExtra.markDone")}
          </button>
        </Tooltip>

        {isCompleted && hasVendor && item.id && myReview && (
          <Tooltip title={t("reviews.mine.alreadyTooltip")} arrow>
            <button
              type="button"
              onClick={() => onViewReview(myReview)}
              aria-label={t("reviews.mine.alreadyTooltip")}
              className="relative inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#fbf1e3] px-3 text-sm font-semibold text-[#94652d] ring-1 ring-[#ecd6b5] transition hover:bg-[#f6e6cf]"
            >
              <MessageSquareText size={16} aria-hidden="true" />
              {t("reviews.mine.reviewed")}
            </button>
          </Tooltip>
        )}

        {isCompleted && hasVendor && item.id && !myReview && (
          <Tooltip title={t("roadmap.card.tooltip.writeReview")} arrow>
            <button
              type="button"
              onClick={() => onReview(item)}
              aria-label={t("roadmap.card.tooltip.writeReview")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6ddd5] bg-white text-[#81756d] transition hover:border-[#c49a64] hover:text-[#8f6330]"
            >
              <MessageSquarePlus size={16} aria-hidden="true" />
            </button>
          </Tooltip>
        )}

        {hasVendor && !isCompleted && (
          <Tooltip title={t("roadmap.card.tooltip.removeVendor")} arrow>
            <button
              type="button"
              disabled={removing}
              onClick={() => onRemove(item.categoryId)}
              aria-label={t("roadmap.card.tooltip.removeVendor")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfd8] bg-white text-[#a2948b] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
            >
              {removing ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <X size={16} aria-hidden="true" />
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {!hasVendor && !isCompleted && (
        <button
          type="button"
          onClick={() => onRequestExternalComplete(item)}
          className="mt-3 inline-flex items-center justify-center gap-1.5 self-start text-sm font-semibold text-[#a47e43] underline-offset-4 transition hover:text-[#8a6834] hover:underline"
        >
          <HeartHandshake size={15} aria-hidden="true" />
          {t("roadmap.external.bookedOutside")}
        </button>
      )}
    </article>
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
  mode = "complete",
  submitting,
  onSkip,
  onSubmit,
  onClose,
}: {
  categoryName: string;
  /** "complete": step not done yet. "share": step already done, only send details. */
  mode?: "complete" | "share";
  submitting: boolean;
  onSkip: () => void;
  onSubmit: (data: { vendorName: string; phone: string; link: string }) => void;
  onClose: () => void;
}) {
  const { t, localize } = useLanguage();
  const [vendorName, setVendorName] = useState("");
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleSend = () => {
    const next: { name?: string; contact?: string } = {};
    if (!vendorName.trim()) next.name = t("roadmap.external.nameRequired");
    if (!phone.trim() && !link.trim())
      next.contact = t("roadmap.external.contactRequired");
    setErrors(next);
    if (next.name || next.contact) return;
    onSubmit({
      vendorName: vendorName.trim(),
      phone: phone.trim(),
      link: link.trim(),
    });
  };

  const inputClass = (invalid?: boolean) =>
    `w-full rounded-xl border bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:bg-white focus:ring-4 ${
      invalid
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-[#e2d8cf] focus:border-[#b17c42] focus:ring-[#b17c42]/10"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("common.close")}
        onClick={() => !submitting && onClose()}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-vendor-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white shadow-2xl animate-dialog-in"
      >
        <div className="relative overflow-hidden bg-[#30221d] px-6 py-7 text-center">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label={t("common.close")}
            className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <HeartHandshake
                size={24}
                className="text-[#d9a363]"
                aria-hidden="true"
              />
            </span>
            <h3
              id="external-vendor-title"
              className="mt-4 text-xl font-bold text-white"
            >
              {mode === "share"
                ? t("roadmap.external.shareTitle")
                : t("roadmap.external.title")}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              {mode === "share"
                ? t("roadmap.external.shareBody", { category: localize(categoryName) })
                : t("roadmap.external.body", { category: localize(categoryName) })}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#5f544d]">
              {t("roadmap.external.nameLabel")}{" "}
              <span className="text-red-500">*</span>
            </span>
            <input
              value={vendorName}
              onChange={(e) => {
                setVendorName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder={t("roadmap.external.namePlaceholder")}
              aria-invalid={!!errors.name}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <span role="alert" className="mt-1 block text-xs text-red-600">
                {errors.name}
              </span>
            )}
          </label>

          <fieldset className="rounded-2xl border border-[#efe7df] p-4">
            <legend className="px-1 text-xs font-semibold text-[#8b7e76]">
              {t("roadmap.external.orLabel")}{" "}
              <span className="text-red-500">*</span>
            </legend>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#5f544d]">
                {t("roadmap.external.phoneLabel")}
              </span>
              <input
                type="tel"
                dir="ltr"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.contact)
                    setErrors((p) => ({ ...p, contact: undefined }));
                }}
                placeholder="+20 1xx xxx xxxx"
                aria-invalid={!!errors.contact}
                className={`${inputClass(!!errors.contact)} text-start`}
              />
            </label>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-semibold text-[#5f544d]">
                {t("roadmap.external.linkLabel")}
              </span>
              <input
                type="url"
                dir="ltr"
                inputMode="url"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (errors.contact)
                    setErrors((p) => ({ ...p, contact: undefined }));
                }}
                placeholder="https://instagram.com/..."
                aria-invalid={!!errors.contact}
                className={`${inputClass(!!errors.contact)} text-start`}
              />
            </label>
            {errors.contact && (
              <span role="alert" className="mt-2 block text-xs text-red-600">
                {errors.contact}
              </span>
            )}
          </fieldset>

          <p className="flex items-start gap-2 rounded-xl bg-[#fdf6ec] px-3.5 py-3 text-xs leading-relaxed text-[#8c6a3c]">
            <Sparkles
              size={14}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {t("roadmap.external.helper")}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSend}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#30221d] px-5 text-sm font-semibold text-white transition hover:bg-[#46332a] disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}
              {mode === "share"
                ? t("roadmap.external.sendOnly")
                : t("roadmap.external.sendAndComplete")}
            </button>
            <button
              type="button"
              onClick={mode === "share" ? onClose : onSkip}
              disabled={submitting}
              className="h-11 rounded-xl border border-[#e3d9d1] px-5 text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0] disabled:opacity-60"
            >
              {mode === "share"
                ? t("roadmap.external.later")
                : t("roadmap.external.skipAndComplete")}
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
  const { t, localize } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={26} className="text-emerald-500" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-[#30251f]">
          {t("roadmap.reviewPrompt.heading", { category: localize(categoryName) })}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#8b7e76]">
          {t("roadmap.reviewPrompt.body")}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onReviewNow}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] text-sm font-semibold text-white transition hover:bg-[#46332a]"
          >
            <MessageSquarePlus size={14} />
            {t("roadmap.reviewPrompt.reviewNow")}
          </button>

          <button
            type="button"
            onClick={onLater}
            className="h-11 rounded-xl border border-[#e3d9d1] text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0]"
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
    <div className="min-h-screen bg-[#fbf8f4] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[36px] border border-[#e5d9cf] bg-white shadow-[0_25px_80px_rgba(48,37,31,0.12)]">
        <div className="relative overflow-hidden bg-[#30221d] px-7 py-12 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d49b5b]/15 blur-3xl" />

          <div className="relative">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#dfb67b]/30 bg-[#dfb67b]/10">
              <Heart size={27} fill="#d9a363" className="text-[#d9a363]" />

              {/* Small gendered touch on the entry screen too. */}
              {copy.touch !== "neutral" && (
                <div
                  className="absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#30221d] bg-[#fbf8f4] shadow-sm"
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

            <p className="mt-7 text-sm font-semibold text-[#dcb078]">
              {copy.eyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              {copy.heading}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55">
              {copy.subheading}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5f544d]">
              {copy.partnerLabel}
              <span className="ms-1 normal-case tracking-normal text-[#b3a89f]">
                {t("roadmap.create.optional")}
              </span>
            </label>

            <div className="relative">
              <Heart
                size={16}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#b39a86]"
              />

              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={copy.partnerPlaceholder}
                className="w-full rounded-2xl border border-[#e2d8cf] bg-[#fcfaf8] py-4 ps-11 pe-4 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5f544d]">
              {t("roadmap.create.weddingDateLabel")}
              <span className="ms-1 normal-case tracking-normal text-[#b3a89f]">
                {t("roadmap.create.optional")}
              </span>
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#b39a86]"
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-2xl border border-[#e2d8cf] bg-[#fcfaf8] py-4 ps-11 pe-4 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10"
              />
            </div>

            {!eventDate && (
              <p className="mt-2.5 flex items-start gap-1.5 text-sm leading-relaxed text-[#8b7e76]">
                <Sparkles
                  size={12}
                  className="mt-0.5 shrink-0 text-[#b17c42]"
                />
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
                <ArrowRight
                  size={16}
                  className={isArabic ? "rotate-180" : ""}
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   WEDDING DETAILS (editable)
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
  gender?: JourneyGender;
}) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const copy = getJourneyCopy(gender, t);

  const [editing, setEditing] = useState(false);
  const [partnerName, setPartnerName] = useState(roadmap.partnerName ?? "");
  const [eventDate, setEventDate] = useState(
    roadmap.eventDate ? roadmap.eventDate.slice(0, 10) : "",
  );

  const startEditing = () => {
    setPartnerName(roadmap.partnerName ?? "");
    setEventDate(roadmap.eventDate ? roadmap.eventDate.slice(0, 10) : "");
    setEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

  const inputClass =
    "w-full rounded-xl border border-[#e2d9d2] bg-[#fcfaf8] px-4 py-3 text-sm text-[#30251f] outline-none transition focus:border-[#b17c42] focus:bg-white focus:ring-4 focus:ring-[#b17c42]/10";

  return (
    <section
      id="plan-details"
      aria-labelledby="plan-details-title"
      className="scroll-mt-24 rounded-[28px] border border-[#ebe2da] bg-white p-5 shadow-sm sm:p-7"
    >
      {!editing ? (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7eee5] text-[#a9773c]">
              <CalendarDays size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#a9773c]">
                {t("roadmap.summary.label")}
              </p>
              <h2
                id="plan-details-title"
                className="mt-0.5 text-lg font-bold text-[#30251f]"
              >
                {roadmap.partnerName
                  ? t("roadmap.summary.planningWith", {
                      name: roadmap.partnerName,
                    })
                  : copy.partnerHeaderFallback}
              </h2>
              <p className="mt-0.5 text-sm text-[#8b7e76]">
                {roadmap.eventDate
                  ? formatDate(
                      roadmap.eventDate,
                      LANGUAGE_DATE_LOCALE[language],
                    )
                  : t("roadmap.summary.dateComingSoon")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startEditing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e2d8cf] px-5 text-sm font-semibold text-[#5f544d] transition hover:border-[#b17c42] hover:text-[#8f6330]"
          >
            <Pencil size={15} aria-hidden="true" />
            {t("roadmap.summary.editButton")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#a9773c]">
                {t("roadmap.summary.editEyebrow")}
              </p>
              <h2
                id="plan-details-title"
                className="mt-0.5 text-lg font-bold text-[#30251f]"
              >
                {t("roadmap.summary.label")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label={t("roadmap.summary.cancel")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dad2] text-[#9b8e85] transition hover:bg-[#f8f4f0]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#5f544d]">
                {copy.partnerLabel}
              </span>
              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={copy.partnerPlaceholder}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#5f544d]">
                {t("roadmap.create.weddingDateLabel")}
              </span>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {!eventDate && (
            <p className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-[#8b7e76]">
              <Sparkles
                size={14}
                className="mt-0.5 shrink-0 text-[#a9773c]"
                aria-hidden="true"
              />
              {copy.noDateReassurance}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-11 rounded-xl border border-[#e3d9d1] px-5 text-sm font-semibold text-[#766a62] transition hover:bg-[#f8f4f0]"
            >
              {t("roadmap.summary.cancel")}
            </button>
            <button
              type="submit"
              disabled={updating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#30221d] px-6 text-sm font-semibold text-white transition hover:bg-[#46332a] disabled:opacity-60"
            >
              {updating && (
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
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
   WEDDING LETTER
   Once every step is done the couple gets a letter: a sealed
   envelope with their names written on it opens, the letter rises
   out and unfolds into a pop-up with our message, a prayer for
   them and an invitation to tell other couples about 5Digea. It
   opens by itself when the last step is completed during this
   visit, and any time from the "read our message" buttons.
========================================================= */

const FINALE_PETALS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  delay: (i * 0.73) % 9,
  duration: 10 + ((i * 1.7) % 8),
  size: 5 + ((i * 5) % 9),
  drift: ((i % 5) - 2) * 28,
  kind: i % 3,
}));

const HEART_COLORS = ["#e7c089", "#d9a363", "#f3d6a8", "#c68a72", "#f5e3c3"];
const CONFETTI_COLORS = ["#e7c089", "#c9914f", "#f5e3c3", "#b27a3d", "#ffffff", "#d9a363"];
const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  left: (i * 53 + 11) % 100,
  delay: ((i * 0.061) % 1.2).toFixed(2),
  duration: (2.6 + ((i * 0.37) % 2.2)).toFixed(2),
  drift: ((i % 7) - 3) * 45,
  spin: 360 + ((i * 97) % 540),
  w: 6 + (i % 4) * 2,
  h: i % 3 === 0 ? 6 + (i % 4) * 2 : 12 + (i % 3) * 3,
  round: i % 3 === 0,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 5200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="absolute -top-6 block"
          style={
            {
              left: `${c.left}%`,
              width: c.w,
              height: c.h,
              background: c.color,
              borderRadius: c.round ? "9999px" : "2px",
              animation: `confettiFall ${c.duration}s cubic-bezier(.25,.6,.4,1) ${c.delay}s both`,
              "--drift": `${c.drift}px`,
              "--spin": `${c.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

type LetterStage = "intro" | "opening" | "rising" | "letter";

function WeddingLetter({
  partnerName,
  eventDate,
  gender,
  onClose,
}: {
  partnerName: string;
  eventDate: string;
  gender?: JourneyGender;
  onClose: () => void;
}) {
  const { t, language, isArabic } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const copy = getJourneyCopy(gender, t);
  const [stage, setStage] = useState<LetterStage>(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "letter"
      : "intro",
  );
  const [confetti, setConfetti] = useState(false);
  const sealRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const firstUserName = getFirstName(user?.fullName || getCurrentUserName());
  const firstPartnerName = getFirstName(partnerName || copy.partnerFallback);
  const names = `${firstUserName} & ${firstPartnerName}`;

  const target = eventDate ? new Date(eventDate) : null;
  const hasDate = !!target && !Number.isNaN(target.getTime());
  const [today] = useState(() => new Date());
  const isToday = hasDate && target!.toDateString() === today.toDateString();

  const shareUrl =
    typeof window === "undefined" ? SITE_URL : window.location.origin;
  const shareText = t("roadmap.finale.shareText");

  // Timeline: names are written, then the envelope opens (on tap, or by
  // itself after a moment), the letter rises out and unfolds full-size.
  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));
    if (stage === "intro") at(3600, () => setStage("opening"));
    if (stage === "opening") at(1050, () => setStage("rising"));
    if (stage === "rising") at(1000, () => setStage("letter"));
    if (stage === "letter") {
      at(0, () => setConfetti(true));
      at(650, () => closeRef.current?.focus({ preventScroll: true }));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [stage]);

  // Esc to close, page scroll locked while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    sealRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, [onClose]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "5Digea", text: shareText, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast(t("roadmap.finale.copied"), "success");
    } catch {
      // share sheet dismissed
    }
  };

  const opened = stage !== "intro";
  const risen = stage === "rising" || stage === "letter";
  const showLetter = stage === "letter";

  const line = (delay: number) => ({
    className: `transition-all duration-[900ms] ease-out ${
      showLetter ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[2px]"
    }`,
    style: { transitionDelay: `${showLetter ? delay : 0}ms` },
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="letter-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-3 sm:p-6"
    >
      {confetti && <ConfettiBurst onDone={() => setConfetti(false)} />}

      {/* backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("common.close")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#120b09]/85 backdrop-blur-md animate-[letterFade_.5s_ease-out_both]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(226,183,119,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {FINALE_PETALS.map((p, i) => (
          <span
            key={i}
            className="absolute -top-10 block"
            style={
              {
                left: `${p.left}%`,
                animation: `heartFall ${p.duration}s linear ${p.delay}s infinite`,
                "--drift": `${p.drift}px`,
              } as React.CSSProperties
            }
          >
            <Heart
              fill={HEART_COLORS[i % HEART_COLORS.length]}
              strokeWidth={0}
              style={{
                width: 10 + p.size,
                height: 10 + p.size,
                opacity: p.kind === 2 ? 0.3 : 0.65,
                filter: p.kind === 2 ? "blur(1.5px)" : "drop-shadow(0 0 6px rgba(231,192,137,0.45))",
              }}
            />
          </span>
        ))}
      </div>

      {/* ENVELOPE */}
      <div
        aria-hidden={showLetter}
        className={`absolute flex flex-col items-center transition-all duration-700 ease-in ${
          showLetter ? "pointer-events-none translate-y-16 scale-90 opacity-0" : "opacity-100"
        }`}
      >
        <div className="animate-[envelopeIn_.9s_cubic-bezier(.2,.9,.25,1.15)_both]" style={{ perspective: 1400 }}>
          <div className={`relative h-[min(58vw,270px)] w-[min(86vw,400px)] ${stage === "intro" ? "animate-[envelopeFloat_3.2s_ease-in-out_1s_infinite]" : ""}`}>
            {/* inside */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#8c5d2e] to-[#b98a52] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]" />

            {/* the letter inside */}
            <div
              className="absolute inset-x-[7%] bottom-[5%] top-[7%] rounded-xl bg-[#fbf6ee] shadow-[0_-6px_20px_rgba(0,0,0,0.15)] transition-transform duration-[950ms] ease-[cubic-bezier(.3,.7,.2,1)]"
              style={{ zIndex: 10, transform: risen ? "translateY(-68%)" : "translateY(0)" }}
            >
              <div className="flex h-full flex-col items-center justify-start gap-2 px-6 pt-5">
                <Heart size={18} fill="#d9a363" strokeWidth={0} />
                <span className="h-1.5 w-3/4 rounded-full bg-[#ecdcc2]" />
                <span className="h-1.5 w-2/3 rounded-full bg-[#ecdcc2]" />
                <span className="h-1.5 w-1/2 rounded-full bg-[#ecdcc2]" />
                <span className="h-1.5 w-3/5 rounded-full bg-[#ecdcc2]" />
              </div>
            </div>

            {/* front pocket */}
            <div
              className="absolute inset-0 z-20 rounded-2xl bg-linear-to-br from-[#f6e7cc] via-[#f0dcb8] to-[#e4c797]"
              style={{ clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 z-20 rounded-2xl bg-linear-to-t from-[#e9cfa3] to-[#f3e2c4]"
              style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
            />
            <div className="pointer-events-none absolute inset-2 top-[30%] z-20 rounded-b-xl border border-t-0 border-[#c9914f]/25" />

            {/* names, handwritten onto the envelope */}
            <div className="absolute inset-x-0 bottom-[6%] z-30 text-center sm:bottom-[9%]">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#a8723a]/80">
                {t("roadmap.letter.to")}
              </p>
              <p
                className="mt-0.5 text-xl font-bold text-[#6b4423] sm:mt-1 sm:text-3xl"
                style={{
                  animation: `${isArabic ? "writeInRtl" : "writeInLtr"} 1.4s cubic-bezier(.5,0,.3,1) .8s both`,
                }}
              >
                {names}
              </p>
            </div>

            {/* flap */}
            <div
              className="absolute inset-x-0 top-0 h-[56%] origin-top transition-transform duration-[850ms] ease-[cubic-bezier(.5,0,.25,1)] [transform-style:preserve-3d]"
              style={{
                zIndex: risen ? 5 : 40,
                transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
              }}
            >
              <div
                className="absolute inset-0 rounded-t-2xl bg-linear-to-b from-[#f3e1bf] to-[#dcbd88] [backface-visibility:hidden]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              <div
                className="absolute inset-0 rounded-t-2xl bg-linear-to-t from-[#a87843] to-[#c99a5e] [backface-visibility:hidden]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transform: "rotateX(180deg)" }}
              />
            </div>

            {/* wax seal */}
            <button
              ref={sealRef}
              type="button"
              onClick={() => stage === "intro" && setStage("opening")}
              aria-label={t("roadmap.letter.tapToOpen")}
              className={`absolute left-1/2 top-[56%] z-50 flex h-12 w-12 -translate-x-1/2 sm:h-16 sm:w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d0645a,#9b2f2a_55%,#6e1c19)] shadow-[0_6px_16px_rgba(80,10,10,0.45),inset_0_-3px_6px_rgba(0,0,0,0.3)] ring-4 ring-[#b8463f]/30 transition-all duration-500 focus-visible:outline-none focus-visible:ring-[#f3d6a8] ${
                opened ? "pointer-events-none scale-150 opacity-0 blur-sm" : "animate-[sealPulse_1.8s_ease-in-out_2.2s_infinite] hover:scale-110"
              }`}
            >
              <span className="absolute inset-1.5 rounded-full border border-white/20" />
              <Heart fill="#fbe9e4" strokeWidth={0} className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <p
          className={`mt-8 flex items-center gap-2 text-sm font-medium text-[#f1d4a6] transition-opacity duration-500 ${
            opened ? "opacity-0" : "animate-[letterFade_.8s_ease-out_2.2s_both]"
          }`}
        >
          <Sparkles size={14} aria-hidden="true" />
          {t("roadmap.letter.tapToOpen")}
        </p>
      </div>

      {/* THE LETTER */}
      <div
        className={`relative w-full max-w-2xl transition-all duration-[850ms] ease-[cubic-bezier(.2,.85,.25,1)] ${
          showLetter ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-24 scale-75 opacity-0"
        }`}
      >
        <div className="relative max-h-[90vh] overflow-y-auto overscroll-contain rounded-[28px] bg-[#fbf6ee] bg-[radial-gradient(circle_at_20%_0%,rgba(226,183,119,0.18),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(198,138,114,0.12),transparent_40%)] px-6 py-12 text-center shadow-[0_50px_120px_-20px_rgba(0,0,0,0.75)] sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-[#d9a363]/35" />
          <div className="pointer-events-none absolute inset-[18px] rounded-[18px] border border-[#d9a363]/15" />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="absolute end-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#8b7e76] ring-1 ring-[#ebe0d3] transition hover:bg-white hover:text-[#30251f]"
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div className="relative">
            <div {...line(150)}>
              <div className="relative mx-auto h-24 w-24">
                <span className="absolute inset-0 animate-[finaleGlow_3.2s_ease-in-out_infinite] rounded-full bg-[#e2b777]/30 blur-2xl" />
                <svg viewBox="0 0 120 120" className="relative h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="letterGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f3d6a8" />
                      <stop offset="50%" stopColor="#c9914f" />
                      <stop offset="100%" stopColor="#94622f" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="47" cy="64" r="24" fill="none" stroke="url(#letterGold)" strokeWidth="5" strokeLinecap="round"
                    pathLength={1} strokeDasharray="1" strokeDashoffset={showLetter ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.6,0,.2,1) .4s" }}
                  />
                  <circle
                    cx="73" cy="64" r="24" fill="none" stroke="url(#letterGold)" strokeWidth="5" strokeLinecap="round"
                    pathLength={1} strokeDasharray="1" strokeDashoffset={showLetter ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.6,0,.2,1) .8s" }}
                  />
                  <path d="M73 34 l-5 -8 h10 z" fill="#d9a363" />
                </svg>
              </div>
            </div>

            <p {...line(300)}>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f3e6d2] px-4 py-1.5 text-xs font-semibold text-[#94622f] sm:text-sm">
                <PartyPopper size={14} aria-hidden="true" />
                {t("roadmap.finale.eyebrow")}
              </span>
            </p>

            <p {...line(450)}>
              <span className="mt-5 flex items-center justify-center gap-3 text-xl font-bold text-[#8a5a2b] sm:text-2xl">
                {firstUserName}
                <Heart size={18} fill="#c9914f" strokeWidth={0} className="animate-[heartBeat_2.4s_ease-in-out_infinite]" aria-hidden="true" />
                {firstPartnerName}
              </span>
            </p>

            <h2 id="letter-title" {...line(600)}>
              <span className="mt-3 block bg-[linear-gradient(110deg,#94622f_20%,#d9a363_40%,#7a4d22_55%,#94622f_75%)] bg-[length:250%_100%] bg-clip-text text-3xl font-extrabold leading-[1.35] text-transparent animate-[finaleShimmer_6s_linear_infinite] sm:text-5xl">
                {t("roadmap.finale.title")}
              </span>
            </h2>

            <div {...line(800)}>
              <p className="mx-auto mt-5 max-w-xl text-base leading-loose text-[#5b4c43] sm:text-lg">
                {t("roadmap.finale.body")}
              </p>
              <p className="mx-auto mt-2 max-w-xl text-base leading-loose text-[#7a6a60] sm:text-lg">
                {t("roadmap.finale.hope")}
              </p>
            </div>

            <div {...line(950)}>
              <div className="mx-auto mt-8 flex max-w-xs items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#c9914f]/60" />
                <Heart size={14} fill="#c9914f" strokeWidth={0} />
                <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#c9914f]/60" />
              </div>
            </div>

            <figure {...line(1100)}>
              <div className="relative mx-auto mt-8 max-w-xl overflow-hidden rounded-3xl border border-[#e8d2ae] bg-[#f6ead7]/70 px-6 py-8 sm:px-9">
                <span className="pointer-events-none absolute -top-3 start-4 font-serif text-7xl leading-none text-[#c9914f]/20" aria-hidden="true">
                  &ldquo;
                </span>
                <figcaption className="text-xs font-semibold tracking-wide text-[#a8723a]">
                  {t("roadmap.finale.duaLabel")}
                </figcaption>
                <blockquote className="mt-3 text-2xl font-bold leading-relaxed text-[#3a2c25] sm:text-[28px]">
                  {t("roadmap.finale.dua")}
                </blockquote>
                <p className="mt-3 text-sm leading-loose text-[#6f5f55] sm:text-base">
                  {t("roadmap.finale.duaMore")}
                </p>
                {hasDate && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#8a5a2b] ring-1 ring-[#e8d2ae]">
                    <CalendarDays size={15} aria-hidden="true" />
                    {isToday
                      ? t("roadmap.finale.today")
                      : t("roadmap.finale.dateOn", {
                          date: formatDate(eventDate, LANGUAGE_DATE_LOCALE[language]),
                        })}
                  </p>
                )}
              </div>
            </figure>

            <div {...line(1250)}>
              <div className="mx-auto mt-10 max-w-xl">
                <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-[#30251f] sm:text-xl">
                  <Users size={18} className="text-[#a8723a]" aria-hidden="true" />
                  {t("roadmap.finale.shareTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7a6a60] sm:text-base">
                  {t("roadmap.finale.shareBody")}
                </p>
                <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#d9a363] to-[#a8723a] px-6 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(168,114,58,0.6)] transition hover:brightness-105"
                  >
                    <span className="absolute inset-y-0 left-0 w-10 -translate-x-full skew-x-[-20deg] bg-white/35 transition-transform duration-700 group-hover:translate-x-[1200%]" aria-hidden="true" />
                    <Send size={16} className="rtl:-scale-x-100" aria-hidden="true" />
                    {t("roadmap.finale.share")}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#5f544d] ring-1 ring-[#e6d9c8] transition hover:ring-[#c9914f] hover:text-[#30251f]"
                  >
                    <MessageSquareText size={16} aria-hidden="true" />
                    {t("roadmap.finale.whatsapp")}
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#8a5a2b] underline-offset-4 hover:underline"
                  >
                    {t("roadmap.finale.feedback")}
                  </Link>
                </div>
              </div>
            </div>

            <div {...line(1400)}>
              <p className="mt-10 inline-flex items-center gap-2 text-base font-semibold text-[#a8723a]">
                <Heart size={14} fill="currentColor" aria-hidden="true" />
                {t("roadmap.finale.signature")}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 rounded-xl px-6 text-sm font-semibold text-[#7a6a60] ring-1 ring-[#e6d9c8] transition hover:bg-white hover:text-[#30251f]"
                >
                  {t("roadmap.letter.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact "you've got a letter" card shown once every step is done. */
function LetterTeaser({ onOpen }: { onOpen: () => void }) {
  const { t } = useLanguage();
  return (
    <section
      aria-labelledby="letter-teaser-title"
      className="relative mt-14 overflow-hidden rounded-[28px] bg-[#1f1613] p-6 text-white shadow-[0_30px_80px_-30px_rgba(48,30,20,0.6)] sm:mt-16 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(226,183,119,0.22),transparent_50%)] rtl:bg-[radial-gradient(circle_at_15%_20%,rgba(226,183,119,0.22),transparent_50%)]" />
      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start">
        <button
          type="button"
          onClick={onOpen}
          aria-label={t("roadmap.letter.open")}
          className="group relative h-20 w-28 shrink-0 animate-[envelopeFloat_3.2s_ease-in-out_infinite]"
        >
          <span className="absolute inset-0 rounded-lg bg-linear-to-br from-[#f6e7cc] to-[#e4c797] shadow-lg" />
          <span className="absolute inset-0 rounded-lg bg-linear-to-t from-[#e9cfa3] to-[#f3e2c4]" style={{ clipPath: "polygon(0 100%, 50% 45%, 100% 100%)" }} />
          <span className="absolute inset-x-0 top-0 h-[58%] rounded-t-lg bg-linear-to-b from-[#f3e1bf] to-[#d8b883] transition-transform duration-500 group-hover:-translate-y-0.5" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          <span className="absolute left-1/2 top-[58%] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d0645a,#9b2f2a_60%,#6e1c19)] shadow-md transition-transform group-hover:scale-110">
            <Heart size={13} fill="#fbe9e4" strokeWidth={0} />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <h2 id="letter-teaser-title" className="text-xl font-bold text-[#f1d4a6] sm:text-2xl">
            {t("roadmap.letter.teaserTitle")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-white/70">
            {t("roadmap.letter.teaserBody")}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e7c089] to-[#c9914f] px-6 text-sm font-bold text-[#2a1c16] shadow-[0_10px_30px_-8px_rgba(217,163,99,0.6)] transition hover:brightness-105"
        >
          <Heart size={15} fill="currentColor" aria-hidden="true" />
          {t("roadmap.letter.open")}
        </button>
      </div>
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

  const { currentUser } = useCurrentUser();
  const myReviews = useMyReviews();
  const { user: authUser } = useAuth();
  const [referrals, setReferrals] = useState<Record<string, string>>(() =>
    typeof window === "undefined" ? {} : readReferrals(),
  );
  const rememberReferral = (categoryId: string, vendorName: string) => {
    setReferrals((current) => {
      const next = { ...current, [categoryId]: vendorName };
      try {
        window.localStorage.setItem(REFERRALS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const [viewReview, setViewReview] = useState<MyReview | null>(null);
  const gender = currentUser?.gender as JourneyGender;

  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo =
    rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : null;

  const [filter, setFilter] = useState<RoadmapFilter>(() =>
    typeof window === "undefined" ? "all" : readStoredFilter(),
  );
  const [reviewItem, setReviewItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);
  const [externalCompleteItem, setExternalCompleteItem] =
    useState<RoadmapItem | null>(null);
  const [externalSubmitting, setExternalSubmitting] = useState(false);
  const [externalMode, setExternalMode] = useState<"complete" | "share">(
    "complete",
  );
  const requestExternalComplete = (item: RoadmapItem) => {
    setExternalMode("complete");
    setExternalCompleteItem(item);
  };
  const requestShareExternal = (item: RoadmapItem) => {
    setExternalMode("share");
    setExternalCompleteItem(item);
  };
  const [reviewPromptItem, setReviewPromptItem] = useState<{
    id: string;
    categoryName: string;
  } | null>(null);

  // Every step done? Celebrate when it happens during this visit.
  const allDone =
    !!roadmap &&
    roadmap.items.length > 0 &&
    roadmap.items.every((i) => i.status === RoadmapItemStatus.Completed);
  const wasAllDone = useRef<boolean | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  useEffect(() => {
    if (loading || !roadmap) return;
    if (wasAllDone.current === false && allDone) {
      const timer = window.setTimeout(() => setLetterOpen(true), 700);
      wasAllDone.current = allDone;
      return () => window.clearTimeout(timer);
    }
    wasAllDone.current = allDone;
  }, [allDone, loading, roadmap]);

  if (loading) {
    return (
      <div
        className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f4]"
        role="status"
      >
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfd6] bg-white shadow-sm">
            <Loader2
              size={26}
              className="animate-spin text-[#ae7b40]"
              aria-hidden="true"
            />
          </span>
          <p className="mt-5 text-lg font-bold text-[#30251f]">
            {t("roadmap.loading.title")}
          </p>
          <p className="mt-1 text-sm text-[#a3978f]">
            {t("roadmap.loading.subtitle")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f4] px-4">
        <div
          className="max-w-md rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm"
          role="alert"
        >
          <AlertCircle
            size={30}
            className="mx-auto text-red-500"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-xl font-bold text-[#30251f]">
            {t("roadmap.errorState.title")}
          </h1>
          <p className="mt-2 text-sm text-[#8b7e76]">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <CreateRoadmapForm
        onCreate={async (data) => {
          const ok = await create(data);
          // Came here from a vendor/service page: go straight back so the
          // couple can finish choosing — no dead end.
          if (ok && returnTo) {
            toast(t("roadmap.pick.createdReturn"), "success");
            router.push(returnTo);
          }
          return ok;
        }}
        loading={actionLoading === "create"}
        gender={gender}
      />
    );
  }

  const items = sortByPriority(roadmap.items);
  const numberOf = (item: RoadmapItem) => items.indexOf(item) + 1;
  const remainingItems = items.filter(
    (item) => item.status !== RoadmapItemStatus.Completed,
  );
  const doneItems = items.filter(
    (item) => item.status === RoadmapItemStatus.Completed,
  );
  // Done steps booked outside 5Digea get their own section, inviting the
  // couple to share the vendor so our team can bring them on board.
  const doneOutside = doneItems.filter((item) => !item.selectedVendorId);
  const doneOnSite = doneItems.filter((item) => item.selectedVendorId);
  const outsidePending = doneOutside.filter(
    (item) => !referrals[String(item.categoryId)],
  ).length;
  const renderDoneCard = (
    item: RoadmapItem,
    extra: Partial<JourneyHandlers> = {},
  ) => (
    <JourneyCard
      {...extra}
      item={item}
      index={numberOf(item) - 1}
      total={items.length}
      isNext={false}
      actionLoading={actionLoading}
      onReview={(item) => {
        if (item.id)
          setReviewItem({
            id: item.id,
            categoryName: item.categoryName,
          });
      }}
      onComplete={(categoryId) =>
        handleAction(
          () => complete(String(categoryId)),
          t("roadmap.toast.categoryCompleted"),
          t("roadmap.toast.categoryCompleteFailed"),
        )
      }
      onUncomplete={(categoryId) =>
        handleAction(
          () => uncomplete(String(categoryId)),
          t("roadmap.toast.categoryReopened"),
          t("roadmap.toast.categoryReopenFailed"),
        )
      }
      onRemove={(categoryId) =>
        handleAction(
          () => removeVendor(String(categoryId)),
          t("roadmap.toast.vendorRemoved"),
          t("roadmap.toast.vendorRemoveFailed"),
        )
      }
      onRequestExternalComplete={requestExternalComplete}
      onCompletedWithVendor={handleCompletedWithVendor}
      reviewOf={(item) =>
        myReviews.reviewForVendor(item.selectedVendorId)
      }
      onViewReview={setViewReview}
      referralOf={(item) =>
        referrals[String(item.categoryId)]
      }
    />
  );
  const changeFilter = (next: RoadmapFilter) => {
    setFilter(next);
    try {
      window.localStorage.setItem(FILTER_STORAGE_KEY, next);
    } catch {
      // ignore (private mode)
    }
  };
  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.status === RoadmapItemStatus.Completed,
  ).length;
  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;
  const nextItem =
    items.find((item) => item.status !== RoadmapItemStatus.Completed) ?? null;

  const handleAction = async (
    action: () => Promise<boolean>,
    success: string,
    failure: string,
  ) => {
    const ok = await action();
    toast(ok ? success : failure, ok ? "success" : "error");
    return ok;
  };

  const handleCompletedWithVendor = (item: RoadmapItem) => {
    // Already reviewed this vendor: don't ask again.
    if (myReviews.reviewForVendor(item.selectedVendorId)) return;
    if (item.id)
      setReviewPromptItem({ id: item.id, categoryName: item.categoryName });
  };

  const handleMarkDone = async (item: RoadmapItem) => {
    if (!item.selectedVendorId) {
      setExternalCompleteItem(item);
      return;
    }
    const ok = await handleAction(
      () => complete(String(item.categoryId)),
      t("roadmap.toast.categoryCompleted"),
      t("roadmap.toast.categoryCompleteFailed"),
    );
    if (ok) handleCompletedWithVendor(item);
  };

  const finalizeExternalComplete = async (feedback?: {
    vendorName: string;
    phone: string;
    link: string;
  }) => {
    if (!externalCompleteItem) return;
    const step = externalCompleteItem;
    setExternalSubmitting(true);

    if (feedback) {
      try {
        await submitContactMessage({
          type: ContactMessageType.ExternalVendorReferral,
          // /api/Auth/me can be slow or unavailable: fall back to the session.
          senderName: currentUser?.fullName || authUser?.fullName || "",
          senderEmail: currentUser?.email || authUser?.email || "",
          senderPhone: currentUser?.phoneNumber || "",
          message: encodeMessageDetails({
            categoryId: String(step.categoryId),
            categoryName: step.categoryName,
            vendorName: feedback.vendorName,
            vendorPhone: feedback.phone,
            vendorLink: feedback.link,
          }),
        });
        rememberReferral(String(step.categoryId), feedback.vendorName);
      } catch (err) {
        // Keep the form open with what was typed so the couple can retry
        // (or skip) - never lose the referral silently.
        toast(
          getApiErrorMessage(err, t("roadmap.external.sendFailed")),
          "error",
        );
        setExternalSubmitting(false);
        return;
      }
    }

    // Step already done ("share" mode): nothing to complete.
    if (externalMode === "share" || step.status === RoadmapItemStatus.Completed) {
      if (feedback)
        toast(t("roadmap.external.sent", { name: feedback.vendorName }), "success");
      setExternalSubmitting(false);
      setExternalCompleteItem(null);
      return;
    }

    const ok = await complete(String(step.categoryId));
    if (ok) {
      toast(
        feedback
          ? t("roadmap.external.sent", { name: feedback.vendorName })
          : t("roadmap.toast.categoryCompleted"),
        "success",
      );
    } else {
      toast(t("roadmap.toast.categoryCompleteFailed"), "error");
    }
    setExternalSubmitting(false);
    setExternalCompleteItem(null);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fbf8f4]">
      <RoadmapHero
        partnerName={roadmap.partnerName}
        eventDate={roadmap.eventDate}
        progress={progress}
        gender={gender}
      />

      <div className="mx-auto lg:max-w-10/12 px-4 pb-16 sm:px-6 lg:px-8">
        <RoadmapOverview
          items={items}
          progress={progress}
          eventDate={roadmap.eventDate}
          nextItem={nextItem}
          onMarkNextDone={handleMarkDone}
          onOpenLetter={allDone ? () => setLetterOpen(true) : undefined}
        />

        {/* JOURNEY */}
        <section aria-labelledby="journey-title" className="mt-14 sm:mt-16">
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
                  ["all", t("roadmap.filter.all"), items.length],
                  [
                    "remaining",
                    t("roadmap.filter.remaining"),
                    remainingItems.length,
                  ],
                  [
                    "completed",
                    t("roadmap.filter.completed"),
                    doneItems.length,
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
                    onClick={() => changeFilter(key)}
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

          {/* Still to do — the path, in recommended order */}
          {filter !== "completed" &&
            (remainingItems.length > 0 ? (
              <JourneyPath
                items={remainingItems}
                nextItem={nextItem}
                numberOf={numberOf}
                total={items.length}
                actionLoading={actionLoading}
                onReview={(item) => {
                  if (item.id)
                    setReviewItem({
                      id: item.id,
                      categoryName: item.categoryName,
                    });
                }}
                onComplete={(categoryId) =>
                  handleAction(
                    () => complete(String(categoryId)),
                    t("roadmap.toast.categoryCompleted"),
                    t("roadmap.toast.categoryCompleteFailed"),
                  )
                }
                onUncomplete={(categoryId) =>
                  handleAction(
                    () => uncomplete(String(categoryId)),
                    t("roadmap.toast.categoryReopened"),
                    t("roadmap.toast.categoryReopenFailed"),
                  )
                }
                onRemove={(categoryId) =>
                  handleAction(
                    () => removeVendor(String(categoryId)),
                    t("roadmap.toast.vendorRemoved"),
                    t("roadmap.toast.vendorRemoveFailed"),
                  )
                }
                onRequestExternalComplete={requestExternalComplete}
                onCompletedWithVendor={handleCompletedWithVendor}
                reviewOf={(item) =>
                  myReviews.reviewForVendor(item.selectedVendorId)
                }
                onViewReview={setViewReview}
                referralOf={(item) => referrals[String(item.categoryId)]}
              />
            ) : (
              <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/60 p-8 text-center">
                <PartyPopper
                  size={30}
                  className="mx-auto text-emerald-600"
                  aria-hidden="true"
                />
                <p className="mt-3 text-lg font-bold text-[#30251f]">
                  {t("roadmap.next.allDoneTitle")}
                </p>
                <p className="mt-1 text-sm text-[#6f635b]">
                  {t("roadmap.next.allDoneBody")}
                </p>
                {allDone && (
                  <button
                    type="button"
                    onClick={() => setLetterOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#46342a]"
                  >
                    <Heart size={15} fill="currentColor" className="text-[#e7c089]" aria-hidden="true" />
                    {t("roadmap.next.seeMessage")}
                  </button>
                )}
              </div>
            ))}

          {/* Done — moved below so the couple focuses on what's left */}
          {filter !== "remaining" && (
            <div
              className={
                filter === "all" && remainingItems.length > 0 ? "mt-14" : ""
              }
            >
              {filter === "all" && doneItems.length > 0 && (
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                    <CheckCircle2 size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#30251f]">
                      {t("roadmap.doneSection.title")}{" "}
                      <span className="text-sm font-semibold text-[#8b7e76]">
                        ({doneItems.length})
                      </span>
                    </h3>
                    <p className="text-sm text-[#8b7e76]">
                      {t("roadmap.doneSection.sub")}
                    </p>
                  </div>
                </div>
              )}

              {doneOutside.length > 0 && (
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
                            ({doneOutside.length})
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
                        outsidePending > 0
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {outsidePending > 0 ? (
                        <Users size={13} aria-hidden="true" />
                      ) : (
                        <CheckCircle2 size={13} aria-hidden="true" />
                      )}
                      {outsidePending > 0
                        ? t("roadmap.outside.pending", {
                            count: outsidePending,
                          })
                        : t("roadmap.outside.allSent")}
                    </p>
                  </div>
                  <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {doneOutside.map((item) => (
                      <li key={getRoadmapItemKey(item, numberOf(item))}>
                        {renderDoneCard(item, {
                          onShareExternal: requestShareExternal,
                        })}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {doneOnSite.length > 0 && (
                <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {doneOnSite.map((item) => (
                    <li key={getRoadmapItemKey(item, numberOf(item))}>
                      {renderDoneCard(item)}
                    </li>
                  ))}
                </ul>
              )}

              {doneItems.length === 0 && filter === "completed" && (
                <p className="rounded-[28px] border border-dashed border-[#e0d4c8] bg-white p-8 text-center text-sm text-[#8b7e76]">
                  {t("roadmap.emptyState.noneDone")}
                </p>
              )}
            </div>
          )}
        </section>

        {allDone && <LetterTeaser onOpen={() => setLetterOpen(true)} />}

        {/* DETAILS + MESSAGE */}
        <div className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_340px]">
          <RoadmapSummary
            roadmap={roadmap}
            onUpdate={update}
            updating={actionLoading === "update"}
            gender={gender}
          />

          <aside className="relative overflow-hidden rounded-[28px] bg-[#30221d] p-6 text-white sm:p-7">
            <div className="pointer-events-none absolute -end-16 -top-16 h-44 w-44 rounded-full bg-[#d5a05e]/15 blur-3xl" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#d8aa6d]/15 ring-1 ring-[#d8aa6d]/30">
              <Heart
                size={19}
                fill="currentColor"
                className="text-[#d8aa6d]"
                aria-hidden="true"
              />
            </span>
            <h2 className="relative mt-4 text-lg font-bold">
              {t("roadmap.progress.enjoyHeading")}
            </h2>
            <p className="relative mt-1.5 text-sm leading-relaxed text-white/65">
              {t("roadmap.progress.enjoyBody")}
            </p>
          </aside>
        </div>

        <p className="mt-4 flex items-start gap-3 rounded-2xl border border-[#ebe2da] bg-white/70 p-4 text-sm leading-relaxed text-[#6f635b]">
          <HeartHandshake
            size={18}
            className="mt-0.5 shrink-0 text-[#ae7a3f]"
            aria-hidden="true"
          />
          {t("roadmap.footer.flexibleNote")}
        </p>
      </div>

      {letterOpen && (
        <WeddingLetter
          partnerName={roadmap.partnerName}
          eventDate={roadmap.eventDate}
          gender={gender}
          onClose={() => setLetterOpen(false)}
        />
      )}

      {viewReview && (
        <ViewReviewModal
          review={viewReview}
          onClose={() => setViewReview(null)}
        />
      )}

      {reviewItem && (
        <WriteReviewModal
          roadmapItemId={reviewItem.id}
          categoryName={reviewItem.categoryName}
          onClose={() => setReviewItem(null)}
          myReviews={myReviews}
          onViewReview={(review) => {
            setReviewItem(null);
            setViewReview(review);
          }}
        />
      )}

      {externalCompleteItem && (
        <ExternalVendorModal
          categoryName={externalCompleteItem.categoryName}
          mode={externalMode}
          submitting={externalSubmitting}
          onSkip={() => finalizeExternalComplete()}
          onSubmit={(data) => finalizeExternalComplete(data)}
          onClose={() => setExternalCompleteItem(null)}
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
      <Suspense fallback={null}>
        <RoadmapContent />
      </Suspense>

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

        @keyframes heroNameIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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
            transform: translateX(-110%);
          }

          to {
            transform: translateX(310%);
          }
        }

        @keyframes finaleFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0), 1100px, 0) rotate(300deg);
            opacity: 0;
          }
        }

        @keyframes envelopeIn {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.7) rotate(-6deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }

        @keyframes envelopeFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        @keyframes sealPulse {
          0%,
          100% {
            box-shadow: 0 6px 16px rgba(80, 10, 10, 0.45),
              0 0 0 0 rgba(208, 100, 90, 0.55);
          }
          50% {
            box-shadow: 0 6px 16px rgba(80, 10, 10, 0.45),
              0 0 0 14px rgba(208, 100, 90, 0);
          }
        }

        @keyframes writeInLtr {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0.2;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes writeInRtl {
          from {
            clip-path: inset(0 0 0 100%);
            opacity: 0.2;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes letterFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes heartFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(-12deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate3d(calc(var(--drift, 0px) * 0.5), 550px, 0)
              rotate(12deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0px), 1100px, 0) rotate(-10deg);
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift, 0), 110vh, 0)
              rotate(var(--spin, 540deg));
            opacity: 0;
          }
        }

        @keyframes finaleShimmer {
          from {
            background-position: 100% 0;
          }
          to {
            background-position: -150% 0;
          }
        }

        @keyframes finaleGlow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes finaleSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes finaleTwinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes dashMove {
          to {
            stroke-dashoffset: -24;
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
