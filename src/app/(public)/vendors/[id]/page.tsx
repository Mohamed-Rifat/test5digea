"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  ImageOff,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Share2,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import FavoriteButton from "@/components/shared/FavoriteButton";
import RatingStars from "@/components/shared/RatingStars";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useServices } from "@/features/services/hooks/useServices";
import { getVendorDetails } from "@/features/vendors/api";
import { fetchServiceReviews } from "@/features/reviews/api";
import { formatDate, formatPrice, startingPrice } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";
import { useRoadmapPicker } from "@/features/roadmap/hooks/useRoadmapPicker";
import RoadmapPickButton from "@/components/roadmap/RoadmapPickButton";
import type { RoadmapItem } from "@/types/roadmap";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import { normalizeExternalUrl } from "@/lib/safe-url";
import { FavoriteTargetType } from "@/types/favorite";
import type { Review } from "@/types/review";
import type { Vendor } from "@/types/vendor";

type SortMode = "recommended" | "rating" | "newest";

const SERVICES_PAGE_SIZE = 6;
const REVIEWS_PAGE_SIZE = 5;

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
};

type WorkingHours = Record<string, string>;

const DAYS_OF_WEEK = [
  {
    labelKey: "vendors.detail.hours.days.sat.name",
    shortKey: "vendors.detail.hours.days.sat.short",
    key: "sat",
    jsDay: 0,
  },
  {
    labelKey: "vendors.detail.hours.days.sun.name",
    shortKey: "vendors.detail.hours.days.sun.short",
    key: "sun",
    jsDay: 1,
  },
  {
    labelKey: "vendors.detail.hours.days.mon.name",
    shortKey: "vendors.detail.hours.days.mon.short",
    key: "mon",
    jsDay: 2,
  },
  {
    labelKey: "vendors.detail.hours.days.tue.name",
    shortKey: "vendors.detail.hours.days.tue.short",
    key: "tue",
    jsDay: 3,
  },
  {
    labelKey: "vendors.detail.hours.days.wed.name",
    shortKey: "vendors.detail.hours.days.wed.short",
    key: "wed",
    jsDay: 4,
  },
  {
    labelKey: "vendors.detail.hours.days.thu.name",
    shortKey: "vendors.detail.hours.days.thu.short",
    key: "thu",
    jsDay: 5,
  },
  {
    labelKey: "vendors.detail.hours.days.fri.name",
    shortKey: "vendors.detail.hours.days.fri.short",
    key: "fri",
    jsDay: 6,
  },
] as const;

/* =========================================================
   Skeleton
========================================================= */

function PageSkeleton() {
  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* Hero */}
      <section className="h-48 animate-pulse bg-[#eee6dc] sm:h-64" />

      <div className="mx-auto lg:max-w-10/12 px-4 sm:px-6 lg:px-8">
        {/* Vendor header */}
        <div className="-mt-14 rounded-3xl border border-[#eee7e1] bg-white p-5 shadow-sm sm:-mt-16 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-[#f4eee9] sm:h-28 sm:w-28" />

            <div className="flex-1 space-y-3">
              <div className="h-7 w-2/3 animate-pulse rounded-lg bg-[#f4eee9]" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-[#f4eee9]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#f4eee9]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-7 w-32 animate-pulse rounded bg-[#f4eee9]" />
              <div className="h-20 animate-pulse rounded-2xl bg-[#f4eee9]" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-40 animate-pulse rounded bg-[#f4eee9]" />

              <div className="grid gap-5 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-3xl bg-white"
                  >
                    <div className="aspect-4/3 animate-pulse bg-[#f4eee9]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#f4eee9]" />
                      <div className="h-3 w-full animate-pulse rounded bg-[#f4eee9]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[#f4eee9]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden h-72 animate-pulse rounded-3xl bg-white lg:block" />
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Social Icon
========================================================= */

function SocialIconButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8ddd4] bg-[#faf7f4] text-[#a47e43] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8c5b0] hover:bg-[#f0e8e0] hover:text-[#30251f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
    >
      {icon}
    </a>
  );
}

/* =========================================================
   Contact Row
========================================================= */

