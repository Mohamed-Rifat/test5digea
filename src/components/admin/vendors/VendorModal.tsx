"use client";

import type { ReactNode } from "react";
import { AlertCircle, X } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function ModalOverlay({
  children,
  onClose,
  zIndex = "z-50",
}: {
  children: ReactNode;
  onClose: () => void;
  zIndex?: string;
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center overflow-y-auto bg-[#241c18]/45 p-4 backdrop-blur-[4px]`}
      onClick={onClose}
    >
      <div className="flex max-h-[calc(100vh-2rem)] w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function CloseButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#766b65] transition hover:bg-[#f3efec] hover:text-[#30251f] disabled:opacity-50"
      aria-label={t("admin.ui.close")}
    >
      <X size={17} />
    </button>
  );
}

export function InlineError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
      <AlertCircle
        size={15}
        className="mt-0.5 shrink-0"
      />

      <span>{message}</span>
    </div>
  );
}
