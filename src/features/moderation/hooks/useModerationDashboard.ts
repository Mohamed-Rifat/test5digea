"use client";

import { useCallback, useEffect, useState } from "react";

import { getModerationDashboard } from "@/features/moderation/api";

import type { ModerationDashboardSummary } from "@/types/moderation";

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
      setError("Failed to load the dashboard summary.");
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
