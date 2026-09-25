import { BriefcaseBusiness, ImageIcon, Star, Store } from "lucide-react";

import { ModerationEntityType, ModerationStatus } from "@/types/moderation";
import type { ModerationQueueItem } from "@/types/moderation";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import type { TranslationKey } from "@/locales";

// Where a recent request should send the admin — the dashboard summary
// is read-only, so it links out to the page that has the real actions
// for that entity type. Reviews don't have an individual admin page yet,
// only the list at /admin/reviews.
export function requestHref(item: ModerationQueueItem): string {
  switch (item.entityType) {
    case ModerationEntityType.Vendor:
      return `/admin/vendors/${item.entityId}`;
    case ModerationEntityType.Service:
      return `/admin/services/${item.entityId}`;
    case ModerationEntityType.ServiceImage:
      return `/admin/services/${item.serviceId ?? item.entityId}`;
    case ModerationEntityType.Review:
    default:
      return "/admin/reviews";
  }
}

export const requestEntityMeta: Record<
  ModerationEntityType,
  {
    labelKey: TranslationKey;
    icon: typeof Store;
    className: string;
  }
> = {
  [ModerationEntityType.Vendor]: {
    labelKey: "admin.moderation.entity.vendor" as const,
    icon: Store,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },

  [ModerationEntityType.Service]: {
    labelKey: "admin.moderation.entity.service" as const,
    icon: BriefcaseBusiness,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },

  [ModerationEntityType.Review]: {
    labelKey: "admin.moderation.entity.review" as const,
    icon: Star,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },

  [ModerationEntityType.ServiceImage]: {
    labelKey: "admin.moderation.entity.image" as const,
    icon: ImageIcon,
    className: "bg-[#eaf2ee] text-[#4d8f6b]",
  },
};
export const requestStatusStyles: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "bg-amber-50 text-amber-700",
  [ModerationStatus.Approved]: "bg-emerald-50 text-emerald-700",
  [ModerationStatus.Rejected]: "bg-red-50 text-red-600",
};

export const requestStatusLabels: Record<ModerationStatus, TranslationKey> = {
  [ModerationStatus.Pending]: "admin.moderation.statuses.pending",
  [ModerationStatus.Approved]: "admin.moderation.statuses.approved",
  [ModerationStatus.Rejected]: "admin.moderation.statuses.rejected",
};

export const CHART_COLORS = {
  approved: "#718b77",
  pending: "#d7a85d",
  rejected: "#b97878",
  inactive: "#d7d0cb",
  dark: "#30251f",
  accent: "#806d61",
  accentLight: "#c9b8ab",
  grid: "#f0e9e4",
};

/* ---------- status helpers ---------- */

export const normalizeStatus = (status?: string) => {
  return status?.toLowerCase().replace(/[_-]/g, " ").trim() || "";
};

export const isApproved = (status?: string) => {
  const normalized = normalizeStatus(status);

  return normalized.includes("approve") || normalized === "active";
};

export const isPending = (status?: string) => {
  return normalizeStatus(status).includes("pending");
};

export const isRejected = (status?: string) => {
  return normalizeStatus(status).includes("reject");
};

export const isInactive = (status?: string) => {
  const normalized = normalizeStatus(status);

  return normalized.includes("inactive") || normalized.includes("deactiv");
};

export const formatNumber = (value: number) => {
  return value.toLocaleString();
};

export const formatRating = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
};

export function formatDate(date?: string, locale = "en-US") {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/* ---------- chart data builders ---------- */

// Builds the last `count` month buckets (oldest -> newest), each keyed by
// "YYYY-M" so records can be grouped by the month they were created in.
function getLastMonthBuckets(count: number, locale = "en-US") {
  const buckets: { key: string; label: string }[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString(locale, { month: "short" }),
    });
  }

  return buckets;
}

function monthKeyOf(dateString?: string) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function buildGrowthSeries(
  vendors: Vendor[],
  services: Service[],
  months = 6,
  locale = "en-US"
) {
  const buckets = getLastMonthBuckets(months, locale);

  return buckets.map((bucket) => ({
    month: bucket.label,
    vendors: vendors.filter(
      (vendor) => monthKeyOf(vendor.createdAt) === bucket.key
    ).length,
    services: services.filter(
      (service) => monthKeyOf(service.createdAt) === bucket.key
    ).length,
  }));
}

export function buildRatingDistribution(vendors: Vendor[]) {
  const buckets = [5, 4, 3, 2, 1].map((stars) => ({
    stars: `${stars} ★`,
    count: 0,
  }));

  vendors.forEach((vendor) => {
    const rating = Number(vendor.averageRating) || 0;

    if (rating <= 0) return;

    const rounded = Math.min(5, Math.max(1, Math.round(rating)));
    const bucket = buckets.find((b) => b.stars === `${rounded} ★`);

    if (bucket) bucket.count += 1;
  });

  return buckets;
}
