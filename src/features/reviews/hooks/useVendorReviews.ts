"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchVendorReviews } from "@/features/reviews/api";
import type { Review } from "@/types/review";

interface UseVendorReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Reviews left on the currently authenticated vendor's own services.
export const useVendorReviews = (): UseVendorReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchVendorReviews();

      setReviews(data);
    } catch (err) {
      setError("Failed to load your reviews.");
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
    error,
    refetch: fetchReviews,
  };
};
