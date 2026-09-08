"use client";

import { useCallback, useEffect, useState } from "react";

import { getReviewableServices } from "@/features/reviews/api";
import type { ReviewableService } from "@/types/review";

interface UseReviewableItemsReturn {
  items: ReviewableService[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useReviewableItems = (
  roadmapItemId?: string,
  enabled = true
): UseReviewableItemsReturn => {
  const [items, setItems] = useState<ReviewableService[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getReviewableServices(roadmapItemId);

      setItems(data);
    } catch (err) {
      setError("Failed to load reviewable services.");
    } finally {
      setLoading(false);
    }
  }, [enabled, roadmapItemId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
};