function ContactRow({
  href,
  icon,
  children,
  ariaLabel,
  ltr,
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
  ltr?: boolean;
}) {
  const baseClass =
    "flex min-w-0 items-center gap-3 rounded-2xl bg-[#faf7f4] px-4 py-3 text-sm text-[#5f544d] transition-all duration-200";

  const interactiveClass = href
    ? `${baseClass} hover:bg-[#f0e9e0] hover:text-[#30251f]`
    : baseClass;

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#a47e43] shadow-sm">
        {icon}
      </span>

      <span dir={ltr ? "ltr" : undefined} className="min-w-0 wrap-break-word">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={interactiveClass}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={baseClass}>
      {content}
    </div>
  );
}

/* =========================================================
   Page
========================================================= */

export default function VendorDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
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

  // Roadmap steps this vendor can fill: the category the couple came from
  // (?categoryId=… from the roadmap), otherwise every roadmap category the
  // vendor offers (from its services and its assigned categories).
  const roadmapTargets: RoadmapItem[] = (() => {
    if (!roadmapPicker.roadmap) return [];
    const fromUrl = roadmapPicker.findItem(searchParams.get("categoryId"));
    if (fromUrl) return [fromUrl];
    const found = new Map<string, RoadmapItem>();
    services.forEach((s) => {
      const item = roadmapPicker.findItem(s.categoryId, s.categoryName);
      if (item) found.set(String(item.categoryId), item);
    });
    roadmapPicker.matchingItems(vendor?.categories).forEach((item) =>
      found.set(String(item.categoryId), item)
    );
    return Array.from(found.values());
  })();

  if (loading) {
    return <PageSkeleton />;
  }

  /* =========================================================
     Error
  ========================================================= */

  if (error || !vendor) {
    return (
      <main className="min-h-screen bg-[#faf8f6]">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4eee9]">
            <Building2
              size={28}
              className="text-[#b99a62]"
            />
          </div>

          <h2 className="font-serif text-2xl text-[#30251f]">
            {error
              ? t("vendors.detail.notFound")
              : t("vendors.detail.notFoundTitle")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#766d67]">
            {t("vendors.detail.notFoundText")}
          </p>

          <Link
            href="/vendors"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#30251f] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#4a3a30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("vendors.detail.backToVendors")}
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     Services
  ========================================================= */

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
        name: service.categoryName || t("vendors.detail.services.otherCategory"),
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

  /* =========================================================
     Favorites
  ========================================================= */

  const isFav = isFavorited(
    FavoriteTargetType.Vendor,
    vendor.id
  );

  const favLoading =
    actionLoading ===
    `${FavoriteTargetType.Vendor}:${vendor.id}`;

  /* =========================================================
     Render
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#faf8f6] pb-24 lg:pb-16">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative h-48 overflow-hidden sm:h-64">
        {/* Background */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(145deg,#f1e8dc_0%,#e8d9c6_55%,#ddc8a8_100%)]"
        />

        {/* Texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #30251f 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Soft decorative glow */}
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"
        />

        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />

        {/* Fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#faf8f6] to-transparent"
        />

        {/* Hero controls */}
        <div className="relative mx-auto flex h-full lg:max-w-10/12 items-start justify-between px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">

          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#30251f]transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            <span className="text-[#9A8F86] hover:text-[#6b3203]">{t("vendors.detail.back")}</span>
          </Link>

          <div className="flex items-center gap-2">

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              aria-label={t("vendors.detail.share")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#30251f] shadow-sm backdrop-blur transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
            >
              {shareCopied ? (
                <Check size={16} />
              ) : (
                <Share2 size={16} />
              )}

              {shareCopied && (
                <span className="absolute end-0 top-12 whitespace-nowrap rounded-lg bg-[#30251f] px-2.5 py-1.5 text-[10px] text-white shadow-lg">
                  {t("vendors.detail.linkCopied")}
                </span>
              )}
            </button>

            {/* Favorite */}
            <div className="rounded-full border border-white/60 bg-white/85 p-0.5 shadow-sm backdrop-blur">
              <FavoriteButton
                targetType={FavoriteTargetType.Vendor}
                targetId={vendor.id}
                isFavorited={isFav}
                loading={favLoading}
                onToggle={toggleFavorite}
                size="sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="mx-auto lg:max-w-10/12 px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            VENDOR IDENTITY
        =================================================== */}

        <section className="relative -mt-14 bg-transparent p-4 sm:-mt-16 sm:p-7">

          <div className="flex items-center gap-3 sm:items-start sm:gap-5">

            {/* Logo */}
            <div className="relative h-20 w-20 shrink-0 sm:h-28 sm:w-28">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f4eee9] shadow-md ring-1 ring-[#e8ddd4]">

                {vendor.profileImageUrl ? (
                  <img
                    src={vendor.profileImageUrl}
                    alt={vendor.businessName}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2
                    size={38}
                    className="text-[#a47e43]"
                  />
                )}
              </div>

              {/* Verified */}
              <span
                className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#a47e43] text-white shadow-sm"
                title={t("vendors.detail.verified")}
              >
                <BadgeCheck size={13} />
              </span>
            </div>

            {/* Vendor information + social on the right */}
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              {/* Text block */}
              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="wrap-break-word font-serif text-xl font-light leading-tight rtl:leading-snug tracking-[-0.02em] rtl:tracking-normal text-[#30251f] sm:text-3xl">
                    {vendor.businessName}
                  </h1>
                </div>

                {vendor.slogan && (
                  <p className="mt-1.5 max-w-2xl text-sm italic rtl:not-italic leading-6 text-[#a47e43]">
                    {vendor.slogan}
                  </p>
                )}

                <div className="mt-2 flex min-w-0 flex-col items-start gap-1.5 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
                  <RatingStars
                    rating={vendor.averageRating}
                    reviewsCount={vendor.reviewsCount}
                  />

                  {vendor.location && (
                    <span className="flex min-w-0 max-w-full items-center gap-1.5 text-xs text-[#9b8f86] sm:text-sm">
                      <MapPin
                        size={13}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {vendor.location}
                      </span>
                    </span>
                  )}
                </div>

                {/* Add to wedding roadmap */}
                {(roadmapTargets.length > 0 ||
                  roadmapPicker.isGuest ||
                  (roadmapPicker.canUse && roadmapPicker.ready && !roadmapPicker.roadmap)) && (
                  <div className="mt-4 flex max-w-2xl flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {roadmapTargets.length > 0 ? (
                      roadmapTargets.map((item) => (
                        <RoadmapPickButton
                          key={String(item.categoryId)}
                          picker={roadmapPicker}
                          vendor={{ id: vendor.id, name: vendor.businessName }}
                          item={item}
                          size="sm"
                          showCategory={roadmapTargets.length > 1}
                          className="sm:w-auto sm:min-w-60"
                        />
                      ))
                    ) : (
                      <RoadmapPickButton
                        picker={roadmapPicker}
                        vendor={{ id: vendor.id, name: vendor.businessName }}
                        item={null}
                        size="sm"
                        className="sm:w-auto sm:min-w-60"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Social icons — right side */}
              {hasSocialLinks && (
                <div className="flex shrink-0 items-center gap-2.5 sm:pt-1">
                  {socialLinks.instagram && (
                    <SocialIconButton
                      href={socialLinks.instagram}
                      icon={
                        <FaInstagram className="h-4 w-4" />
                      }
                      label="Instagram"
                    />
                  )}

                  {socialLinks.facebook && (
                    <SocialIconButton
                      href={socialLinks.facebook}
                      icon={
                        <FaFacebookF className="h-4 w-4" />
                      }
                      label="Facebook"
                    />
                  )}

                  {socialLinks.tiktok && (
                    <SocialIconButton
                      href={socialLinks.tiktok}
                      icon={
                        <FaTiktok className="h-4 w-4" />
                      }
                      label="TikTok"
                    />
                  )}

                  {socialLinks.website && (
                    <SocialIconButton
                      href={socialLinks.website}
                      icon={<Globe2 size={16} />}
                      label={t("vendors.detail.website")}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            PAGE BODY
        =================================================== */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-12">

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="min-w-0">

            {/* =================================================
                SERVICES — FIRST
            ================================================= */}


            <section>
              <div className="mb-5 flex items-end justify-between gap-4">

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
                    {t("vendors.detail.services.eyebrow")}
                  </p>

                  <h2 className="font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                    {t("vendors.detail.services.title")}
                  </h2>
                </div>

                {!servicesLoading &&
                  availableServices.length > 0 && (
                    <span className="shrink-0 text-xs text-[#9b8f86]">
                      {availableServices.length === 1
                        ? t("vendors.detail.services.countOne", {
                            count: availableServices.length,
                          })
                        : t("vendors.detail.services.countMany", {
                            count: availableServices.length,
                          })}
                    </span>
                  )}
              </div>

              {/* Category filter + sort */}
              {!servicesLoading &&
                availableServices.length > 1 && (
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                    {hasMultipleCategories ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCategoryId("")}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                            activeCategoryId === ""
                              ? "bg-[#30251f] text-white"
                              : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#c9bcae]"
                          }`}
                        >
                          {t("vendors.detail.services.all")}
                        </button>

                        {categoryOptions.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              setActiveCategoryId(category.id)
                            }
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                              activeCategoryId === category.id
                                ? "bg-[#30251f] text-white"
                                : "border border-[#e4dbd0] bg-white text-[#5f544d] hover:border-[#c9bcae]"
                            }`}
                          >
                            {category.name}{" "}
                            <span
                              className={
                                activeCategoryId === category.id
                                  ? "text-white/70"
                                  : "text-[#9b8f86]"
                              }
                            >
                              ({category.count})
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span />
                    )}

                    <div className="relative shrink-0">
                      <SlidersHorizontal
                        size={13}
                        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#a47e43]"
                      />

                      <select
                        value={sortMode}
                        onChange={(e) =>
                          setSortMode(e.target.value as SortMode)
                        }
                        className="appearance-none rounded-full border border-[#e4dbd0] bg-white py-1.5 ps-8 pe-8 text-xs font-semibold text-[#5f544d] outline-none transition hover:border-[#c9bcae] focus-visible:ring-2 focus-visible:ring-[#b99a62]/40"
                      >
                        {sortOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#a47e43]"
                      />
                    </div>
                  </div>
                )}

              {/* Loading */}
              {servicesLoading && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[30px] border border-[#eee7e1] bg-white shadow-[0_10px_35px_rgba(48,37,31,0.04)]"
                    >
                      <div className="aspect-[1.08/1] animate-pulse bg-[#f4eee9]" />

                      <div className="space-y-4 p-5">
                        <div className="h-6 w-4/5 animate-pulse rounded-lg bg-[#f4eee9]" />
                        <div className="h-3 w-full animate-pulse rounded bg-[#f4eee9]" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#f4eee9]" />
                        <div className="my-4 h-px bg-[#eee7e1]" />
                        <div className="flex justify-between">
                          <div className="h-8 w-24 animate-pulse rounded-lg bg-[#f4eee9]" />
                          <div className="h-9 w-20 animate-pulse rounded-full bg-[#f4eee9]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty */}
              {!servicesLoading &&
                availableServices.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-14 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee9]">
                      <ImageOff
                        size={22}
                        className="text-[#b99a62]"
                      />
                    </div>

                    <p className="text-sm font-medium text-[#30251f]">
                      {t("vendors.detail.services.emptyTitle")}
                    </p>

                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#9b8f86]">
                      {t("vendors.detail.services.emptyText")}
                    </p>
                  </div>
                )}

              {/* No services match the selected category */}
              {!servicesLoading &&
                availableServices.length > 0 &&
                orderedServices.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-[#dfd2c5] bg-white px-6 py-10 text-center">
                    <p className="text-sm font-medium text-[#30251f]">
                      {t("vendors.detail.services.noneInCategory")}
                    </p>

                    <button
                      type="button"
                      onClick={() => setActiveCategoryId("")}
                      className="mt-3 text-xs font-semibold text-[#a47e43] underline-offset-2 hover:underline"
                    >
                      {t("vendors.detail.services.clearFilter")}
                    </button>
                  </div>
                )}

              {/* =================================================
                  PREMIUM SERVICE CARDS
              ================================================= */}

              {!servicesLoading &&
                displayedServices.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {displayedServices.map((service) => {
                      const price = startingPrice(service.prices);
                      const image = service.images?.[0]?.url;
                      const serviceRating =
                        service._avgRating > 0 ? service._avgRating : null;

                      return (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className="group relative flex min-w-0 flex-col overflow-hidden rounded-[30px] border border-[#e9dfd6] bg-white shadow-[0_10px_35px_rgba(48,37,31,0.045)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d8c4ae] hover:shadow-[0_24px_60px_rgba(48,37,31,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
                        >
                          {/* Image */}
                          <div className="relative aspect-[1.08/1] overflow-hidden bg-[#f4eee9]">
                            {image ? (
                              <img
                                src={image}
                                alt={service.name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-[#c9bcae] shadow-sm backdrop-blur">
                                  <ImageOff size={23} />
                                </div>
                              </div>
                            )}

                            {/* Editorial image overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-[#241b17]/55 via-transparent to-[#241b17]/5 opacity-80" />

                        

                            {/* Rating */}
                            {serviceRating !== null && (
                              <span className="absolute end-4 top-4 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#30251f] shadow-lg backdrop-blur-md">
                                <Star
                                  size={11}
                                  className="fill-[#a47e43] text-[#a47e43]"
                                />
                                {Number(serviceRating).toFixed(1)}
                              </span>
                            )}

                            {/* Bottom image eyebrow */}
                            <div className="absolute bottom-4 start-4 end-4 flex items-end justify-between gap-3">
                              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-white/80">
                                {t("vendors.detail.services.weddingService")}
                              </span>

                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#30251f] shadow-lg backdrop-blur transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105">
                                <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col p-5 sm:p-5.5">
                            <h3 className="line-clamp-2 min-h-[3.4rem] font-serif text-[20px] font-light leading-[1.7] text-[#30251f] transition-colors duration-300 group-hover:text-[#8f6d3d]">
                              {service.name}
                            </h3>

                            {service.description ? (
                              <p className="mt-2.5 line-clamp-2 text-[12px] leading-6 text-[#94877e]">
                                {service.description}
                              </p>
                            ) : (
                              <p className="mt-2.5 line-clamp-2 text-[12px] leading-6 text-[#b2a59c]">
                                {t("vendors.detail.services.defaultDescription")}
                              </p>
                            )}

                            {/* Divider */}
                            <div className="my-5 h-px bg-linear-to-r from-[#eadfd5] via-[#eee7e1] to-transparent" />

                            {/* Footer */}
                            <div className="mt-auto flex items-end justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] rtl:tracking-normal text-[#a99a90]">
                                  {t("vendors.detail.services.startingFrom")}
                                </p>

                                <p className="mt-1 truncate text-[14px] font-semibold text-[#a47e43]">
                                  {price !== null
                                    ? `${formatPrice(price)} ${t("common.currency")}`
                                    : t("vendors.detail.services.contactForPricing")}
                                </p>
                              </div>

                              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e7ddd4] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal text-[#30251f] transition-all duration-300 group-hover:border-[#cbb08d] group-hover:bg-[#faf6f2]">
                                {t("vendors.detail.services.explore")}
                                <ArrowUpRight
                                  size={12}
                                  className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

            </section>

            {/* =================================================
                REVIEWS — WHAT CLIENTS SAY
            ================================================= */}

            <VendorReviewsSection
              vendor={vendor}
              reviews={vendorReviews}
              loading={reviewsLoading}
            />

            {/* =================================================
                MOBILE SIDEBAR CONTENT
            ================================================= */}

            <div className="mt-10 space-y-6 lg:hidden">

              <div id="contact">
                <ContactCard vendor={vendor} />
              </div>

              {Object.keys(workingHours).length > 0 && (
                <WorkingHoursCard
                  workingHours={workingHours}
                  todayJsDay={todayJsDay}
                />
              )}
            </div>
          </div>

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden space-y-6 lg:sticky lg:top-6 lg:block lg:self-start">

            {/* About */}
            {vendor.bio && <AboutCard vendor={vendor} />}

            {/* Contact */}
            <div
              id="contact"
              className="rounded-3xl border border-[#e3d7cd] bg-white p-6 shadow-[0_12px_32px_rgba(48,37,31,0.05)]"
            >

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
                  {t("vendors.detail.contact.eyebrow")}
                </p>

                <h2 className="mt-1.5 font-serif text-xl font-light text-[#30251f]">
                  {t("vendors.detail.contact.title")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#958980]">
                  {t("vendors.detail.contact.text", { name: vendor.businessName })}
                </p>
              </div>

              <div className="mt-5 space-y-2.5">

                {vendor.contactPhone && (
                  <ContactRow
                    href={`tel:${vendor.contactPhone}`}
            ltr
                    icon={<Phone size={15} />}
                    ariaLabel={t("vendors.detail.contact.call", {
              name: vendor.businessName,
            })}
                  >
                    {vendor.contactPhone}
                  </ContactRow>
                )}

                {vendor.contactEmail && (
                  <ContactRow
                    href={`mailto:${vendor.contactEmail}`}
            ltr
                    icon={<Mail size={15} />}
                    ariaLabel={t("vendors.detail.contact.email", {
              name: vendor.businessName,
            })}
                  >
                    {vendor.contactEmail}
                  </ContactRow>
                )}

                {vendor.location && (
                  <ContactRow
                    icon={<MapPin size={15} />}
                  >
                    {vendor.location}
                  </ContactRow>
                )}

                {!vendor.contactPhone &&
                  !vendor.contactEmail &&
                  !vendor.location && (
                    <p className="rounded-2xl bg-[#faf7f4] p-4 text-sm text-[#968a82]">
                      {t("vendors.detail.contact.none")}
                    </p>
                  )}
              </div>
            </div>

            {/* Working Hours */}
            {Object.keys(workingHours).length > 0 && (
              <WorkingHoursCard
                workingHours={workingHours}
                todayJsDay={todayJsDay}
              />
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================
          MOBILE CONTACT BAR
      ===================================================== */}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e7ded6] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(48,37,31,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2.5">

          <a
            href="#contact"
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#30251f] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#49382f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            {t("vendors.detail.contact.cta")}
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </a>

          <div className="rounded-full border border-[#e9e0d8] p-0.5">
            <FavoriteButton
              targetType={FavoriteTargetType.Vendor}
              targetId={vendor.id}
              isFavorited={isFav}
              loading={favLoading}
              onToggle={toggleFavorite}
              size="sm"
            />
          </div>

          <button
            type="button"
            onClick={handleShare}
            aria-label={t("vendors.detail.share")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e9e0d8] bg-white text-[#30251f] transition-all duration-200 hover:bg-[#faf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b99a62]/50"
          >
            {shareCopied ? (
              <Check size={16} />
            ) : (
              <Share2 size={16} />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Contact Card
========================================================= */

function ContactCard({
  vendor,
}: {
  vendor: Vendor;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#e3d7cd] bg-white p-6 shadow-[0_12px_32px_rgba(48,37,31,0.05)]">

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {t("vendors.detail.contact.eyebrow")}
        </p>

        <h2 className="mt-1.5 font-serif text-xl font-light text-[#30251f]">
          {t("vendors.detail.contact.title")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#958980]">
          {t("vendors.detail.contact.text", { name: vendor.businessName })}
        </p>
      </div>

      <div className="mt-5 space-y-2.5">

        {vendor.contactPhone && (
          <ContactRow
            href={`tel:${vendor.contactPhone}`}
            ltr
            icon={<Phone size={15} />}
            ariaLabel={t("vendors.detail.contact.call", {
              name: vendor.businessName,
            })}
          >
            {vendor.contactPhone}
          </ContactRow>
        )}

        {vendor.contactEmail && (
          <ContactRow
            href={`mailto:${vendor.contactEmail}`}
            ltr
            icon={<Mail size={15} />}
            ariaLabel={t("vendors.detail.contact.email", {
              name: vendor.businessName,
            })}
          >
            {vendor.contactEmail}
          </ContactRow>
        )}

        {vendor.location && (
          <ContactRow
            icon={<MapPin size={15} />}
          >
            {vendor.location}
          </ContactRow>
        )}

        {!vendor.contactPhone &&
          !vendor.contactEmail &&
          !vendor.location && (
            <p className="rounded-2xl bg-[#faf7f4] p-4 text-sm text-[#968a82]">
              {t("vendors.detail.contact.none")}
            </p>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   Vendor Reviews Section ("What clients say")
========================================================= */

function VendorReviewsSection({
  vendor,
  reviews,
  loading,
}: {
  vendor: Vendor;
  reviews: Review[];
  loading: boolean;
}) {
  const { t, language } = useLanguage();

  // The vendor profile is intentionally kept editorial and compact:
  // only the five newest reviews are shown here.
  const latestReviews = reviews.slice(0, REVIEWS_PAGE_SIZE);
  const hasMoreReviews = reviews.length > REVIEWS_PAGE_SIZE;

  return (
    <section className="mt-12 border-t border-[#e9e0d8] pt-9">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
            {t("vendors.detail.reviews.eyebrow")}
          </p>

          <h2 className="flex items-center gap-2 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
            <MessageSquareText
              size={20}
              className="text-[#a47e43]"
            />
            {t("vendors.detail.reviews.title")}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {vendor.reviewsCount > 0 && (
            <RatingStars
              rating={vendor.averageRating}
              reviewsCount={vendor.reviewsCount}
            />
          )}

          {hasMoreReviews && (
            <Link
              href={`/vendors/${vendor.id}/reviews`}
              className="hidden items-center gap-1.5 rounded-full border border-[#e4dbd0] bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rtl:tracking-normal text-[#30251f] transition-all duration-200 hover:border-[#cbb08d] hover:bg-[#faf7f4] sm:inline-flex"
            >
              {t("vendors.detail.reviews.viewAll")}
              <ArrowUpRight size={12} className="rtl:-scale-x-100" />
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-[#eee7e1] bg-white"
            />
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="rounded-2xl border border-[#eee7e1] bg-white p-6 text-center text-sm text-[#9b8f86]">
          {t("vendors.detail.reviews.empty", { name: vendor.businessName })}
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {latestReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-[#eee7e1] bg-white p-4 shadow-[0_8px_28px_rgba(48,37,31,0.035)] transition-all duration-300 hover:border-[#e1d3c6] hover:shadow-[0_14px_36px_rgba(48,37,31,0.06)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e9e2] text-[#a47e43]">
                      <User size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#30251f]">
                        {review.userFullName || t("vendors.detail.reviews.anonymous")}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#9b8f86]">
                        {review.serviceName} ·{" "}
                        {formatDate(review.createdAt, LANGUAGE_DATE_LOCALE[language])}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                </div>

                {review.comment && (
                  <p dir="auto" className="mt-3 whitespace-pre-line text-sm leading-7 text-[#5f544d]">
                    {review.comment}
                  </p>
                )}
              </article>
            ))}
          </div>

          {hasMoreReviews && (
            <div className="mt-6 flex justify-center sm:hidden">
              <Link
                href={`/vendors/${vendor.id}/reviews`}
                className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-5 py-2.5 text-xs font-semibold text-[#30251f] transition-all duration-200 hover:border-[#b99a62] hover:bg-[#faf7f4]"
              >
                {t("vendors.detail.reviews.viewAllReviews")}
                <ArrowUpRight size={13} className="rtl:-scale-x-100" />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* =========================================================
   About Card
========================================================= */

function AboutCard({
  vendor,
}: {
  vendor: Vendor;
}) {
  const { t } = useLanguage();

  if (!vendor.bio) return null;

  return (
    <section className="rounded-xl border border-[#e3d7cd] bg-white p-6 shadow-[0_12px_32px_rgba(48,37,31,0.05)] ">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a47e43]">
          {t("vendors.detail.about.eyebrow")}
        </p>

        <h2 className="mt-1.5 flex items-center gap-2 font-serif text-xl font-light text-[#30251f]">
          <Building2
            size={17}
            className="text-[#a47e43]"
          />
          {t("vendors.detail.about.title")}
        </h2>
      </div>

      <div className="mt-5 rounded-2xl p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-[#958980]">
          {vendor.bio}
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   Working Hours Card
========================================================= */

function WorkingHoursCard({
  workingHours,
  todayJsDay,
}: {
  workingHours: WorkingHours;
  todayJsDay: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#eee7e1] bg-white p-6">

      <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-light text-[#30251f]">
        <Calendar
          size={16}
          className="text-[#a47e43]"
        />

        {t("vendors.detail.hours.title")}
      </h2>

      <div className="space-y-2">

        {DAYS_OF_WEEK.map(
          ({
            labelKey,
            shortKey,
            key,
            jsDay,
          }) => {
            const value = workingHours[key];

            if (!value) return null;

            const isOff = value === "OFF";
            const isToday =
              jsDay === todayJsDay;

            return (
              <div
                key={key}
                className={`flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-sm ${
                  isToday
                    ? "bg-[#f3e6e1] ring-1 ring-[#ead8ca]"
                    : "bg-[#faf7f4]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">

                  <Clock3
                    size={14}
                    className={
                      isToday
                        ? "text-[#a47e43]"
                        : "text-[#c2b5aa]"
                    }
                  />

                  <span className="hidden text-[#5f544d] sm:inline">
                    {t(labelKey)}
                  </span>

                  <span className="text-[#5f544d] sm:hidden">
                    {t(shortKey)}
                  </span>

                  {isToday && (
                    <span className="rounded-full bg-[#a47e43] px-2 py-0.5 text-[9px] font-semibold text-white">
                      {t("vendors.detail.hours.today")}
                    </span>
                  )}
                </div>

                <span
                  className={
                    isOff
                      ? "shrink-0 text-xs font-semibold text-rose-500"
                      : "shrink-0 text-xs font-medium text-[#5f544d]"
                  }
                >
                  {isOff
                    ? t("vendors.detail.hours.dayOff")
                    : value}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}