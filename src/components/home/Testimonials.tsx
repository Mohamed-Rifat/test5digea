"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Paperclip,
  Star,
} from "lucide-react";
import RatingStars from "@/components/shared/RatingStars";
import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";
import type { Review } from "@/types/review";

// 3 seconds
const TESTIMONIAL_INTERVAL = 3000;

/** Auto-sliding "pinned paper" testimonials carousel. */
export function Testimonials({
  reviews,
  reviewsLoading,
  vendors,
}: {
  reviews: Review[];
  reviewsLoading: boolean;
  vendors: Vendor[];
}) {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

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

    const nextIndex = ((index % totalReviews) + totalReviews) % totalReviews;

    setActiveIndex(nextIndex);
  };

  const goToPrevTestimonial = () => goToTestimonial(activeIndex - 1);
  const goToNextTestimonial = () => goToTestimonial(activeIndex + 1);

  // In RTL the flex track lays slides out right-to-left, so it has to slide
  // in the opposite direction to bring the next slide into view.
  const trackOffset = (isRtl ? 1 : -1) * activeIndex * 100;

  const currentReview = reviews[activeIndex];

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

  if (reviewsLoading || reviews.length === 0) return null;

  return (
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
                onClick={isRtl ? goToNextTestimonial : goToPrevTestimonial}
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
                onClick={isRtl ? goToPrevTestimonial : goToNextTestimonial}
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
                                {review?.userFullName ||
                                  t("home.testimonials.happyCouple")}
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
                aria-label={t("home.testimonials.goTo", {
                  number: index + 1,
                })}
                onClick={() => goToTestimonial(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-8 bg-[#e0b64a]"
                    : "w-1.5 bg-[#5a4638] hover:bg-[#7a5f47]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
