"use client";

import Link from "next/link";
import {
  Heart,
  ImageOff,
  Loader2,
  Trash2,
  Store,
  Wrench,
  ArrowRight,
  Compass,
  CalendarDays,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatDate } from "@/lib/format";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import { FavoriteTargetType } from "@/types/favorite";
import type { Favorite } from "@/types/favorite";

import type { Tab } from "@/components/public/favorites/favoritesUtils";

export function FavoriteFallbackCard({
  favorite,
  isRemoving,
  onRemove,
}: {
  favorite: Favorite;
  isRemoving: boolean;
  onRemove: (targetType: FavoriteTargetType, targetId: string) => void;
}) {
  const { t, language } = useLanguage();

  const isVendor = favorite.targetType === FavoriteTargetType.Vendor;
  const href = isVendor
    ? `/vendors/${favorite.targetId}`
    : `/services/${favorite.targetId}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#eee7e1] bg-white shadow-[0_4px_24px_-12px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e0d3c4] hover:shadow-[0_20px_45px_-20px_rgba(48,37,31,0.28)]">
      {/* -------- Image -------- */}
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden bg-[#f4eee9]"
      >
        {favorite.imageUrl ? (
          <img
            loading="lazy"
            decoding="async"
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
          className={`absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rtl:tracking-normal shadow-sm backdrop-blur-md ${
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
          {isVendor
            ? t("favorites.badge.vendor")
            : t("favorites.badge.service")}
        </span>

        {/* remove button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(favorite.targetType, favorite.targetId);
          }}
          disabled={isRemoving}
          aria-label={t("favorites.removeFromFavorites")}
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#9b8f86] shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#c0564a] disabled:opacity-60"
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

          <p className="mt-1 text-xs text-[#9b8f86]">
            {t("favorites.detailsUnavailable")}
          </p>

          <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#9b8f86]">
            <CalendarDays className="h-3 w-3" />
            {t("favorites.savedOn", {
              date: formatDate(
                favorite.createdAt,
                LANGUAGE_DATE_LOCALE[language],
              ),
            })}
          </p>
        </Link>

        <div className="mt-5 flex items-center justify-between border-t border-[#f0e8dd] pt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a47e43] transition hover:gap-2.5"
          >
            {t("favorites.viewDetails")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(favorite.targetType, favorite.targetId)}
            disabled={isRemoving}
            className="text-xs font-medium text-[#9b8f86] transition hover:text-[#c0564a] disabled:opacity-60"
          >
            {isRemoving ? t("favorites.removing") : t("favorites.remove")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function FavoriteCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#eee7e1] bg-white">
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
  );
}

export function EmptyState({ tab, hasAny }: { tab: Tab; hasAny: boolean }) {
  const { t } = useLanguage();
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
          {isFiltered
            ? t("favorites.empty.filteredTitle")
            : t("favorites.empty.title")}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#766d67]">
          {isFiltered
            ? t("favorites.empty.filteredDescription")
            : t("favorites.empty.description")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 rounded-full bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#45362e]"
          >
            <Store className="h-4 w-4" />
            {t("favorites.empty.browseVendors")}
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-2.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#a47e43]"
          >
            <Compass className="h-4 w-4" />
            {t("favorites.empty.exploreServices")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FavoritesSkeleton() {
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
