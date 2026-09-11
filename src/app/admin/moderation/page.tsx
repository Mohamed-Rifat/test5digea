"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  RotateCcw,
  Star,
  Store,
} from "lucide-react";

import Select from "@/components/shared/Select";
import { useModerationQueue } from "@/features/moderation/hooks/useModerationQueue";
import { formatDate } from "@/lib/format";
import {
  ModerationEntityType,
  ModerationStatus,
} from "@/types/moderation";
import type {
  GetModerationQueueParams,
  ModerationQueueItem,
} from "@/types/moderation";

const entityTypeOptions = [
  { value: "", label: "All types" },
  { value: String(ModerationEntityType.Vendor), label: "Vendors" },
  { value: String(ModerationEntityType.Service), label: "Services" },
  { value: String(ModerationEntityType.Review), label: "Reviews" },
];

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: String(ModerationStatus.Pending), label: "Pending" },
  { value: String(ModerationStatus.Approved), label: "Approved" },
  { value: String(ModerationStatus.Rejected), label: "Rejected" },
];

const entityMeta: Record<
  ModerationEntityType,
  { label: string; icon: typeof Store; className: string }
> = {
  [ModerationEntityType.Vendor]: {
    label: "Vendor",
    icon: Store,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },
  [ModerationEntityType.Service]: {
    label: "Service",
    icon: BriefcaseBusiness,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },
  [ModerationEntityType.Review]: {
    label: "Review",
    icon: Star,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },
};

const statusStyles: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "bg-amber-50 text-amber-700",
  [ModerationStatus.Approved]: "bg-emerald-50 text-emerald-700",
  [ModerationStatus.Rejected]: "bg-red-50 text-red-600",
};

const statusLabels: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "Pending",
  [ModerationStatus.Approved]: "Approved",
  [ModerationStatus.Rejected]: "Rejected",
};

// Where "Review" should send the admin — the moderation queue is read-only
// (no approve/reject endpoint of its own), so it links out to the page
// that already has the real actions for that entity type. Reviews don't
// have an individual admin page yet, only the list at /admin/reviews.
function reviewHref(item: ModerationQueueItem): string {
  switch (item.entityType) {
    case ModerationEntityType.Vendor:
      return `/admin/vendors/${item.entityId}`;
    case ModerationEntityType.Service:
      return `/admin/services/${item.entityId}`;
    case ModerationEntityType.Review:
    default:
      return "/admin/reviews";
  }
}

export default function AdminModerationPage() {
  const [vendorId, setVendorId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const params: GetModerationQueueParams = {
    vendorId: vendorId.trim() || undefined,
    entityType: entityType
      ? (Number(entityType) as ModerationEntityType)
      : undefined,
    status: status ? (Number(status) as ModerationStatus) : undefined,
    dateFrom: dateFrom
      ? new Date(dateFrom).toISOString()
      : undefined,
    dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
  };

  const { items, loading, error, refetch } = useModerationQueue(params);

  const hasFilters =
    !!vendorId || !!entityType || !!status || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setVendorId("");
    setEntityType("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="mx-auto">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47e43]">
            <ClipboardList size={13} />
            Everything awaiting a decision
          </p>

          <h1 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            Moderation Queue
          </h1>

          <p className="mt-1 text-sm text-[#958980]">
            Vendors, services and reviews in one place — pick a filter
            or open an item to approve or reject it.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="flex shrink-0 items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-4 py-2 text-xs font-semibold text-[#30251f] transition hover:border-[#b99a62] hover:bg-[#faf7f4]"
        >
          <RotateCcw size={13} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 rounded-2xl border border-[#eee7e1] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9b8f86]">
            Vendor ID
          </label>
          <input
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder="Paste a vendor ID"
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition placeholder:text-[#a99d94] focus:border-[#30251f]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9b8f86]">
            Type
          </label>
          <Select
            value={entityType}
            onChange={setEntityType}
            options={entityTypeOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9b8f86]">
            Status
          </label>
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9b8f86]">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9b8f86]">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-xl border border-[#e3d9d1] bg-[#fcfaf8] px-3 py-2.5 text-sm text-[#30251f] outline-none transition focus:border-[#30251f]"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mb-4 text-xs font-semibold text-[#a47e43] hover:underline"
        >
          Clear filters
        </button>
      )}

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee9]">
            <ClipboardList size={22} className="text-[#b99a62]" />
          </div>

          <p className="text-sm font-medium text-[#30251f]">
            Nothing in the queue
          </p>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
            {hasFilters
              ? "No items match these filters."
              : "There's nothing waiting on a decision right now."}
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-2.5">
          {items.map((item) => {
            const meta = entityMeta[item.entityType] ?? {
              label: "Item",
              icon: ClipboardList,
              className: "bg-[#f0e9e0] text-[#a47e43]",
            };

            const Icon = meta.icon;

            return (
              <Link
                key={`${item.entityType}-${item.entityId}`}
                href={reviewHref(item)}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#eee7e1] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#dccab8] hover:shadow-[0_10px_28px_rgba(48,37,31,0.07)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
                  >
                    <Icon size={16} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#30251f]">
                        {item.title}
                      </p>

                      <span className="shrink-0 rounded-full bg-[#f4eee9] px-2 py-0.5 text-[10px] font-medium text-[#766d67]">
                        {meta.label}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-[#9b8f86]">
                      {item.vendorBusinessName} ·{" "}
                      {formatDate(item.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusStyles[item.status] ??
                      "bg-[#f4eee9] text-[#766d67]"
                    }`}
                  >
                    {statusLabels[item.status] ?? "Unknown"}
                  </span>

                  <ArrowUpRight size={15} className="text-[#a47e43]" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
