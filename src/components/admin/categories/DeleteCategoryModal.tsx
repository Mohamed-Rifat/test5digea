"use client";

import { Loader2, Trash2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/types/category";

interface DeleteCategoryModalProps {
  category: Category;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

export function DeleteCategoryModal({
  category,
  onConfirm,
  onClose,
  loading,
  error: actionError,
}: DeleteCategoryModalProps) {
  const { t, localize } = useLanguage();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#211914]/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0ee] text-[#b45e57]">
          <Trash2 size={20} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-[#30251f]">
          {t("admin.categories.deleteConfirmTitle")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#8f8179]">
          {t("admin.categories.deleteWarning")}{" "}
          <strong className="font-semibold text-[#50423a]">
            {localize(category.name)}
          </strong>
          {t("admin.categories.deleteWarningSuffix")}
        </p>

        {actionError && (
          <div className="mt-5 rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
            <p className="text-xs font-medium text-[#a34f49]">{actionError}</p>
          </div>
        )}

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#e5dcd6] px-5 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4] disabled:opacity-50"
          >
            {t("admin.categories.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b85e57] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#a9514b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}

            {loading
              ? t("admin.categories.deleting")
              : t("admin.categories.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
