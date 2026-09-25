"use client";

import { Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { FavoritesPageState } from "./useFavoritesPage";

/** Title, total count and the all / vendors / services tabs. */
export function FavoritesHero({ state }: { state: FavoritesPageState }) {
  const { t } = useLanguage();
  const { tab, setTab, tabs, favorites, loading, error } = state;

  return (
    <section className="relative overflow-hidden border-b border-[#eee7e1] bg-gradient-to-b from-[#f8f5ef] via-[#faf8f6] to-[#faf8f6] px-4 py-14 sm:px-6 lg:px-8">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e8d7bd] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d9c9be] opacity-25 blur-3xl" />

      <div className="relative mx-auto lg:max-w-10/12">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] rtl:tracking-normal text-[#9b8367]">
            {t("favorites.eyebrow")}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-light tracking-tight rtl:tracking-normal text-[#30251f] sm:text-5xl">
              {t("favorites.title")}{" "}
              <span className="italic rtl:not-italic text-[#a47e43]">
                {t("favorites.titleHighlight")}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#766d67]">
              {t("favorites.description")}
            </p>
          </div>

          {!loading && !error && favorites.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#eee7e1] bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf2e4] text-[#a47e43]">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-none text-[#30251f]">
                  {favorites.length}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider rtl:tracking-normal text-[#9b8367]">
                  {t("favorites.totalSaved")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===================== TABS ===================== */}
        <div className="mt-8 inline-flex flex-wrap items-center gap-1 rounded-full border border-[#eee7e1] bg-white p-1 shadow-sm">
          {tabs.map((tabItem) => {
            const isActive = tab === tabItem.key;
            return (
              <button
                key={tabItem.key}
                type="button"
                onClick={() => setTab(tabItem.key)}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#30251f] text-white shadow-sm"
                    : "text-[#5f544d] hover:bg-[#f7f2ec]"
                }`}
              >
                {tabItem.label}
                <span
                  className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#f0e8dd] text-[#8a7558]"
                  }`}
                >
                  {tabItem.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
