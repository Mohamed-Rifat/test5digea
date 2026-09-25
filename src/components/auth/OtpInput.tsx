"use client";

import { useImperativeHandle, useRef, type Ref } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { normalizeDigits } from "@/lib/i18n";

export interface OtpInputHandle {
  focus: () => void;
}

interface OtpInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  ref?: Ref<OtpInputHandle>;
}

/**
 * One underlined box per digit. Typing moves forward, Backspace on an
 * empty box moves back, and pasting a full code fills every box.
 */
export default function OtpInput({
  digits,
  onChange,
  disabled,
  invalid,
  ref,
}: OtpInputProps) {
  const { t } = useLanguage();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const length = digits.length;

  useImperativeHandle(ref, () => ({
    focus: () => inputRefs.current[0]?.focus(),
  }));

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = normalizeDigits(value).replace(/\D/g, "");
    const next = [...digits];

    if (!sanitized) {
      next[index] = "";
      onChange(next);
      return;
    }

    const chars = sanitized.split("");
    chars.forEach((char, offset) => {
      if (index + offset < length) next[index + offset] = char;
    });

    onChange(next);
    inputRefs.current[Math.min(index + chars.length, length - 1)]?.focus();
  };

  return (
    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          value={digit}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          disabled={disabled}
          aria-label={t("auth.verifyOtpPage.digitLabel", { number: index + 1 })}
          aria-invalid={invalid}
          className={`field-underline h-13 w-11 border-0 border-b-2 bg-transparent text-center text-lg font-semibold text-[#30251f] outline-none transition-colors duration-300 sm:h-14 sm:w-12 ${
            invalid
              ? "border-red-300 focus:border-red-500"
              : "border-[#ded5ce] focus:border-[#9a8171]"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        />
      ))}
    </div>
  );
}
