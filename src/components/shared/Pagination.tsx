"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Keeps the buttons in place but not clickable (e.g. while loading). */
  disabled?: boolean;
}

const MAX_VISIBLE_PAGES = 5;

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] bg-white text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#f9f1e9] disabled:opacity-40 disabled:hover:border-[#e4dbd0] disabled:hover:bg-white";

export default function Pagination({
  page,
  totalPages,
  onChange,
  disabled = false,
}: PaginationProps) {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  const visible = Math.min(totalPages, MAX_VISIBLE_PAGES);
  let first = 1;

  if (totalPages > MAX_VISIBLE_PAGES) {
    if (page <= 3) first = 1;
    else if (page >= totalPages - 2) first = totalPages - MAX_VISIBLE_PAGES + 1;
    else first = page - 2;
  }

  const pages = Array.from({ length: visible }, (_, i) => first + i);

  return (
    <nav
      aria-label={t("common.pagination.label")}
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        aria-label={t("common.pagination.previous")}
        className={arrowClass}
      >
        <ChevronLeft size={16} className="rtl:rotate-180" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            disabled={disabled}
            onClick={() => onChange(pageNumber)}
            aria-label={t("common.pagination.page", { page: pageNumber })}
            aria-current={page === pageNumber ? "page" : undefined}
            className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
              page === pageNumber
                ? "bg-[#30251f] text-white"
                : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#b99a62] hover:bg-[#f9f1e9]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        aria-label={t("common.pagination.next")}
        className={arrowClass}
      >
        <ChevronRight size={16} className="rtl:rotate-180" />
      </button>
    </nav>
  );
}
