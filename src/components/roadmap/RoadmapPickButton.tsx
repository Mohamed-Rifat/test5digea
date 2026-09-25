"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2, HeartHandshake, Loader2, Map as MapIcon, RefreshCw } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { loginPathFor } from "@/lib/auth-utils";
import type { PickVendor, RoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import { RoadmapItemStatus, type RoadmapItem } from "@/types/roadmap";

interface Props {
  picker: RoadmapPicker;
  vendor: PickVendor;
  /** The roadmap step this vendor would fill (null = no matching step). */
  item: RoadmapItem | null;
  /** Show the category name in the button (vendor pages with several categories). */
  showCategory?: boolean;
  /** Visual size. */
  size?: "md" | "sm";
  /** Show guest / no-roadmap / not-in-roadmap helper states (detail pages). */
  showHelpers?: boolean;
  className?: string;
}

/**
 * One button that covers the whole "add this vendor to my wedding" flow:
 * sign in → start a roadmap → choose / replace → chosen ✓ (with a link to
 * the roadmap). Every state is explicit so the couple always knows what
 * happened.
 */
export default function RoadmapPickButton({
  picker,
  vendor,
  item,
  showCategory,
  size = "md",
  showHelpers = true,
  className = "",
}: Props) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const here = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const base =
    size === "sm"
      ? "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition"
      : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition";
  const primary = `${base} bg-[#30251f] text-white hover:bg-[#46382f] disabled:opacity-60`;
  const secondary = `${base} border border-[#e4dbd0] bg-white text-[#30251f] hover:border-[#b99a62] hover:text-[#8f6330]`;

  if (!picker.ready) {
    return showHelpers ? (
      <div className={`${base} animate-pulse bg-[#f1ebe5] ${className}`} aria-hidden="true" />
    ) : null;
  }

  if (picker.isGuest) {
    return showHelpers ? (
      <Link href={loginPathFor(here)} className={`${secondary} ${className}`}>
        <HeartHandshake size={17} aria-hidden="true" />
        {t("roadmap.pick.signIn")}
      </Link>
    ) : null;
  }

  // Vendors and admins don't have a roadmap.
  if (!picker.canUse) return null;

  if (!picker.roadmap) {
    return showHelpers ? (
      <Link
        href={`/roadmap?returnTo=${encodeURIComponent(here)}`}
        className={`${secondary} ${className}`}
      >
        <MapIcon size={17} aria-hidden="true" />
        {t("roadmap.pick.startRoadmap")}
      </Link>
    ) : null;
  }

  if (!item) {
    return showHelpers ? (
      <p className={`rounded-xl bg-[#f8f1e4] px-4 py-3 text-center text-sm text-[#8c6a3c] ${className}`}>
        {t("roadmap.pick.notInRoadmap")}
      </p>
    ) : null;
  }

  const isChosen = item.selectedVendorId === vendor.id;
  const isPicking = picker.pickingCategoryId === String(item.categoryId);
  const label = showCategory
    ? t("roadmap.pick.chooseFor", { category: item.categoryName })
    : t("roadmap.pick.choose");

  if (isChosen) {
    const done = item.status === RoadmapItemStatus.Completed;
    return (
      <div className={`space-y-2 ${className}`}>
        <div
          className={`${base} cursor-default bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`}
          role="status"
        >
          <CheckCircle2 size={17} aria-hidden="true" />
          <span className="truncate">
            {done ? t("roadmap.pick.completed") : t("roadmap.pick.chosen")}
            {showCategory ? ` · ${item.categoryName}` : ""}
          </span>
        </div>
        {showHelpers && (
          <Link
            href="/roadmap"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#a47e43] underline-offset-4 hover:underline"
          >
            <MapIcon size={15} aria-hidden="true" />
            {t("roadmap.pick.viewRoadmap")}
          </Link>
        )}
      </div>
    );
  }

  const replacing = Boolean(item.selectedVendorId);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <button
        type="button"
        disabled={isPicking}
        onClick={() => picker.pick(item, vendor)}
        className={replacing ? secondary : primary}
      >
        {isPicking ? (
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
        ) : replacing ? (
          <RefreshCw size={16} aria-hidden="true" />
        ) : (
          <HeartHandshake size={17} aria-hidden="true" />
        )}
        <span className="truncate">{replacing ? t("roadmap.pick.replace") : label}</span>
      </button>
      {replacing && showHelpers && (
        <p className="truncate text-center text-xs text-[#8b7e76]">
          {t("roadmap.pick.currently", { name: item.selectedVendorName || "—" })}
        </p>
      )}
    </div>
  );
}
