"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import { useLanguage } from "@/context/LanguageContext";

import type { useHomeData } from "./useHomeData";

type HomeData = ReturnType<typeof useHomeData>;

export function HomeCategories({
  categories,
  categoriesLoading,
  categoriesError,
}: Pick<HomeData, "categories" | "categoriesLoading" | "categoriesError">) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto px-4 py-16 sm:px-6 lg:max-w-10/12 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
            {t("home.categories.eyebrow")}
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
            {t("home.categories.title")}
          </h2>
        </div>

        <Link
          href="/vendors"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
        >
          {t("common.viewAll")}{" "}
          <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>

      {categoriesLoading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
            />
          ))}
        </div>
      )}

      {!categoriesLoading && categoriesError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="font-medium text-red-600">
            {t("home.categories.loadError")}
          </p>
        </div>
      )}

      {!categoriesLoading && !categoriesError && categories.length === 0 && (
        <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
          <p className="text-[#756960]">{t("home.categories.empty")}</p>
        </div>
      )}

      {!categoriesLoading && !categoriesError && categories.length > 0 && (
        <CategoryCarousel categories={categories} />
      )}
    </section>
  );
}
