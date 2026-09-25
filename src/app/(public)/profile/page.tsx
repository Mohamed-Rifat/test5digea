"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f6] px-4 py-16 sm:px-6 sm:py-20">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#f4eadc] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#f7e9e5] opacity-60 blur-3xl" />

      {/* Fine grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #30251f 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative w-full max-w-7xl">
        {/* Main card */}
        <div className="group/card relative overflow-hidden rounded-32px border border-[#e9dfd8] bg-white shadow-[0_24px_80px_rgba(48,37,31,0.09)] transition-shadow duration-500 hover:shadow-[0_30px_90px_rgba(48,37,31,0.12)]">
          {/* Top accent */}
          <div className="relative h-1.5 overflow-hidden bg-gradient-to-r from-[#30251f] via-[#b99a62] to-[#30251f]">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#eee5df]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#faf5ee]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full border border-[#f0e7df]" />

          {/* Corner sparkles */}
          <div className="pointer-events-none absolute left-6 top-6 h-3 w-3 rotate-45 rounded-sm border border-[#b99a62]/25" />
          <div className="pointer-events-none absolute right-6 top-10 h-2 w-2 rotate-45 rounded-sm border border-[#b99a62]/20" />
          <div className="pointer-events-none absolute bottom-10 left-10 h-2 w-2 rotate-45 rounded-sm border border-[#b99a62]/20" />

          <div className="relative px-6 py-9 text-center sm:px-10 sm:py-11">
            {/* Emotional icon */}
            <div className="relative mx-auto w-fit">
              {/* Pulsing halo */}
              <div className="absolute inset-[-14px] animate-[pulseSlow_3s_ease-in-out_infinite] rounded-32px border border-[#eee5df]" />

              <div className="absolute inset-[-8px] rounded-[28px] border border-[#eee5df]" />

              <div className="relative flex h-18 w-18 items-center justify-center rounded-24px bg-[#faf5ee] text-[#a47e43] shadow-[0_8px_25px_rgba(164,126,67,0.10)]">
                <Heart size={28} strokeWidth={1.5} className="fill-[#f3e4d0]" />
              </div>

              {/* Status dot with ping */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#b99a62]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#b99a62]" />
              </span>
            </div>

            {/* Eyebrow */}
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43] rtl:tracking-normal">
              {t("profile.signedOut.eyebrow")}
            </p>

            {/* Heading */}
            <h1 className="mt-3 font-serif text-[34px] font-light leading-tight tracking-tight text-[#30251f] sm:text-[40px] rtl:leading-snug">
              {t("profile.signedOut.title")}
            </h1>

            {/* Decorative divider */}
            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d9c9a8]" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]/50" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d9c9a8]" />
            </div>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-lg text-[14px] leading-7 text-[#81746d] sm:text-[15px] sm:leading-8">
              {t("profile.signedOut.description")}
            </p>

            {/* Benefits */}
            <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-2xl border border-[#eee5df] bg-gradient-to-b from-[#faf8f6] to-[#faf5ee]/60">
              {/* Benefit 1 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <Heart size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.favorites")}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 h-12 -translate-y-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e8ded6] to-transparent" />
              </div>

              {/* Benefit 2 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <CalendarDays size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.roadmap")}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 h-12 -translate-y-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e8ded6] to-transparent" />
              </div>

              {/* Benefit 3 */}
              <div className="group/benefit px-2.5 py-4 transition-colors duration-300 hover:bg-white/70 sm:px-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm transition-all duration-300 group-hover/benefit:-translate-y-0.5 group-hover/benefit:shadow-[0_6px_18px_rgba(164,126,67,0.18)]">
                  <Sparkles size={15} strokeWidth={1.7} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold leading-4 text-[#5f544d] sm:text-[11px]">
                  {t("profile.signedOut.benefits.planning")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group relative inline-flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] hover:shadow-[0_12px_28px_rgba(48,37,31,0.22)]"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative">
                  {t("profile.signedOut.signIn")}
                </span>
                <ArrowRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-[#e3d8cf] bg-white px-6 text-sm font-semibold text-[#5f544d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b99a62] hover:bg-[#faf8f6] hover:text-[#30251f]"
              >
                {t("profile.signedOut.createAccount")}
              </Link>
            </div>

            {/* Small emotional footer */}
            <div className="mt-7 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#e8ded6]" />
              <p className="text-[10px] font-medium text-[#a3958c]">
                {t("profile.signedOut.footer")}
              </p>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#e8ded6]" />
            </div>
          </div>
        </div>

        {/* Brand note */}
        <p className="mt-5 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-[#b3a69e] rtl:tracking-normal">
          Digea · Your story, beautifully planned
        </p>
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>
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
      <div className="absolute inset-e-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rtl:-translate-x-8 rounded-full bg-[#faf5ee] opacity-70 transition duration-500 group-hover:scale-150" />

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
  const { user, role, isAuthenticated } = useAuth();
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
            CONTACT US
        ========================================= */}
        <section className="relative mt-10 overflow-hidden rounded-4xl bg-[#30251f] p-8 text-white shadow-[0_20px_60px_rgba(48,37,31,0.18)] sm:p-10 lg:mt-12 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#b99a62]/15" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full border-40 border-white/5" />

          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] rtl:tracking-normal text-[#c9ad78]">
                {t("profile.contactUs.eyebrow")}
              </p>

              <h2 className="mt-3 font-serif text-3xl font-light rtl:leading-snug sm:text-4xl">
                {t("profile.contactUs.title")}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-[15px] sm:leading-8">
                {t("profile.contactUs.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#30251f] transition hover:bg-[#f5efe8]"
              >
                <MessageCircle size={16} />
                {t("profile.contactUs.cta")}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>

              <p className="text-center text-xs text-white/60">
                {t("profile.contactUs.emailLabel")}{" "}
                <a
                  href="mailto:hello@5digea.com"
                  dir="ltr"
                  className="font-semibold text-white underline-offset-4 hover:underline"
                >
                  hello@5digea.com
                </a>
              </p>
            </div>
          </div>

          <p className="relative mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/60">
            <Heart size={13} className="shrink-0 text-[#c9ad78]" />
            {t("profile.contactUs.note")}
          </p>
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