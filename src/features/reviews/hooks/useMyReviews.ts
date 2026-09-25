"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchServiceReviews } from "@/features/reviews/api";
import { useAuth } from "@/context/AuthContext";
import { ReviewStatus, type Review } from "@/types/review";

/**
 * A review the couple has written. Some fields may be unknown when we only
 * learned about it from the API's "already reviewed" answer.
 */
export type MyReview = Pick<Review, "serviceId" | "vendorId"> &
  Partial<Omit<Review, "serviceId" | "vendorId">>;

const storageKey = (userId: string) => `5digea-my-reviews:${userId}`;

function readLocal(userId: string | undefined): MyReview[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    const parsed = raw ? (JSON.parse(raw) as MyReview[]) : [];
    return Array.isArray(parsed) ? parsed.filter((r) => r && r.serviceId) : [];
  } catch {
    return [];
  }
}

function writeLocal(userId: string | undefined, reviews: MyReview[]) {
  if (!userId) return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(reviews.slice(-200)));
  } catch {
    // storage blocked - the in-memory list still works for this visit
  }
}

/** Richer entry wins; server data wins over local guesses. */
function merge(base: MyReview[], extra: MyReview[]): MyReview[] {
  const map = new Map<string, MyReview>();
  [...base, ...extra].forEach((r) => {
    const prev = map.get(r.serviceId);
    map.set(r.serviceId, prev ? { ...prev, ...Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined && v !== null && v !== "")) } : r);
  });
  return Array.from(map.values());
}

/**
 * Knows which services / vendors the signed-in couple already reviewed so
 * the UI can lock "write a review" and show the existing review instead.
 *
 * Sources (merged): the couple's own published reviews found on a service,
 * and a per-account local record of reviews written - or reported by the API
 * as "already reviewed" - from this browser.
 *
 * Note: GET /api/reviews/me is vendor-only (reviews left on the vendor's own
 * services) and answers 403 for couples, so it is not called here.
 */
export function useMyReviews() {
  const { isUser, isLoading: authLoading, user } = useAuth();
  const userId = user?.userId;
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  const remember = useCallback(
    (entries: MyReview[]) => {
      if (!entries.length) return;
      setReviews((current) => {
        const next = merge(current, entries);
        writeLocal(userId, next);
        return next;
      });
    },
    [userId]
  );

  const refetch = useCallback(async () => {
    setReviews(readLocal(userId));
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (authLoading || !isUser) return;
    refetch();
  }, [authLoading, isUser, refetch]);

  /**
   * Looks for this couple's review among a service's published reviews
   * (covers reviews written from another device). Returns what it found.
   */
  const checkServices = useCallback(
    async (serviceIds: string[]): Promise<MyReview[]> => {
      if (!userId || !serviceIds.length) return [];
      const found: MyReview[] = [];
      await Promise.all(
        serviceIds.map(async (serviceId) => {
          try {
            const page = await fetchServiceReviews(serviceId, { page: 1, pageSize: 100 });
            const mine = page.items?.find((r) => r.userId === userId);
            if (mine) found.push(mine);
          } catch {
            // ignore
          }
        })
      );
      remember(found);
      return found;
    },
    [remember, userId]
  );

  const reviewForVendor = useCallback(
    (vendorId: string | null | undefined) =>
      vendorId ? reviews.find((r) => r.vendorId === vendorId) : undefined,
    [reviews]
  );

  const reviewedServiceIds = useMemo(
    () => new Set(reviews.map((r) => r.serviceId)),
    [reviews]
  );

  return {
    reviews,
    loaded,
    refetch,
    remember,
    checkServices,
    reviewForVendor,
    reviewedServiceIds,
  };
}

export type MyReviews = ReturnType<typeof useMyReviews>;

/** True when an API error means "this user already reviewed the service". */
export const isAlreadyReviewedMessage = (message: string | null | undefined) =>
  /already|سبق|بالفعل|قبل كده|مسبق/i.test(message ?? "");

export const PENDING_STATUS = ReviewStatus.Pending;
