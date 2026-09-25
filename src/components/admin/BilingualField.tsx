"use client";

import type { BilingualText } from "@/lib/bilingual";

type Props = {
  idPrefix: string;
  label: string;
  value: BilingualText;
  onChange: (value: BilingualText) => void;
  placeholders: { ar: string; en: string };
  multiline?: boolean;
  required?: boolean;
  disabled?: boolean;
};

const inputClass =
  "w-full rounded-xl border border-[#e7ded8] bg-[#fcfaf8] px-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#afa19a] focus:border-[#bba99d] focus:bg-white focus:ring-4 focus:ring-[#f3ece7]";

/**
 * One field, two languages: an Arabic input and an English input side by
 * side (stacked on phones). Each input keeps its own direction.
 */
export default function BilingualField({
  idPrefix,
  label,
  value,
  onChange,
  placeholders,
  multiline,
  required,
  disabled,
}: Props) {
  const langs = [
    { key: "ar" as const, tag: "عربي", dir: "rtl" as const },
    { key: "en" as const, tag: "English", dir: "ltr" as const },
  ];

  return (
    <fieldset>
      <legend className="mb-2 block text-xs font-semibold text-[#55483f]">
        {label}
        {required && <span className="ms-0.5 text-red-500">*</span>}
      </legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {langs.map(({ key, tag, dir }) => {
          const id = `${idPrefix}-${key}`;
          const common = {
            id,
            dir,
            lang: key,
            value: value[key],
            disabled,
            required,
            placeholder: placeholders[key],
            "aria-label": `${label} (${tag})`,
          };
          return (
            <div key={key} className="relative">
              <span
                className={`pointer-events-none absolute top-2 rounded-md bg-[#f1e8df] px-1.5 py-0.5 text-[10px] font-bold text-[#8a6a45] ${
                  dir === "rtl" ? "left-2" : "right-2"
                }`}
              >
                {tag}
              </span>
              {multiline ? (
                <textarea
                  {...common}
                  rows={4}
                  onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                  className={`${inputClass} resize-none py-3 pt-7 leading-6`}
                />
              ) : (
                <input
                  {...common}
                  type="text"
                  onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                  className={`${inputClass} h-12 pt-3`}
                />
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
