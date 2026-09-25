"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchReviewableServices,
  submitReview,
} from "@/features/reviews/api";
import type { ReviewableService, CreateReviewRequest } from "@/types/review";
import { translateNow } from "@/lib/translate-now";
import { getApiErrorMessage } from "@/lib/error";

interface UseWriteReviewReturn {
  reviewableServices: ReviewableService[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;

  refetch: () => Promise<void>;
  /** true on success, otherwise the (server) error message. */
  submit: (data: CreateReviewRequest) => Promise<true | string>;
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
    } catch {
      setError(translateNow("errors.loadReviewable"));
    } finally {
      setLoading(false);
    }
  }, [roadmapItemId]);

  useEffect(() => {
    fetchReviewable();
  }, [fetchReviewable]);

  const submit = useCallback(
    async (data: CreateReviewRequest): Promise<true | string> => {
      try {
        setActionLoading(true);
        setActionError(null);

        await submitReview(data);
        await fetchReviewable();

        return true;
      } catch (err) {
        const message = getApiErrorMessage(err, translateNow("errors.submitReview"));
        setActionError(message);
        return message;
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
