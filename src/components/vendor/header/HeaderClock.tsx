"use client";

import type { VendorHeaderState } from "./useVendorHeader";

/** Current time / date pill. */
export function HeaderClock({ header }: { header: VendorHeaderState }) {
  const { formattedTime, formattedDate, vendor } = header;

  return (
    <div className="hidden items-center gap-3 rounded-full bg-[#faf7f4] px-4 py-1.5 text-xs text-[#756b65] lg:flex">
      <span className="font-medium text-[#30251f]">{formattedTime}</span>

      <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

      <span>{formattedDate}</span>

      {vendor?.businessName && (
        <>
          <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

          <span className="font-medium text-[#a47e43]">
            {vendor.businessName}
          </span>
        </>
      )}
    </div>
  );
}
