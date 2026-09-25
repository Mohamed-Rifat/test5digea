"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles, UserPlus } from "lucide-react";
import {
  ContactMessageType,
  parseMessageDetails,
  type ContactMessageAdminItem,
  type ExternalVendorReferralDetails,
  type VendorApplicationDetails,
  type VendorCategoryRequestDetails,
} from "@/features/contactMessages/types";
import { findGovernorate, governorateLabel } from "@/lib/governorates";
import { localizeText } from "@/lib/bilingual";
import type { TranslationKey } from "@/locales";

export function MessageDetails({
  item,
  language,
  t,
}: {
  item: ContactMessageAdminItem;
  language: "ar" | "en";
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const localize = (value: string | null | undefined) =>
    localizeText(value, language);
  if (item.type === ContactMessageType.ExternalVendorReferral) {
    const details = parseMessageDetails<ExternalVendorReferralDetails>(
      item.message,
    );

    if (!details) return <RawMessage message={item.message} />;

    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-[#5f544d] sm:grid-cols-2">
        {details.categoryName && (
          <Row
            label={t("admin.messages.fields.category")}
            value={localize(details.categoryName)}
          />
        )}
        <Row
          label={t("admin.messages.fields.externalVendorName")}
          value={details.vendorName}
        />
        {details.vendorPhone && (
          <Row
            label={t("admin.messages.fields.phone")}
            value={details.vendorPhone}
          />
        )}
        {details.vendorLink && (
          <div className="sm:col-span-2">
            <span className="font-semibold text-[#30251f]">
              {t("admin.messages.fields.link")}:{" "}
            </span>
            <a
              href={details.vendorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#a47e43] hover:underline"
            >
              {details.vendorLink}
              <ExternalLink size={11} />
            </a>
          </div>
        )}
      </dl>
    );
  }

  if (item.type === ContactMessageType.VendorApplication) {
    const details = parseMessageDetails<VendorApplicationDetails>(item.message);

    if (!details) return <RawMessage message={item.message} />;

    const governorate = findGovernorate(details.governorate);
    const governorateText = governorate
      ? governorateLabel(governorate, language)
      : details.governorate;

    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-[#5f544d] sm:grid-cols-2">
        <Row
          label={t("admin.messages.fields.brandName")}
          value={details.brandName}
        />
        <Row
          label={t("admin.messages.fields.governorate")}
          value={governorateText}
        />
        <div className="sm:col-span-2">
          <span className="font-semibold text-[#30251f]">
            {t("admin.messages.fields.categories")}:{" "}
          </span>
          {details.categoryNames && details.categoryNames.length > 0
            ? details.categoryNames
                .map((n) => localize(n))
                .join(language === "ar" ? "، " : ", ")
            : details.categoryIds.join(", ")}
        </div>
      </dl>
    );
  }

  if (item.type === ContactMessageType.VendorCategoryRequest) {
    const details = parseMessageDetails<VendorCategoryRequestDetails>(
      item.message,
    );

    if (!details) return <RawMessage message={item.message} />;

    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-[#5f544d] sm:grid-cols-2">
        <Row
          label={t("admin.messages.fields.category")}
          value={localize(details.categoryName)}
        />
        {details.note && (
          <div className="sm:col-span-2">
            <span className="font-semibold text-[#30251f]">
              {t("admin.messages.fields.note")}:{" "}
            </span>
            <span className="whitespace-pre-wrap">{details.note}</span>
          </div>
        )}
      </dl>
    );
  }

  return <RawMessage message={item.message} />;
}

export function MessageActions({
  item,
  t,
}: {
  item: ContactMessageAdminItem;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  if (item.type === ContactMessageType.VendorCategoryRequest && item.vendorId) {
    const details = parseMessageDetails<VendorCategoryRequestDetails>(
      item.message,
    );
    const href = details?.categoryId
      ? `/admin/vendors/${item.vendorId}?highlightCategory=${details.categoryId}`
      : `/admin/vendors/${item.vendorId}`;

    return (
      <div className="mt-3">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#30251f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#40332c]"
        >
          {t("admin.messages.actions.openAndActivateCategory")}
          <ArrowUpRight size={13} className="rtl:-scale-x-100" />
        </Link>
      </div>
    );
  }

  if (item.type === ContactMessageType.VendorApplication) {
    const details = parseMessageDetails<VendorApplicationDetails>(item.message);

    const quickParams = new URLSearchParams({
      prefillName: item.senderName || "",
      prefillEmail: item.senderEmail || "",
    });

    const fullParams = new URLSearchParams({
      prefillName: item.senderName || "",
      prefillEmail: item.senderEmail || "",
      prefillBusinessName: details?.brandName || "",
    });

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/admin/vendors?${quickParams.toString()}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#dcd2c9] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f544d] transition hover:border-[#a47e43] hover:text-[#a47e43]"
        >
          <UserPlus size={13} />
          {t("admin.messages.actions.quickRegister")}
        </Link>

        <Link
          href={`/admin/vendors?${fullParams.toString()}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#a47e43] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#8f6b37]"
        >
          <Sparkles size={13} />
          {t("admin.messages.actions.useAllData")}
        </Link>
      </div>
    );
  }

  return null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-[#30251f]">{label}: </span>
      {value}
    </div>
  );
}

function RawMessage({ message }: { message: string }) {
  return (
    <p className="whitespace-pre-wrap text-xs text-[#5f544d]">{message}</p>
  );
}
