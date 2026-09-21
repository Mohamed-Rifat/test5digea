"use client";

import { useCallback, useEffect, useId, useState } from "react";

import {
  getMyServices,
  createService,
  updateService,
  updateServicePrices,
  resubmitService,
  uploadServiceImages,
  deleteServiceImage,
} from "@/features/services/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  localizedError,
  resolveLocalizedError,
  type LocalizedError,
} from "@/lib/error";
import {
  announceVendorDataChange,
  subscribeToVendorDataChange,
} from "@/lib/vendor-sync";

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
  uploadImages: (id: string, files: File[]) => Promise<boolean>;
  deleteImage: (id: string, imageId: string) => Promise<boolean>;
}

interface FetchOptions {
  /** Refresh in the background without flipping `loading` on. */
  silent?: boolean;
}

export const useVendorServices = (): UseVendorServicesReturn => {
  const { t } = useLanguage();
  const instanceId = useId();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LocalizedError | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<LocalizedError | null>(null);

  const fetchServices = useCallback(async (options: FetchOptions = {}) => {
    try {
      if (!options.silent) setLoading(true);
      setError(null);

      const data = await getMyServices();

      setServices(data);
    } catch (error) {
      console.error("Failed to fetch vendor services:", error);
      setError(localizedError("vendor.errors.loadServices", error));
    } finally {
      if (!options.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Another component changed the vendor's services (e.g. the edit page):
  // refresh quietly so counts in the sidebar / dashboard never go stale.
  useEffect(
    () =>
      subscribeToVendorDataChange("services", instanceId, () => {
        void fetchServices({ silent: true });
      }),
    [instanceId, fetchServices]
  );

  // Public refetch: never forwards its arguments (it is safe to pass
  // straight to an onClick handler).
  const refetch = useCallback(() => fetchServices(), [fetchServices]);

  const create = useCallback(
    async (data: CreateServiceRequest): Promise<string | null> => {
      try {
        setActionLoading("create");
        setActionError(null);

        const id = await createService(data);
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return id;
      } catch (error) {
        console.error("Failed to create service:", error);
        setActionError(localizedError("vendor.errors.createService", error));

        return null;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
  );

  const update = useCallback(
    async (id: string, data: UpdateServiceRequest): Promise<boolean> => {
      try {
        setActionLoading(`update-${id}`);
        setActionError(null);

        await updateService(id, data);
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to update service:", error);
        setActionError(localizedError("vendor.errors.updateService", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
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
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to update service prices:", error);
        setActionError(localizedError("vendor.errors.updatePrices", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
  );

  const resubmit = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setActionLoading(`resubmit-${id}`);
        setActionError(null);

        await resubmitService(id);
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to resubmit service:", error);
        setActionError(localizedError("vendor.errors.resubmitService", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
  );

  const uploadImages = useCallback(
    async (id: string, files: File[]): Promise<boolean> => {
      try {
        setActionLoading(`images-${id}`);
        setActionError(null);

        await uploadServiceImages(id, files);
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to upload service images:", error);
        setActionError(localizedError("vendor.errors.uploadImages", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
  );

  const deleteImage = useCallback(
    async (id: string, imageId: string): Promise<boolean> => {
      try {
        setActionLoading(`delete-image-${imageId}`);
        setActionError(null);

        await deleteServiceImage(id, imageId);
        await fetchServices({ silent: true });
        announceVendorDataChange("services", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to delete service image:", error);
        setActionError(localizedError("vendor.errors.deleteImage", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchServices, instanceId]
  );

  return {
    services,
    loading,
    error: resolveLocalizedError(error, t),
    actionLoading,
    actionError: resolveLocalizedError(actionError, t),
    refetch,
    create,
    update,
    updatePrices,
    resubmit,
    uploadImages,
    deleteImage,
  };
};
