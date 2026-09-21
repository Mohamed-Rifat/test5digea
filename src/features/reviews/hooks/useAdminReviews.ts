"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchPendingReviews,
  approveReview as approveReviewApi,
  rejectReview as rejectReviewApi,
  toggleReviewDisplay as toggleReviewDisplayApi,
} from "@/features/reviews/api";
import type { RejectReviewRequest, Review } from "@/types/review";

interface UseAdminReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;

  refetch: () => Promise<void>;
  approve: (id: string) => Promise<boolean>;
  reject: (id: string, data: RejectReviewRequest) => Promise<boolean>;
  toggleDisplay: (id: string, isDisplayed: boolean) => Promise<boolean>;
}

export const useAdminReviews = (): UseAdminReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPendingReviews();

      setReviews(data);
    } catch (err) {
      setError("Failed to load pending reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const approve = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`approve-${id}`);

        await approveReviewApi(id);
        await fetchReviews();

        return true;
      } catch (err) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchReviews]
  );

  const reject = useCallback(
    async (id: string, data: RejectReviewRequest): Promise<boolean> => {
      try {
        setActionLoading(`reject-${id}`);

        await rejectReviewApi(id, data);
        await fetchReviews();

        return true;
      } catch (err) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchReviews]
  );

  // Pending reviews aren't displayed yet, so toggling display is normally
  // done from the approved-reviews list rather than this pending queue —
  // exposed here too since the same admin surface may want it.
  const toggleDisplay = useCallback(
    async (id: string, isDisplayed: boolean): Promise<boolean> => {
      try {
        setActionLoading(`toggle-${id}`);

        await toggleReviewDisplayApi(id, { isDisplayed });
        await fetchReviews();

        return true;
      } catch (err) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchReviews]
  );

  return {
    reviews,
    loading,
    error,
    actionLoading,
    refetch: fetchReviews,
    approve,
    reject,
    toggleDisplay,
  };
};
