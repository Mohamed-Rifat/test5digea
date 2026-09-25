"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Heart, Target } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { StatCard } from "./ProfileCards";
import type { ProfileOverviewState } from "./useProfileOverview";

/** Wedding progress + saved favourites. */
export function ProfileOverviewSection({
  profile,
}: {
  profile: ProfileOverviewState;
}) {
  const { t } = useLanguage();
  const {
    totalItems,
    completedItems,
    progress,
    favorites,
    favoritesLoading,
    roadmap,
    roadmapLoading,
  } = profile;

  return (
    <section className="mt-8 lg:mt-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] rtl:tracking-normal text-[#a47e43]">
            {t("profile.overview.eyebrow")}
          </p>

          <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
            {t("profile.overview.title")}
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Wedding progress */}
        <div className="rounded-3xl border border-[#eee5df] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)] lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#faf5ee] text-[#a47e43]">
                <Target size={19} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#9b8d85]">
                  {t("profile.overview.weddingProgress")}
                </p>

                {roadmapLoading ? (
                  <div className="mt-2 h-8 w-28 animate-pulse rounded-lg bg-[#f3ede6]" />
                ) : roadmap ? (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-[#30251f]">
                      {progress}%
                    </span>

                    <span className="text-xs text-[#9b8d85]">
                      {t("profile.overview.completed")}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[#81746d]">
                    {t("profile.overview.notStartedYet")}
                  </p>
                )}
              </div>
            </div>

            {roadmap && !roadmapLoading && (
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e685e] transition hover:text-[#30251f]"
              >
                {t("profile.overview.viewRoadmap")}
                <ChevronRight size={14} className="rtl:rotate-180" />
              </Link>
            )}
          </div>

          {roadmap && !roadmapLoading && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#9b8d85]">
                <span>
                  {t("profile.overview.categoriesCompleted", {
                    completed: completedItems,
                    total: totalItems,
                  })}
                </span>

                <span>{progress}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1ebe6]">
                <div
                  className="h-full rounded-full bg-[#30251f] transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!roadmap && !roadmapLoading && (
            <Link
              href="/roadmap"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#45362d]"
            >
              {t("profile.overview.startRoadmap")}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          )}
        </div>

        {/* Favorites */}
        <StatCard
          icon={<Heart size={19} />}
          label={t("profile.overview.savedFavorites")}
          value={favoritesLoading ? "—" : favorites.length}
          description={t("profile.overview.savedFavoritesDescription")}
        />
      </div>
    </section>
  );
}
