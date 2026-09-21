"use client";

import { useCallback, useEffect, useState } from "react";

import { getCurrentUser } from "@/features/auth/api";
import type { CurrentUser } from "@/types/auth";

interface UseCurrentUserReturn {
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Loads the signed-in user's full account details (phone, date of birth,
// gender ...) from GET /api/Auth/me. The login response only carries the
// basics, so anything richer comes from here.
export const useCurrentUser = (enabled = true): UseCurrentUserReturn => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setCurrentUser(await getCurrentUser());
    } catch {
      
      setError("Failed to load account details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurrentUser();
  }, [enabled, fetchCurrentUser]);

  return { currentUser, loading, error, refetch: fetchCurrentUser };
};
