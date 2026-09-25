"use client";

import { Check } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Gender } from "@/types/auth";

interface GenderPickerProps {
  value: Gender | "";
  onChange: (value: Gender) => void;
  disabled?: boolean;
  invalid?: boolean;
}

/** Two pill buttons acting as a radio group. */
export default function GenderPicker({ value, onChange, disabled, invalid }: GenderPickerProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full text-start">
      <p
        id="gender-label"
        className={`mb-2 text-xs ${invalid ? "text-red-500" : "text-[#a59a92]"}`}
      >
        {t("auth.gender")}
      </p>

      <div role="radiogroup" aria-labelledby="gender-label" className="grid grid-cols-2 gap-3">
        {(["Male", "Female"] as const).map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option)}
              className={`flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9a8171]/25 disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "border-[#30251f] bg-[#30251f] text-white shadow-[0_6px_18px_rgba(48,37,31,0.15)]"
                  : "border-[#ded5ce] bg-transparent text-[#6f625b] hover:border-[#9a8171] hover:text-[#30251f]"
              }`}
            >
              {selected && <Check size={14} />}
              {option === "Male" ? t("auth.male") : t("auth.female")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
