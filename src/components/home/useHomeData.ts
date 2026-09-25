"use client";

import { useEffect, useMemo, useState } from "react";
import { topServices, topVendors } from "@/lib/ranking";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { getServices } from "@/features/services/api";
import { searchVendorList } from "@/features/vendors/api";
import { fetchServiceReviews } from "@/features/reviews/api";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import type { Review } from "@/types/review";

const FEATURED_COUNT = 8;

/** Loads categories, services, vendors and recent reviews for the home page. */
export function useHomeData() {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

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

  // Best first: weighted rating (Bayesian), then number of reviews.
  const featuredVendors = useMemo(
    () => topVendors(vendors, FEATURED_COUNT),
    [vendors],
  );
  // Services borrow their vendor's score, with one per vendor per round.
  const featuredServices = useMemo(
    () => topServices(allServices, vendors, FEATURED_COUNT),
    [allServices, vendors],
  );

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
            }).catch(() => null),
          ),
        );

        if (cancelled) return;

        const allReviews: Review[] = [];

        results.forEach((result) => {
          if (result) {
            allReviews.push(...(result.items ?? []));
          }
        });

        const withComments = allReviews.filter(
          (review) => review.comment && review.comment.trim().length > 0,
        );

        const pool = withComments.length > 0 ? withComments : allReviews;

        pool.sort(
          (a, b) =>
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  return {
    categories,
    categoriesLoading,
    categoriesError,
    servicesLoading,
    servicesError,
    featuredServices,
    vendors,
    vendorsLoading,
    vendorsError,
    featuredVendors,
    reviews,
    reviewsLoading,
  };
}
