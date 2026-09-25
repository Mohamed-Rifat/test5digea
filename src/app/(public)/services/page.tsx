"use client";

import { Suspense } from "react";
import { Sparkles } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { ServiceCompareTray } from "@/components/public/services-list/ServiceCompareTray";
import { ServiceResults } from "@/components/public/services-list/ServiceResults";
import { ServiceSearchArea } from "@/components/public/services-list/ServiceSearchBar";
import { useServicesList } from "@/components/public/services-list/useServicesList";

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const { t } = useLanguage();
  const state = useServicesList();

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <section className="relative overflow-visible border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto lg:max-w-10/12">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] rtl:tracking-normal text-[#9b8367]">
              {t("services.list.eyebrow")}
            </span>
          </div>

          <h1 className="max-w-3xl font-serif text-2xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
            {t("services.list.titlePrefix")}{" "}
            <span className="italic rtl:not-italic text-[#a47e43]">
              {t("services.list.titleHighlight")}
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            {t("services.list.description")}
          </p>

          {/* Search bar + filters panel */}

          <ServiceSearchArea state={state} />
        </div>
      </section>

      <ServiceResults state={state} />

      <ServiceCompareTray state={state} />
    </main>
  );
}
