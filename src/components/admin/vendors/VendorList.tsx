"use client";

import { Check, MapPin } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import { Rating, StatusBadge, TableHeader, VendorAvatar } from "./VendorBits";
import VendorInlineActions, {
  type VendorRowActions,
  type VendorRowProps,
} from "./VendorInlineActions";

const GRID =
  "grid-cols-[minmax(280px,2.2fr)_minmax(160px,1.15fr)_minmax(120px,.85fr)_minmax(100px,.8fr)_minmax(270px,1.7fr)]";

interface VendorListProps {
  vendors: Vendor[];
  /** Id of the vendor whose action is running, if any. */
  busyId: string | null;
  actionsFor: (vendor: Vendor) => VendorRowActions;
}

/** Table on desktop, cards on phones. */
export default function VendorList({ vendors, busyId, actionsFor }: VendorListProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="hidden overflow-hidden rounded-[26px] border border-[#e9e1dc] bg-white shadow-[0_12px_40px_rgba(48,37,31,0.04)] md:block">
        <div className={`grid ${GRID} items-center border-b border-[#eee8e4] bg-[#faf9f8] px-5 py-3.5`}>
          <TableHeader>{t("admin.vendors.vendor")}</TableHeader>
          <TableHeader>{t("admin.vendors.location")}</TableHeader>
          <TableHeader>{t("admin.vendors.status")}</TableHeader>
          <TableHeader>{t("admin.vendors.rating")}</TableHeader>
          <TableHeader className="text-right">{t("admin.vendors.actions")}</TableHeader>
        </div>

        {vendors.map((vendor) => (
          <VendorTableRow
            key={vendor.id}
            vendor={vendor}
            loading={busyId === vendor.id}
            {...actionsFor(vendor)}
          />
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {vendors.map((vendor) => (
          <VendorMobileCard
            key={vendor.id}
            vendor={vendor}
            loading={busyId === vendor.id}
            {...actionsFor(vendor)}
          />
        ))}
      </div>
    </>
  );
}

function VendorTableRow({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: VendorRowProps) {
  const { t } = useLanguage();

  return (
    <div className={`group grid min-h-[94px] ${GRID} items-center border-b border-[#eee8e4] px-5 py-3 transition last:border-b-0 hover:bg-[#fdfcfb]`}>
      {/* Vendor */}
      <div className="flex min-w-0 items-center gap-3.5">
        <VendorAvatar vendor={vendor} size="md" />

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#30251f]">
              {vendor.businessName ||
                t('admin.vendors.unnamedVendor')}
            </p>

            {vendor.status === "Approved" && (
              <span
                title={t("admin.vendors.approvedVendor")}
                className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 lg:inline-flex"
              >
                <Check size={9} strokeWidth={3} />
                {t('admin.vendors.verified')}
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-xs text-[#8b817b]">
            {vendor.contactEmail || t('admin.vendors.noEmail')}
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="flex min-w-0 items-center gap-2 pr-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7f3f0] text-[#9b7b67]">
          <MapPin size={14} />
        </div>

        <span className="truncate text-xs font-medium text-[#665b55]">
          {vendor.location || t('admin.vendors.notSpecified')}
        </span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={vendor.status} />
      </div>

      {/* Rating */}
      <div>
        <Rating
          value={vendor.averageRating}
          count={vendor.reviewsCount}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <VendorInlineActions
          vendor={vendor}
          loading={loading}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      </div>
    </div>
  );
}

function VendorMobileCard({
  vendor,
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
}: VendorRowProps) {
  const { t } = useLanguage();

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#e9e1dc] bg-white shadow-[0_8px_26px_rgba(48,37,31,0.035)]">
      <div className="p-4">
        <div className="flex items-start gap-3.5">
          <VendorAvatar vendor={vendor} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[#30251f]">
                  {vendor.businessName ||
                    t('admin.vendors.unnamedVendor')}
                </h3>

                <p className="mt-1 truncate text-xs text-[#8b817b]">
                  {vendor.contactEmail ||
                    t('admin.vendors.noEmail')}
                </p>
              </div>

              <StatusBadge status={vendor.status} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-[#faf8f6] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a09791]">
              {t('admin.vendors.rating')}
            </p>

            <div className="mt-1.5">
              <Rating
                value={vendor.averageRating}
                count={vendor.reviewsCount}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#faf8f6] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a09791]">
              {t('admin.vendors.location')}
            </p>

            <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
              <MapPin
                size={13}
                className="shrink-0 text-[#9b7b67]"
              />

              <span className="truncate text-xs font-medium text-[#665b55]">
                {vendor.location ||
                  t('admin.vendors.notSpecified')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-[#f0ebe8] pt-3">
          <VendorInlineActions
            vendor={vendor}
            loading={loading}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onReject={onReject}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        </div>
      </div>
    </article>
  );
}
