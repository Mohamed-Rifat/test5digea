"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

/** "Need help? … Contact support" footer of the service forms. */
export default function ServiceHelpNote({ text }: { text: string }) {
  const { t } = useLanguage();

  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-3 text-[10px] text-[#6f625a] sm:mt-6 sm:p-3.5 sm:text-xs">
      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a47e43] sm:h-4 sm:w-4" />

      <span className="leading-5">
        <span className="font-medium text-[#40352f]">{t("vendor.services.form.needHelp")}</span>{" "}
        {text}
        <Link
          href="/vendor/support"
          className="ms-1 font-medium text-[#a47e43] hover:underline"
        >
          {t("vendor.services.form.contactSupport")}
        </Link>
      </span>
    </div>
  );
}
