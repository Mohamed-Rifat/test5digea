"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VendorCard from "@/components/public/VendorCard";
import { useLanguage } from "@/context/LanguageContext";

import type { useHomeData } from "./useHomeData";

type HomeData = ReturnType<typeof useHomeData>;

export function FeaturedVendors({
  featuredVendors,
  vendorsLoading,
  vendorsError,
}: Pick<HomeData, "featuredVendors" | "vendorsLoading" | "vendorsError">) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto px-4 pb-20 sm:px-6 lg:max-w-10/12 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
            {t("home.vendors.eyebrow")}
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
            {t("home.vendors.title")}
          </h2>
        </div>

        <Link
          href="/vendors"
          className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
        >
          {t("common.viewAll")}{" "}
          <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>

      {vendorsLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
            />
          ))}
        </div>
      )}

      {!vendorsLoading && vendorsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="font-medium text-red-600">
            {t("home.vendors.loadError")}
          </p>
        </div>
      )}

      {!vendorsLoading && !vendorsError && featuredVendors.length === 0 && (
        <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
          <p className="text-[#756960]">{t("home.vendors.empty")}</p>
        </div>
      )}

      {!vendorsLoading && !vendorsError && featuredVendors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}

      <Link
        href="/vendors"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
      >
        {t("home.vendors.viewAllVendors")}{" "}
        <ArrowRight size={14} className="rtl:rotate-180" />
      </Link>
    </section>
  );
}
