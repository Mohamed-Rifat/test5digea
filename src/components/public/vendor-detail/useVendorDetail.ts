"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useServices } from "@/features/services/hooks/useServices";
import { getVendorDetails } from "@/features/vendors/api";
import { fetchServiceReviews } from "@/features/reviews/api";
import { useRoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import { normalizeExternalUrl } from "@/lib/safe-url";
import type { RoadmapItem } from "@/types/roadmap";
import type { Review } from "@/types/review";
import type { Vendor } from "@/types/vendor";

import {
  SERVICES_PAGE_SIZE,
  type SocialLinks,
  type SortMode,
  type WorkingHours,
} from "./vendorDetailUtils";

/**
 * Loads a vendor, their services and reviews, and derives everything the
 * public vendor page shows (filters, sorting, social links, hours, …).
 */
export function useVendorDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { t, localize } = useLanguage();
  const roadmapPicker = useRoadmapPicker();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const {
    isFavorited,
    toggleFavorite,
    actionLoading,
  } = useFavorites();

  const {
    services,
    loading: servicesLoading,
  } = useServices(
    params.id
      ? {
          vendorId: params.id,
        }
      : undefined
  );

  // Per-service rating, derived from that service's own reviews (the API
  // doesn't expose an aggregate rating on the Service itself). We also reuse
  // this same fetch to power the "What clients say" section below, so it's
  // a single round of requests rather than fetching reviews twice.
  const [serviceRatings, setServiceRatings] = useState<
    Record<string, { avg: number; count: number }>
  >({});
  const [vendorReviews, setVendorReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [visibleServiceCount, setVisibleServiceCount] = useState(
    SERVICES_PAGE_SIZE
  );
  // The vendor page intentionally shows only the latest five reviews.
  // Full review history is available on the dedicated reviews page.

  // Reset pagination whenever the person changes filters, so they don't end
  // up looking at page 3 of a completely different, smaller result set.
  // (Adjusted during render rather than in an effect, per React's guidance
  // for state that depends on a prop/derived value changing.)
  const activeFilterKey = `${activeCategoryId}|${sortMode}`;
  const [lastFilterKey, setLastFilterKey] = useState(activeFilterKey);

  if (activeFilterKey !== lastFilterKey) {
    setLastFilterKey(activeFilterKey);
    setVisibleServiceCount(SERVICES_PAGE_SIZE);
  }

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      if (services.length === 0) {
        setReviewsLoading(false);
        return;
      }

      try {
        setReviewsLoading(true);

        const results = await Promise.all(
          services.map((service) =>
            fetchServiceReviews(service.id, {
              page: 1,
              pageSize: 100,
            }).catch(() => null)
          )
        );

        if (cancelled) return;

        const ratings: Record<
          string,
          { avg: number; count: number }
        > = {};
        const allReviews: Review[] = [];

        results.forEach((result, index) => {
          if (!result) return;

          const items = result.items ?? [];
          allReviews.push(...items);

          if (items.length > 0) {
            const avg =
              items.reduce((sum, r) => sum + r.rating, 0) /
              items.length;

            ratings[services[index].id] = {
              avg,
              count: result.totalCount ?? items.length,
            };
          }
        });

        allReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setServiceRatings(ratings);
        setVendorReviews(allReviews);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [services]);

  /* =========================================================
     Parse Social Links
  ========================================================= */

  const socialLinksJson = vendor?.socialLinksJson;
  const workingHoursJson = vendor?.workingHoursJson;

  const socialLinks = useMemo<SocialLinks>(() => {
    try {
      const parsed = socialLinksJson ? JSON.parse(socialLinksJson) : {};

      // Vendors type these links themselves: keep only real http(s) links so
      // a "javascript:" value can never end up in an href.
      const safe: SocialLinks = {};

      (["instagram", "facebook", "tiktok", "website"] as const).forEach((key) => {
        const link = normalizeExternalUrl(
          typeof parsed?.[key] === "string" ? parsed[key] : ""
        );

        if (link) safe[key] = link;
      });

      return safe;
    } catch {
      return {};
    }
  }, [socialLinksJson]);

  /* =========================================================
     Parse Working Hours
  ========================================================= */

  const workingHours = useMemo<WorkingHours>(() => {
    try {
      return workingHoursJson ? JSON.parse(workingHoursJson) : {};
    } catch {
      return {};
    }
  }, [workingHoursJson]);

  const hasSocialLinks =
    !!socialLinks.instagram ||
    !!socialLinks.facebook ||
    !!socialLinks.tiktok ||
    !!socialLinks.website;

  const todayJsDay = (new Date().getDay() + 1) % 7;

  /* =========================================================
     Load Vendor
  ========================================================= */

  useEffect(() => {
    const loadVendor = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(false);

        const data = await getVendorDetails(params.id);

        setVendor(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, [params.id]);

  /* =========================================================
     Share
  ========================================================= */

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: vendor?.businessName,
          url,
        });

        return;
      }
    } catch {
      // fallback
    }

    try {
      await navigator.clipboard.writeText(url);

      setShareCopied(true);

      setTimeout(() => {
        setShareCopied(false);
      }, 1800);
    } catch {
      // no-op
    }
  };

  /* =========================================================
     Loading
  ========================================================= */

  // Roadmap steps this vendor can fill. The API only accepts a vendor for a
  // step when they have an *approved* service in that category, so the
  // buttons come from approved services only - not from the vendor's
  // assigned categories (a category with no approved service would fail).
  const roadmapTargets: RoadmapItem[] = (() => {
    if (!roadmapPicker.roadmap) return [];
    const offered = services.filter(
      (s) => s.status === "Approved" || s.status === "approved"
    );
    const found = new Map<string, RoadmapItem>();
    offered.forEach((s) => {
      const item = roadmapPicker.findItem(s.categoryId, s.categoryName);
      if (item) found.set(String(item.categoryId), item);
    });
    // Came from a roadmap step: show just that one (if the vendor offers it).
    const fromUrl = roadmapPicker.findItem(searchParams.get("categoryId"));
    if (fromUrl && found.has(String(fromUrl.categoryId))) return [fromUrl];
    return Array.from(found.values());
  })();

  const approvedServices = services.filter(
    (service) =>
      service.status === "Approved" ||
      service.status === "approved"
  );

  const availableServices =
    approvedServices.length > 0
      ? approvedServices
      : services;

  // Distinct categories this vendor actually offers, in the order they
  // appear, each carrying how many services fall under it.
  const categoryMap = new Map<
    string,
    { id: string; name: string; count: number }
  >();

  availableServices.forEach((service) => {
    if (!service.categoryId) return;

    const existing = categoryMap.get(service.categoryId);

    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(service.categoryId, {
        id: service.categoryId,
        name: localize(service.categoryName) || t("vendors.detail.services.otherCategory"),
        count: 1,
      });
    }
  });

  const categoryOptions = Array.from(
    categoryMap.values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const hasMultipleCategories = categoryOptions.length > 1;

  const servicesWithRating = availableServices.map((service) => ({
    ...service,
    _avgRating: serviceRatings[service.id]?.avg ?? 0,
    _reviewCount: serviceRatings[service.id]?.count ?? 0,
  }));

  const byCategory = activeCategoryId
    ? servicesWithRating.filter(
        (service) => service.categoryId === activeCategoryId
      )
    : servicesWithRating;

  const sortByRating = (
    a: (typeof servicesWithRating)[number],
    b: (typeof servicesWithRating)[number]
  ) =>
    b._avgRating - a._avgRating ||
    b._reviewCount - a._reviewCount;

  const sortByNewest = (
    a: (typeof servicesWithRating)[number],
    b: (typeof servicesWithRating)[number]
  ) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime();

  let orderedServices: typeof servicesWithRating;

  if (sortMode === "rating") {
    orderedServices = [...byCategory].sort(sortByRating);
  } else if (sortMode === "newest") {
    orderedServices = [...byCategory].sort(sortByNewest);
  } else if (!activeCategoryId && hasMultipleCategories) {
    // "Recommended" with no category picked: surface a taste of every
    // category first (best-rated of each, up to two), then the rest —
    // instead of only ever showing services from whichever category
    // happens to come first.
    const perCategory = new Map<string, typeof servicesWithRating>();

    servicesWithRating.forEach((service) => {
      const list = perCategory.get(service.categoryId) ?? [];
      list.push(service);
      perCategory.set(service.categoryId, list);
    });

    const curated: typeof servicesWithRating = [];
    const rest: typeof servicesWithRating = [];

    categoryOptions.forEach(({ id }) => {
      const list = [...(perCategory.get(id) ?? [])].sort(
        sortByRating
      );

      curated.push(...list.slice(0, 2));
      rest.push(...list.slice(2));
    });

    orderedServices = [...curated, ...rest.sort(sortByRating)];
  } else {
    orderedServices = byCategory;
  }

  const displayedServices = orderedServices.slice(
    0,
    visibleServiceCount
  );

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "recommended", label: t("vendors.detail.services.sort.recommended") },
    { value: "rating", label: t("vendors.detail.services.sort.rating") },
    { value: "newest", label: t("vendors.detail.services.sort.newest") },
  ];

  return {
    vendor,
    loading,
    error,
    // favourites
    isFavorited,
    toggleFavorite,
    favoriteActionLoading: actionLoading,
    // share
    shareCopied,
    handleShare,
    // roadmap
    roadmapPicker,
    roadmapTargets,
    // contact / hours
    socialLinks,
    hasSocialLinks,
    workingHours,
    todayJsDay,
    // reviews
    vendorReviews,
    reviewsLoading,
    // services
    servicesLoading,
    availableServices,
    categoryOptions,
    hasMultipleCategories,
    activeCategoryId,
    setActiveCategoryId,
    sortMode,
    setSortMode,
    sortOptions,
    orderedServices,
    displayedServices,
  };
}

export type VendorDetail = ReturnType<typeof useVendorDetail>;
export type DisplayedService = VendorDetail["displayedServices"][number];
