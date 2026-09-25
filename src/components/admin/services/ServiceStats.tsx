"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ServiceStats({
  stats,
}: {
  stats: { total: number; approved: number; pending: number; rejected: number };
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label={t("admin.services.total")} value={stats.total} />

      <StatCard label={t("admin.services.approved")} value={stats.approved} />

      <StatCard label={t("admin.services.pending")} value={stats.pending} />

      <StatCard label={t("admin.services.rejected")} value={stats.rejected} />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
