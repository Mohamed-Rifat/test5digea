"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchServiceReviews } from "@/features/reviews/api";
import type { PaginatedReviews } from "@/types/review";

interface UseServiceReviewsReturn {
  data: PaginatedReviews | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY: PaginatedReviews = {
  items: [],
  totalCount: 0,
  page: 1,
  pageSize: 5,
  totalPages: 0,
};

export const useServiceReviews = (
  serviceId: string | undefined,
  page = 1,
  pageSize = 5
): UseServiceReviewsReturn => {
  const [data, setData] = useState<PaginatedReviews | null>(null);
  const [loading, setLoading] = useState(!!serviceId);
  const [error, setError] = useState<string | null>(null);

  // Depend on the primitive fields only — never pass an inline params
  // object into a useCallback dependency array (it gets a new identity on
  // every render and re-triggers the effect forever).
  const fetchReviews = useCallback(async () => {
    if (!serviceId) {
      setData(EMPTY);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchServiceReviews(serviceId, {
        page,
        pageSize,
      });

      setData(result);
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [serviceId, page, pageSize]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    data,
    loading,
    error,
    refetch: fetchReviews,
  };
};
