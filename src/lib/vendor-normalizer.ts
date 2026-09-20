import type {
  Vendor,
  VendorApiResponse,
  VendorProfileData,
  VendorStatus,
} from "@/types/vendor";

const STATUS_BY_CODE: Record<number, VendorStatus> = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  4: "Inactive",
};

const STATUS_NAMES: VendorStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Inactive",
];

export const normalizeVendorStatus = (raw: unknown): VendorStatus => {
  if (typeof raw === "number") {
    return STATUS_BY_CODE[raw] ?? "Pending";
  }

  if (typeof raw === "string") {
    const asNumber = Number(raw);

    if (raw.trim() !== "" && Number.isFinite(asNumber)) {
      return STATUS_BY_CODE[asNumber] ?? "Pending";
    }

    const byName = STATUS_NAMES.find(
      (name) => name.toLowerCase() === raw.trim().toLowerCase()
    );

    if (byName) return byName;
  }

  return "Pending";
};

export const PROFILE_FIELDS: (keyof VendorProfileData)[] = [
  "businessName",
  "slogan",
  "bio",
  "profileImageUrl",
  "location",
  "latitude",
  "longitude",
  "contactPhone",
  "contactEmail",
  "socialLinksJson",
  "workingHoursJson",
];

const NUMERIC_FIELDS: (keyof VendorProfileData)[] = ["latitude", "longitude"];

// Builds a complete profile from a possibly partial / null-filled source,
// falling back to `fallback` (or empty values) for anything missing.
const readProfile = (
  source: Partial<VendorProfileData> | null | undefined,
  fallback?: VendorProfileData
): VendorProfileData => {
  const result = {} as Record<string, string | number>;

  PROFILE_FIELDS.forEach((field) => {
    const value = source?.[field];
    const numeric = NUMERIC_FIELDS.includes(field);

    if (value !== undefined && value !== null) {
      result[field] = numeric ? Number(value) || 0 : String(value);
    } else if (fallback) {
      result[field] = fallback[field];
    } else {
      result[field] = numeric ? 0 : "";
    }
  });

  return result as unknown as VendorProfileData;
};

// JSON columns may differ only in whitespace / key order — compare content.
const canonical = (value: string | number): string => {
  if (typeof value === "number") return String(value);

  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed);

    if (parsed && typeof parsed === "object") {
      const sortDeep = (input: unknown): unknown => {
        if (Array.isArray(input)) return input.map(sortDeep);
        if (input && typeof input === "object") {
          return Object.keys(input as object)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
              acc[key] = sortDeep((input as Record<string, unknown>)[key]);
              return acc;
            }, {});
        }
        return input;
      };

      return JSON.stringify(sortDeep(parsed));
    }
  } catch {
    // not JSON — plain text
  }

  return trimmed;
};

export const getChangedFields = (
  current: VendorProfileData,
  pending: VendorProfileData
): (keyof VendorProfileData)[] =>
  PROFILE_FIELDS.filter(
    (field) => canonical(current[field]) !== canonical(pending[field])
  );

const hasAnyValue = (source: object | null | undefined): boolean =>
  !!source &&
  Object.values(source).some((value) => value !== null && value !== undefined);

/**
 * Accepts both payload shapes (flat, or profile nested under `profile`) and
 * always returns the flat `Vendor` the UI is built on, plus `pendingChanges`
 * when the vendor has edits waiting for approval.
 */
export const normalizeVendor = (raw: VendorApiResponse): Vendor => {
  const { profile, pendingChanges, status, rejectionReason, ...rest } = raw;

  const live = readProfile({ ...raw, ...(profile ?? {}) } as Partial<VendorProfileData>);

  const pending = hasAnyValue(pendingChanges)
    ? readProfile(pendingChanges, live)
    : null;

  return {
    ...rest,
    ...live,
    id: raw.id,
    userId: raw.userId,
    status: normalizeVendorStatus(status),
    rejectionReason: rejectionReason ?? "",
    averageRating: raw.averageRating ?? 0,
    reviewsCount: raw.reviewsCount ?? 0,
    categories: raw.categories ?? [],
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    pendingChanges:
      pending && getChangedFields(live, pending).length > 0 ? pending : null,
    hasPendingRecord: hasAnyValue(pendingChanges),
  };
};
