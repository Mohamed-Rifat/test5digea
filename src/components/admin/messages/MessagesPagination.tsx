"use client";

import Pagination from "@/components/shared/Pagination";
import { useLanguage } from "@/context/LanguageContext";

import type { AdminMessagesState } from "./useAdminMessages";

/** Pager and total count. */
export function MessagesPagination({ inbox }: { inbox: AdminMessagesState }) {
  const { t } = useLanguage();
  const { page, setPage, totalCount, totalPages, loading, error } = inbox;

  return (
    <>
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
    </>
  );
}
