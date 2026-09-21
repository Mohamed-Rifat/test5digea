"use client";

import { useEffect, useState } from "react";

import { getServices, searchServices } from "@/features/services/api";
import type { Service } from "@/types/service";

export const SIMILAR_SERVICES_LIMIT = 3;

// "sameVendor":   the same vendor also offers other services in this category.
// "otherVendors": the vendor offers nothing else here, so we suggest similar
//                 services (same category) from other vendors instead.
export type SimilarServicesMode = "sameVendor" | "otherVendors";

interface SimilarState {
  forServiceId: string;
  mode: SimilarServicesMode | null;
  services: Service[];
}

interface UseSimilarServicesReturn {
  mode: SimilarServicesMode | null;
  services: Service[];
  loading: boolean;
}

/**
 * Suggestions for the service details page.
 *  1. Other services of the same vendor in the same category (up to 3).
 *  2. If there are none: services of the same category from other vendors.
 */
export const useSimilarServices = (
  service: Service | null
): UseSimilarServicesReturn => {
  const serviceId = service?.id ?? "";
  const vendorId = service?.vendorId ?? "";
  const categoryId = service?.categoryId ?? "";

  const [state, setState] = useState<SimilarState | null>(null);

  useEffect(() => {
    if (!serviceId || !categoryId) return;

    let cancelled = false;

    const load = async () => {
      try {
        if (vendorId) {
          const vendorServices = await getServices({ vendorId, categoryId });
          const sameVendor = vendorServices.filter(
            (item) => item.id !== serviceId
          );

          if (sameVendor.length > 0) {
            if (!cancelled) {
              setState({
                forServiceId: serviceId,
                mode: "sameVendor",
                services: sameVendor.slice(0, SIMILAR_SERVICES_LIMIT),
              });
            }
            return;
          }
        }

        const result = await searchServices({
          categoryId,
          sortBy: 0,
          page: 1,
          pageSize: 12,
        });

        const others = result.items.filter(
          (item) => item.id !== serviceId && item.vendorId !== vendorId
        );

        if (!cancelled) {
          setState({
            forServiceId: serviceId,
            mode: others.length > 0 ? "otherVendors" : null,
            services: others.slice(0, SIMILAR_SERVICES_LIMIT),
          });
        }
      } catch {
        // Suggestions are optional: on failure the block is simply hidden.
        if (!cancelled) {
          setState({ forServiceId: serviceId, mode: null, services: [] });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [serviceId, vendorId, categoryId]);

  // Ignore results that belong to the previously opened service.
  const current =
    state !== null && state.forServiceId === serviceId ? state : null;

  return {
    mode: current ? current.mode : null,
    services: current ? current.services : [],
    loading: serviceId !== "" && current === null,
  };
};
