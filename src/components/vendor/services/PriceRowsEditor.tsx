"use client";

import { Plus, Trash2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextField } from "@/components/ui";

export interface PriceRow {
  label: string;
  /** "" while the vendor is still typing. */
  price: number | "";
}

interface PriceRowsEditorProps {
  rows: PriceRow[];
  onChange: (index: number, field: "label" | "price", value: string) => void;
  onRemove: (index: number) => void;
}

/** One line per price option: label + amount + remove button. */
export default function PriceRowsEditor({ rows, onChange, onRemove }: PriceRowsEditorProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-[#f0eae5] bg-[#fcfaf8] px-3 pb-3 pt-4 sm:flex-row sm:items-end sm:gap-4 sm:px-4"
        >
          <TextField
            label={t("vendor.services.form.labelPlaceholder")}
            value={row.label}
            onChange={(event) => onChange(index, "label", event.target.value)}
            size="sm"
            containerClassName="flex-1"
          />

          <div className="flex items-end gap-2">
            <TextField
              type="number"
              min={0}
              step="0.01"
              label={t("vendor.services.form.pricePlaceholder")}
              value={row.price}
              onChange={(event) => onChange(index, "price", event.target.value)}
              size="sm"
              containerClassName="w-full sm:w-40"
              endAdornment={
                <span className="text-xs text-[#9b8f86]">{t("common.currency")}</span>
              }
            />

            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                title={t("vendor.services.form.removePrice")}
                aria-label={t("vendor.services.form.removePrice")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e3d9d1] text-[#9a5555] transition hover:border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Small "+ Add price" text button used above a {@link PriceRowsEditor}. */
export function AddPriceButton({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#604b3e] transition hover:bg-[#f5eee9] hover:text-[#30251f] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
    >
      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      {t("vendor.services.form.addPrice")}
    </button>
  );
}
