"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getCurrentVendor,
  updateVendor,
  resubmitVendor,
  uploadVendorProfileImage,
  uploadVendorGalleryImages,
  deleteVendorGalleryImage,
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
  uploadProfileImage: (file: File) => Promise<boolean>;
  uploadGalleryImages: (files: File[]) => Promise<boolean>;
  deleteGalleryImage: (imageId: string) => Promise<boolean>;
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

  const uploadProfileImage = useCallback(
    async (file: File): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading("profile-image");
        setActionError(null);

        await uploadVendorProfileImage(vendor.id, file);
        await fetchVendor();

        return true;
      } catch (error) {
        console.error("Failed to upload vendor profile image:", error);
        setActionError("Failed to upload your profile photo.");

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor]
  );

  const uploadGalleryImages = useCallback(
    async (files: File[]): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading("gallery-upload");
        setActionError(null);

        const images = await uploadVendorGalleryImages(vendor.id, files);

        // The upload response already carries the resulting gallery, so
        // merge it in immediately instead of waiting on a refetch whose
        // GET payload may or may not include gallery images (see the NOTE
        // on Vendor.galleryImages in types/vendor.ts).
        setVendor((prev) => (prev ? { ...prev, galleryImages: images } : prev));
        await fetchVendor();

        return true;
      } catch (error) {
        console.error("Failed to upload vendor gallery images:", error);
        setActionError("Failed to upload gallery photos.");

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor]
  );

  const deleteGalleryImage = useCallback(
    async (imageId: string): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading(`delete-gallery-${imageId}`);
        setActionError(null);

        await deleteVendorGalleryImage(vendor.id, imageId);

        setVendor((prev) =>
          prev
            ? {
                ...prev,
                galleryImages: (prev.galleryImages || []).filter(
                  (image) => image.id !== imageId
                ),
              }
            : prev
        );

        return true;
      } catch (error) {
        console.error("Failed to delete vendor gallery image:", error);
        setActionError("Failed to delete gallery photo.");

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor]
  );

  return {
    vendor,
    loading,
    error,
    actionLoading,
    actionError,
    refetch: fetchVendor,
    update,
    resubmit,
    uploadProfileImage,
    uploadGalleryImages,
    deleteGalleryImage,
  };
};