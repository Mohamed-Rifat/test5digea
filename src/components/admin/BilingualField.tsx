"use client";

import type { BilingualText } from "@/lib/bilingual";
import { TextAreaField, TextField } from "@/components/ui/TextField";

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
      <legend className="mb-3 block text-xs font-semibold text-[#55483f]">
        {label}
        {required && <span className="ms-0.5 text-red-500">*</span>}
      </legend>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {langs.map(({ key, tag, dir }) => {
          const common = {
            id: `${idPrefix}-${key}`,
            dir,
            lang: key,
            value: value[key],
            disabled,
            required,
            label: tag,
            placeholder: placeholders[key],
            "aria-label": `${label} (${tag})`,
          };

          return multiline ? (
            <TextAreaField
              key={key}
              {...common}
              rows={4}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            />
          ) : (
            <TextField
              key={key}
              {...common}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
