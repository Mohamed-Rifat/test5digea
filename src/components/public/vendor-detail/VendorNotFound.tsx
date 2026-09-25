"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function VendorNotFound({ failed }: { failed: boolean }) {
  const { t } = useLanguage();

  return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4eee9]">
            <Building2
              size={28}
              className="text-[#b99a62]"
            />
          </div>

          <h2 className="font-serif text-2xl text-[#30251f]">
            {failed
              ? t("vendors.detail.notFound")
              : t("vendors.detail.notFoundTitle")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#766d67]">
            {t("vendors.detail.notFoundText")}
          </p>

          <Link
            href="/vendors"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#4a3a30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("vendors.detail.backToVendors")}
          </Link>
        </div>
    </main>
  );
}
