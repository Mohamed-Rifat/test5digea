"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getContactMessagesAdmin,
  markContactMessageHandled,
} from "@/features/contactMessages/api";
import type {
  ContactMessageAdminItem,
  GetContactMessagesParams,
} from "@/features/contactMessages/types";

interface UseContactMessagesAdminReturn {
  items: ContactMessageAdminItem[];
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  handlingId: string | null;
  markHandled: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useContactMessagesAdmin(
  params: GetContactMessagesParams
): UseContactMessagesAdminReturn {
  const [items, setItems] = useState<ContactMessageAdminItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handlingId, setHandlingId] = useState<string | null>(null);

  const { type, isHandled, page, pageSize } = params;

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getContactMessagesAdmin({
        type,
        isHandled,
        page,
        pageSize,
      });

      setItems(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch {
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isHandled, page, pageSize]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markHandled = async (id: string) => {
    try {
      setHandlingId(id);
      await markContactMessageHandled(id);

      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isHandled: true } : item
        )
      );

      return true;
    } catch {
      return false;
    } finally {
      setHandlingId(null);
    }
  };

  return {
    items,
    totalCount,
    totalPages,
    loading,
    error,
    handlingId,
    markHandled,
    refetch: fetchMessages,
  };
}
