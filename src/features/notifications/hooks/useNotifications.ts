"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/api";
import { getApiErrorMessage } from "@/lib/error";
import { useToast } from "@/components/providers/ToastProvider";

import type {
  GetNotificationsParams,
  Notification,
} from "@/types/notification";

interface UseNotificationsReturn {
  notifications: Notification[];
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotifications = (
  params?: GetNotificationsParams
): UseNotificationsReturn => {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>(
    []
  );
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getNotifications(params);

      setNotifications(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
    // Depend on primitives rather than the params object itself — callers
    // passing an inline object literal would otherwise create an infinite
    // fetch loop (same reasoning as useServices).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.pageSize]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        setActionLoading(id);

        await markNotificationRead(id);

        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        toast(
          getApiErrorMessage(err, "Failed to mark as read."),
          "error"
        );
      } finally {
        setActionLoading(null);
      }
    },
    [toast]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      setActionLoading("all");

      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      toast(
        getApiErrorMessage(err, "Failed to mark all as read."),
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  }, [toast]);

  return {
    notifications,
    totalCount,
    totalPages,
    loading,
    error,
    actionLoading,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
