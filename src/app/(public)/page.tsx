"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Compass,
  Heart,
  Quote,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { FaGooglePlay, FaApple } from "react-icons/fa";

import ServiceCard from "@/components/public/ServiceCard";
import VendorCard from "@/components/public/VendorCard";
import RatingStars from "@/components/shared/RatingStars";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { getServices } from "@/features/services/api";
import { searchVendorList } from "@/features/vendors/api";
import { fetchServiceReviews } from "@/features/reviews/api";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import type { Review } from "@/types/review";

const FEATURED_COUNT = 6;
const VISIBLE_CATEGORIES = 6;
const TESTIMONIAL_INTERVAL = 5000;
const TESTIMONIALS_PER_VIEW_DESKTOP = 3;

export default function Home() {
  const { isAuthenticated } = useAuth();

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
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        const data = await getServices();
        if (!cancelled) setAllServices(data);
      } catch {
        if (!cancelled) setServicesError("Failed to load services.");
      } finally {
        if (!cancelled) setServicesLoading(false);
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
  const [totalVendors, setTotalVendors] = useState<number | null>(null);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadVendors = async () => {
      try {
        setVendorsLoading(true);
        setVendorsError(null);
        const data = await searchVendorList({
          sortBy: 0,
          page: 1,
          pageSize: FEATURED_COUNT,
        });
        if (!cancelled) {
          setVendors(data.items);
          setTotalVendors(data.totalCount);
        }
      } catch {
        if (!cancelled) setVendorsError("Failed to load vendors.");
      } finally {
        if (!cancelled) setVendorsLoading(false);
      }
    };

    loadVendors();
    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------------------------------
  // Testimonials
  // ------------------------------------------------------------------
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      if (featuredServices.length === 0) {
        if (!cancelled && !servicesLoading) setReviewsLoading(false);
        return;
      }

      try {
        setReviewsLoading(true);

        const results = await Promise.all(
          featuredServices.map((service) =>
            fetchServiceReviews(service.id, { page: 1, pageSize: 20 }).catch(
              () => null
            )
          )
        );

        if (cancelled) return;

        const allReviews: Review[] = [];
        results.forEach((result) => {
          if (result) allReviews.push(...(result.items ?? []));
        });

        const withComments = allReviews.filter(
          (r) => r.comment && r.comment.trim().length > 0
        );
        const pool = withComments.length > 0 ? withComments : allReviews;

        pool.sort(
          (a, b) =>
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReviews(pool.slice(0, 12));
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    loadReviews();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allServices, servicesLoading]);

  // ------------------------------------------------------------------
  // Testimonial carousel — auto-swipe every 5s, pause on hover
  // ------------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [perView, setPerView] = useState(TESTIMONIALS_PER_VIEW_DESKTOP);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Responsive: 1 card on mobile, 2 on sm, 3 on lg
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(TESTIMONIALS_PER_VIEW_DESKTOP);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / perView));

  useEffect(() => {
    if (reviews.length === 0 || isPaused || totalPages <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % totalPages);
    }, TESTIMONIAL_INTERVAL);
    return () => clearInterval(id);
  }, [reviews.length, isPaused, totalPages]);

  useEffect(() => {
    setActiveIndex(0);
  }, [perView]);

  

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* ================= Hero (full height) ================= */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-[#eee7e1] bg-gradient-to-b from-[#f8f5ef] via-[#faf7f1] to-[#f4ede4] px-4 sm:px-6 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#e8d4b0]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#d9c2a1]/30 blur-3xl" />

        <div className="relative mx-auto w-full py-16 lg:max-w-10/12">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white/70 px-4 py-1.5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[#b99a62]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
                5digea
              </span>
            </div>

            <h1 className="font-serif text-4xl font-light leading-tight text-[#30251f] sm:text-5xl lg:text-6xl">
              Plan your perfect day with{" "}
              <span className="italic text-[#a47e43]">trusted vendors</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#766d67] sm:text-base">
              Discover approved wedding professionals and curated services,
              compare your options, and build your wedding roadmap in one
              place.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#30251f]/10 transition hover:bg-[#42332a] hover:shadow-xl"
              >
                <Search size={16} />
                Explore services
              </Link>

              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-7 py-3.5 text-sm font-medium text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#30251f]"
              >
                <Store size={16} />
                Browse vendors
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================= Categories (limited to 6) ================= */}
      <section className="mx-auto px-4 py-16 sm:px-6 lg:max-w-10/12 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              Wedding services for every need
            </h2>
          </div>

          {categories.length > VISIBLE_CATEGORIES && (
            <Link
              href="/categories"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
            >
              View all <ArrowRight size={14} />
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
            <p className="font-medium text-red-600">{categoriesError}</p>
          </div>
        )}

        {!categoriesLoading && !categoriesError && categories.length === 0 && (
          <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
            <p className="text-[#756960]">No categories available yet.</p>
          </div>
        )}

        {!categoriesLoading && !categoriesError && categories.length > 0 && (
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
                      <span className="text-2xl text-[#c9b8a8]">✦</span>
                    </div>
                  )}

                  <h3 className="mb-2 text-xl font-semibold text-[#30251f]">
                    {category.name}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-6 text-[#81746d]">
                    {category.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e685e]">
                    Browse vendors <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>

            {categories.length > VISIBLE_CATEGORIES && (
              <Link
                href="/categories"
                className="mt-8 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f]"
              >
                View all categories <ArrowRight size={14} />
              </Link>
            )}
          </>
        )}
      </section>

      {/* ================= Featured vendors ================= */}
      <section className="mx-auto px-4 pb-20 sm:px-6 lg:max-w-10/12 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              Trusted vendors couples love
            </h2>
          </div>

          <Link
            href="/vendors"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
          >
            View all <ArrowRight size={14} />
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
            <p className="font-medium text-red-600">{vendorsError}</p>
          </div>
        )}

        {!vendorsLoading && !vendorsError && vendors.length === 0 && (
          <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
            <p className="text-[#756960]">No vendors available yet.</p>
          </div>
        )}

        {!vendorsLoading && !vendorsError && vendors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}

        <Link
          href="/vendors"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
        >
          View all vendors <ArrowRight size={14} />
        </Link>
      </section>

      {/* ================= Featured services ================= */}
      <section className="bg-[#f8f5ef] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto lg:max-w-10/12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
                Popular services
              </h2>
            </div>

            <Link
              href="/services"
              className="hidden items-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:inline-flex"
            >
              View all <ArrowRight size={14} />
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
              <p className="font-medium text-red-600">{servicesError}</p>
            </div>
          )}

          {!servicesLoading &&
            !servicesError &&
            featuredServices.length === 0 && (
              <div className="rounded-2xl border border-[#eee5df] bg-white p-10 text-center shadow-sm">
                <p className="text-[#756960]">No services available yet.</p>
              </div>
            )}

          {!servicesLoading &&
            !servicesError &&
            featuredServices.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

          <Link
            href="/services"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#8e685e] hover:text-[#30251f] sm:hidden"
          >
            View all services <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ================= Testimonials carousel (full width) ================= */}
      {!reviewsLoading && reviews.length > 0 && (
        <section
          className="w-full overflow-hidden border-y border-[#eee7e1] bg-gradient-to-b from-white via-[#fdfbf8] to-[#faf6ef] py-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="mx-auto mb-10 px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              Testimonials
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#30251f] sm:text-3xl">
              What couples are saying
            </h2>
          </div>

          <div className="relative w-full">
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <div
                  key={pageIdx}
                  className="w-full shrink-0 px-4 sm:px-6 lg:px-8"
                >
                  <div className="mx-auto grid gap-6 lg:max-w-10/12 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews
                      .slice(pageIdx * perView, pageIdx * perView + perView)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="flex flex-col rounded-2xl border border-[#eee7e1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                          <Quote className="h-6 w-6 text-[#d8c6ab]" />

                          <div className="mt-4">
                            <RatingStars rating={review.rating} />
                          </div>

                          <p className="mt-4 line-clamp-5 flex-1 text-sm leading-7 text-[#5f544d]">
                            &ldquo;{review.comment}&rdquo;
                          </p>

                          <div className="mt-5 border-t border-[#f0e9e0] pt-4">
                            <p className="text-sm font-semibold text-[#30251f]">
                              {review.userFullName}
                            </p>
                            <p className="mt-0.5 text-xs text-[#9b8f86]">
                              {review.serviceName} ·{" "}
                              {review.vendorBusinessName}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-8 bg-[#a47e43]"
                        : "w-2 bg-[#d8c6ab] hover:bg-[#c9b28a]"
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
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b8171]">
              About 5digea
            </p>
            <h2 className="mt-2 max-w-lg font-serif text-3xl font-light leading-tight text-[#30251f] sm:text-4xl">
              A wedding marketplace built around{" "}
              <span className="italic text-[#a47e43]">trust</span>.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
              We believe finding wedding services should feel exciting rather
              than overwhelming. 5digea brings approved vendors and couples
              together in one elegant, simple experience — from the first
              search to the final &ldquo;I do.&rdquo;
            </p>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white px-6 py-3 text-sm font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#30251f]"
            >
              Learn our story
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <ShieldCheck size={18} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                Vetted vendors
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                Every vendor is reviewed and approved before appearing on the
                platform.
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Compass size={18} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                Guided planning
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                Your personal roadmap keeps every category and vendor decision
                organized.
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Heart size={18} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                Real reviews
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                Feedback from real couples helps you choose with confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f4] text-[#a47e43]">
                <Users size={18} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#30251f]">
                Built for couples
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                Compare, save favorites, and plan together in one shared place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Coming Soon — Mobile App ================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto lg:max-w-10/12">
          <div className="relative overflow-hidden rounded-3xl border border-[#eee7e1] bg-gradient-to-br from-[#f8f5ef] via-[#fbf8f2] to-[#f3ece2] p-8 shadow-[0_18px_40px_rgba(48,37,31,0.06)] sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#e8d4b0]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#d9c2a1]/30 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e4dbd0] bg-white/70 px-3 py-1.5 backdrop-blur">
                  <Smartphone size={13} className="text-[#a47e43]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b8367]">
                    Coming Soon
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-[#30251f] sm:text-4xl">
                  The 5digea app is{" "}
                  <span className="italic text-[#a47e43]">
                    almost here
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
                  Plan your wedding on the go — manage your roadmap, chat with
                  vendors, and get real-time updates. Download the app on iOS
                  and Android very soon.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#"
                    aria-disabled="true"
                    className="group flex items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-left text-white transition hover:bg-[#42332a]"
                  >
                    <FaApple className="h-6 w-6" />
                    <div className="leading-tight">
                      <p className="text-[9px] uppercase tracking-widest text-white/60">
                        Coming soon on
                      </p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </a>

                  <a
                    href="#"
                    aria-disabled="true"
                    className="group flex items-center gap-3 rounded-2xl border border-[#30251f]/10 bg-[#30251f] px-5 py-3 text-left text-white transition hover:bg-[#42332a]"
                  >
                    <FaGooglePlay className="h-5 w-5" />
                    <div className="leading-tight">
                      <p className="text-[9px] uppercase tracking-widest text-white/60">
                        Coming soon on
                      </p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative mx-auto w-full max-w-[260px]">
                <div className="relative rounded-[2.5rem] border-[10px] border-[#30251f] bg-[#30251f] shadow-2xl">
                  <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#5a4a3f]" />
                  <div className="overflow-hidden rounded-[2rem] bg-[#faf8f6]">
                    <div className="flex h-[420px] flex-col">
                      <div className="bg-gradient-to-br from-[#30251f] to-[#42332a] px-5 pb-6 pt-8 text-white">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                          5digea
                        </p>
                        <p className="mt-1 font-serif text-lg font-light">
                          Your wedding roadmap
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
      <section className="mx-auto max-full px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-linear-to-br from-[#30251f] via-[#3d3028] to-[#2a201b] p-10 text-center shadow-xl sm:p-16">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#a47e43]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#8e685e]/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex items-center justify-center gap-2 text-[#d5b77d]">
              <Sparkles size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
                Start planning today
              </span>
            </div>

            <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-light leading-tight text-white sm:text-4xl">
              Ready to build{" "}
              <span className="italic text-[#d8bd89]">
                your wedding roadmap?
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              Track every category, save your favorite vendors, and know exactly
              what to do next — all in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={isAuthenticated ? "/roadmap" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#30251f] transition hover:bg-[#f3ede6]"
              >
                <Sparkles size={16} />
                {isAuthenticated ? "Open your roadmap" : "Get started free"}
              </Link>

              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <Building2 size={16} />
                Browse vendors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}