"use client";

import { useCallback, useEffect, useState } from "react";

import { getModerationDashboard } from "@/features/moderation/api";

import type { ModerationDashboardSummary } from "@/types/moderation";
import { translateNow } from "@/lib/translate-now";

interface UseModerationDashboardReturn {
  summary: ModerationDashboardSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useModerationDashboard = (): UseModerationDashboardReturn => {
  const [summary, setSummary] = useState<ModerationDashboardSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getModerationDashboard();

      setSummary(data);
    } catch {
      setError(translateNow("errors.loadDashboard"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};
