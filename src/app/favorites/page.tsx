"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, ImageOff, Loader2, Sparkles, Trash2 } from "lucide-react";

import SiteNavbar from "@/components/site/SiteNavbar";
import AuthGuard from "@/components/guards/AuthGuard";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoriteTargetType } from "@/types/favorite";

type Tab = "all" | FavoriteTargetType.Vendor | FavoriteTargetType.Service;

function FavoritesContent() {
  const { favorites, loading, error, remove, actionLoading } = useFavorites();
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return favorites;
    return favorites.filter((f) => f.targetType === tab);
  }, [favorites, tab]);

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <SiteNavbar />

      <section className="border-b border-[#eee7e1] bg-[#f8f5ef] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
              Saved for You
            </span>
          </div>

          <h1 className="font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
            Your <span className="italic text-[#a47e43]">Favorites</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#766d67]">
            Everything you've saved while planning, all in one place.
          </p>

          <div className="mt-8 flex gap-2">
            {[
              { key: "all" as Tab, label: "All" },
              { key: FavoriteTargetType.Vendor, label: "Partners" },
              { key: FavoriteTargetType.Service, label: "Services" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-[#30251f] text-white"
                    : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#b99a62]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#b99a62]" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-[#eee7e1] bg-white p-14 text-center">
            <Heart className="mx-auto mb-4 h-8 w-8 text-[#d8cdc0]" />
            <p className="text-[#766d67]">
              You haven't saved anything yet. Browse{" "}
              <Link href="/services" className="text-[#a47e43] underline">
                services
              </Link>{" "}
              or{" "}
              <Link href="/partners" className="text-[#a47e43] underline">
                partners
              </Link>{" "}
              to add favorites.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((favorite) => {
              const href =
                favorite.targetType === FavoriteTargetType.Vendor
                  ? `/partners/${favorite.targetId}`
                  : `/services/${favorite.targetId}`;

              const key = `${favorite.targetType}:${favorite.targetId}`;

              return (
                <div
                  key={favorite.id}
                  className="group flex items-center gap-4 rounded-2xl border border-[#eee7e1] bg-white p-4"
                >
                  <Link
                    href={href}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4eee9]"
                  >
                    {favorite.imageUrl ? (
                      <img
                        src={favorite.imageUrl}
                        alt={favorite.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#c9bcae]">
                        <ImageOff size={18} />
                      </div>
                    )}
                  </Link>

                  <Link href={href} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#30251f]">
                      {favorite.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#9b8f86]">
                      {favorite.targetType === FavoriteTargetType.Vendor
                        ? "Partner"
                        : "Service"}
                    </p>
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      remove(favorite.targetType, favorite.targetId)
                    }
                    disabled={actionLoading === key}
                    aria-label="Remove from favorites"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e4dbd0] text-[#9b8f86] transition hover:border-[#c0564a] hover:text-[#c0564a] disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
