import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

import type { TranslationKey } from "@/locales";
import type { Service } from "@/types/service";

export const formatDate = (date: string, locale = "en-GB") => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(price);
};

export const getStatusKey = (status: string): TranslationKey | null => {
  const n = (status || "").toLowerCase().replace(/[_\-\s]/g, "");

  if (n.includes("pending")) return "admin.services.pending";
  if (n.includes("reject")) return "admin.services.rejected";
  if (n.includes("inactive") || n.includes("deactiv"))
    return "admin.services.inactive";
  if (n.includes("approved") || n.includes("active"))
    return "admin.services.approved";

  return null;
};

export const getRawStatusLabel = (status: string) => {
  if (!status) return "";

  return status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase().replace(/[_-\s]/g, "");

  if (normalized.includes("approved") || normalized.includes("active")) {
    return {
      wrapper: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (normalized.includes("pending") || normalized.includes("review")) {
    return {
      wrapper: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    };
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("inactive") ||
    normalized.includes("deactiv")
  ) {
    return {
      wrapper: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    };
  }

  return {
    wrapper: "bg-gray-50 text-gray-700 border-gray-200",
    icon: AlertCircle,
  };
};

export const formatDateTime = (date: string, locale = "en-GB") => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStartingPrice = (service: Service) => {
  if (!service.prices?.length) return null;

  return Math.min(...service.prices.map((item) => item.price));
};

/** Which moderation actions apply to a service, and which one is running. */
export function getServiceActionState(
  service: Service,
  actionLoading: string | null,
) {
  const isApproving = actionLoading === `approve-${service.id}`;
  const isRejecting = actionLoading === `reject-${service.id}`;
  const isActivating = actionLoading === `activate-${service.id}`;
  const isDeactivating = actionLoading === `deactivate-${service.id}`;

  const normalizedStatus = service.status?.toLowerCase().replace(/[_-\s]/g, "");

  return {
    isApproving,
    isRejecting,
    isActivating,
    isDeactivating,
    busy: isApproving || isRejecting || isActivating || isDeactivating,
    canApprove: !!normalizedStatus?.includes("pending"),
    canReject: !!normalizedStatus?.includes("pending"),
    canActivate: !!(
      normalizedStatus?.includes("inactive") ||
      normalizedStatus?.includes("deactiv")
    ),
    canDeactivate: !!(
      normalizedStatus?.includes("approved") ||
      normalizedStatus?.includes("active")
    ),
  };
}
