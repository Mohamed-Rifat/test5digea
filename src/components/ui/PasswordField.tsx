"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { TextField, type TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "endAdornment"> & {
  showLabel?: string;
  hideLabel?: string;
};

/** {@link TextField} for passwords with a show / hide toggle. */
export default function PasswordField({
  showLabel,
  hideLabel,
  disabled,
  ...props
}: PasswordFieldProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      disabled={disabled}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          disabled={disabled}
          aria-label={
            visible
              ? (hideLabel ?? t("auth.hidePassword"))
              : (showLabel ?? t("auth.showPassword"))
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8c7d73] transition-colors duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.8} />
          ) : (
            <Eye size={18} strokeWidth={1.8} />
          )}
        </button>
      }
    />
  );
}
