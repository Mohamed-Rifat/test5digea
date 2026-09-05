import { useCallback, useEffect, useState } from "react";

import { getServices } from "@/services/services.service";

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
setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [params]);

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