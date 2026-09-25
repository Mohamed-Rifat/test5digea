"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

import type { AdminVendorDetails } from "./useAdminVendorDetails";

/** About the business. */
export function VendorAboutSection({
  vendor,
}: {
  vendor: Vendor;
  details: AdminVendorDetails;
}) {
  const { t } = useLanguage();

  return (
    <section className="mt-5 rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
      <h2 className="text-base font-semibold text-[#30251f]">
        {t("admin.vendorDetails.sections.about")}
      </h2>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#665b55]">
        {vendor.bio || t("admin.vendorDetails.sections.noDescription")}
      </p>
    </section>
  );
}
