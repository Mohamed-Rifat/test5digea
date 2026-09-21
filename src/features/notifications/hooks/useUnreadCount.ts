"use client";

import { useCallback, useEffect, useState } from "react";

import { getUnreadNotificationsCount } from "@/features/notifications/api";

// How often to re-poll the unread count while the header is mounted.
// The bell isn't meant to feel real-time — this just keeps the badge from
// going stale during a long session.
const POLL_INTERVAL_MS = 30_000;

interface UseUnreadCountReturn {
  count: number;
  loading: boolean;
  refetch: () => Promise<void>;
  // Lets the bell zero the badge instantly on "mark all as read" instead
  // of waiting for the next poll.
  setCount: (count: number) => void;
}

export const useUnreadCount = (
  enabled = true
): UseUnreadCountReturn => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(enabled);

  const fetchCount = useCallback(async () => {
    if (!enabled) return;

    try {
      const data = await getUnreadNotificationsCount();

      setCount(data);
    } catch {
      // Silent — a stale/missing badge isn't worth surfacing an error for.
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    fetchCount();

    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [enabled, fetchCount]);

  return {
    count,
    loading,
    refetch: fetchCount,
    setCount,
  };
};
