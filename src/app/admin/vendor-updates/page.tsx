"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  FilePenLine,
  Loader2,
  RotateCcw,
  ArrowUpRight,
  X,
} from "lucide-react";

import {
  getDiffRows,
  RejectReasonDialog,
  ROW_LABEL_KEYS,
  VendorChangesDiff,
} from "@/components/admin/VendorChangesReview";
import { useVendorsWithPendingChanges } from "@/features/vendors/hooks/useVendorsWithPendingChanges";
import { approveVendor, rejectVendor } from "@/features/vendors/api";
import { getApiErrorMessage } from "@/lib/error";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import type { Vendor } from "@/types/vendor";

export default function AdminVendorUpdatesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = LANGUAGE_DATE_LOCALE[language];

  const { vendors, loading, error, progress, failedCount, refetch, remove } =
    useVendorsWithPendingChanges();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<{
    id: string;
    action: "approve" | "reject";
  } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Vendor | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const showMessage = (type: "success" | "error", text: string) => {
    toast(text, type);
  };

  const handleApprove = async (vendor: Vendor) => {
    try {
      setBusy({ id: vendor.id, action: "approve" });

      await approveVendor(vendor.id);

      remove(vendor.id);
      setExpandedId((current) => (current === vendor.id ? null : current));
      showMessage("success", t("admin.vendorDetails.review.approvedChangesOk"));
    } catch (err: unknown) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed"))
      );
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    const reason = rejectReason.trim();

    if (!reason) {
      showMessage("error", t("admin.vendorDetails.review.modal.reasonRequired"));
      return;
    }

    try {
      setBusy({ id: rejectTarget.id, action: "reject" });

      await rejectVendor(rejectTarget.id, { reason });

      remove(rejectTarget.id);
      setExpandedId((current) =>
        current === rejectTarget.id ? null : current
      );
      setRejectTarget(null);
      setRejectReason("");
      showMessage("success", t("admin.vendorDetails.review.rejectedOk"));
    } catch (err: unknown) {
      showMessage(
        "error",
        getApiErrorMessage(err, t("admin.vendorDetails.review.actionFailed"))
      );
    } finally {
      setBusy(null);
    }
  };

  const scanning = loading && progress.total > 0;

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
            <FilePenLine size={13} />
            {t("admin.vendorUpdates.eyebrow")}
          </p>

          <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            {t("admin.vendorUpdates.title")}
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-[#958980]">
            {t("admin.vendorUpdates.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4] disabled:opacity-60"
        >
          <RotateCcw size={13} className={loading ? "animate-spin" : ""} />
          {t("admin.vendorUpdates.refresh")}
        </button>
      </div>

      {/* Status line: scan progress / count */}
      <div className="mb-4 flex min-h-6 flex-wrap items-center gap-3 text-xs text-[#8a7f78]">
        {scanning && (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={13} className="animate-spin text-[#a47e43]" />
            {t("admin.vendorUpdates.checking", {
              done: progress.done,
              total: progress.total,
            })}
          </span>
        )}

        {vendors.length > 0 && (
          <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
            {vendors.length === 1
              ? t("admin.vendorUpdates.awaitingOne")
              : t("admin.vendorUpdates.awaitingMany", { count: vendors.length })}
          </span>
        )}

        {!loading && failedCount > 0 && (
          <span className="inline-flex items-center gap-1.5 text-amber-700">
            <AlertCircle size={13} />
            {t("admin.vendorUpdates.partialWarning", { count: failedCount })}
          </span>
        )}
      </div>

      {/* Skeleton before the first result */}
      {loading && vendors.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {t("admin.vendorUpdates.loadFailed")}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && vendors.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={24} className="text-emerald-600" />
          </div>

          <p className="text-sm font-medium text-[#30251f]">
            {t("admin.vendorUpdates.emptyTitle")}
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
            {t("admin.vendorUpdates.emptyText")}
          </p>
        </div>
      )}

      {/* List */}
      {vendors.length > 0 && (
        <div className="space-y-3">
          {vendors.map((vendor) => {
            const rows = getDiffRows(vendor);
            const expanded = expandedId === vendor.id;
            const isBusy = busy?.id === vendor.id;

            return (
              <section
                key={vendor.id}
                className="overflow-hidden rounded-2xl border border-[#eee7e1] bg-white shadow-[0_8px_30px_rgba(48,37,31,0.04)]"
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    {vendor.profileImageUrl ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={vendor.profileImageUrl}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f1ebe7] text-lg font-semibold text-[#806d60]">
                        {vendor.businessName?.charAt(0)?.toUpperCase() || "V"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#30251f] sm:text-base">
                        {vendor.businessName ||
                          t("admin.vendorDetails.unnamed")}
                      </p>

                      <p className="mt-0.5 text-xs text-[#9b8f86]">
                        {t("admin.vendorUpdates.lastEdited", {
                          date: formatDateTime(vendor.updatedAt, dateLocale),
                        })}
                      </p>

                      <div
                        className="mt-2 flex flex-wrap gap-1.5"
                        aria-label={t("admin.vendorUpdates.fieldsChanged")}
                      >
                        {rows.map((row) => (
                          <span
                            key={row}
                            className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700"
                          >
                            {t(ROW_LABEL_KEYS[row])}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#8b7464] transition hover:bg-[#faf7f4]"
                    >
                      {t("admin.vendorUpdates.openProfile")}
                      <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : vendor.id)
                      }
                      aria-expanded={expanded}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4dbd0] bg-white px-3 py-2 text-xs font-semibold text-[#30251f] transition hover:bg-[#faf7f4]"
                    >
                      {expanded
                        ? t("admin.vendorUpdates.hideChanges")
                        : t("admin.vendorUpdates.reviewChanges")}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectReason("");
                        setRejectTarget(vendor);
                      }}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <X size={14} />
                      {t("admin.vendorDetails.review.reject")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(vendor)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isBusy && busy?.action === "approve" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      {t("admin.vendorDetails.review.approve")}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-[#f1ebe6] bg-[#fdfcfb]">
                    <VendorChangesDiff vendor={vendor} rows={rows} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <RejectReasonDialog
        open={!!rejectTarget}
        title={t("admin.vendorDetails.review.modal.title")}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        loading={busy?.action === "reject"}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </div>
  );
}
