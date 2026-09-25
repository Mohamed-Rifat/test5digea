"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/components/public/ServiceCard";
import { useLanguage } from "@/context/LanguageContext";

import type { useHomeData } from "./useHomeData";

type HomeData = ReturnType<typeof useHomeData>;

export function FeaturedServices({
  featuredServices,
  servicesLoading,
  servicesError,
}: Pick<HomeData, "featuredServices" | "servicesLoading" | "servicesError">) {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto lg:max-w-10/12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
              {t("home.services.eyebrow")}
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              {t("home.services.title")}
            </h2>
          </div>

          <Link
            href="/services"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
          >
            {t("common.viewAll")}{" "}
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>

        {servicesLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
              />
            ))}
          </div>
        )}

        {!servicesLoading && servicesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">
              {t("home.services.loadError")}
            </p>
          </div>
        )}

        {!servicesLoading &&
          !servicesError &&
          featuredServices.length === 0 && (
            <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
              <p className="text-[#756960]">{t("home.services.empty")}</p>
            </div>
          )}

        {!servicesLoading && !servicesError && featuredServices.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        <Link
          href="/services"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
        >
          {t("home.services.viewAllServices")}{" "}
          <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}
