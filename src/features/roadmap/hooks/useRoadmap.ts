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
} from "@/services/roadmap.service";

import type {
  Roadmap,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
} from "@/types/roadmap";

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
      if (isAxiosError(err) && err.response?.status === 404) {
        setRoadmap(null);
      } else {
        setError("Failed to load your wedding roadmap.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const create = useCallback(
    async (data: CreateRoadmapRequest): Promise<boolean> => {
      try {
        setActionLoading("create");
        setActionError(null);

        await createRoadmap(data);
        await fetchRoadmap();

        return true;
      } catch (err) {
        setActionError("Failed to create your roadmap.");
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
        setActionError("Failed to update your roadmap.");
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
        setActionError("Failed to select this vendor.");
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
        setActionError("Failed to remove this vendor.");
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
        setActionError("Failed to update this category.");
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
        setActionError("Failed to update this category.");
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchRoadmap]
  );

  return {
    roadmap,
    loading,
    error,
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
