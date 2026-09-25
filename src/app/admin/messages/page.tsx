"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ExternalLink,
  HeartHandshake,
  Inbox,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  Store,
  Tags,
  UserPlus,
} from "lucide-react";

import Select from "@/components/shared/Select";
import Pagination from "@/components/shared/Pagination";
import { useContactMessagesAdmin } from "@/features/contactMessages/hooks/useContactMessagesAdmin";
import {
  ContactMessageType,
  parseMessageDetails,
  type ContactMessageAdminItem,
  type ExternalVendorReferralDetails,
  type VendorApplicationDetails,
  type VendorCategoryRequestDetails,
} from "@/features/contactMessages/types";
import { findGovernorate, governorateLabel } from "@/lib/governorates";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { localizeText } from "@/lib/bilingual";
import { useToast } from "@/components/providers/ToastProvider";
import { LANGUAGE_DATE_LOCALE, type TranslationKey } from "@/locales";

const PAGE_SIZE = 10;

const typeMeta: Record<
  ContactMessageType,
  { labelKey: TranslationKey; icon: typeof Store; className: string }
> = {
  [ContactMessageType.ExternalVendorReferral]: {
    labelKey: "admin.messages.types.externalVendor",
    icon: HeartHandshake,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [ContactMessageType.VendorApplication]: {
    labelKey: "admin.messages.types.vendorApplication",
    icon: Store,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },
  [ContactMessageType.VendorCategoryRequest]: {
    labelKey: "admin.messages.types.categoryRequest",
    icon: Tags,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },
};

export default function AdminContactMessagesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const typeOptions = [
    { value: "", label: t("admin.messages.filters.allTypes") },
    {
      value: String(ContactMessageType.ExternalVendorReferral),
      label: t("admin.messages.types.externalVendor"),
    },
    {
      value: String(ContactMessageType.VendorApplication),
      label: t("admin.messages.types.vendorApplication"),
    },
    {
      value: String(ContactMessageType.VendorCategoryRequest),
      label: t("admin.messages.types.categoryRequest"),
    },
  ];

  const handledOptions = [
    { value: "", label: t("admin.messages.filters.allStatuses") },
    { value: "false", label: t("admin.messages.filters.unhandled") },
    { value: "true", label: t("admin.messages.filters.handled") },
  ];

  const [type, setType] = useState("");
  const [isHandled, setIsHandled] = useState("");
  const [page, setPage] = useState(1);

  const { items, totalCount, totalPages, loading, error, handlingId, markHandled, refetch } =
    useContactMessagesAdmin({
      type: type ? (Number(type) as ContactMessageType) : undefined,
      isHandled: isHandled ? isHandled === "true" : undefined,
      page,
      pageSize: PAGE_SIZE,
    });

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  const handleMarkHandled = async (item: ContactMessageAdminItem) => {
    const ok = await markHandled(item.id);

    showMessage(
      ok ? "success" : "error",
      ok
        ? t("admin.messages.messages.markedHandled")
        : t("admin.messages.messages.markFailed")
    );
  };

  const resetToFirstPage = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="mx-auto">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7d]">
            {t("admin.messages.eyebrow")}
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
            {t("admin.messages.title")}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8a7d75]">
            {t("admin.messages.subtitle")}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTERS */}
      {/* ========================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#eee7e1] bg-white p-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a08e82]">
            {t("admin.messages.filters.type")}
          </label>
          <Select
            value={type}
            onChange={resetToFirstPage(setType)}
            options={typeOptions}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a08e82]">
            {t("admin.messages.filters.status")}
          </label>
          <Select
            value={isHandled}
            onChange={resetToFirstPage(setIsHandled)}
            options={handledOptions}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* LIST */}
      {/* ========================================================= */}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={26} className="animate-spin text-[#ae7b40]" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 py-16 text-center">
          <AlertCircle size={24} className="text-red-500" />
          <p className="text-sm text-red-600">
            {t("admin.messages.messages.loadFailed")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            {t("admin.messages.retry")}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#e4dbd0] bg-[#faf7f4] py-16 text-center">
          <Inbox size={26} className="text-[#c2b6ac]" />
          <p className="text-sm text-[#8a7d75]">
            {t("admin.messages.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const meta = typeMeta[item.type];
            const Icon = meta?.icon ?? Mail;
            const isActing = handlingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#eee7e1] bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        meta?.className ?? "bg-[#f4eee9] text-[#766d67]"
                      }`}
                    >
                      <Icon size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#30251f]">
                          {item.senderName || t("admin.messages.unknownSender")}
                        </p>

                        <span className="rounded-full bg-[#f4eee9] px-2 py-0.5 text-[10px] font-medium text-[#766d67]">
                          {meta ? t(meta.labelKey) : t("admin.messages.types.unknown")}
                        </span>

                        {!item.isHandled && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            {t("admin.messages.filters.unhandled")}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9b8f86]">
                        {item.senderEmail && (
                          <span className="inline-flex items-center gap-1">
                            <Mail size={11} /> {item.senderEmail}
                          </span>
                        )}
                        {item.senderPhone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={11} /> {item.senderPhone}
                          </span>
                        )}
                        <span>{formatDateTime(item.createdAt, dateLocale)}</span>
                      </div>

                    </div>
                  </div>

                  {!item.isHandled && (
                    <button
                      type="button"
                      disabled={isActing}
                      onClick={() => handleMarkHandled(item)}
                      className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isActing ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Check size={13} />
                      )}
                      {t("admin.messages.markHandled")}
                    </button>
                  )}
                </div>

                <div className="mt-3 rounded-xl bg-[#faf7f4] p-3">
                  <MessageDetails item={item} language={language} t={t} />
                </div>

                <MessageActions item={item} t={t} />
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* PAGINATION */}
      {/* ========================================================= */}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      {!loading && !error && totalCount > 0 && (
        <p className="mt-3 text-center text-xs text-[#a99d94]">
          {t("admin.messages.totalCount", { count: totalCount })}
        </p>
      )}
    </div>
  );
}

// =========================================================
// Per-type detail rendering — the JSON payload each form
// encodes into `message` is decoded here into a small,
// readable summary instead of raw text.
// =========================================================

function MessageDetails({
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
    const details = parseMessageDetails<ExternalVendorReferralDetails>(item.message);

    if (!details) return <RawMessage message={item.message} />;

    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-[#5f544d] sm:grid-cols-2">
        {details.categoryName && (
          <Row label={t("admin.messages.fields.category")} value={localize(details.categoryName)} />
        )}
        <Row label={t("admin.messages.fields.externalVendorName")} value={details.vendorName} />
        {details.vendorPhone && (
          <Row label={t("admin.messages.fields.phone")} value={details.vendorPhone} />
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
        <Row label={t("admin.messages.fields.brandName")} value={details.brandName} />
        <Row label={t("admin.messages.fields.governorate")} value={governorateText} />
        <div className="sm:col-span-2">
          <span className="font-semibold text-[#30251f]">
            {t("admin.messages.fields.categories")}:{" "}
          </span>
          {details.categoryNames && details.categoryNames.length > 0
            ? details.categoryNames.map((n) => localize(n)).join(language === "ar" ? "، " : ", ")
            : details.categoryIds.join(", ")}
        </div>
      </dl>
    );
  }

  if (item.type === ContactMessageType.VendorCategoryRequest) {
    const details = parseMessageDetails<VendorCategoryRequestDetails>(item.message);

    if (!details) return <RawMessage message={item.message} />;

    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-[#5f544d] sm:grid-cols-2">
        <Row label={t("admin.messages.fields.category")} value={localize(details.categoryName)} />
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

// =========================================================
// Per-type quick actions — skip the "go find the right vendor /
// category / field" step and land the admin ready to finish the job
// in one more click.
// =========================================================

function MessageActions({
  item,
  t,
}: {
  item: ContactMessageAdminItem;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  if (item.type === ContactMessageType.VendorCategoryRequest && item.vendorId) {
    const details = parseMessageDetails<VendorCategoryRequestDetails>(item.message);
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
  return <p className="whitespace-pre-wrap text-xs text-[#5f544d]">{message}</p>;
}
