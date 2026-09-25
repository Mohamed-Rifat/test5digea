"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import {
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  selectRoadmapVendor,
  removeRoadmapVendor,
  completeRoadmapCategory,
  uncompleteRoadmapCategory,
} from "@/features/roadmap/api";
import { getApiErrorMessage } from "@/lib/error";
import { useAuth } from "@/context/AuthContext";

import type {
  Roadmap,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
} from "@/types/roadmap";
import { translateNow } from "@/lib/translate-now";

interface UseRoadmapReturn {
  roadmap: Roadmap | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  actionError: string | null;

  refetch: () => Promise<void>;

  create: (data: CreateRoadmapRequest) => Promise<boolean>;
  update: (data: UpdateRoadmapRequest) => Promise<boolean>;
  selectVendor: (
    categoryId: string,
    vendorId: string
  ) => Promise<boolean>;
  removeVendor: (categoryId: string) => Promise<boolean>;
  complete: (categoryId: string) => Promise<boolean>;
  uncomplete: (categoryId: string) => Promise<boolean>;
}

export const useRoadmap = (): UseRoadmapReturn => {
  // Guests have no roadmap: don't call the API (it would only fail).
  const { isUser, isLoading: authLoading } = useAuth();
  // Only couples (role "User") have favorites / a roadmap.
  const isAuthenticated = isUser;
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );
  const [actionError, setActionError] = useState<string | null>(
    null
  );

  const fetchRoadmap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRoadmap();

      setRoadmap(data);
    } catch (err) {
      // The backend signals "no roadmap yet" with a 400 Bad Request whose
      // ProblemDetails `detail` says so (not a 404, and not any other
      // structure) — treat that specific case as "no roadmap", and only
      // that case, so genuine 400s aren't hidden.
      const noRoadmapYet =
        isAxiosError(err) &&
        err.response?.status === 400 &&
        typeof err.response?.data?.detail === "string" &&
        err.response.data.detail.toLowerCase().includes("haven't created a roadmap");

      if (noRoadmapYet || (isAxiosError(err) && err.response?.status === 404)) {
        setRoadmap(null);
      } else {
        setError(getApiErrorMessage(err, translateNow("errors.loadRoadmap")));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchRoadmap();
  }, [fetchRoadmap, authLoading, isAuthenticated]);

  const create = useCallback(
    async (data: CreateRoadmapRequest): Promise<boolean> => {
      try {
        setActionLoading("create");
        setActionError(null);

        await createRoadmap(data);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.createRoadmap")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  const update = useCallback(
    async (data: UpdateRoadmapRequest): Promise<boolean> => {
      try {
        setActionLoading("update");
        setActionError(null);

        await updateRoadmap(data);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.updateRoadmap")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  const selectVendor = useCallback(
    async (
      categoryId: string,
      vendorId: string
    ): Promise<boolean> => {
      try {
        setActionLoading(`select-${categoryId}`);
        setActionError(null);

        await selectRoadmapVendor(categoryId, { vendorId });
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.selectVendor")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  const removeVendor = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        setActionLoading(`remove-${categoryId}`);
        setActionError(null);

        await removeRoadmapVendor(categoryId);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.removeVendor")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  const complete = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        setActionLoading(`complete-${categoryId}`);
        setActionError(null);

        await completeRoadmapCategory(categoryId);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.updateCategory")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  const uncomplete = useCallback(
    async (categoryId: string): Promise<boolean> => {
      try {
        setActionLoading(`uncomplete-${categoryId}`);
        setActionError(null);

        await uncompleteRoadmapCategory(categoryId);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError(getApiErrorMessage(err, translateNow("errors.updateCategory")));
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  return {
    roadmap: isAuthenticated ? roadmap : null,
    loading: authLoading || (isAuthenticated && loading),
    error: isAuthenticated ? error : null,
    actionLoading,
    actionError,
    refetch: fetchRoadmap,
    create,
    update,
    selectVendor,
    removeVendor,
    complete,
    uncomplete,
  };
};
