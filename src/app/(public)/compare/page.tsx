"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  GitCompare,
  ImageOff,
  Info,
  Package,
  Trash2,
  X,
} from "lucide-react";

import { compareServices, getService } from "@/features/services/api";
import { compareVendorList, getVendorDetails } from "@/features/vendors/api";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice } from "@/lib/format";
import ImageLightbox from "@/components/shared/ImageLightbox";
import type { TranslationKey } from "@/locales";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

const MAX_COMPARE = 4;
const LABEL_COL_WIDTH = 160;

type TranslationParams = Record<string, string | number>;

class CompareError extends Error {
  key: TranslationKey;
  params?: TranslationParams;
  constructor(key: TranslationKey, params?: TranslationParams) {
    super(key);
    this.key = key;
    this.params = params;
  }
}

type ErrorState =
  | { key: TranslationKey; params?: TranslationParams }
  | { message: string };

/* ═══════════════════════════════════════════════════════════
   Reusable primitives
   ═══════════════════════════════════════════════════════════ */

/** Sticky label cell — always visible when scrolling horizontally. */
function LabelCell({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="sticky start-0 z-20 flex items-center gap-2 border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-3.5 text-[13px] font-medium text-[#111827]"
      style={{ width: LABEL_COL_WIDTH, minWidth: LABEL_COL_WIDTH }}
    >
      {icon && <span className="shrink-0 text-[#9ca3af]">{icon}</span>}
      <span className="truncate">{children}</span>
    </div>
  );
}

