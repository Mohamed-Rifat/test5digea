"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Compass,
  Handshake,
  Heart,
  Paperclip,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Users,
  Users2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { FaGooglePlay, FaApple } from "react-icons/fa";

import ServiceCard from "@/components/public/ServiceCard";
import VendorCard from "@/components/public/VendorCard";
import RatingStars from "@/components/shared/RatingStars";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { getServices } from "@/features/services/api";
import { searchVendorList } from "@/features/vendors/api";
import { fetchServiceReviews } from "@/features/reviews/api";

import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import type { Review } from "@/types/review";

const FEATURED_COUNT = 6;
const VISIBLE_CATEGORIES = 6;

// 3 seconds
const TESTIMONIAL_INTERVAL = 3000;

// Small deterministic tilt values so each pinned testimonial card looks
// like it was placed by hand, without relying on Math.random() (which
// would cause a hydration mismatch between server and client).
const TESTIMONIAL_TILTS = [-3, 2.5, -2.5, 3, -1.5, 2, -3.5, 1.5];

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dqwoefi7l/video/upload/promo-Wedding_jvscmu.mp4";

export default function Home() {
  const { isAuthenticated, isUser } = useAuth();
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  // Only pitch "join us" to guests and couples — vendors are already in,
  // and admins manage the platform.
  const canJoinAsVendor = !isAuthenticated || isUser;

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const visibleCategories = useMemo(
    () => categories.slice(0, VISIBLE_CATEGORIES),
    [categories]
  );

  // ------------------------------------------------------------------
  // Featured services
  // ------------------------------------------------------------------

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(false);

        const data = await getServices();

        if (!cancelled) {
          setAllServices(data);
        }
      } catch {
        if (!cancelled) {
          setServicesError(true);
        }
      } finally {
        if (!cancelled) {
          setServicesLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredServices = allServices.slice(0, FEATURED_COUNT);

  // ------------------------------------------------------------------
  // Featured vendors
  // ------------------------------------------------------------------

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadVendors = async () => {
      try {
        setVendorsLoading(true);
        setVendorsError(false);

        const data = await searchVendorList({
          sortBy: 0,
          page: 1,

          // Load enough vendors so vendor ratings
          // can be found for testimonial reviews.
          pageSize: 100,
        });

        if (!cancelled) {
          setVendors(data.items);
        }
      } catch {
        if (!cancelled) {
          setVendorsError(true);
        }
      } finally {
        if (!cancelled) {
          setVendorsLoading(false);
        }
      }
    };

    loadVendors();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredVendors = vendors.slice(0, FEATURED_COUNT);

  // ------------------------------------------------------------------
  // Testimonials
  // ------------------------------------------------------------------

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      if (featuredServices.length === 0) {
        if (!cancelled && !servicesLoading) {
          setReviewsLoading(false);
        }

        return;
      }

      try {
        setReviewsLoading(true);

        const results = await Promise.all(
          featuredServices.map((service) =>
            fetchServiceReviews(service.id, {
              page: 1,
              pageSize: 20,
            }).catch(() => null)
          )
        );

        if (cancelled) return;

        const allReviews: Review[] = [];

        results.forEach((result) => {
          if (result) {
            allReviews.push(...(result.items ?? []));
          }
        });

        const withComments = allReviews.filter(
          (review) =>
            review.comment && review.comment.trim().length > 0
        );

        const pool =
          withComments.length > 0 ? withComments : allReviews;

        pool.sort(
          (a, b) =>
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setReviews(pool.slice(0, 12));
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allServices, servicesLoading]);

  // ------------------------------------------------------------------
  // Hero video
  // ------------------------------------------------------------------

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // ------------------------------------------------------------------
  // Testimonials carousel
  // ------------------------------------------------------------------

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalReviews = reviews.length;

  useEffect(() => {
    if (totalReviews <= 1 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % totalReviews;
      });
    }, TESTIMONIAL_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [totalReviews, isPaused]);

  // Keep index safe if reviews change.
  useEffect(() => {
    if (totalReviews === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= totalReviews) {
      setActiveIndex(0);
    }
  }, [totalReviews, activeIndex]);

  const goToTestimonial = (index: number) => {
    if (totalReviews === 0) return;

    const nextIndex =
      ((index % totalReviews) + totalReviews) %
      totalReviews;

    setActiveIndex(nextIndex);
  };

  const goToPrevTestimonial = () => goToTestimonial(activeIndex - 1);
  const goToNextTestimonial = () => goToTestimonial(activeIndex + 1);

  // In RTL the flex track lays slides out right-to-left, so it has to slide
  // in the opposite direction to bring the next slide into view.
  const trackOffset = (isRtl ? 1 : -1) * activeIndex * 100;

  const currentReview = reviews[activeIndex];
  const currentTilt =
    TESTIMONIAL_TILTS[activeIndex % TESTIMONIAL_TILTS.length];

  // ------------------------------------------------------------------
  // Vendor helpers
  // ------------------------------------------------------------------

  // Review.vendorId and Vendor.id are both strings, so this is a plain
  // string lookup — no numeric conversion needed (that mismatch was the
  // source of the "string vs number" TS error).
  const getVendorById = (vendorId?: string) => {
    if (!vendorId) return null;

    return vendors.find((vendor) => vendor.id === vendorId) ?? null;
  };

  const currentVendor = getVendorById(currentReview?.vendorId);

  const vendorRating = currentVendor?.averageRating ?? null;

  return (
    <main className="min-h-screen bg-[#faf8f6]">

      {/* ================= Hero ================= */}

      <section className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-linear-to-b from-[#1c140f]/70 via-[#1c140f]/55 to-[#1c140f]/75 sm:bg-[#1c140f]/55" />

          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            className="h-full w-full object-cover object-[center_35%] sm:scale-105 sm:object-center"
          >
            <source
              src={HERO_VIDEO_URL}
              type="video/mp4"
            />
          </video>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={t("home.hero.toggleSound")}
          className="absolute end-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 sm:end-8 sm:top-8"
        >
          {isMuted ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>

        <div className="relative z-20 mx-auto w-full px-4 py-16 text-center sm:px-6 lg:max-w-10/12 lg:px-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#e8cd9a]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/80">
              5digea
            </span>
          </div>

          <h1 className="font-serif text-4xl font-light leading-tight rtl:leading-snug text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
            {t("home.hero.title")}{" "}
            <span className="italic rtl:not-italic text-[#e8cd9a]">
              {t("home.hero.titleHighlight")}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            {t("home.hero.description")}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#30251f] shadow-lg transition hover:bg-[#f3ede6] hover:shadow-xl"
            >
              <Search size={16} />
              {t("home.hero.exploreServices")}
            </Link>

            <Link
              href="/vendors"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              <Store size={16} />
              {t("home.hero.browseVendors")}
            </Link>
          </div>

          <div className="mt-14 flex justify-center">
            <div className="flex h-9 w-5.5 items-start justify-center rounded-full border-2 border-white/40 pt-1.5">
              <div className="h-1.5 w-1 animate-bounce rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= Categories ================= */}

      <section className="mx-auto px-4 py-16 sm:px-6 lg:max-w-10/12 lg:px-8">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
              {t("home.categories.eyebrow")}
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              {t("home.categories.title")}
            </h2>
          </div>

          {categories.length > VISIBLE_CATEGORIES && (
            <Link
              href="/vendors"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
            >
              {t("common.viewAll")} <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          )}
        </div>

        {categoriesLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
              />
            ))}
          </div>
        )}

        {!categoriesLoading && categoriesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">
              {t("home.categories.loadError")}
            </p>
          </div>
        )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
              <p className="text-[#756960]">
                {t("home.categories.empty")}
              </p>
            </div>
          )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/vendors?categoryId=${category.id}`}
                    className="group rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {category.iconUrl ? (
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#faf7f4]">
                        <img
                          src={category.iconUrl}
                          alt={category.name}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#faf7f4]">
                        <span className="text-2xl text-[#c9b8a8]">
                          ✦
                        </span>
                      </div>
                    )}

                    <h3 className="mb-2 text-xl font-semibold text-[#30251f]">
                      {category.name}
                    </h3>

                    <p className="line-clamp-3 text-sm leading-6 text-[#81746d]">
                      {category.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
                      {t("home.categories.browseVendors")} <ArrowRight size={14} className="rtl:rotate-180" />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
      </section>

      {/* ================= Featured vendors ================= */}

      <section className="mx-auto px-4 pb-20 sm:px-6 lg:max-w-10/12 lg:px-8">

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
              {t("home.vendors.eyebrow")}
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              {t("home.vendors.title")}
            </h2>
          </div>

          <Link
            href="/vendors"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
          >
            {t("common.viewAll")} <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>

        {vendorsLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
              />
            ))}
          </div>
        )}

        {!vendorsLoading && vendorsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-medium text-red-600">
              {t("home.vendors.loadError")}
            </p>
          </div>
        )}

        {!vendorsLoading &&
          !vendorsError &&
          vendors.length === 0 && (
            <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
              <p className="text-[#756960]">
                {t("home.vendors.empty")}
              </p>
            </div>
          )}

        {!vendorsLoading &&
          !vendorsError &&
          vendors.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                />
              ))}
            </div>
          )}

        <Link
          href="/vendors"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
        >
          {t("home.vendors.viewAllVendors")} <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </section>

      {/* ================= Featured services ================= */}

      <section className="bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto lg:max-w-10/12">

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
                {t("home.services.eyebrow")}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
                {t("home.services.title")}
              </h2>
            </div>

            <Link
              href="/services"
              className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
            >
              {t("common.viewAll")} <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>

          {servicesLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-[#eee5df] bg-white"
                />
              ))}
            </div>
          )}

          {!servicesLoading && servicesError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
              <p className="font-medium text-red-600">
                {t("home.services.loadError")}
              </p>
            </div>
          )}

          {!servicesLoading &&
            !servicesError &&
            featuredServices.length === 0 && (
              <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
                <p className="text-[#756960]">
                  {t("home.services.empty")}
                </p>
              </div>
            )}

          {!servicesLoading &&
            !servicesError &&
            featuredServices.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            )}

          <Link
            href="/services"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
          >
            {t("home.services.viewAllServices")} <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* ================= Testimonials ================= */}

      {!reviewsLoading && reviews.length > 0 && (
        <section
          className="relative overflow-hidden bg-linear-to-b from-[#241713] via-[#2e1b16] to-[#241713] py-24 sm:py-28"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Hidden SVG filter — gives the card its hand-torn paper edge */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <filter
                id="torn-paper-edge"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012 0.045"
                  numOctaves="4"
                  seed="7"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="16"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>

          {/* Decorative glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 rounded-full bg-[#a47e43]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-75 w-75 rounded-full bg-[#a47e43]/10 blur-3xl" />

          <div className="relative mx-auto px-4 sm:px-6 lg:max-w-10/12 lg:px-8">
            {/* Header */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#c9ad82]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9bf98] rtl:tracking-normal">
                  {t("home.testimonials.eyebrow")}
                </span>
                <span className="h-px w-10 bg-[#c9ad82]" />
              </div>

              <h2 className="font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#faf6ef] sm:text-4xl lg:text-5xl">
                {t("home.testimonials.title")}{" "}
                <span className="ms-2 italic rtl:not-italic text-[#e0b64a]">
                  {t("home.testimonials.titleHighlight")}
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#c9bcae] sm:text-base">
                {t("home.testimonials.description")}
              </p>
            </div>

            {/* Pinned review card */}
            <div className="relative mx-auto mt-16 max-w-5xl">
              {/* Prev / next controls */}
              {totalReviews > 1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      isRtl ? goToNextTestimonial : goToPrevTestimonial
                    }
                    aria-label={
                      isRtl
                        ? t("home.testimonials.next")
                        : t("home.testimonials.previous")
                    }
                    className="absolute left-0 top-1/2 z-30 hidden h-10 w-10 -translate-x-14 -translate-y-1/2 items-center justify-center rounded-full border border-[#4a352c] bg-[#2e1b16]/70 text-[#e6d7c2] backdrop-blur transition hover:border-[#e0b64a] hover:text-[#e0b64a] sm:flex"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={
                      isRtl ? goToPrevTestimonial : goToNextTestimonial
                    }
                    aria-label={
                      isRtl
                        ? t("home.testimonials.previous")
                        : t("home.testimonials.next")
                    }
                    className="absolute right-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 translate-x-14 items-center justify-center rounded-full border border-[#4a352c] bg-[#2e1b16]/70 text-[#e6d7c2] backdrop-blur transition hover:border-[#e0b64a] hover:text-[#e0b64a] sm:flex"
                  >
                    <ArrowRight size={16} />
                  </button>
                </>
              )}

              {/* Paperclip (ثابت فوق، مش بيتكرر) */}
              <Paperclip
                strokeWidth={1.4}
                className="absolute -top-9 right-10 z-20 h-16 w-16 rotate-[-20deg] text-[#e6c257] drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] sm:-top-10 sm:right-14 sm:h-20 sm:w-20"
              />

              {/* Sliding track — الكارتس بتتحرك يمين/شمال بدل النطة */}
              <div className="relative overflow-hidden px-2">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(${trackOffset}%)` }}
                >
                  {reviews.map((review, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <div
                        key={review.id}
                        className="w-full shrink-0 px-3"
                        aria-hidden={!isActive}
                        style={
                          {
                            "--tilt": isActive ? "-2deg" : "0deg",
                          } as React.CSSProperties
                        }
                      >
                        <div className="animate-testimonial-in relative">
                          {/* Torn-paper background */}
                          <div
                            className="absolute inset-3 rounded-sm bg-[#fbf6ea] sm:inset-4"
                            style={{
                              filter:
                                "url(#torn-paper-edge) drop-shadow(0 25px 40px rgba(0,0,0,0.45))",
                              backgroundImage:
                                "radial-gradient(circle at 15% 20%, rgba(120,95,60,0.08), transparent 40%), radial-gradient(circle at 85% 80%, rgba(120,95,60,0.07), transparent 45%)",
                            }}
                          />

                          {/* Card content */}
                          <div className="relative px-7 py-10 sm:px-11 sm:py-12">
                            {/* Reviewer */}
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-[#fbf6ea] bg-linear-to-br from-[#ead9bd] to-[#c9a879] text-lg font-semibold text-[#5a4632] shadow-md sm:h-16 sm:w-16">
                                {review?.userFullName?.charAt(0)?.toUpperCase() ||
                                  "?"}
                              </div>

                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h3 className="text-base font-bold text-[#2c2015] sm:text-lg">
                                    {review?.userFullName || t("home.testimonials.happyCouple")}
                                  </h3>
                                  <BadgeCheck className="h-4 w-4 shrink-0 text-[#c9962e]" />
                                </div>
                                <p className="text-xs font-medium text-[#a4937d] sm:text-sm">
                                  {t("home.testimonials.customer")}
                                </p>
                              </div>
                            </div>

                            {/* Quote */}
                            <p
                              dir="auto"
                              className="mt-7 text-[15px] leading-8 text-[#493a2c] sm:text-[17px] sm:leading-9"
                            >
                              &ldquo;{review?.comment}&rdquo;
                            </p>

                            {/* Customer rating — five stars */}
                            <div className="mt-8 flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={26}
                                  className={
                                    i < Math.round(review?.rating ?? 0)
                                      ? "fill-[#e0b64a] text-[#e0b64a]"
                                      : "fill-transparent text-[#e3d7c2]"
                                  }
                                />
                              ))}
                            </div>

                            {/* Vendor + their rating */}
                            {(review?.vendorId || review?.vendorBusinessName) && (
                              <div className="mt-7 flex items-center justify-between gap-3 border-t border-dashed border-[#e3d6bd] pt-5">
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a4937d] rtl:tracking-normal">
                                    {t("home.testimonials.reviewedVendor")}
                                  </p>

                                  {review?.vendorId ? (
                                    <Link
                                      href={`/vendors/${review.vendorId}`}
                                      className="text-sm font-semibold text-[#5a4632] transition hover:text-[#a47e43]"
                                    >
                                      {review.vendorBusinessName ||
                                        t("home.testimonials.weddingVendor")}
                                    </Link>
                                  ) : (
                                    <span className="text-sm font-semibold text-[#5a4632]">
                                      {review?.vendorBusinessName}
                                    </span>
                                  )}
                                </div>

                                {isActive && vendorRating !== null && (
                                  <RatingStars rating={vendorRating} size={12} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dots */}
            {totalReviews > 1 && (
              <div className="mt-9 flex items-center justify-center gap-2">
                {reviews.map((review, index) => (
                  <button
                    key={review.id}
                    type="button"
                    aria-label={t("home.testimonials.goTo", { number: index + 1 })}
                    onClick={() => goToTestimonial(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex
                      ? "w-8 bg-[#e0b64a]"
                      : "w-1.5 bg-[#5a4638] hover:bg-[#7a5f47]"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= About teaser ================= */}

      <section className="border-y border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto grid gap-10 lg:max-w-10/12 lg:grid-cols-[1fr_1fr] lg:items-center">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171] rtl:tracking-normal">
              {t("home.about.eyebrow")}
            </p>

            <h2 className="mt-2 max-w-lg font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
              {t("home.about.title")}{" "}
              <span className="italic rtl:not-italic text-[#a47e43]">
                {t("home.about.titleHighlight")}
              </span>.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
              {t("home.about.description")}
            </p>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-6 py-3 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#30251f]"
            >
              {t("home.about.cta")}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <ShieldCheck size={18} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                {t("home.about.vetted.title")}
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                {t("home.about.vetted.description")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Compass size={18} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                {t("home.about.guided.title")}
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                {t("home.about.guided.description")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Heart size={18} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                {t("home.about.reviews.title")}
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                {t("home.about.reviews.description")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Users size={18} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                {t("home.about.couples.title")}
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                {t("home.about.couples.description")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= Join us — become a vendor ================= */}

      {canJoinAsVendor && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid gap-10 rounded-4xl border border-[#e4dbd0] bg-white p-8 shadow-sm lg:max-w-10/12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-[#faf7f4] px-3 py-1.5">
                <Handshake size={14} className="text-[#a47e43]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8171] rtl:tracking-normal">
                  {t("home.join.badge")}
                </span>
              </div>

              <h2 className="mt-5 max-w-lg font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
                {t("home.join.title")}{" "}
                <span className="italic rtl:not-italic text-[#a47e43]">
                  {t("home.join.titleHighlight")}
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
                {t("home.join.description")}
              </p>

              <Link
                href="/become-a-vendor"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#c6a66f] bg-[#30251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#42332a]"
              >
                <Handshake size={15} />
                {t("home.join.cta")}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
                  <Users2 size={18} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                  {t("home.join.reach.title")}
                </h3>
                <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                  {t("home.join.reach.description")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
                  <BadgeCheck size={18} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                  {t("home.join.badgeCard.title")}
                </h3>
                <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                  {t("home.join.badgeCard.description")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#eee5df] bg-[#faf7f4] p-5 sm:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a47e43]">
                  <TrendingUp size={18} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                  {t("home.join.grow.title")}
                </h3>
                <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                  {t("home.join.grow.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= Coming Soon — Mobile App ================= */}

      <section className="border-y border-[#eee7e1] bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">

        <div className="mx-auto lg:max-w-10/12">

          {/* Glass card */}
          <div className="relative overflow-hidden rounded-md border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_rgba(48,37,31,0.08),0_1px_0_rgba(255,255,255,0.9)_inset,0_-1px_0_rgba(48,37,31,0.04)_inset] backdrop-blur-xl sm:p-12">

            {/* Soft gradient tint behind the glass */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/60 via-white/20 to-[#f3ece2]/40" />

            {/* Colorful blobs (blurred) that show through the glass */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#e8d4b0]/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#d9c2a1]/40 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 top-1/4 h-56 w-56 rounded-full bg-[#f5e6cf]/40 blur-3xl" />

            {/* Top highlight line */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur">
                  <Smartphone
                    size={13}
                    className="text-[#a47e43]"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8367] rtl:tracking-normal">
                    {t("home.app.badge")}
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-3xl font-light leading-tight rtl:leading-snug text-[#30251f] sm:text-4xl">
                  {t("home.app.title")}{" "}
                  <span className="italic rtl:not-italic text-[#a47e43]">
                    {t("home.app.titleHighlight")}
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
                  {t("home.app.description")}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">

                  <div
                    aria-disabled="true"
                    className="group flex cursor-not-allowed items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-start text-white opacity-90 shadow-lg transition"
                  >
                    <FaApple className="h-6 w-6" />

                    <div className="leading-tight">
                      <p className="text-[9px] uppercase tracking-widest text-white/60 rtl:tracking-normal">
                        {t("home.app.comingSoonOn")}
                      </p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </div>

                  <div
                    aria-disabled="true"
                    className="group flex cursor-not-allowed items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-start text-white opacity-90 shadow-lg transition"
                  >
                    <FaGooglePlay className="h-5 w-5" />

                    <div className="leading-tight">
                      <p className="text-[9px] uppercase tracking-widest text-white/60 rtl:tracking-normal">
                        {t("home.app.comingSoonOn")}
                      </p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Phone mockup */}

              <div className="relative mx-auto w-full max-w-65">

                <div className="relative rounded-[2.5rem] border-10 border-[#30251f] bg-[#30251f] shadow-2xl">

                  <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#5a4a3f]" />

                  <div className="overflow-hidden rounded-4xl bg-[#faf8f6]">

                    <div className="flex h-105 flex-col">

                      <div className="bg-linear-to-br from-[#30251f] to-[#42332a] px-5 pb-6 pt-8 text-white">

                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                          5digea
                        </p>

                        <p className="mt-1 font-serif text-lg font-light">
                          {t("home.app.phoneTitle")}
                        </p>

                        <div className="mt-4 h-2 w-3/4 rounded-full bg-white/15" />
                        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />

                      </div>

                      <div className="flex-1 space-y-3 p-4">

                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-xl border border-[#eee5df] bg-white p-3"
                          >
                            <div className="h-8 w-8 shrink-0 rounded-lg bg-[#faf5ee]" />

                            <div className="flex-1 space-y-1.5">
                              <div className="h-2 w-3/4 rounded-full bg-[#eee5df]" />
                              <div className="h-2 w-1/2 rounded-full bg-[#f3ece2]" />
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      {/* ================= Final CTA ================= */}

      <section className="mx-auto max-full pb-12 ">

        <div className="relative overflow-hidden bg-linear-to-br from-[#30251f] via-[#3d3028] to-[#2a201b] p-10 text-center shadow-xl sm:p-16">

          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a47e43]/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8e685e]/20 blur-3xl" />

          <div className="relative">

            <div className="mx-auto flex items-center justify-center gap-2 text-[#d5b77d]">
              <Sparkles size={16} />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] rtl:tracking-normal">
                {t("home.cta.eyebrow")}
              </span>
            </div>

            <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-light leading-tight rtl:leading-snug text-white sm:text-4xl">
              {t("home.cta.title")}{" "}
              <span className="italic rtl:not-italic text-[#d8bd89]">
                {t("home.cta.titleHighlight")}
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              {t("home.cta.description")}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href={isAuthenticated ? "/roadmap" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#30251f] transition hover:bg-[#f3ede6]"
              >
                <Sparkles size={16} />

                {isAuthenticated
                  ? t("home.cta.openRoadmap")
                  : t("home.cta.getStarted")}
              </Link>

              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <Building2 size={16} />
                {t("home.cta.browseVendors")}
              </Link>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}