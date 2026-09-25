
export type SortMode = "recommended" | "rating" | "newest";

export const SERVICES_PAGE_SIZE = 6;

export const REVIEWS_PAGE_SIZE = 5;

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

export type WorkingHours = Record<string, string>;

export const DAYS_OF_WEEK = [
  {
    labelKey: "vendors.detail.hours.days.sat.name",
    shortKey: "vendors.detail.hours.days.sat.short",
    key: "sat",
    jsDay: 0,
  },
  {
    labelKey: "vendors.detail.hours.days.sun.name",
    shortKey: "vendors.detail.hours.days.sun.short",
    key: "sun",
    jsDay: 1,
  },
  {
    labelKey: "vendors.detail.hours.days.mon.name",
    shortKey: "vendors.detail.hours.days.mon.short",
    key: "mon",
    jsDay: 2,
  },
  {
    labelKey: "vendors.detail.hours.days.tue.name",
    shortKey: "vendors.detail.hours.days.tue.short",
    key: "tue",
    jsDay: 3,
  },
  {
    labelKey: "vendors.detail.hours.days.wed.name",
    shortKey: "vendors.detail.hours.days.wed.short",
    key: "wed",
    jsDay: 4,
  },
  {
    labelKey: "vendors.detail.hours.days.thu.name",
    shortKey: "vendors.detail.hours.days.thu.short",
    key: "thu",
    jsDay: 5,
  },
  {
    labelKey: "vendors.detail.hours.days.fri.name",
    shortKey: "vendors.detail.hours.days.fri.short",
    key: "fri",
    jsDay: 6,
  },
] as const;
