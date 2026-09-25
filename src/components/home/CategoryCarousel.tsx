"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/types/category";

const PAGE_SIZE = 8;
const INTERVAL = 3000;
/** After a touch/click, wait this long before rotating again. */
const RESUME_AFTER_INTERACTION = 8000;

/**
 * Categories, 8 at a time. With more than 8, the next 8 slide in every 3
 * seconds - but never while the visitor is pointing at, focusing or has just
 * touched a card, so nothing moves out from under their finger.
 */
export default function CategoryCarousel({
  categories,
}: {
  categories: Category[];
}) {
  const { t, localize } = useLanguage();
  const pages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const holdTimer = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    const vis = () => setHidden(document.hidden);
    sync();
    mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", vis);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const paused =
    pages < 2 || hovered || focused || holding || hidden || reduced;

  // Advance every INTERVAL while not paused (restarts when the page changes).
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(
      () => setPage((p) => (p + 1) % pages),
      INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [paused, page, pages]);

  const hold = useCallback(() => {
    setHolding(true);
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(
      () => setHolding(false),
      RESUME_AFTER_INTERACTION,
    );
  }, []);

  useEffect(
    () => () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
    },
    [],
  );

  const go = (next: number) => {
    setPage(((next % pages) + pages) % pages);
    hold();
  };

  const safePage = Math.min(page, pages - 1);
  const visible = categories.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setFocused(false);
      }}
      onPointerDown={(e) => e.pointerType !== "mouse" && hold()}
      aria-roledescription="carousel"
      aria-label={t("home.categories.title")}
    >
      <div
        key={safePage}
        className="grid min-h-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        aria-live={paused ? "polite" : "off"}
      >
        {visible.map((category, i) => (
          <Link
            key={category.id}
            href={`/vendors?categoryId=${category.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#eee5df] bg-white p-4 shadow-[0_1px_2px_rgba(48,37,31,0.04)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#e6cfae] hover:shadow-[0_18px_40px_-18px_rgba(120,85,45,0.35)] motion-safe:animate-[catIn_.7s_cubic-bezier(.2,.8,.2,1)_both] sm:p-5"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span
              className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(226,183,119,0.22),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />
            <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf7f4] ring-1 ring-[#f1e8de] transition-all duration-500 ease-out group-hover:bg-linear-to-br group-hover:from-[#fdf6ec] group-hover:to-[#f6e8d4] group-hover:shadow-[0_10px_24px_-8px_rgba(164,126,67,0.45)] group-hover:ring-[#e6cfae] sm:h-14 sm:w-14">
              {category.iconUrl ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={category.iconUrl}
                  alt=""
                  className="h-7 w-7 object-contain transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-115 motion-reduce:transition-none sm:h-8 sm:w-8"
                />
              ) : (
                <span className="text-xl text-[#c9b8a8]" aria-hidden="true">
                  ✦
                </span>
              )}
            </div>
            <h3 className="line-clamp-1 text-sm font-bold text-[#30251f] sm:text-base">
              {localize(category.name)}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8a7d75]">
              {localize(category.description)}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold text-[#8e685e] transition-colors group-hover:text-[#a47e43] sm:text-xs">
              {t("home.categories.browseVendors")}
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(safePage - 1)}
            aria-label={t("home.categories.prev")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6ddd5] bg-white text-[#6f635b] transition hover:border-[#c9a26b] hover:text-[#30251f]"
          >
            <ChevronLeft size={16} className="rtl:rotate-180" />
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label={t("home.categories.pages")}
          >
            {Array.from({ length: pages }).map((_, i) => {
              const active = i === safePage;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={t("home.categories.goToPage", {
                    number: i + 1,
                    total: pages,
                  })}
                  onClick={() => go(i)}
                  className={`relative h-2 overflow-hidden rounded-full transition-all duration-500 ${
                    active
                      ? "w-10 bg-[#eadfd2]"
                      : "w-2 bg-[#ddd0c4] hover:bg-[#c9b39a]"
                  }`}
                >
                  {active && (
                    <span
                      key={`${safePage}-${paused}`}
                      className="absolute inset-y-0 start-0 rounded-full bg-[#a47e43]"
                      style={
                        paused
                          ? { width: "100%" }
                          : {
                              animation: `catProgress ${INTERVAL}ms linear both`,
                            }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go(safePage + 1)}
            aria-label={t("home.categories.next")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6ddd5] bg-white text-[#6f635b] transition hover:border-[#c9a26b] hover:text-[#30251f]"
          >
            <ChevronRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
