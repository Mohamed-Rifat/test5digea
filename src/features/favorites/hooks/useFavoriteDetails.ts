"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getService } from "@/features/services/api";
import { getVendorDetails } from "@/features/vendors/api";
import { FavoriteTargetType } from "@/types/favorite";

import type { Favorite } from "@/types/favorite";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";

/**
 * `GET /api/Favorites` only returns a light summary of every saved item
 * (id, name, imageUrl, createdAt). The shared VendorCard / ServiceCard need
 * the full record (rating, location, categories, prices, ...), so this hook
 * loads the full vendor / service for each favorite and caches it.
 */
export type FavoriteDetail =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; vendor: Vendor; service?: undefined }
  | { status: "ready"; service: Service; vendor?: undefined };

const detailKey = (favorite: Favorite) =>
  `${favorite.targetType}:${favorite.targetId}`;

export const useFavoriteDetails = (favorites: Favorite[]) => {
  const [details, setDetails] = useState<Record<string, FavoriteDetail>>({});

  // Keys that were already requested, so a re-render never triggers a
  // second request for the same item.
  const requested = useRef<Set<string>>(new Set());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const missing = favorites.filter(
      (favorite) => !requested.current.has(detailKey(favorite))
    );

    if (missing.length === 0) return;

    missing.forEach((favorite) => requested.current.add(detailKey(favorite)));

    const load = async (favorite: Favorite): Promise<[string, FavoriteDetail]> => {
      const key = detailKey(favorite);

      try {
        if (favorite.targetType === FavoriteTargetType.Vendor) {
          const vendor = await getVendorDetails(favorite.targetId);
          return [key, { status: "ready", vendor }];
        }

        const service = await getService(favorite.targetId);
        return [key, { status: "ready", service }];
      } catch {
        // Deleted / unapproved items still show up as a basic card so the
        // user can remove them.
        return [key, { status: "failed" }];
      }
    };

    Promise.all(missing.map(load)).then((entries) => {
      if (!mounted.current) return;

      setDetails((previous) => ({
        ...previous,
        ...Object.fromEntries(entries),
      }));
    });
  }, [favorites]);

  const getDetail = useCallback(
    (favorite: Favorite): FavoriteDetail =>
      details[detailKey(favorite)] ?? { status: "loading" },
    [details]
  );

  return { getDetail };
};