/** Value cell for a given column. */
function ValueCell({
  children,
  emphasized = false,
  className = "",
}: {
  children: React.ReactNode;
  emphasized?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-l border-[#e5e7eb] px-4 py-3.5 text-[13px] leading-[1.55] ${
        emphasized ? "text-[#111827]" : "text-[#374151]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Number badge for ranking (#1, #2, ...). */
function Rank({ n }: { n: number }) {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[10px] font-semibold text-white">
      {n}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════ */

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { selected, hydrated, removeService, clearAll } = useCompare();

  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const type = searchParams.get("type") || "";
  const urlIds = useMemo(
    () => (searchParams.get("ids") || "").split(",").filter(Boolean),
    [searchParams]
  );
  const categoryId = searchParams.get("categoryId") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  // Service objects never carry the provider's photo (only vendorId /
  // vendorBusinessName), so it's fetched separately per unique vendorId
  // and kept here, keyed by vendorId.
  const [vendorProfiles, setVendorProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [showOnlyDiff, setShowOnlyDiff] = useState(false);
  const [lightbox, setLightbox] = useState<{
    images: { id: string; url: string }[];
    index: number;
    title: string;
  } | null>(null);

  /* ── Data load ── */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hydrated) return;
      setLoading(true);
      setError(null);

      try {
        const ids = Array.from(new Set(urlIds));
        if (ids.length < 2) throw new CompareError("compare.errors.selectTwo");
        if (ids.length > MAX_COMPARE)
          throw new CompareError("compare.errors.maxItems", {
            max: MAX_COMPARE,
          });

        if (type === "service") {
          const contextIds = selected.map((item) => item.id);
          const hasTrustedSelection = ids.every((id) =>
            contextIds.includes(id)
          );

          let categoryIds: string[];
          if (hasTrustedSelection && selected.length >= ids.length) {
            categoryIds = ids.map(
              (id) =>
                selected.find((item) => item.id === id)?.categoryId || ""
            );
          } else {
            const details = await Promise.all(ids.map((id) => getService(id)));
            categoryIds = details.map((item) => item.categoryId);
          }

          const firstCategoryId = categoryIds[0];
          if (
            !firstCategoryId ||
            categoryIds.some((id) => id !== firstCategoryId)
          ) {
            throw new CompareError("compare.errors.sameCategory");
          }

          const result = await compareServices({ serviceIds: ids });
          const returnedCategoryIds = result.map((item) => item.categoryId);
          if (returnedCategoryIds.some((id) => id !== firstCategoryId)) {
            throw new CompareError("compare.errors.mixedCategories");
          }

          const needsImageHydration = result.some(
            (item) => !item.images || item.images.length === 0
          );

          let hydratedResult = result;
          if (needsImageHydration) {
            try {
              const details = await Promise.all(
                result.map((item) => getService(item.id))
              );
              hydratedResult = result.map((item, i) => ({
                ...item,
                images:
                  item.images && item.images.length > 0
                    ? item.images
                    : details[i]?.images || [],
              }));
            } catch {
              hydratedResult = result;
            }
          }

          if (!cancelled) setServices(hydratedResult);

          // Best-effort, non-blocking: fetch each distinct provider's photo.
          // A failed lookup just leaves that vendor without a photo (the
          // header falls back to the placeholder icon) instead of breaking
          // the whole comparison.
          const vendorIds = Array.from(
            new Set(hydratedResult.map((item) => item.vendorId).filter(Boolean))
          );
          Promise.all(
            vendorIds.map((id) =>
              getVendorDetails(id)
                .then((vendor) => [id, vendor.profileImageUrl || ""] as const)
                .catch(() => [id, ""] as const)
            )
          ).then((entries) => {
            if (!cancelled) setVendorProfiles(Object.fromEntries(entries));
          });

          return;
        }

        if (type === "vendor") {
          if (!categoryId)
            throw new CompareError("compare.errors.selectCategory");
          const result = await compareVendorList({
            vendorIds: ids,
            categoryId,
          });
          if (!cancelled) setVendors(result);
          return;
        }

        throw new CompareError("compare.errors.invalid");
      } catch (err: unknown) {
        if (!cancelled) {
          if (err instanceof CompareError) {
            setError({ key: err.key, params: err.params });
            toast(tRef.current(err.key, err.params), "error");
          } else {
            const message =
              (err instanceof Error && err.message) ||
              tRef.current("compare.errors.generic");
            setError({ message });
            toast(message, "error");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, urlIds.join(","), categoryId, selected, hydrated, toast]);

  const isServiceComparison = type === "service";
  const items = isServiceComparison ? services : vendors;

  const serviceImages = (s: Service) =>
    [...(s.images ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const vendorImages = (v: Vendor) =>
    [...(v.galleryImages ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  /* ── Rows ── */
  const rows = useMemo(() => {
    if (isServiceComparison) {
      return [
        {
          key: "vendor",
          label: t("compare.rows.vendor"),
          get: (s: Service) => s.vendorBusinessName || "—",
        },
        {
          key: "category",
          label: t("compare.rows.category"),
          get: (s: Service) => s.categoryName || "—",
        },
        {
          key: "description",
          label: t("compare.rows.description"),
          get: (s: Service) => s.description || "—",
          multiline: true,
        },
      ];
    }
    return [
      {
        key: "rating",
        label: t("compare.rows.rating"),
        get: (v: Vendor) => `${Number(v.averageRating || 0).toFixed(1)} / 5`,
      },
      {
        key: "reviews",
        label: t("compare.rows.reviews"),
        get: (v: Vendor) => String(v.reviewsCount ?? 0),
      },
      {
        key: "category",
        label: t("compare.rows.category"),
        get: (v: Vendor) => v.categories?.join(", ") || "—",
      },
      {
        key: "location",
        label: t("compare.rows.location"),
        get: (v: Vendor) => v.location || "—",
      },
      {
        key: "bio",
        label: t("compare.rows.description"),
        get: (v: Vendor) => v.bio || "—",
        multiline: true,
      },
    ];
  }, [isServiceComparison, t]);

  const visibleRows = useMemo(() => {
    if (!showOnlyDiff || items.length < 2) return rows;
    return rows.filter((row) => {
      const values = items.map((item) => row.get(item as never));
      return new Set(values).size > 1;
    });
  }, [rows, items, showOnlyDiff]);

  /* ── Best values (for subtle emphasis) ── */
  const best = useMemo(() => {
    if (isServiceComparison) {
      const priceMins: Record<string, number> = {};
      services.forEach((s) => {
        const nums = (s.prices || []).map((p) => Number(p.price));
        priceMins[s.id] = nums.length ? Math.min(...nums) : Infinity;
      });
      const finite = Object.values(priceMins).filter((x) => Number.isFinite(x));
      const overallMin = finite.length ? Math.min(...finite) : Infinity;
      const hasMultiple = finite.length > 1;
      return { priceMins, overallMin, hasMultiple };
    }
    const ratings = vendors.map((v) => Number(v.averageRating || 0));
    const maxRating = ratings.length ? Math.max(...ratings) : 0;
    const hasMultiple = new Set(ratings).size > 1;
    return { maxRating, hasMultiple };
  }, [services, vendors, isServiceComparison]);

  /* ── Handlers ── */
  const handleRemove = (id: string) => {
    removeService(id);
    const nextIds = urlIds.filter((x) => x !== id);
    if (nextIds.length > 0) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("ids", nextIds.join(","));
      if (nextIds.length < 2) next.delete("categoryId");
      router.replace(`/compare?${next.toString()}`);
    } else {
      router.replace("/services");
    }
  };

  const errorText = error
    ? "key" in error
      ? t(error.key, error.params)
      : error.message
    : "";

  const gridTemplate = `repeat(${items.length}, minmax(220px, 1fr))`;

  /* ═══════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen bg-white">
      {/* ── Page header ── */}
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            >
              <ArrowLeft
                size={15}
                className="transition group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
              />
              {t("common.back")}
            </button>

            {isServiceComparison && selected.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  router.replace("/services");
                }}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#fef2f2] hover:text-[#b91c1c]"
              >
                <Trash2 size={14} />
                {t("compare.clearAll")}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Title block ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare size={18} className="text-[#111827]" />
              <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[#111827]">
                {isServiceComparison
                  ? t("compare.titleServices")
                  : t("compare.titleVendors")}
              </h1>
            </div>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              {t("compare.description")}
            </p>
          </div>

          {!loading && !error && items.length >= 2 && (
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-[#374151]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showOnlyDiff}
                  onClick={() => setShowOnlyDiff((v) => !v)}
                  className={`relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full transition-colors ${
                    showOnlyDiff ? "bg-[#111827]" : "bg-[#d1d5db]"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                      showOnlyDiff ? "translate-x-[15px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
                {t("compare.showOnlyDifferences")}
              </label>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        {loading ? (
          <LoadingState
            columns={Math.max(2, Math.min(MAX_COMPARE, urlIds.length || 2))}
          />
        ) : error ? (
          <ErrorStateBlock
            text={errorText}
            href={isServiceComparison ? "/services" : "/vendors"}
            cta={t("compare.backToMarketplace")}
          />
        ) : items.length < 2 ? (
          <EmptyState text={t("compare.errors.selectTwo")} />
        ) : (
          <>
            {/* ── Same-category notice (services) ── */}
            {isServiceComparison && (
              <div className="mt-5 flex items-start gap-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-[12.5px] text-[#4b5563]">
                <Info size={14} className="mt-0.5 shrink-0 text-[#6b7280]" />
                <span>{t("compare.sameCategoryNotice")}</span>
              </div>
            )}

            {/* ── Comparison table ── */}
            <div className="mt-5 overflow-hidden rounded-lg border border-[#e5e7eb]">
              <div className="overflow-x-auto">
                <div style={{ minWidth: LABEL_COL_WIDTH + items.length * 220 }}>
                  {/* ▸ Product header row */}
                  <div
                    className="grid sticky top-0 z-30 border-b border-[#e5e7eb] bg-white"
                    style={{
                      gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
                    }}
                  >
                    <div
                      className="sticky start-0 z-20 flex items-end bg-[#fafafa] px-4 pb-4 pt-5"
                      style={{
                        width: LABEL_COL_WIDTH,
                        minWidth: LABEL_COL_WIDTH,
                      }}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                        {t("compare.comparison")}
                      </span>
                    </div>

                    {items.map((item, idx) => {
                      const s = item as Service;
                      const v = item as Vendor;

                      // ── Header image ──
                      // Services: vendor's profile photo, fetched separately
                      // into vendorProfiles (service photos are shown in the
                      // gallery row further down, never here).
                      // Vendors:  profile photo (or first gallery image as fallback)
                      const serviceGallery = isServiceComparison
                        ? serviceImages(s)
                        : [];
                      const vendorGallery = !isServiceComparison
                        ? vendorImages(v)
                        : [];

                      const headerImage = isServiceComparison
                        ? vendorProfiles[s.vendorId] || null
                        : v.profileImageUrl || vendorGallery[0]?.url || null;

                      // ── Lightbox source ──
                      const lightboxImages = isServiceComparison
                        ? serviceGallery
                        : vendorGallery;

                      const title = isServiceComparison ? s.name : v.businessName;
                      const href = isServiceComparison
                        ? `/services/${item.id}`
                        : `/vendors/${item.id}`;

                      const canZoom = lightboxImages.length > 0;

                      return (
                        <div
                          key={item.id}
                          className="relative border-l border-[#e5e7eb] px-4 pb-4 pt-5"
                        >
                          {/* Remove btn */}
                          {isServiceComparison && (
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              aria-label={t("compare.removeItem", { title })}
                              className="absolute end-3 top-3 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#b91c1c]"
                            >
                              <X size={14} />
                            </button>
                          )}

                          <div className="flex flex-col">
                            {/* Rank */}
                            <div className="mb-3 flex items-center gap-2">
                              <Rank n={idx + 1} />
                              <span className="text-[11px] font-medium uppercase tracking-wider text-[#9ca3af]">
                                {t("compare.item")}
                              </span>
                            </div>

                            {/* Header image */}
                            <button
                              type="button"
                              onClick={() => {
                                if (canZoom) {
                                  setLightbox({
                                    images: lightboxImages,
                                    index: 0,
                                    title,
                                  });
                                }
                              }}
                              disabled={!canZoom}
                              className={`group relative mb-3 block aspect-[4/3] w-full overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f9fafb] transition ${
                                canZoom
                                  ? "cursor-zoom-in hover:border-[#d1d5db]"
                                  : "cursor-default"
                              }`}
                            >
                              {headerImage ? (
                                <>
                                  <img
                                    src={headerImage}
                                    alt={title}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                  />
                                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/[0.04]" />
                                </>
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageOff
                                    size={20}
                                    className="text-[#d1d5db]"
                                  />
                                </div>
                              )}
                            </button>

                            <h2 className="line-clamp-2 text-[14px] font-semibold leading-[1.4] text-[#111827]">
                              {title}
                            </h2>

                            <Link
                              href={href}
                              className="mt-1.5 inline-flex w-fit items-center gap-0.5 text-[12.5px] font-medium text-[#1d4ed8] hover:underline"
                            >
                              {t("compare.viewDetails")}
                              <ChevronRight
                                size={12}
                                className="rtl:rotate-180"
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ▸ Attribute rows */}
                  {visibleRows.map((row) => (
                    <div
                      key={row.key}
                      className="grid hover:bg-[#fafafa]"
                      style={{
                        gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
                      }}
                    >
                      <LabelCell>{row.label}</LabelCell>
                      {items.map((item) => (
                        <ValueCell
                          key={`${row.key}-${item.id}`}
                          emphasized={!row.multiline}
                        >
                          {row.multiline ? (
                            <p className="line-clamp-4 text-[#4b5563]">
                              {row.get(item as never)}
                            </p>
                          ) : (
                            row.get(item as never)
                          )}
                        </ValueCell>
                      ))}
                    </div>
                  ))}

                  {/* ▸ Packages row (services) */}
                  {isServiceComparison && (
                    <div
                      className="grid hover:bg-[#fafafa]"
                      style={{
                        gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
                      }}
                    >
                      <LabelCell icon={<Package size={13} />}>
                        {t("compare.packages")}
                      </LabelCell>
                      {services.map((service) => {
                        const hasPrices = !!service.prices?.length;
                        const minPrice = hasPrices
                          ? Math.min(
                              ...(service.prices || []).map((p) =>
                                Number(p.price)
                              )
                            )
                          : Infinity;
                        const isCheapest =
                          best.hasMultiple &&
                          hasPrices &&
                          minPrice === best.overallMin;

                        return (
                          <ValueCell
                            key={`pkg-${service.id}`}
                            emphasized={isCheapest}
                          >
                            {hasPrices ? (
                              <div className="space-y-1.5">
                                {service.prices!.map((price) => {
                                  const isRowBest =
                                    best.hasMultiple &&
                                    Number(price.price) === best.overallMin;
                                  return (
                                    <div
                                      key={price.id}
                                      className="flex items-baseline justify-between gap-3 rounded border border-[#f3f4f6] bg-[#fafafa] px-2.5 py-1.5"
                                    >
                                      <span className="min-w-0 truncate text-[12.5px] text-[#4b5563]">
                                        {price.label}
                                      </span>
                                      <span
                                        className={`shrink-0 text-[13px] tabular-nums ${
                                          isRowBest
                                            ? "font-semibold text-[#111827]"
                                            : "font-medium text-[#374151]"
                                        }`}
                                      >
                                        {formatPrice(price.price)}{" "}
                                        <span className="text-[11px] font-normal text-[#6b7280]">
                                          {t("common.currency")}
                                        </span>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-[12.5px] text-[#6b7280]">
                                {t("compare.contactVendor")}
                              </span>
                            )}
                          </ValueCell>
                        );
                      })}
                    </div>
                  )}

                  {/* ▸ Gallery row */}
                  <div
                    className="grid hover:bg-[#fafafa]"
                    style={{
                      gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
                    }}
                  >
                    <LabelCell>{t("compare.gallery")}</LabelCell>
                    {items.map((item) => {
                      const s = item as Service;
                      const v = item as Vendor;
                      const images = isServiceComparison
                        ? serviceImages(s)
                        : vendorImages(v);
                      const title = isServiceComparison
                        ? s.name
                        : v.businessName;
                      const visible = images.slice(0, 4);
                      const extra = images.length - visible.length;

                      return (
                        <ValueCell key={`gal-${item.id}`}>
                          {images.length ? (
                            <div className="grid grid-cols-4 gap-1">
                              {visible.map((img, i) => {
                                const isLast = i === visible.length - 1;
                                const showOverlay = isLast && extra > 0;
                                return (
                                  <button
                                    key={img.id}
                                    type="button"
                                    onClick={() =>
                                      setLightbox({ images, index: i, title })
                                    }
                                    className="group relative aspect-square overflow-hidden rounded border border-[#e5e7eb] bg-[#f9fafb] transition hover:border-[#d1d5db]"
                                  >
                                    <img
                                      src={img.url}
                                      alt=""
                                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    {showOverlay && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-semibold text-white">
                                        +{extra}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex h-14 items-center justify-center rounded border border-dashed border-[#e5e7eb] text-[11.5px] text-[#9ca3af]">
                              {t("compare.noImages")}
                            </div>
                          )}
                        </ValueCell>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer note ── */}
            <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#9ca3af]">
              <Info size={12} />
              {t("compare.tip")}
            </p>
          </>
        )}
      </div>

      <ImageLightbox
        images={lightbox?.images || []}
        initialIndex={lightbox?.index || 0}
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        title={lightbox?.title}
      />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   States
   ═══════════════════════════════════════════════════════════ */

function LoadingState({ columns }: { columns: number }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[#e5e7eb]">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `${LABEL_COL_WIDTH}px repeat(${columns}, minmax(220px, 1fr))`,
        }}
      >
        <div className="border-b border-[#e5e7eb] bg-[#fafafa]" />
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="border-b border-l border-[#e5e7eb] px-4 py-5">
            <div className="animate-pulse space-y-3">
              <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
              <div className="aspect-[4/3] w-full rounded-md bg-[#f3f4f6]" />
              <div className="h-4 w-3/4 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
            </div>
          </div>
        ))}
        {[1, 2, 3].map((r) => (
          <div key={`row-${r}`} className="contents">
            <div className="border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-3.5">
              <div className="h-3 w-20 animate-pulse rounded bg-[#f3f4f6]" />
            </div>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`r${r}-c${i}`}
                className="border-b border-l border-[#e5e7eb] px-4 py-3.5"
              >
                <div className="h-3 w-full animate-pulse rounded bg-[#f3f4f6]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorStateBlock({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-12 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fef2f2]">
        <GitCompare size={18} className="text-[#b91c1c]" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-[#111827]">{text}</h3>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 rounded-md bg-[#111827] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1f2937]"
      >
        {cta}
        <ChevronRight size={14} className="rtl:rotate-180" />
      </Link>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-[#e5e7eb] bg-[#fafafa] p-12 text-center">
      <GitCompare size={22} className="mx-auto text-[#d1d5db]" />
      <p className="mt-3 text-[13px] text-[#6b7280]">{text}</p>
    </div>
  );
}
