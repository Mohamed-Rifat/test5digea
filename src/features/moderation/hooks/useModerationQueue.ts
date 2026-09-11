"use client";

import { useCallback, useEffect, useState } from "react";

import { getModerationQueue } from "@/features/moderation/api";

import type {
  GetModerationQueueParams,
  ModerationQueueItem,
} from "@/types/moderation";

interface UseModerationQueueReturn {
  items: ModerationQueueItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useModerationQueue = (
  params?: GetModerationQueueParams
): UseModerationQueueReturn => {
  const [items, setItems] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getModerationQueue(params);

      setItems(data);
    } catch {
      setError("Failed to load the moderation queue.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params?.vendorId,
    params?.entityType,
    params?.status,
    params?.dateFrom,
    params?.dateTo,
  ]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return {
    items,
    loading,
    error,
    refetch: fetchQueue,
  };
};
