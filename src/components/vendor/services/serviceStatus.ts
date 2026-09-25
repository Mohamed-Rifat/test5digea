import { CheckCircle2, Clock3, XCircle, type LucideIcon } from "lucide-react";

import type { TranslationKey } from "@/locales";

export const MAX_SERVICE_IMAGES = 5;

interface StatusConfig {
  labelKey: TranslationKey;
  icon: LucideIcon;
  className: string;
  dot: string;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  Approved: {
    labelKey: "vendor.services.statusLabel.approved",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Pending: {
    labelKey: "vendor.services.statusLabel.pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Rejected: {
    labelKey: "vendor.services.statusLabel.rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  Inactive: {
    labelKey: "vendor.services.statusLabel.inactive",
    icon: XCircle,
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-500",
  },
};

export const getServiceStatusConfig = (status: string): StatusConfig =>
  STATUS_CONFIGS[status] || STATUS_CONFIGS.Pending;
