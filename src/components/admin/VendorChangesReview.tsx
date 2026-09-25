"use client";

import { Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getChangedFields } from "@/lib/vendor-normalizer";
import type { TranslationKey } from "@/locales";
import type { Vendor, VendorProfileData } from "@/types/vendor";

// ================================
// Diff rows
// ================================

// One row per changed profile field, except latitude / longitude which are
// shown together as a single "Coordinates" row.
export type DiffRow =
  | Exclude<keyof VendorProfileData, "latitude" | "longitude">
  | "coordinates";

export const ROW_LABEL_KEYS: Record<DiffRow, TranslationKey> = {
  businessName: "admin.vendorDetails.fields.businessName",
  slogan: "admin.vendorDetails.fields.slogan",
  bio: "admin.vendorDetails.fields.bio",
  profileImageUrl: "admin.vendorDetails.fields.profileImage",
  location: "admin.vendorDetails.fields.location",
  coordinates: "admin.vendorDetails.fields.coordinates",
  contactPhone: "admin.vendorDetails.fields.contactPhone",
  contactEmail: "admin.vendorDetails.fields.businessEmail",
  socialLinksJson: "admin.vendorDetails.fields.socialLinks",
  workingHoursJson: "admin.vendorDetails.fields.workingHours",
};

/** Fields the vendor changed in their pending (unapproved) edit. */
export const getDiffRows = (vendor: Vendor | null): DiffRow[] => {
  if (!vendor?.pendingChanges) return [];

  const rows: DiffRow[] = [];

  getChangedFields(vendor, vendor.pendingChanges).forEach((field) => {
    if (field === "latitude" || field === "longitude") {
      if (!rows.includes("coordinates")) rows.push("coordinates");
      return;
    }

    rows.push(field);
  });

  return rows;
};

const DAY_KEYS = [
  ["sat", "vendor.profile.days.sat"],
  ["sun", "vendor.profile.days.sun"],
  ["mon", "vendor.profile.days.mon"],
  ["tue", "vendor.profile.days.tue"],
  ["wed", "vendor.profile.days.wed"],
  ["thu", "vendor.profile.days.thu"],
  ["fri", "vendor.profile.days.fri"],
] as const satisfies readonly (readonly [string, TranslationKey])[];

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  website: "Website",
};

const parseJson = (value: string): Record<string, string> => {
  try {
    const parsed = value ? JSON.parse(value) : {};

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

// ================================
// Field value renderer
// ================================

function FieldValue({
  row,
  data,
}: {
  row: DiffRow;
  data: VendorProfileData;
}) {
  const { t } = useLanguage();

  const empty = (
    <span className="text-xs italic text-[#b0a59d]">
      {t("admin.vendorDetails.empty")}
    </span>
  );

  switch (row) {
    case "profileImageUrl":
      return data.profileImageUrl ? (
        <img
          loading="lazy"
          decoding="async"
          src={data.profileImageUrl}
          alt=""
          className="h-20 w-20 rounded-xl object-cover"
        />
      ) : (
        empty
      );

    case "coordinates":
      return data.latitude || data.longitude ? (
        <span dir="ltr" className="text-sm">
          {data.latitude}, {data.longitude}
        </span>
      ) : (
        empty
      );

    case "socialLinksJson": {
      const links = Object.entries(parseJson(data.socialLinksJson)).filter(
        ([, url]) => !!url
      );

      return links.length ? (
        <ul className="space-y-1 text-sm">
          {links.map(([platform, url]) => (
            <li key={platform} className="flex flex-wrap gap-x-2">
              <span className="font-medium text-[#5b4f48]">
                {SOCIAL_LABELS[platform] ?? platform}
              </span>
              <span dir="ltr" className="break-all text-[#7d716a]">
                {url}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        empty
      );
    }

    case "workingHoursJson": {
      const hours = parseJson(data.workingHoursJson);
      const days = DAY_KEYS.filter(([key]) => !!hours[key]);

      return days.length ? (
        <ul className="space-y-1 text-sm">
          {days.map(([key, labelKey]) => (
            <li key={key} className="flex flex-wrap gap-x-2">
              <span className="font-medium text-[#5b4f48]">{t(labelKey)}</span>
              <span dir="ltr" className="text-[#7d716a]">
                {hours[key]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        empty
      );
    }

    default: {
      const value = data[row];

      return value ? (
        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
          {value}
        </p>
      ) : (
        empty
      );
    }
  }
}

// ================================
// Field-by-field diff (current vs proposed)
// ================================

export function VendorChangesDiff({
  vendor,
  rows,
}: {
  vendor: Vendor;
  rows?: DiffRow[];
}) {
  const { t } = useLanguage();

  const diffRows = rows ?? getDiffRows(vendor);

  if (!vendor.pendingChanges || diffRows.length === 0) return null;

  return (
    <div className="divide-y divide-[#f1ebe6]">
      {diffRows.map((row) => (
        <div key={row} className="p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide rtl:tracking-normal text-[#a09791]">
            {t(ROW_LABEL_KEYS[row])}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[#eee8e4] bg-[#faf8f6] p-3.5 text-[#8a7f78]">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider rtl:tracking-normal text-[#b0a59d]">
                {t("admin.vendorDetails.review.current")}
              </p>

              <FieldValue row={row} data={vendor} />
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-[#30251f]">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider rtl:tracking-normal text-emerald-700">
                {t("admin.vendorDetails.review.proposed")}
              </p>

              <FieldValue row={row} data={vendor.pendingChanges as VendorProfileData} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ================================
// Reject dialog (reason is required — the vendor sees it)
// ================================

export function RejectReasonDialog({
  open,
  title,
  reason,
  onReasonChange,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  reason: string;
  onReasonChange: (value: string) => void;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-[#30251f]">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-[#958980]">
          {t("admin.vendorDetails.review.modal.text")}
        </p>

        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          disabled={loading}
          placeholder={t("admin.vendorDetails.review.modal.placeholder")}
          rows={4}
          className="mt-3 w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#a99d94] focus:border-[#30251f]"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:bg-[#faf7f4] disabled:opacity-60"
          >
            {t("admin.vendorDetails.review.modal.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !reason.trim()}
            className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <X size={13} />
            )}
            {t("admin.vendorDetails.review.modal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
