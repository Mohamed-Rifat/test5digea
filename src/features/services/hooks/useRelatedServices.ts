"use client";

import { useEffect, useState } from "react";

import { getServices } from "@/features/services/api";
import { searchVendorList } from "@/features/vendors/api";
import { vendorScores } from "@/lib/ranking";
import { RoadmapItemStatus, type Roadmap } from "@/types/roadmap";
import type { Service } from "@/types/service";

const RAIL_LIMIT = 10;

export interface RelatedServices {
  /** Same category, other vendors - best first. */
  sameCategory: Service[];
  /** Everything else this vendor offers (any category). */
  sameVendor: Service[];
  /** Other categories, one per category per round - to keep exploring. */
  explore: Service[];
  /** True when `explore` is built from the couple's unfinished roadmap steps. */
  exploreFromRoadmap: boolean;
}

const isLive = (s: Service) => !s.status || /approved/i.test(s.status);

/**
 * Everything the service page suggests below the fold, from one round of
 * requests: similar services (same category), more from this vendor, and
 * other categories worth a look (the couple's unfinished roadmap steps
 * first, when they have a roadmap).
 */
export function useRelatedServices(service: Service | null, roadmap: Roadmap | null) {
  const serviceId = service?.id ?? "";
  const [state, setState] = useState<{
    forId: string;
    all: Service[];
    scores: Map<string, number>;
  } | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    (async () => {
      const [servicesRes, vendorsRes] = await Promise.allSettled([
        getServices(),
        searchVendorList({ sortBy: 0, page: 1, pageSize: 100 }),
      ]);
      if (cancelled) return;
      const all = servicesRes.status === "fulfilled" ? servicesRes.value.filter(isLive) : [];
      const scores =
        vendorsRes.status === "fulfilled" ? vendorScores(vendorsRes.value.items) : new Map();
      setState({ forId: serviceId, all, scores });
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const current = state && state.forId === serviceId ? state : null;
  if (!service || !current) {
    return { loading: !!serviceId, data: null as RelatedServices | null };
  }

  const { all, scores } = current;
  const byScore = (a: Service, b: Service) =>
    (scores.get(b.vendorId) ?? 0) - (scores.get(a.vendorId) ?? 0) ||
    Number((b.images?.length ?? 0) > 0) - Number((a.images?.length ?? 0) > 0);
  const others = all.filter((s) => s.id !== service.id);

  const sameCategory = others
    .filter((s) => s.categoryId === service.categoryId && s.vendorId !== service.vendorId)
    .sort(byScore)
    .slice(0, RAIL_LIMIT);

  const sameVendor = others
    .filter((s) => s.vendorId === service.vendorId)
    // same category first, then the rest
    .sort((a, b) => Number(b.categoryId === service.categoryId) - Number(a.categoryId === service.categoryId))
    .slice(0, RAIL_LIMIT);

  const shown = new Set([...sameCategory, ...sameVendor].map((s) => s.id));
  const pool = others.filter(
    (s) => !shown.has(s.id) && s.categoryId !== service.categoryId && s.vendorId !== service.vendorId
  );

  // Couple with a roadmap: steps still waiting for a vendor come first.
  const openSteps = new Set(
    (roadmap?.items ?? [])
      .filter((i) => i.status !== RoadmapItemStatus.Completed && !i.selectedVendorId)
      .map((i) => String(i.categoryId))
  );
  const fromRoadmap = pool.filter((s) => openSteps.has(String(s.categoryId)));
  const source = fromRoadmap.length >= 3 ? fromRoadmap : pool;

  // Round-robin across categories so one category can't fill the rail.
  const byCategory = new Map<string, Service[]>();
  [...source].sort(byScore).forEach((s) => {
    const list = byCategory.get(s.categoryId) ?? [];
    list.push(s);
    byCategory.set(s.categoryId, list);
  });
  const explore: Service[] = [];
  const queues = Array.from(byCategory.values());
  for (let round = 0; explore.length < RAIL_LIMIT && queues.some((q) => q.length > round); round++) {
    for (const q of queues) {
      if (q[round]) explore.push(q[round]);
      if (explore.length === RAIL_LIMIT) break;
    }
  }

  return {
    loading: false,
    data: {
      sameCategory,
      sameVendor,
      explore,
      exploreFromRoadmap: source === fromRoadmap && fromRoadmap.length >= 3,
    } as RelatedServices,
  };
}
