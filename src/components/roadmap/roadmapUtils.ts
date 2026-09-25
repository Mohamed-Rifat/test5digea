import type { ElementType } from "react";
import {
  Camera,
  Music2,
  Utensils,
  Gem,
  Flower2,
  CakeSlice,
  Shirt,
  Car,
  MoreHorizontal,
  Building2,
  Palette,
  ClipboardList,
  Plane,
  Gift,
} from "lucide-react";
import { RoadmapItemStatus, type RoadmapItem } from "@/types/roadmap";
import { authStorage } from "@/lib/auth-storage";
import type { TranslationKey } from "@/locales";

export const GOLD = "#b27a3d";

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

export const getCategoryIcon = (
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

export const getRoadmapItemKey = (
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

export const getCurrentUserName = () => {
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

export const getFirstName = (name: string | null | undefined) => {
  const trimmed = (name ?? "").trim();

  if (!trimmed) {
    return "You";
  }

  return trimmed.split(/\s+/)[0];
};

export type JourneyGender = "Male" | "Female" | null | undefined;

export const getJourneyCopy = (
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

export type StepState = "completed" | "selected" | "todo";

export const getStepState = (item: RoadmapItem): StepState =>
  item.status === RoadmapItemStatus.Completed
    ? "completed"
    : item.status === RoadmapItemStatus.VendorSelected || item.selectedVendorId
      ? "selected"
      : "todo";

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
export const sortByPriority = (items: RoadmapItem[]) =>
  items
    .map((item, apiIndex) => ({
      item,
      apiIndex,
      p: getCategoryPriority(item.categoryName),
    }))
    .sort((a, b) => a.p - b.p || a.apiIndex - b.apiIndex)
    .map(({ item }) => item);

export type RoadmapFilter = "all" | "remaining" | "completed";

export const REFERRALS_KEY = "5digea-roadmap-referrals";

/** categoryId -> external vendor name the couple told us about. */
export const readReferrals = (): Record<string, string> => {
  try {
    const raw = window.localStorage.getItem(REFERRALS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const FILTER_STORAGE_KEY = "5digea-roadmap-filter";

export const readStoredFilter = (): RoadmapFilter => {
  try {
    const value = window.localStorage.getItem(FILTER_STORAGE_KEY);
    return value === "remaining" || value === "completed" ? value : "all";
  } catch {
    return "all";
  }
};

export const STATE_STYLES: Record<
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
