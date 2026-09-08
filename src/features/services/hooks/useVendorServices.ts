"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getMyServices,
  createService,
  updateService,
  updateServicePrices,
  resubmitService,
} from "@/features/services/api";
import { getApiErrorMessage } from "@/lib/error";

import type {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
  UpdateServicePricesRequest,
} from "@/types/service";

interface UseVendorServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  actionError: string | null;

  refetch: () => Promise<void>;

  create: (data: CreateServiceRequest) => Promise<string | null>;
  update: (id: string, data: UpdateServiceRequest) => Promise<boolean>;
  updatePrices: (
    id: string,
    data: UpdateServicePricesRequest
  ) => Promise<boolean>;
  resubmit: (id: string) => Promise<boolean>;
}

export const useVendorServices = (): UseVendorServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyServices();

      setServices(data);
    } catch (error) {
      console.error("Failed to fetch vendor services:", error);
      setError(getApiErrorMessage(error, "Failed to load services."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const create = useCallback(
    async (data: CreateServiceRequest): Promise<string | null> => {
      try {
        setActionLoading("create");
        setActionError(null);

        const id = await createService(data);
        await fetchServices();

        return id;
      } catch (error) {
        console.error("Failed to create service:", error);
        setActionError(getApiErrorMessage(error, "Failed to create service."));

        return null;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const update = useCallback(
    async (id: string, data: UpdateServiceRequest): Promise<boolean> => {
      try {
        setActionLoading(`update-${id}`);
        setActionError(null);

        await updateService(id, data);
        await fetchServices();

        return true;
      } catch (error) {
        console.error("Failed to update service:", error);
        setActionError(getApiErrorMessage(error, "Failed to update service."));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const updatePrices = useCallback(
    async (
      id: string,
      data: UpdateServicePricesRequest
    ): Promise<boolean> => {
      try {
        setActionLoading(`prices-${id}`);
        setActionError(null);

        await updateServicePrices(id, data);
        await fetchServices();

        return true;
      } catch (error) {
        console.error("Failed to update service prices:", error);
        setActionError(getApiErrorMessage(error, "Failed to update prices."));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices]
  );

  const resubmit = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`resubmit-${id}`);
        setActionError(null);

        await resubmitService(id);
        await fetchServices();

        return true;
      } catch (error) {
        console.error("Failed to resubmit service:", error);
        setActionError(getApiErrorMessage(error, "Failed to resubmit service."));

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
    actionError,
    refetch: fetchServices,
    create,
    update,
    updatePrices,
    resubmit,
  };
};
