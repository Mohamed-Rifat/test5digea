import { useCallback, useEffect, useState } from "react";

import {
  getAdminServices,
  approveService,
  rejectService,
  activateService,
  deactivateService,
} from "@/services/services.service";

import type {
  Service,
  GetAdminServicesParams,
  RejectServiceRequest,
} from "@/types/service";

interface UseAdminServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;

  refetch: () => Promise<void>;

  approve: (id: string) => Promise<boolean>;
  reject: (id: string, data: RejectServiceRequest) => Promise<boolean>;
  activate: (id: string) => Promise<boolean>;
  deactivate: (id: string) => Promise<boolean>;
}

export const useAdminServices = (
  params?: GetAdminServicesParams
): UseAdminServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminServices(params);

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

  const approve = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`approve-${id}`);

        await approveService(id);
        await fetchServices();

        return true;
      } catch (error) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const reject = useCallback(
    async (
      id: string,
      data: RejectServiceRequest
    ): Promise<boolean> => {
      try {
        setActionLoading(`reject-${id}`);

        await rejectService(id, data);
        await fetchServices();

        return true;
      } catch (error) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const activate = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`activate-${id}`);

        await activateService(id);
        await fetchServices();

        return true;
      } catch (error) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const deactivate = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`deactivate-${id}`);

        await deactivateService(id);
        await fetchServices();

        return true;
      } catch (error) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  return {
    services,
    loading,
    error,
    actionLoading,
    refetch: fetchServices,
    approve,
    reject,
    activate,
    deactivate,
  };
};
