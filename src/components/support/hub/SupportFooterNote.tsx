"use client";

import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** "Still need help?" note. */
export function SupportFooterNote() {
  const { t } = useLanguage();

  return (
    <div className="mt-6 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#756b65]">{t("support.contact.text")}</p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:support@5digea.com"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a47e43] hover:underline"
          >
            <Mail className="h-4 w-4" />
            <span dir="ltr">support@5digea.com</span>
          </a>

          <span className="hidden h-4 w-px bg-[#d5c8be] sm:block" />

          <a
            href="tel:+201222800121"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a47e43] hover:underline"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr">+20 122 280 0121</span>
          </a>
        </div>
      </div>
    </div>
  );
}
