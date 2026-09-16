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
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { RoadmapItemStatus } from "@/types/roadmap";

const ROLE_LABEL: Record<string, string> = {
  Admin: "Administrator",
  Vendor: "Vendor",
  User: "Couple",
};

function SignedOutState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-[#eee5df] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.08)]">
        <div className="h-2 bg-[#30251f]" />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#faf5ee] text-[#a47e43]">
            <UserRound size={26} strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a47e43]">
            Digea Account
          </p>

          <h1 className="mt-3 font-serif text-3xl font-light text-[#30251f]">
            Your account
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81746d]">
            Sign in to manage your wedding journey, saved vendors, and
            planning progress.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white transition hover:bg-[#45362d]"
            >
              Sign in
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#e5dbd2] px-6 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#faf8f6]"
            >
              Create an account
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
  return (
    <div className="rounded-[24px] border border-[#eee5df] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(48,37,31,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#faf5ee] text-[#a47e43]">
          {icon}
        </div>

        <span className="rounded-full bg-[#faf8f6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#a4968e]">
          Overview
        </span>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b8d85]">
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
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#faf5ee] opacity-70 transition duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#faf5ee] text-[#a47e43] transition duration-300 group-hover:bg-[#30251f] group-hover:text-white">
            {icon}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee5df] text-[#a3958c] transition duration-300 group-hover:border-[#30251f] group-hover:bg-[#30251f] group-hover:text-white">
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a47e43]">
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

  const roleLabel = role ? ROLE_LABEL[role] ?? role : "Couple";

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto w-full lg:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43]">
              My Account
            </p>

            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f] sm:text-4xl lg:text-[44px]">
              Your personal space
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#81746d]">
              Everything you need to manage your Digea account and wedding
              journey in one place.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-[#9b8d85] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b99a62]" />
            Account overview
          </div>
        </div>

        {/* =========================================
            PROFILE HERO
        ========================================= */}
        <section className="relative overflow-hidden rounded-[32px] border border-[#e9dfd8] bg-white shadow-[0_15px_55px_rgba(48,37,31,0.07)]">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#faf5ee]" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full border-[40px] border-[#faf8f6]" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* User identity */}
              <div className="flex min-w-0 items-center gap-5">
                <div className="relative shrink-0">
                  <div className="flex h-[82px] w-[82px] items-center justify-center rounded-[27px] bg-[#30251f] font-serif text-3xl font-light text-white shadow-lg sm:h-24 sm:w-24 sm:text-4xl">
                    {initial}
                  </div>

                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#b99a62] text-white">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43]">
                    Welcome back
                  </p>

                  <h2 className="mt-1 truncate font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                    {user?.fullName}
                  </h2>

                  <div className="mt-2 flex max-w-full flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-[#81746d]">
                      <Mail size={14} className="shrink-0 text-[#a47e43]" />
                      <span className="truncate">{user?.email}</span>
                    </div>

                    <span className="hidden h-1 w-1 rounded-full bg-[#d7cbc3] sm:block" />

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf5ee] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#a47e43]">
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
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a3958c]">
                  Account type
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
                  {roleLabel}
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a3958c]">
                  Wedding plan
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
                  {roadmap ? "Active planning" : "Not started"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8f6] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a3958c]">
                  Saved collection
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#30251f]">
                  {favoritesLoading ? "Loading..." : `${favorites.length} saved`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            OVERVIEW
        ========================================= */}
        <section className="mt-8 lg:mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43]">
                Overview
              </p>

              <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
                Your journey at a glance
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Wedding progress */}
            <div className="rounded-[24px] border border-[#eee5df] bg-white p-5 shadow-[0_8px_30px_rgba(48,37,31,0.035)] lg:col-span-2">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#faf5ee] text-[#a47e43]">
                    <Target size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b8d85]">
                      Wedding progress
                    </p>

                    {roadmapLoading ? (
                      <div className="mt-2 h-8 w-28 animate-pulse rounded-lg bg-[#f3ede6]" />
                    ) : roadmap ? (
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-[#30251f]">
                          {progress}%
                        </span>

                        <span className="text-xs text-[#9b8d85]">
                          completed
                        </span>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-[#81746d]">
                        Your planning journey has not started yet.
                      </p>
                    )}
                  </div>
                </div>

                {roadmap && !roadmapLoading && (
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e685e] transition hover:text-[#30251f]"
                  >
                    View roadmap
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>

              {roadmap && !roadmapLoading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#9b8d85]">
                    <span>
                      {completedItems} of {totalItems} categories completed
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
                  Start your roadmap
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Favorites */}
            <StatCard
              icon={<Heart size={19} />}
              label="Saved favorites"
              value={favoritesLoading ? "—" : favorites.length}
              description="Vendors and services you've saved."
            />
          </div>
        </section>

        {/* =========================================
            QUICK ACTIONS
        ========================================= */}
        <section className="mt-10 lg:mt-12">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a47e43]">
              Quick access
            </p>

            <h2 className="mt-1 font-serif text-2xl font-light text-[#30251f]">
              Manage your account
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              href="/roadmap"
              icon={<CalendarDays size={20} />}
              eyebrow="Planning"
              title="Wedding roadmap"
              description="Manage your wedding date, categories, progress, and selected vendors."
            />

            <ActionCard
              href="/favorites"
              icon={<Heart size={20} />}
              eyebrow="Collection"
              title="Saved favorites"
              description="Revisit the vendors and services you've saved while planning."
            />

            <ActionCard
              href="/vendors"
              icon={<Store size={20} />}
              eyebrow="Discover"
              title="Browse vendors"
              description="Explore approved wedding professionals and find the right match."
            />

            <ActionCard
              href="/compare"
              icon={<Sparkles size={20} />}
              eyebrow="Decide"
              title="Compare options"
              description="Compare vendors or services side by side before making your choice."
            />

            <ActionCard
              href="/change-password"
              icon={<KeyRound size={20} />}
              eyebrow="Security"
              title="Change password"
              description="Keep your account secure by updating your password whenever needed."
            />

            <Link
              href="/roadmap"
              className="group flex min-h-[210px] flex-col justify-between rounded-[26px] border border-dashed border-[#d9ccc2] bg-[#faf8f6] p-6 transition-all duration-300 hover:border-[#b99a62] hover:bg-[#faf5ee]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[#a47e43] shadow-sm">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a47e43]">
                  Keep planning
                </p>

                <h3 className="mt-2 font-serif text-xl font-light text-[#30251f]">
                  Your perfect day starts here.
                </h3>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#8e685e]">
                  Continue your journey
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
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
            Your Digea account keeps your wedding planning journey organized,
            personal, and easy to revisit.
          </p>
        </div>
      </div>
    </main>
  );
}