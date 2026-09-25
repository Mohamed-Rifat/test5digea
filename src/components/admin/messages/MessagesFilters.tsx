"use client";

import Select from "@/components/shared/Select";
import { useLanguage } from "@/context/LanguageContext";

import type { AdminMessagesState } from "./useAdminMessages";

/** Type / handled-status filters. */
export function MessagesFilters({ inbox }: { inbox: AdminMessagesState }) {
  const { t } = useLanguage();
  const {
    typeOptions,
    handledOptions,
    type,
    setType,
    isHandled,
    setIsHandled,
    resetToFirstPage,
  } = inbox;

  return (
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
  );
}
