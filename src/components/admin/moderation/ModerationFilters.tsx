"use client";

import Select from "@/components/shared/Select";
import { useLanguage } from "@/context/LanguageContext";

import { TextField } from "@/components/ui";
import type { ModerationQueueState } from "./useModerationPage";

/** Vendor id / type / status / date filters. */
export function ModerationFilters({ queue }: { queue: ModerationQueueState }) {
  const { t } = useLanguage();
  const {
    vendorId,
    setVendorId,
    entityType,
    setEntityType,
    entityTypeOptions,
    status,
    setStatus,
    statusOptions,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    hasFilters,
    clearFilters,
  } = queue;

  return (
    <>
      <div className="mb-6 grid items-end gap-5 rounded-2xl border border-[#eee7e1] bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <TextField
          label={t("admin.moderation.filters.vendorId")}
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          placeholder={t("admin.moderation.filters.vendorIdPlaceholder")}
          size="sm"
        />

        <div>
          <p className="mb-0.5 text-xs text-[#a59a92]">
            {t("admin.moderation.filters.type")}
          </p>
          <Select
            value={entityType}
            onChange={setEntityType}
            options={entityTypeOptions}
          />
        </div>

        <div>
          <p className="mb-0.5 text-xs text-[#a59a92]">
            {t("admin.moderation.filters.status")}
          </p>
          <Select value={status} onChange={setStatus} options={statusOptions} />
        </div>

        <TextField
          type="date"
          label={t("admin.moderation.filters.from")}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          size="sm"
        />

        <TextField
          type="date"
          label={t("admin.moderation.filters.to")}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          size="sm"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mb-4 text-xs font-semibold text-[#a47e43] hover:underline"
        >
          {t("admin.moderation.filters.clear")}
        </button>
      )}
    </>
  );
}
