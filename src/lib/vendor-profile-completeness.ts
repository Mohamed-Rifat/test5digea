import type { Vendor } from "@/types/vendor";

export type ProfileCheckKey =
  | "image"
  | "slogan"
  | "bio"
  | "location"
  | "phone"
  | "email"
  | "categories"
  | "gallery"
  | "hours"
  | "social";

export interface ProfileCheck {
  key: ProfileCheckKey;
  done: boolean;
  /** Where the vendor goes to fix it. */
  href: string;
}

export interface ProfileCompleteness {
  checks: ProfileCheck[];
  done: number;
  total: number;
  percent: number;
}

const PROFILE_HREF = "/vendor/profile";
const CATEGORIES_HREF = "/vendor/categories";

const hasText = (value: string | null | undefined) =>
  typeof value === "string" && value.trim().length > 0;

/**
 * socialLinksJson / workingHoursJson are JSON strings edited on the profile
 * page ("" when never saved). They count as filled when at least one value
 * inside is a non-empty string.
 */
const hasAnyJsonValue = (json: string | null | undefined) => {
  if (!hasText(json)) return false;

  try {
    const parsed: unknown = JSON.parse(json as string);

    if (!parsed || typeof parsed !== "object") return false;

    return Object.values(parsed as Record<string, unknown>).some((value) =>
      hasText(typeof value === "string" ? value : "")
    );
  } catch {
    return false;
  }
};

export function getVendorProfileCompleteness(
  vendor: Vendor
): ProfileCompleteness {
  const checks: ProfileCheck[] = [
    { key: "image", done: hasText(vendor.profileImageUrl), href: PROFILE_HREF },
    { key: "slogan", done: hasText(vendor.slogan), href: PROFILE_HREF },
    { key: "bio", done: hasText(vendor.bio), href: PROFILE_HREF },
    { key: "location", done: hasText(vendor.location), href: PROFILE_HREF },
    { key: "phone", done: hasText(vendor.contactPhone), href: PROFILE_HREF },
    { key: "email", done: hasText(vendor.contactEmail), href: PROFILE_HREF },
    {
      key: "categories",
      done: (vendor.categories?.length ?? 0) > 0,
      href: CATEGORIES_HREF,
    },
    {
      key: "hours",
      done: hasAnyJsonValue(vendor.workingHoursJson),
      href: PROFILE_HREF,
    },
    {
      key: "social",
      done: hasAnyJsonValue(vendor.socialLinksJson),
      href: PROFILE_HREF,
    },
  ];

  // The gallery is optional in the Vendor type (the GET payload may omit
  // it), so only count it when the API actually returned the field.
  if (Array.isArray(vendor.galleryImages)) {
    checks.push({
      key: "gallery",
      done: vendor.galleryImages.length > 0,
      href: PROFILE_HREF,
    });
  }

  const done = checks.filter((check) => check.done).length;
  const total = checks.length;

  return {
    checks,
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}
