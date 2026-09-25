import type { TranslationKey } from "@/locales";

// Vendor account status -> label + dot colour (comes from the API, not fixed).
export const VENDOR_STATUS: Record<
  string,
  { labelKey: TranslationKey; dot: string }
> = {
  Approved: { labelKey: "vendor.status.approved", dot: "bg-emerald-500" },
  Pending: { labelKey: "vendor.status.pending", dot: "bg-amber-500" },
  Rejected: { labelKey: "vendor.status.rejected", dot: "bg-red-500" },
  Inactive: { labelKey: "vendor.status.inactive", dot: "bg-gray-400" },
};
