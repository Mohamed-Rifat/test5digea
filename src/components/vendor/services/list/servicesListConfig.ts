import { CheckCircle2, Clock3, XCircle, Filter } from "lucide-react";
import type { TranslationKey } from "@/locales";

export type StatusFilter =
  "All" | "Approved" | "Pending" | "Rejected" | "Inactive";

export const statusConfig: Record<
  string,
  {
    labelKey: TranslationKey;
    icon: React.ElementType;
    className: string;
    color: string;
  }
> = {
  Approved: {
    labelKey: "vendor.services.statusLabel.approved",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    color: "emerald",
  },
  Pending: {
    labelKey: "vendor.services.statusLabel.pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    color: "amber",
  },
  Rejected: {
    labelKey: "vendor.services.statusLabel.rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-200",
    color: "red",
  },
  Inactive: {
    labelKey: "vendor.services.statusLabel.inactive",
    icon: XCircle,
    className: "bg-gray-100 text-gray-700 border border-gray-200",
    color: "gray",
  },
};

export const STATUS_FILTERS: {
  value: StatusFilter;
  labelKey: TranslationKey;
  icon: React.ElementType;
}[] = [
  { value: "All", labelKey: "vendor.services.list.filterAll", icon: Filter },
  {
    value: "Approved",
    labelKey: "vendor.services.list.stats.approved",
    icon: CheckCircle2,
  },
  {
    value: "Pending",
    labelKey: "vendor.services.list.stats.pending",
    icon: Clock3,
  },
  {
    value: "Rejected",
    labelKey: "vendor.services.list.stats.rejected",
    icon: XCircle,
  },
  {
    value: "Inactive",
    labelKey: "vendor.services.list.stats.inactive",
    icon: XCircle,
  },
];
