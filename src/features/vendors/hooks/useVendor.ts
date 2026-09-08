"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getCurrentVendor,
  updateVendor,
  resubmitVendor,
} from "@/features/vendors/api";

import type { Vendor, UpdateVendorRequest } from "@/types/vendor";

interface UseVendorReturn {
  vendor: Vendor | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  actionError: string | null;

  refetch: () => Promise<void>;

  update: (data: UpdateVendorRequest) => Promise<boolean>;
  resubmit: () => Promise<boolean>;
}

export const useVendor = (): UseVendorReturn => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchVendor = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCurrentVendor();

      setVendor(data);
    } catch (error) {
      console.error("Failed to fetch current vendor:", error);
      setError("Failed to load vendor information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const update = useCallback(
    async (data: UpdateVendorRequest): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading("update");
        setActionError(null);

        await updateVendor(vendor.id, data);
        await fetchVendor();

        return true;
      } catch (error) {
        console.error("Failed to update vendor:", error);
        setActionError("Failed to update your profile.");

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor]
  );

  const resubmit = useCallback(async (): Promise<boolean> => {
    if (!vendor) return false;

    try {
      setActionLoading("resubmit");
      setActionError(null);

      await resubmitVendor(vendor.id);
      await fetchVendor();

      return true;
    } catch (error) {
      console.error("Failed to resubmit vendor:", error);
      setActionError("Failed to resubmit your profile.");

      return false;
    } finally {
      setActionLoading(null);
    }
  }, [vendor, fetchVendor]);

  return {
    vendor,
    loading,
    error,
    actionLoading,
    actionError,
    refetch: fetchVendor,
    update,
    resubmit,
  };
};
