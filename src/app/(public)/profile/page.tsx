"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { calculateAge, formatCalendarDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import type { TranslationKey } from "@/locales";
import { RoadmapItemStatus } from "@/types/roadmap";

const ROLE_LABEL_KEY: Record<string, TranslationKey> = {
  Admin: "profile.roles.admin",
  Vendor: "profile.roles.vendor",
  User: "profile.roles.couple",
};

function SignedOutState() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-4xl border border-[#eee5df] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.08)]">
        <div className="h-2 bg-[#30251f]" />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#faf5ee] text-[#a47e43]">
            <UserRound size={26} strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] rtl:tracking-normal text-[#a47e43]">
            {t("profile.signedOut.eyebrow")}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-light rtl:leading-snug text-[#30251f]">
            {t("profile.signedOut.title")}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81746d]">
            {t("profile.signedOut.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white transition hover:bg-[#45362d]"
            >
              {t("profile.signedOut.signIn")}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#e5dbd2] px-6 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#faf8f6]"
            >
              {t("profile.signedOut.createAccount")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#eee5df] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(48,37,31,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#faf5ee] text-[#a47e43]">
          {icon}
        </div>

        <span className="rounded-full bg-[#faf8f6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] rtl:tracking-normal text-[#a4968e]">
          {t("profile.overview.eyebrow")}
        </span>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] rtl:tracking-normal text-[#9b8d85]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight text-[#30251f]">
        {value}
      </p>

      <p className="mt-1.5 text-xs leading-5 text-[#9b8d85]">
        {description}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[26px] border border-[#eee5df] bg-white p-6 shadow-[0_8px_30px_rgba(48,37,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd1c6] hover:shadow-[0_18px_45px_rgba(48,37,31,0.09)]"
    >
      <div className="absolute end-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rtl:-translate-x-8 rounded-full bg-[#faf5ee] opacity-70 transition duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43] transition duration-300 group-hover:bg-[#30251f] group-hover:text-white">
            {icon}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee5df] text-[#a3958c] transition duration-300 group-hover:border-[#30251f] group-hover:bg-[#30251f] group-hover:text-white">
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {eyebrow}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-[#30251f]">
          {title}
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#81746d]">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { roadmap, loading: roadmapLoading } = useRoadmap();
  const { t, language } = useLanguage();
  const { currentUser } = useCurrentUser(isAuthenticated);

  if (!isAuthenticated) return <SignedOutState />;

  const totalItems = roadmap?.items.length ?? 0;

  const completedItems =
    roadmap?.items.filter(
      (item) => item.status === RoadmapItemStatus.Completed
    ).length ?? 0;

  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const initial =
    user?.fullName?.trim()?.charAt(0).toUpperCase() || "?";

  const roleKey = role ? ROLE_LABEL_KEY[role] : undefined;
  const roleLabel = role
    ? roleKey
      ? t(roleKey)
      : role
    : t("profile.roles.couple");

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] rtl:tracking-normal text-[#a47e43]">
              {t("profile.header.eyebrow")}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight rtl:tracking-normal text-[#30251f] sm:text-4xl lg:text-[44px]">
              {t("profile.header.title")}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#81746d]">
              {t("profile.header.description")}
            </p>
          </div>

        </div>

        {/* =========================================
            PROFILE HERO
        ========================================= */}
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

                  <div className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#b99a62] text-white">
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
                      <span dir="ltr" className="truncate">{user?.email}</span>
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
                          LANGUAGE_DATE_LOCALE[language]
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

        {/* =========================================
            OVERVIEW
        ========================================= */}
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

        {/* =========================================
            QUICK ACTIONS
        ========================================= */}
        <section className="mt-10 lg:mt-12">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] rtl:tracking-normal text-[#a47e43]">
              {t("profile.quickAccess.eyebrow")}
            </p>

            <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
              {t("profile.quickAccess.title")}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              href="/roadmap"
              icon={<CalendarDays size={20} />}
              eyebrow={t("profile.quickAccess.roadmap.eyebrow")}
              title={t("profile.quickAccess.roadmap.title")}
              description={t("profile.quickAccess.roadmap.description")}
            />

            <ActionCard
              href="/favorites"
              icon={<Heart size={20} />}
              eyebrow={t("profile.quickAccess.favorites.eyebrow")}
              title={t("profile.quickAccess.favorites.title")}
              description={t("profile.quickAccess.favorites.description")}
            />

            <ActionCard
              href="/vendors"
              icon={<Store size={20} />}
              eyebrow={t("profile.quickAccess.vendors.eyebrow")}
              title={t("profile.quickAccess.vendors.title")}
              description={t("profile.quickAccess.vendors.description")}
            />

            <ActionCard
              href="/compare"
              icon={<Sparkles size={20} />}
              eyebrow={t("profile.quickAccess.compare.eyebrow")}
              title={t("profile.quickAccess.compare.title")}
              description={t("profile.quickAccess.compare.description")}
            />

            <ActionCard
              href="/change-password"
              icon={<KeyRound size={20} />}
              eyebrow={t("profile.quickAccess.security.eyebrow")}
              title={t("profile.quickAccess.security.title")}
              description={t("profile.quickAccess.security.description")}
            />

            <Link
              href="/roadmap"
              className="group flex min-h-52.5 flex-col justify-between rounded-[26px] border border-dashed border-[#d9ccc2] bg-[#faf8f6] p-6 transition-all duration-300 hover:border-[#b99a62] hover:bg-[#faf5ee]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a47e43] shadow-sm">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
                  {t("profile.quickAccess.keepPlanning.eyebrow")}
                </p>

                <h3 className="mt-2 font-serif text-xl font-light text-[#30251f]">
                  {t("profile.quickAccess.keepPlanning.title")}
                </h3>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#8e685e]">
                  {t("profile.quickAccess.keepPlanning.cta")}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* =========================================
            FOOTER NOTE
        ========================================= */}
        <div className="mt-10 border-t border-[#e9dfd8] pt-6 text-center">
          <p className="text-[11px] leading-5 text-[#a3958c]">
            {t("profile.footerNote")}
          </p>
        </div>
      </div>
    </main>
  );
}