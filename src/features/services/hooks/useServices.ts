import { useCallback, useEffect, useState } from "react";

import { getServices } from "@/features/services/api";

import type {
  Service,
  GetServicesParams,
} from "@/types/service";

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useServices = (
  params?: GetServicesParams
): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getServices(params);

      setServices(data);
    } catch (error) {
      console.error(
        "Failed to fetch services:",
        error
      );

      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
    // Depend on the primitive filter values rather than the `params` object
    // itself — callers that pass an inline object literal (e.g.
    // `useServices({ vendorId })`) create a new reference on every render,
    // which would otherwise re-trigger this callback (and the effect below)
    // on every render, causing an infinite fetch/re-render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.vendorId, params?.categoryId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
};