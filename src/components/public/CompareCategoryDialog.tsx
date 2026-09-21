"use client";

import { useEffect } from "react";
import { GitCompare, Tag, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

interface CompareCategoryDialogProps {
  vendorName: string;
  options: { id: string; name: string }[];
  onPick: (categoryId: string) => void;
  onClose: () => void;
}

/**
 * Shown when the vendor picked for comparison works in several categories:
 * vendors are compared inside one category, so the user chooses which.
 */
export default function CompareCategoryDialog({
  vendorName,
  options,
  onPick,
  onClose,
}: CompareCategoryDialogProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-[#30251f]/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-category-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(48,37,31,0.35)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f9f1e9] text-[#a47e43]">
              <GitCompare size={17} />
            </span>
            <div className="min-w-0">
              <h2
                id="compare-category-title"
                className="font-serif text-xl font-light text-[#30251f]"
              >
                {t("vendors.list.pickCategoryTitle")}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#81746d]">
                {t("vendors.list.pickCategoryText", { vendor: vendorName })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9b8f86] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onPick(option.id)}
              className="flex items-center gap-2 rounded-xl border border-[#eee7e1] bg-white px-3.5 py-3 text-start text-sm font-medium text-[#5f544d] transition hover:border-[#a47e43] hover:bg-[#f9f1e9] hover:text-[#8c6a3c]"
            >
              <Tag size={13} className="shrink-0 text-[#b99a62]" />
              <span className="truncate">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
