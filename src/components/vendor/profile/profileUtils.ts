import type { TranslationKey } from "@/locales";
import type { UpdateVendorRequest } from "@/types/vendor";

export const emptyForm: UpdateVendorRequest = {
  businessName: "",
  slogan: "",
  bio: "",
  location: "",
  latitude: 0,
  longitude: 0,
  contactPhone: "",
  contactEmail: "",
  socialLinksJson: "",
  workingHoursJson: "",
};

export const DAYS_OF_WEEK = [
  { labelKey: "vendor.profile.days.sat", key: "sat" },
  { labelKey: "vendor.profile.days.sun", key: "sun" },
  { labelKey: "vendor.profile.days.mon", key: "mon" },
  { labelKey: "vendor.profile.days.tue", key: "tue" },
  { labelKey: "vendor.profile.days.wed", key: "wed" },
  { labelKey: "vendor.profile.days.thu", key: "thu" },
  { labelKey: "vendor.profile.days.fri", key: "fri" },
] as const;

// Backend status -> translation key.
export const STATUS_KEYS: Record<string, TranslationKey> = {
  Approved: "vendor.status.approved",
  Pending: "vendor.status.pending",
  Rejected: "vendor.status.rejected",
  Inactive: "vendor.status.inactive",
};

// Badge colours per vendor status (the badge used to be green for everything).
export const STATUS_BADGE_CLASSES: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-red-50 text-red-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

export type WorkingHours = Record<string, string>;

export type ValidationErrors = Record<string, TranslationKey | "">;

// Pure validators (module level so callbacks don't need them as deps).
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // يسمح بالأرقام فقط مع مسافات و + و - و ()
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  return phoneRegex.test(phone);
};

export const validateField = (
  field: string,
  value: string,
): TranslationKey | "" => {
  switch (field) {
    case "businessName":
      if (!value.trim()) return "vendor.profile.errors.nameRequired";
      if (value.trim().length < 2) return "vendor.profile.errors.nameShort";
      return "";

    case "location":
      if (!value.trim()) return "vendor.profile.errors.locationRequired";
      return "";

    case "contactPhone":
      if (!value.trim()) return "vendor.profile.errors.phoneRequired";
      if (!validatePhone(value)) return "vendor.profile.errors.phoneInvalid";
      return "";

    case "contactEmail":
      if (!value.trim()) return "vendor.profile.errors.emailRequired";
      if (!validateEmail(value)) return "vendor.profile.errors.emailInvalid";
      return "";

    case "slogan":
      if (value.length > 100) return "vendor.profile.errors.sloganLong";
      return "";

    case "bio":
      if (value.length > 2000) return "vendor.profile.errors.bioLong";
      return "";

    default:
      return "";
  }
};
