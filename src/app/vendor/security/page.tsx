"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SecurityTips } from "@/components/vendor/security/SecurityTips";
import { VendorPasswordCard } from "@/components/vendor/security/VendorPasswordCard";

export default function VendorSecurityPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-full bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="mb-7 lg:mb-9">
          <div className="mt-3 flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                {t("vendor.security.title")}
              </h1>

              <p className="mt-1 text-sm text-[#81756e]">
                {t("vendor.security.subtitle")}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <VendorPasswordCard />
          <SecurityTips />
        </div>
      </div>
    </div>
  );
}
