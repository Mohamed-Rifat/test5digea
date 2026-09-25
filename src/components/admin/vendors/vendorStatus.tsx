import { Ban, Check, Clock3, X } from "lucide-react";

import type { Vendor } from "@/types/vendor";

export type VendorStatusFilter = "all" | Vendor["status"];

export const getStatusClasses = (status: Vendor["status"]): string => {
  switch (status) {
    case "Approved":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-700";

    case "Pending":
      return "border-amber-200/80 bg-amber-50 text-amber-700";

    case "Rejected":
      return "border-red-200/80 bg-red-50 text-red-700";

    case "Inactive":
      return "border-slate-200 bg-slate-100 text-slate-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const getStatusDot = (status: Vendor["status"]): string => {
  switch (status) {
    case "Approved":
      return "bg-emerald-500";

    case "Pending":
      return "bg-amber-500";

    case "Rejected":
      return "bg-red-500";

    case "Inactive":
      return "bg-slate-400";

    default:
      return "bg-slate-400";
  }
};

export const getStatusIcon = (status: Vendor["status"]) => {
  switch (status) {
    case "Approved":
      return <Check size={12} strokeWidth={2.5} />;

    case "Pending":
      return <Clock3 size={12} strokeWidth={2.5} />;

    case "Rejected":
      return <X size={12} strokeWidth={2.5} />;

    case "Inactive":
      return <Ban size={12} strokeWidth={2.5} />;

    default:
      return null;
  }
};
