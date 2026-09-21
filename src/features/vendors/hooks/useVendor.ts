"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { isAxiosError } from "axios";

import {
  getCurrentVendor,
  updateVendor,
  resubmitVendor,
  uploadVendorProfileImage,
  uploadVendorGalleryImages,
  deleteVendorGalleryImage,
} from "@/features/vendors/api";
import { getNotifications } from "@/features/notifications/api";
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
import {
  clearMarker,
  hasVendorChangedSince,
  isMarkerExpired,
  readMarker,
  takeSnapshot,
  writeMarker,
  type PendingEditMarker,
} from "@/lib/vendor-pending-edit";
import { NotificationType } from "@/types/notification";

import type { Vendor, UpdateVendorRequest } from "@/types/vendor";

interface FetchOptions {
  /** Refresh in the background without flipping `loading` on. */
  silent?: boolean;
  /**
   * The change came from something other than the profile edit (gallery,
   * photo…): keep waiting for the admin, just re-baseline the marker.
   */
  rebaseline?: boolean;
}

interface UseVendorReturn {
  vendor: Vendor | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  actionError: string | null;

  /** A submitted profile edit is waiting for an admin decision. */
  isPendingReview: boolean;
  /** What the vendor submitted, while it is pending (null otherwise). */
  pendingSubmitted: UpdateVendorRequest | null;

  refetch: () => Promise<void>;
  /** Re-check status in the background (no loading flash). */
  refreshSilently: () => Promise<void>;

  update: (data: UpdateVendorRequest) => Promise<boolean>;
  resubmit: () => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<boolean>;
  uploadGalleryImages: (files: File[]) => Promise<boolean>;
  deleteGalleryImage: (imageId: string) => Promise<boolean>;
}

// Did the admin notify this vendor after the edit was submitted?
const decisionNotificationArrived = async (
  vendorId: string,
  marker: PendingEditMarker
): Promise<boolean> => {
  try {
    const { items } = await getNotifications({ page: 1, pageSize: 20 });
    const submittedAt = new Date(marker.submittedAt).getTime();

    return items.some(
      (notification) =>
        new Date(notification.createdAt).getTime() > submittedAt &&
        (notification.type === NotificationType.VendorApproved ||
          notification.type === NotificationType.VendorRejected ||
          notification.relatedEntityId === vendorId)
    );
  } catch {
    return false;
  }
};

