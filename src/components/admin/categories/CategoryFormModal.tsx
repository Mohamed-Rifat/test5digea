"use client";

import type { FormEvent } from "react";
import { Languages, Loader2, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import BilingualField from "@/components/admin/BilingualField";
import IconPicker from "@/components/admin/IconPicker";
import type { BilingualText } from "@/lib/bilingual";

interface CategoryFormModalProps {
  mode: "create" | "edit";
  name: BilingualText;
  onNameChange: (value: BilingualText) => void;
  description: BilingualText;
  onDescriptionChange: (value: BilingualText) => void;
  iconUrl: string;
  onIconUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

/** Create / edit category dialog (bilingual name + description + icon). */
export function CategoryFormModal({
  mode,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  iconUrl,
  onIconUrlChange,
  onSubmit,
  onClose,
  loading,
  error: actionError,
}: CategoryFormModalProps) {
  const { t } = useLanguage();
  const isCreate = mode === "create";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#211914]/45 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee7e2] bg-white px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a18d7f]">
              {t("admin.categories.management")}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#30251f]">
              {isCreate
                ? t("admin.categories.createTitle")
                : t("admin.categories.editTitle")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2.5 text-[#9c8e85] transition hover:bg-[#f7f2ef] hover:text-[#30251f] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <BilingualField
            idPrefix="category-name"
            label={t("admin.categories.name")}
            value={name}
            onChange={onNameChange}
            placeholders={{
              ar: t("admin.categories.namePlaceholderAr"),
              en: t("admin.categories.namePlaceholderEn"),
            }}
            required
            disabled={loading}
          />

          <BilingualField
            idPrefix="category-description"
            label={t("admin.categories.description")}
            value={description}
            onChange={onDescriptionChange}
            placeholders={{
              ar: t("admin.categories.descriptionPlaceholderAr"),
              en: t("admin.categories.descriptionPlaceholderEn"),
            }}
            multiline
            disabled={loading}
          />

          <p className="-mt-2 flex items-start gap-2 rounded-xl bg-[#faf5ef] px-3.5 py-2.5 text-[11px] leading-5 text-[#8a7a6e]">
            <Languages size={14} className="mt-0.5 shrink-0 text-[#a47e43]" />
            {t("admin.categories.bilingualHint")}
          </p>

          <div>
            <p className="mb-2 block text-xs font-semibold text-[#55483f]">
              {t("admin.categories.iconUrl")}
              <span className="ms-0.5 text-red-500">*</span>
            </p>
            <IconPicker
              value={iconUrl}
              onChange={onIconUrlChange}
              hints={[name.ar, name.en]}
              disabled={loading}
            />
          </div>

          {actionError && (
            <div className="rounded-xl border border-[#f1d1ce] bg-[#fff7f6] px-4 py-3">
              <p className="text-xs font-medium text-[#a34f49]">
                {actionError}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-[#eee7e2] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#e5dcd6] px-5 py-2.5 text-sm font-medium text-[#665951] transition hover:bg-[#faf7f4] disabled:opacity-50"
            >
              {t("admin.categories.cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#43342c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}

              {isCreate
                ? loading
                  ? t("admin.categories.creating")
                  : t("admin.categories.createTitle")
                : loading
                  ? t("admin.categories.saving")
                  : t("admin.categories.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
