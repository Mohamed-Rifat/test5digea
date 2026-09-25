"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TextWithSlots from "@/components/shared/TextWithSlots";

/** How category assignment works. */
export function CategoriesNote() {
  const { t } = useLanguage();

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-3 text-xs text-[#6f625a] shadow-sm sm:p-4 sm:text-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#a47e43] sm:h-4.5 sm:w-4.5" />
      <p className="leading-5 sm:leading-6">
        <TextWithSlots
          text={t("vendor.categories.info")}
          slots={{
            bold: (
              <strong className="text-[#a47e43]">
                {t("vendor.categories.infoBold")}
              </strong>
            ),
            link: (
              <Link
                href="/vendor/support"
                className="font-semibold text-[#a47e43] hover:underline"
              >
                {t("vendor.categories.infoLink")}
              </Link>
            ),
          }}
        />
      </p>
    </div>
  );
}