export const useVendor = (): UseVendorReturn => {
  const { t } = useLanguage();
  const instanceId = useId();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LocalizedError | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<LocalizedError | null>(null);

  // Local record of an edit that is still awaiting review (fallback for when
  // the API response doesn't carry `pendingChanges`).
  const [marker, setMarker] = useState<PendingEditMarker | null>(null);

  // Decides whether the locally remembered edit is still pending.
  const syncMarker = useCallback(
    async (fresh: Vendor, rebaseline: boolean) => {
      const stored = readMarker(fresh.id);

      if (!stored) {
        setMarker(null);
        return;
      }

      // The server reports the pending edit itself — it is authoritative,
      // the local record is no longer needed.
      if (fresh.hasPendingRecord) {
        clearMarker(fresh.id);
        setMarker(null);
        return;
      }

      if (isMarkerExpired(stored)) {
        clearMarker(fresh.id);
        setMarker(null);
        return;
      }

      if (rebaseline) {
        const next = { ...stored, snapshot: takeSnapshot(fresh) };
        writeMarker(fresh.id, next);
        setMarker(next);
        return;
      }

      if (
        hasVendorChangedSince(stored, fresh) ||
        (await decisionNotificationArrived(fresh.id, stored))
      ) {
        clearMarker(fresh.id);
        setMarker(null);
        return;
      }

      setMarker(stored);
    },
    []
  );

  const fetchVendor = useCallback(
    async (options: FetchOptions = {}) => {
      try {
        if (!options.silent) setLoading(true);
        setError(null);

        const data = await getCurrentVendor();

        setVendor(data);
        await syncMarker(data, !!options.rebaseline);
      } catch (error) {
        console.error("Failed to fetch current vendor:", error);
        setError(localizedError("vendor.errors.loadVendor", error));
      } finally {
        if (!options.silent) setLoading(false);
      }
    },
    [syncMarker]
  );

  useEffect(() => {
    // Data fetch on mount; state is set after the awaited request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVendor();
  }, [fetchVendor]);

  // Another component changed the vendor (photo, resubmit, ...): refresh
  // quietly so the header, sidebar and status banner never go stale.
  useEffect(
    () =>
      subscribeToVendorDataChange("vendor", instanceId, () => {
        void fetchVendor({ silent: true });
      }),
    [instanceId, fetchVendor]
  );

  const refetch = useCallback(() => fetchVendor(), [fetchVendor]);
  const refreshSilently = useCallback(
    () => fetchVendor({ silent: true }),
    [fetchVendor]
  );

  const update = useCallback(
    async (data: UpdateVendorRequest): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading("update");
        setActionError(null);

        await updateVendor(vendor.id, data);

        const fresh = await getCurrentVendor();
        setVendor(fresh);

        // The edit now waits for an admin. If the server reports that itself
        // (`pendingChanges`), nothing more to do; otherwise (including a
        // `null` that just means "not populated here") remember it locally
        // so the form stays locked until a decision shows up.
        if (fresh.hasPendingRecord || fresh.status === "Rejected") {
          clearMarker(fresh.id);
          setMarker(null);
        } else {
          const created: PendingEditMarker = {
            submittedAt: new Date().toISOString(),
            snapshot: takeSnapshot(fresh),
            submitted: data,
          };

          writeMarker(fresh.id, created);
          setMarker(created);
        }

        announceVendorDataChange("vendor", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to update vendor:", error);

        // The server may refuse an edit (e.g. one is already awaiting
        // review). Show its reason (if it gave one) and resync so the UI
        // locks accordingly.
        setActionError(localizedError("vendor.errors.updateProfile", error));

        if (isAxiosError(error) && error.response?.status === 409) {
          await fetchVendor({ silent: true });
        }

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor, instanceId]
  );

  const resubmit = useCallback(async (): Promise<boolean> => {
    if (!vendor) return false;

    try {
      setActionLoading("resubmit");
      setActionError(null);

      await resubmitVendor(vendor.id);
      await fetchVendor({ silent: true });
      announceVendorDataChange("vendor", instanceId);

      return true;
    } catch (error) {
      console.error("Failed to resubmit vendor:", error);
      setActionError(localizedError("vendor.errors.resubmitProfile", error));

      return false;
    } finally {
      setActionLoading(null);
    }
  }, [vendor, fetchVendor, instanceId]);

  const uploadProfileImage = useCallback(
    async (file: File): Promise<boolean> => {
      if (!vendor) return false;

      try {
        setActionLoading("profile-image");
        setActionError(null);

        await uploadVendorProfileImage(vendor.id, file);
        await fetchVendor({ silent: true });
        announceVendorDataChange("vendor", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to upload vendor profile image:", error);
        setActionError(localizedError("vendor.errors.uploadProfilePhoto", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor, instanceId]
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
        await fetchVendor({ rebaseline: true, silent: true });
        announceVendorDataChange("vendor", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to upload vendor gallery images:", error);
        setActionError(localizedError("vendor.errors.uploadGallery", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, fetchVendor, instanceId]
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

        // A gallery change isn't an admin decision; don't let it release the
        // pending-review lock.
        const stored = readMarker(vendor.id);
        if (stored) {
          try {
            const fresh = await getCurrentVendor();
            const next = { ...stored, snapshot: takeSnapshot(fresh) };
            writeMarker(vendor.id, next);
            setMarker(next);
          } catch {
            // keep the existing marker
          }
        }

        announceVendorDataChange("vendor", instanceId);

        return true;
      } catch (error) {
        console.error("Failed to delete vendor gallery image:", error);
        setActionError(localizedError("vendor.errors.deleteGalleryPhoto", error));

        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [vendor, instanceId]
  );

  return {
    vendor,
    loading,
    error: resolveLocalizedError(error, t),
    actionLoading,
    actionError: resolveLocalizedError(actionError, t),
    isPendingReview:
      !!vendor?.pendingChanges || !!vendor?.hasPendingRecord || !!marker,
    pendingSubmitted: marker?.submitted ?? null,
    refetch,
    refreshSilently,
    update,
    resubmit,
    uploadProfileImage,
    uploadGalleryImages,
    deleteGalleryImage,
  };
};
