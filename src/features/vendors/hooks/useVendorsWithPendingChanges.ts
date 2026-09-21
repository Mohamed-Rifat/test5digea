"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getAdminVendorDetails,
  getAdminVendorsList,
} from "@/features/vendors/api";
import type { Vendor } from "@/types/vendor";

// How many vendor detail requests run at the same time.
const CONCURRENCY = 6;

interface Progress {
  done: number;
  total: number;
}

interface UseVendorsWithPendingChangesReturn {
  /** Vendors that have profile edits waiting for admin approval. */
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  progress: Progress;
  /** Vendors whose details couldn't be loaded (network / permission). */
  failedCount: number;
  refetch: () => Promise<void>;
  /** Drop a vendor from the list once its edit was approved / rejected. */
  remove: (id: string) => void;
}

/**
 * Finds every vendor with profile edits awaiting review.
 *
 * `pendingChanges` is only returned by GET /api/Vendors/admin/{id}, not by
 * the list endpoint, so this walks the admin vendor list and checks each
 * vendor's details (a few at a time). If the backend later exposes a single
 * "vendors with pending changes" endpoint, replace the body of `scan` with
 * that one call — nothing else needs to change.
 */
export const useVendorsWithPendingChanges =
  (): UseVendorsWithPendingChangesReturn => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<Progress>({ done: 0, total: 0 });
    const [failedCount, setFailedCount] = useState(0);

    // Lets a newer scan cancel an older one that is still running.
    const scanId = useRef(0);

    const scan = useCallback(async () => {
      const myScan = ++scanId.current;
      const cancelled = () => scanId.current !== myScan;

      try {
        setLoading(true);
        setError(null);
        setFailedCount(0);
        setVendors([]);
        setProgress({ done: 0, total: 0 });

        const all = await getAdminVendorsList();

        if (cancelled()) return;

        // Rejected vendors resubmit through their own flow; everyone else
        // can have a live profile with edits on top of it.
        const candidates = all.filter((vendor) => vendor.status !== "Rejected");

        setProgress({ done: 0, total: candidates.length });

        const found: Vendor[] = [];
        let cursor = 0;
        let done = 0;
        let failed = 0;

        const worker = async () => {
          while (!cancelled()) {
            const index = cursor++;

            if (index >= candidates.length) return;

            try {
              const details = await getAdminVendorDetails(candidates[index].id);

              if (details.pendingChanges) {
                found.push(details);

                if (!cancelled()) {
                  setVendors(
                    [...found].sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                  );
                }
              }
            } catch {
              
              failed += 1;
            } finally {
              done += 1;

              if (!cancelled()) {
                setProgress({ done, total: candidates.length });
              }
            }
          }
        };

        await Promise.all(
          Array.from(
            { length: Math.min(CONCURRENCY, candidates.length) },
            worker
          )
        );

        if (!cancelled()) setFailedCount(failed);
      } catch {
        

        if (!cancelled()) setError("Failed to load partners.");
      } finally {
        if (!cancelled()) setLoading(false);
      }
    }, []);

    useEffect(() => {
      // Data fetch on mount; state is set as requests resolve.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      scan();

      return () => {
        scanId.current += 1;
      };
    }, [scan]);

    const remove = useCallback((id: string) => {
      setVendors((previous) => previous.filter((vendor) => vendor.id !== id));
    }, []);

    return {
      vendors,
      loading,
      error,
      progress,
      failedCount,
      refetch: scan,
      remove,
    };
  };
