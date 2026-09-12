"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
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
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4 py-24">
      <div className="w-full max-w-sm rounded-3xl border border-[#eee7e1] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43]">
          <UserRound size={24} />
        </div>

        <h1 className="mt-5 font-serif text-2xl font-light text-[#30251f]">
          Your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#81746d]">
          Sign in to view your profile, track your wedding roadmap, and
          revisit your saved favorites.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#42332a]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dbd0] px-6 py-3 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62]"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { roadmap, loading: roadmapLoading } = useRoadmap();

  if (!isAuthenticated) return <SignedOutState />;

  const totalItems = roadmap?.items.length ?? 0;
  const completedItems =
    roadmap?.items.filter((i) => i.status === RoadmapItemStatus.Completed)
      .length ?? 0;
  const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

  const initial = user?.fullName?.trim()?.charAt(0).toUpperCase() || "?";
  const roleLabel = role ? ROLE_LABEL[role] ?? role : "Couple";

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto lg:max-w-10/12 px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
          Account
        </p>
        <h1 className="mt-2 font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
          Welcome back, <span className="italic text-[#a47e43]">{user?.fullName}</span>
        </h1>

        {/* Identity card */}
        <div className="mt-7 overflow-hidden rounded-3xl border border-[#eee5df] bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#30251f] text-xl font-semibold text-white">
                {initial}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#30251f]">
                  {user?.fullName}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-[#81746d]">
                  <Mail size={14} />
                  <span className="truncate">{user?.email}</span>
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#faf5ee] px-3 py-1 text-[11px] font-semibold text-[#a47e43]">
                  <ShieldCheck size={12} />
                  {roleLabel}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#e4dbd0] px-5 py-2.5 text-xs font-semibold text-[#5f544d] transition hover:border-red-200 hover:text-red-500 sm:self-center"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
                <Target size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8d85]">
                Wedding progress
              </span>
            </div>

            {roadmapLoading ? (
              <div className="mt-4 h-6 w-24 animate-pulse rounded bg-[#f3ede6]" />
            ) : roadmap ? (
              <>
                <p className="mt-4 text-2xl font-bold text-[#30251f]">
                  {progress}%{" "}
                  <span className="text-sm font-normal text-[#9b8f86]">
                    complete
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#9b8f86]">
                  {completedItems} of {totalItems} categories done
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-[#81746d]">
                You haven&apos;t started a roadmap yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
                <Heart size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8d85]">
                Saved favorites
              </span>
            </div>

            {favoritesLoading ? (
              <div className="mt-4 h-6 w-16 animate-pulse rounded bg-[#f3ede6]" />
            ) : (
              <>
                <p className="mt-4 text-2xl font-bold text-[#30251f]">
                  {favorites.length}{" "}
                  <span className="text-sm font-normal text-[#9b8f86]">
                    saved
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#9b8f86]">
                  Vendors and services you&apos;ve favorited
                </p>
              </>
            )}
          </div>
        </div>

        {/* Navigation cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/roadmap"
            className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
              <CalendarDays size={20} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#30251f]">
              Wedding roadmap
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[#81746d]">
              Manage your date, categories, and selected vendors.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
              {roadmap ? "Open roadmap" : "Start planning"}{" "}
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/favorites"
            className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
              <Heart size={20} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#30251f]">
              Saved favorites
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[#81746d]">
              Review the vendors and services you&apos;ve saved.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
              View favorites <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/vendors"
            className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
              <Store size={20} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#30251f]">
              Browse vendors
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[#81746d]">
              Discover approved wedding professionals near you.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
              Explore <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/compare"
            className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf5ee] text-[#a47e43]">
              <Sparkles size={20} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-[#30251f]">
              Compare options
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[#81746d]">
              Line up vendors or services side by side before deciding.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
              Compare now <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
