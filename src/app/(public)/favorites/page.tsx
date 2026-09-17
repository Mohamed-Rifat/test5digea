"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Heart,
  ImageOff,
  Loader2,
  Sparkles,
  Trash2,
  Store,
  Wrench,
  ArrowRight,
  Compass,
  MapPin,
  Star,
} from "lucide-react";

import AuthGuard from "@/components/guards/AuthGuard";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoriteTargetType } from "@/types/favorite";

// ================================================================
// TYPES
// ================================================================

type Tab = "all" | FavoriteTargetType.Vendor | FavoriteTargetType.Service;

// ================================================================
// MAIN CONTENT
// ================================================================

function FavoritesContent() {
  const { favorites, loading, error, remove, actionLoading } = useFavorites();
  const [tab, setTab] = useState<Tab>("all");

  // ============================================================
  // COMPUTED
  // ============================================================

  const counts = useMemo(() => {
    const vendorCount = favorites.filter(
      (f) => f.targetType === FavoriteTargetType.Vendor
    ).length;
    const serviceCount = favorites.filter(
      (f) => f.targetType === FavoriteTargetType.Service
    ).length;

    return {
      all: favorites.length,
      vendor: vendorCount,
      service: serviceCount,
    };
  }, [favorites]);

  const filtered = useMemo(() => {
    if (tab === "all") return favorites;
    return favorites.filter((f) => f.targetType === tab);
  }, [favorites, tab]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: FavoriteTargetType.Vendor, label: "Partners", count: counts.vendor },
    { key: FavoriteTargetType.Service, label: "Services", count: counts.service },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden border-b border-[#eee7e1] bg-gradient-to-b from-[#f8f5ef] via-[#faf8f6] to-[#faf8f6] px-4 py-14 sm:px-6 lg:px-8">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e8d7bd] opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#d9c9be] opacity-25 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Saved for You
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl font-light tracking-tight text-[#30251f] sm:text-5xl">
                Your{" "}
                <span className="italic text-[#a47e43]">Favorites</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#766d67]">
                A curated collection of everything you&apos;ve saved while
                planning. Revisit, compare, and book in one tap.
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
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-[#9b8367]">
                    Total Saved
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===================== TABS ===================== */}
          <div className="mt-8 inline-flex flex-wrap items-center gap-1 rounded-full border border-[#eee7e1] bg-white p-1 shadow-sm">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#30251f] text-white shadow-sm"
                      : "text-[#5f544d] hover:bg-[#f7f2ec]"
                  }`}
                >
                  {t.label}
                  <span
                    className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-[#f0e8dd] text-[#8a7558]"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== BODY ===================== */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Loading — skeleton cards */}
        {loading && <FavoritesSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState tab={tab} hasAny={favorites.length > 0} />
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((favorite) => {
              const isVendor =
                favorite.targetType === FavoriteTargetType.Vendor;

              const href = isVendor
                ? `/vendors/${favorite.targetId}`
                : `/services/${favorite.targetId}`;

              const key = `${favorite.targetType}:${favorite.targetId}`;
              const isRemoving = actionLoading === key;

              return (
                <article
                  key={favorite.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#eee7e1] bg-white shadow-[0_4px_24px_-12px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e0d3c4] hover:shadow-[0_20px_45px_-20px_rgba(48,37,31,0.28)]"
                >
                  {/* -------- Image -------- */}
                  <Link
                    href={href}
                    className="relative block aspect-[16/10] overflow-hidden bg-[#f4eee9]"
                  >
                    {favorite.imageUrl ? (
                      <img
                        src={favorite.imageUrl}
                        alt={favorite.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                        <ImageOff size={28} />
                      </div>
                    )}

                    {/* type badge */}
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                        isVendor
                          ? "bg-[#fdf5e4]/90 text-[#8a6a2c]"
                          : "bg-[#efe9fb]/90 text-[#6b52a3]"
                      }`}
                    >
                      {isVendor ? (
                        <Store className="h-3 w-3" />
                      ) : (
                        <Wrench className="h-3 w-3" />
                      )}
                      {isVendor ? "Partner" : "Service"}
                    </span>

                    {/* remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(favorite.targetType, favorite.targetId);
                      }}
                      disabled={isRemoving}
                      aria-label="Remove from favorites"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#9b8f86] shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#c0564a] disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    {/* hover gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>

                  {/* -------- Body -------- */}
                  <div className="flex flex-1 flex-col p-5">
                    <Link href={href} className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold tracking-tight text-[#30251f] transition group-hover:text-[#a47e43]">
                        {favorite.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-3 text-xs text-[#9b8f86]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Saved item
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#d8cdc0]" />
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Curated
                        </span>
                      </div>
                    </Link>

                    <div className="mt-5 flex items-center justify-between border-t border-[#f0e8dd] pt-4">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a47e43] transition hover:gap-2.5"
                      >
                        View details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          remove(favorite.targetType, favorite.targetId)
                        }
                        disabled={isRemoving}
                        className="text-xs font-medium text-[#9b8f86] transition hover:text-[#c0564a] disabled:opacity-60"
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

// ================================================================
// EMPTY STATE
// ================================================================

function EmptyState({ tab, hasAny }: { tab: Tab; hasAny: boolean }) {
  const isFiltered = tab !== "all" && hasAny;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#eee7e1] bg-white p-12 text-center sm:p-16">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f4eee9] opacity-60" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#f4eee9] opacity-60" />

      <div className="relative">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#faf2e4] to-[#f0e0c4] shadow-sm">
          <Heart className="h-7 w-7 text-[#a47e43]" />
        </div>

        <h2 className="font-serif text-2xl font-light text-[#30251f]">
          {isFiltered ? "Nothing here yet" : "Your collection is empty"}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#766d67]">
          {isFiltered
            ? "You haven't saved anything in this category yet. Explore and start building your list."
            : "Start curating your perfect plan. Save partners and services as you browse, and they'll all live here."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#45362e]"
          >
            <Store className="h-4 w-4" />
            Browse Partners
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-2.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#a47e43]"
          >
            <Compass className="h-4 w-4" />
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// SKELETON
// ================================================================

function FavoritesSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-[#eee7e1] bg-white"
        >
          <div className="aspect-[16/10] bg-[#f0e8dd]" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded bg-[#f0e8dd]" />
            <div className="h-3 w-1/2 rounded bg-[#f4eee9]" />
            <div className="mt-4 flex items-center justify-between border-t border-[#f0e8dd] pt-4">
              <div className="h-3 w-20 rounded bg-[#f0e8dd]" />
              <div className="h-3 w-14 rounded bg-[#f4eee9]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ================================================================
// PAGE
// ================================================================

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}