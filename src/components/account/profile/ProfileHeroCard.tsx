"use client";

import { CheckCircle2, Mail, Phone, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { calculateAge, formatCalendarDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

import type { ProfileOverviewState } from "./useProfileOverview";

/** Avatar, name, role and personal details. */
export function ProfileHeroCard({
  profile,
}: {
  profile: ProfileOverviewState;
}) {
  const { t, language } = useLanguage();
  const {
    initial,
    roleLabel,
    user,
    favorites,
    favoritesLoading,
    roadmap,
    currentUser,
  } = profile;

  return (
    <section className="relative overflow-hidden rounded-4xl border border-[#e9dfd8] bg-white shadow-[0_15px_55px_rgba(48,37,31,0.07)]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#faf5ee]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full border-40 border-[#faf8f6]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* User identity */}
          <div className="flex min-w-0 items-center gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20.5 w-20.5 items-center justify-center rounded-full bg-[#30251f] font-serif text-3xl font-light text-white shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
                {initial}
              </div>

              <div className="absolute -bottom-1 inset-e-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#b99a62] text-white">
                <CheckCircle2 size={13} strokeWidth={2.5} />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] rtl:tracking-normal text-[#a47e43]">
                {t("profile.hero.welcomeBack")}
              </p>

              <h2 className="mt-1 truncate font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                {user?.fullName}
              </h2>

              <div className="mt-2 flex max-w-full flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex min-w-0 items-center gap-2 text-sm text-[#81746d]">
                  <Mail size={14} className="shrink-0 text-[#a47e43]" />
                  <span dir="ltr" className="truncate">
                    {user?.email}
                  </span>
                </div>

                <span className="hidden h-1 w-1 rounded-full bg-[#d7cbc3] sm:block" />

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf5ee] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rtl:tracking-normal text-[#a47e43]">
                  <ShieldCheck size={12} />
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[#f0e9e4]" />

        {/* Profile mini info */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#faf8f6] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
              {t("profile.hero.accountType")}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
              {roleLabel}
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf8f6] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
              {t("profile.hero.weddingPlan")}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
              {roadmap
                ? t("profile.hero.activePlanning")
                : t("profile.hero.notStarted")}
            </p>
          </div>

          <div className="rounded-2xl bg-[#faf8f6] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
              {t("profile.hero.savedCollection")}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
              {favoritesLoading
                ? t("common.loading")
                : t("profile.hero.savedCount", {
                    count: favorites.length,
                  })}
            </p>
          </div>
        </div>

        {/* Personal details (from GET /api/Auth/me) */}
        {(currentUser?.phoneNumber ||
          currentUser?.dateOfBirth ||
          currentUser?.gender) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {currentUser?.phoneNumber && (
              <div className="rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
                  {t("profile.hero.personal.phone")}
                </p>
                <p
                  dir="ltr"
                  className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#30251f] rtl:justify-end"
                >
                  <Phone size={14} className="shrink-0 text-[#a47e43]" />
                  {currentUser.phoneNumber}
                </p>
              </div>
            )}

            {currentUser?.dateOfBirth && (
              <div className="rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
                  {t("profile.hero.personal.dateOfBirth")}
                </p>
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-[#30251f]">
                  <span>
                    {formatCalendarDate(
                      currentUser.dateOfBirth,
                      LANGUAGE_DATE_LOCALE[language],
                    )}
                  </span>
                  {calculateAge(currentUser.dateOfBirth) !== null && (
                    <span className="text-xs font-medium text-[#a3958c]">
                      {t("profile.hero.personal.age", {
                        age: calculateAge(currentUser.dateOfBirth) ?? 0,
                      })}
                    </span>
                  )}
                </p>
              </div>
            )}

            {currentUser?.gender && (
              <div className="rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a3958c]">
                  {t("profile.hero.personal.gender")}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
                  {currentUser.gender.toLowerCase() === "male"
                    ? t("profile.hero.personal.male")
                    : currentUser.gender.toLowerCase() === "female"
                      ? t("profile.hero.personal.female")
                      : currentUser.gender}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
