"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { compareServices, getService } from "@/features/services/api";
import { compareVendorList, getVendorDetails } from "@/features/vendors/api";
import { useCompare } from "@/context/CompareContext";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import {
  CompareError,
  type ErrorState,
  MAX_COMPARE,
} from "@/components/public/compare/compareUtils";

/** Loads the compared services / vendors and derives rows, "best" values etc. */
export function useCompareData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t, localize } = useLanguage();
  const { selected, hydrated, removeService, clearAll } = useCompare();

  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const type = searchParams.get("type") || "";
  const urlIds = useMemo(
    () => (searchParams.get("ids") || "").split(",").filter(Boolean),
    [searchParams],
  );
  const categoryId = searchParams.get("categoryId") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  // Service objects never carry the provider's photo (only vendorId /
  // vendorBusinessName), so it's fetched separately per unique vendorId
  // and kept here, keyed by vendorId.
  const [vendorProfiles, setVendorProfiles] = useState<Record<string, string>>(
    {},
  );
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
            contextIds.includes(id),
          );

          let categoryIds: string[];
          if (hasTrustedSelection && selected.length >= ids.length) {
            categoryIds = ids.map(
              (id) => selected.find((item) => item.id === id)?.categoryId || "",
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
            (item) => !item.images || item.images.length === 0,
          );

          let hydratedResult = result;
          if (needsImageHydration) {
            try {
              const details = await Promise.all(
                result.map((item) => getService(item.id)),
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
            new Set(
              hydratedResult.map((item) => item.vendorId).filter(Boolean),
            ),
          );
          Promise.all(
            vendorIds.map((id) =>
              getVendorDetails(id)
                .then((vendor) => [id, vendor.profileImageUrl || ""] as const)
                .catch(() => [id, ""] as const),
            ),
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
            // Validation states (e.g. "pick at least two") are already shown
            // inline in the empty state - no error toast for them.
            setError({ key: err.key, params: err.params });
          } else {
            const message = getApiErrorMessage(
              err,
              tRef.current("compare.errors.generic"),
            );
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
    [...(v.galleryImages ?? [])].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );

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
          get: (s: Service) => localize(s.categoryName) || "—",
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
        get: (v: Vendor) =>
          v.categories?.map((c) => localize(c)).join(", ") || "—",
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
  }, [isServiceComparison, t, localize]);

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

  return {
    router,
    searchParams,
    selected,
    hydrated,
    removeService,
    clearAll,
    type,
    urlIds,
    categoryId,
    services,
    vendors,
    vendorProfiles,
    loading,
    error,
    showOnlyDiff,
    setShowOnlyDiff,
    lightbox,
    setLightbox,
    isServiceComparison,
    items,
    serviceImages,
    vendorImages,
    rows,
    visibleRows,
    best,
    handleRemove,
    errorText,
    gridTemplate,
  };
}

export type CompareData = ReturnType<typeof useCompareData>;
