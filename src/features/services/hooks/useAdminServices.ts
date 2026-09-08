import { useCallback, useEffect, useState } from "react";

import {
  getAdminServices,
  approveService,
  rejectService,
  activateService,
  deactivateService,
} from "@/features/services/api";

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
      console.error("Failed to fetch admin services:", error);

      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.status]);

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
        console.error("Failed to approve service:", error);

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
        console.error("Failed to reject service:", error);

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
        console.error("Failed to activate service:", error);

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
        console.error("Failed to deactivate service:", error);

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
