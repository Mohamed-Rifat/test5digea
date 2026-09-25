import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

/**
 * Weighted rating (Bayesian average): a 5.0 from 2 reviews shouldn't beat a
 * 4.8 from 120. Ratings are pulled toward the site average until a vendor
 * has enough reviews (PRIOR_REVIEWS) to speak for itself.
 */
const PRIOR_REVIEWS = 5;

export function vendorScores(vendors: Vendor[]): Map<string, number> {
  const rated = vendors.filter((v) => (v.reviewsCount ?? 0) > 0);
  const siteAverage = rated.length
    ? rated.reduce((sum, v) => sum + (v.averageRating ?? 0), 0) / rated.length
    : 0;
  return new Map(
    vendors.map((v) => {
      const n = v.reviewsCount ?? 0;
      const r = v.averageRating ?? 0;
      return [v.id, (n / (n + PRIOR_REVIEWS)) * r + (PRIOR_REVIEWS / (n + PRIOR_REVIEWS)) * siteAverage];
    })
  );
}

/** Best vendors first: weighted rating, then number of reviews. */
export function topVendors(vendors: Vendor[], count: number): Vendor[] {
  const score = vendorScores(vendors);
  return [...vendors]
    .sort(
      (a, b) =>
        (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0) ||
        (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)
    )
    .slice(0, count);
}

/**
 * Services have no rating of their own, so they borrow their vendor's score.
 * Services with photos come first, and at most one per vendor is taken per
 * round so a single vendor can't fill the whole row.
 */
export function topServices(services: Service[], vendors: Vendor[], count: number): Service[] {
  const score = vendorScores(vendors);
  const sorted = [...services].sort(
    (a, b) =>
      Number((b.images?.length ?? 0) > 0) - Number((a.images?.length ?? 0) > 0) ||
      (score.get(b.vendorId) ?? 0) - (score.get(a.vendorId) ?? 0) ||
      (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
  );
  const picked: Service[] = [];
  const used = new Set<string>();
  while (picked.length < count && used.size < sorted.length) {
    const seen = new Set<string>();
    let added = false;
    for (const s of sorted) {
      if (used.has(s.id) || seen.has(s.vendorId)) continue;
      picked.push(s);
      used.add(s.id);
      seen.add(s.vendorId);
      added = true;
      if (picked.length === count) break;
    }
    if (!added) break;
  }
  return picked;
}
