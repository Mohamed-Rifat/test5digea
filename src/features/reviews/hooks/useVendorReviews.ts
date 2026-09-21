"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchVendorReviews } from "@/features/reviews/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  localizedError,
  resolveLocalizedError,
  type LocalizedError,
} from "@/lib/error";
import type { Review } from "@/types/review";

interface UseVendorReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Reviews left on the currently authenticated vendor's own services.
export const useVendorReviews = (): UseVendorReviewsReturn => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LocalizedError | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchVendorReviews();

      setReviews(data);
    } catch (err) {
      setError(localizedError("vendor.errors.loadReviews", err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error: resolveLocalizedError(error, t),
    refetch: fetchReviews,
  };
};
