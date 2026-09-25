"use client";

import type { ReactNode } from "react";
import { Ban, Check, Clock3, Store, UserCheck, UserX } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { VendorStatusFilter } from "./vendorStatus";

export interface VendorCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inactive: number;
  averageRating: number;
}

/** Clickable count cards that double as status filters. */
export default function VendorStatsCards({
  stats,
  statusFilter,
  onFilter,
}: {
  stats: VendorCounts;
  statusFilter: VendorStatusFilter;
  onFilter: (status: VendorStatusFilter) => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
      <InsightCard
        label={t('admin.vendors.total')}
        value={stats.total}
        icon={<Store size={18} />}
        tone="neutral"
        active={statusFilter === "all"}
        onClick={() => onFilter("all")}
        description={t("admin.vendors.allAccounts")}
      />

      <InsightCard
        label={t('admin.vendors.pending')}
        value={stats.pending}
        icon={<Clock3 size={18} />}
        tone="amber"
        active={statusFilter === "Pending"}
        onClick={() => onFilter("Pending")}
        description={t("admin.vendors.needAttention")}
      />

      <InsightCard
        label={t('admin.vendors.statusApproved')}
        value={stats.approved}
        icon={<UserCheck size={18} />}
        tone="emerald"
        active={statusFilter === "Approved"}
        onClick={() => onFilter("Approved")}
        description={t("admin.vendors.active")}
      />

      <InsightCard
        label={t('admin.vendors.statusRejected')}
        value={stats.rejected}
        icon={<UserX size={18} />}
        tone="red"
        active={statusFilter === "Rejected"}
        onClick={() => onFilter("Rejected")}
        description={t("admin.vendors.rejected")}
      />

      <InsightCard
        label={t('admin.vendors.statusInactive')}
        value={stats.inactive}
        icon={<Ban size={18} />}
        tone="gray"
        active={statusFilter === "Inactive"}
        onClick={() => onFilter("Inactive")}
        description={
          stats.averageRating > 0
            ? t('admin.vendors.avgRating', { value: stats.averageRating.toFixed(1) })
            : t('admin.vendors.noRatings')
        }
      />
    </section>
  );
}

function InsightCard({
  label,
  value,
  icon,
  description,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  description: string;
  tone: "neutral" | "amber" | "emerald" | "red" | "gray";
  active?: boolean;
  onClick?: () => void;
}) {
  const styles = {
    neutral: {
      icon: "bg-[#f3efec] text-[#846e60]",
      active:
        "border-[#cfc1b8] ring-2 ring-[#30251f]/10",
      accent: "bg-[#30251f]",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      active:
        "border-amber-300 ring-2 ring-amber-500/10",
      accent: "bg-amber-500",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      active:
        "border-emerald-300 ring-2 ring-emerald-500/10",
      accent: "bg-emerald-500",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      active:
        "border-red-300 ring-2 ring-red-500/10",
      accent: "bg-red-500",
    },

    gray: {
      icon: "bg-slate-100 text-slate-500",
      active:
        "border-slate-300 ring-2 ring-slate-400/10",
      accent: "bg-slate-400",
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-md border bg-white p-4 text-left shadow-[0_7px_25px_rgba(48,37,31,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(48,37,31,0.07)] ${
        active
          ? styles.active
          : "border-[#e9e1dc]"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-1 w-full opacity-0 transition group-hover:opacity-100 ${
          styles.accent
        } ${active ? "opacity-100" : ""}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>

        {active && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#30251f] text-white">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-2xl font-semibold tracking-[-0.04em] text-[#30251f]">
          {value}
        </p>

        <p className="mt-1 text-xs font-semibold text-[#5f544e]">
          {label}
        </p>

        <p className="mt-1 text-[11px] text-[#a09791]">
          {description}
        </p>
      </div>
    </button>
  );
}
