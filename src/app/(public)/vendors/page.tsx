"use client";

import { Suspense } from "react";
import { Sparkles } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { VendorCompareBar } from "@/components/public/vendors-list/VendorCompareBar";
import { VendorResults } from "@/components/public/vendors-list/VendorResults";
import { VendorSearchArea } from "@/components/public/vendors-list/VendorSearchBar";
import { useVendorsList } from "@/components/public/vendors-list/useVendorsList";

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const { t } = useLanguage();
  const state = useVendorsList();

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <section className="relative overflow-visible border-b border-[#eee7e1] bg-linear-to-b from-[#f8f5ef] to-[#faf8f6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b99a62]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#a47e43]/5 blur-3xl" />

        <div className="relative mx-auto lg:max-w-10/12">
          {/* Badge */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b99a62]/15">
              <Sparkles className="h-3 w-3 text-[#b99a62]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] rtl:tracking-normal text-[#9b8367]">
              {t("vendors.list.eyebrow")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl lg:text-5xl">
            {t("vendors.list.titlePrefix")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">
              {t("vendors.list.titleHighlight")}
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67] sm:text-base">
            {t("vendors.list.description")}
          </p>

          {/* Search Form + Filters Panel Wrapper */}

          <VendorSearchArea state={state} />
        </div>
      </section>

      <section className="mx-auto lg:max-w-10/12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <VendorCompareBar state={state} />
        <VendorResults state={state} />
      </section>
    </main>
  );
}
