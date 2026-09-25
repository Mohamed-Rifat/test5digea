"use client";

import type { TranslationKey } from "@/locales";
import type { Vendor } from "@/types/vendor";

export const STATUS_STYLES: Record<Vendor["status"], string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

export const STATUS_KEYS: Record<Vendor["status"], TranslationKey> = {
  Approved: "admin.vendorDetails.status.approved",
  Pending: "admin.vendorDetails.status.pending",
  Rejected: "admin.vendorDetails.status.rejected",
  Inactive: "admin.vendorDetails.status.inactive",
};

export function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto animate-pulse space-y-5">
        <div className="h-5 w-28 rounded bg-[#e7dfda]" />

        <div className="rounded-2xl border border-[#e9e1dc] bg-white p-6">
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-2xl bg-[#eee9e5]" />

            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-[#eee9e5]" />
              <div className="h-4 w-72 rounded bg-[#eee9e5]" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-[#eee9e5]" />
          <div className="h-64 rounded-2xl bg-[#eee9e5]" />
        </div>
      </div>
    </div>
  );
}

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#eee8e4] bg-[#fdfcfb] p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3efec] text-[#8b7464]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide rtl:tracking-normal text-[#a09791]">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-[#403630]">
          {value}
        </p>
      </div>
    </div>
  );
}
