"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

import type { AdminVendorDetails } from "./useAdminVendorDetails";
import { InfoRow } from "./vendorDetailBits";

/** Business information + vendor profile cards. */
export function VendorInfoSections({
  vendor,
  details,
}: {
  vendor: Vendor;
  details: AdminVendorDetails;
}) {
  const { t } = useLanguage();
  const { dateLocale, notProvided } = details;

  return (
    <div className="mt-5 grid gap-5 md:grid-cols-2">
      {/* Business Information */}
      <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
        <div className="mb-4 flex items-center gap-2">
          <Store size={18} className="text-[#8b7464]" />

          <h2 className="text-base font-semibold text-[#30251f]">
            {t("admin.vendorDetails.sections.business")}
          </h2>
        </div>

        <div className="space-y-3">
          <InfoRow
            icon={<Store size={16} />}
            label={t("admin.vendorDetails.fields.businessName")}
            value={vendor.businessName || notProvided}
          />

          <InfoRow
            icon={<MapPin size={16} />}
            label={t("admin.vendorDetails.fields.location")}
            value={vendor.location || notProvided}
          />

          <InfoRow
            icon={<Mail size={16} />}
            label={t("admin.vendorDetails.fields.businessEmail")}
            value={vendor.contactEmail || notProvided}
          />

          <InfoRow
            icon={<Phone size={16} />}
            label={t("admin.vendorDetails.fields.contactPhone")}
            value={vendor.contactPhone || notProvided}
          />
        </div>
      </section>

      {/* Vendor Profile */}
      <section className="rounded-2xl border border-[#e9e1dc] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)]">
        <div className="mb-4 flex items-center gap-2">
          <User size={18} className="text-[#8b7464]" />

          <h2 className="text-base font-semibold text-[#30251f]">
            {t("admin.vendorDetails.sections.profile")}
          </h2>
        </div>

        <div className="space-y-3">
          <InfoRow
            icon={<User size={16} />}
            label={t("admin.vendorDetails.fields.userId")}
            value={vendor.userId || notProvided}
          />

          <InfoRow
            icon={<CheckCircle2 size={16} />}
            label={t("admin.vendorDetails.fields.createdAt")}
            value={formatDateTime(vendor.createdAt, dateLocale) || notProvided}
          />

          <InfoRow
            icon={<Clock3 size={16} />}
            label={t("admin.vendorDetails.fields.updatedAt")}
            value={formatDateTime(vendor.updatedAt, dateLocale) || notProvided}
          />

          {vendor.rejectionReason && (
            <InfoRow
              icon={<AlertCircle size={16} />}
              label={t("admin.vendorDetails.fields.rejectionReason")}
              value={vendor.rejectionReason}
            />
          )}
        </div>
      </section>
    </div>
  );
}
