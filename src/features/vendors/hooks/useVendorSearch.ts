"use client";

import { useCallback, useEffect, useState } from "react";

import { searchVendorList } from "@/services/vendors.service";

import type {
  Vendor,
  VendorSearchParams,
} from "@/types/vendor";

interface UseVendorSearchReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVendorSearch = (
  params?: VendorSearchParams,
  enabled = true
): UseVendorSearchReturn => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await searchVendorList(params);

      setVendors(data.items);
    } catch (err) {
      setError("Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    params?.searchTerm,
    params?.categoryId,
    params?.location,
    params?.minRating,
    params?.sortBy,
    params?.page,
    params?.pageSize,
  ]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
  };
};
