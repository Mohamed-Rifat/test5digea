"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchReviewableServices,
  submitReview,
} from "@/features/reviews/api";
import type { ReviewableService, CreateReviewRequest } from "@/types/review";

interface UseWriteReviewReturn {
  reviewableServices: ReviewableService[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;

  refetch: () => Promise<void>;
  submit: (data: CreateReviewRequest) => Promise<boolean>;
}

// Loads the services a user is allowed to review for a given roadmap item
// (GET /api/reviews/reviewable?roadmapItemId=...) and exposes a submit
// action for POST /api/reviews.
export const useWriteReview = (
  roadmapItemId: string | undefined
): UseWriteReviewReturn => {
  const [reviewableServices, setReviewableServices] = useState<
    ReviewableService[]
  >([]);
  const [loading, setLoading] = useState(!!roadmapItemId);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchReviewable = useCallback(async () => {
    if (!roadmapItemId) {
      setReviewableServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchReviewableServices(roadmapItemId);

      setReviewableServices(data);
    } catch (err) {
      setError("Failed to load services available to review.");
    } finally {
      setLoading(false);
    }
  }, [roadmapItemId]);

  useEffect(() => {
    fetchReviewable();
  }, [fetchReviewable]);

  const submit = useCallback(
    async (data: CreateReviewRequest): Promise<boolean> => {
      try {
        setActionLoading(true);
        setActionError(null);

        await submitReview(data);
        await fetchReviewable();

        return true;
      } catch (err) {
        setActionError("Failed to submit your review.");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchReviewable]
  );

  return {
    reviewableServices,
    loading,
    error,
    actionLoading,
    actionError,
    refetch: fetchReviewable,
    submit,
  };
};
