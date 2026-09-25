"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import { getStatusClasses, getStatusDot, getStatusIcon } from "./vendorStatus";

export function TableHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.14em] text-[#948983] ${className}`}
    >
      {children}
    </span>
  );
}

export function VendorAvatar({
  vendor,
  size = "md",
}: {
  vendor: Vendor;
  size?: "md" | "lg";
}) {
  const { t } = useLanguage();

  const sizeClass =
    size === "lg"
      ? "h-14 w-14 rounded-full"
      : "h-11 w-11 rounded-full";

  const initial =
    vendor.businessName?.charAt(0)?.toUpperCase() ||
    "V";

  if (vendor.profileImageUrl) {
    return (
      <img
        loading="lazy"
        decoding="async"
        src={vendor.profileImageUrl}
        alt={vendor.businessName || t("admin.vendors.vendor")}
        className={`${sizeClass} shrink-0 object-cover ring-1 ring-[#eee8e4]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center bg-gradient-to-br from-[#f1ebe7] to-[#e5d9d0] font-semibold text-[#806d60]`}
    >
      {initial}
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: Vendor["status"];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${getStatusClasses(
        status
      )}`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${getStatusDot(
          status
        )} text-white`}
      >
        {getStatusIcon(status)}
      </span>

      {status}
    </span>
  );
}

export function Rating({
  value,
  count,
}: {
  value?: number;
  count?: number;
}) {
  const rating = Number(value || 0);
  const reviews = Number(count || 0);

  return (
    <div className="flex items-center gap-1.5">
      <Star
        size={14}
        className="fill-current text-[#b08b55]"
      />

      <span className="text-xs font-semibold text-[#403630]">
        {rating.toFixed(1)}
      </span>

      <span className="text-[10px] text-[#9b918b]">
        ({reviews})
      </span>
    </div>
  );
}
