"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorites.service";

import type {
  Favorite,
  FavoriteTargetType,
  GetFavoritesParams,
} from "@/types/favorite";

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;

  refetch: () => Promise<void>;
  isFavorited: (
    targetType: FavoriteTargetType,
    targetId: string
  ) => boolean;
  toggleFavorite: (
    targetType: FavoriteTargetType,
    targetId: string
  ) => Promise<boolean>;
  remove: (
    targetType: FavoriteTargetType,
    targetId: string
  ) => Promise<boolean>;
}

const favoriteKey = (
  targetType: FavoriteTargetType,
  targetId: string
) => `${targetType}:${targetId}`;

export const useFavorites = (
  params?: GetFavoritesParams
): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getFavorites(params);

      setFavorites(data);
    } catch (err) {
      setError("Failed to load your favorites.");
    } finally {
      setLoading(false);
    }
  }, [params?.targetType]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorited = useCallback(
    (targetType: FavoriteTargetType, targetId: string) => {
      return favorites.some(
        (favorite) =>
          favorite.targetType === targetType &&
          favorite.targetId === targetId
      );
    },
    [favorites]
  );

  const remove = useCallback(
    async (
      targetType: FavoriteTargetType,
      targetId: string
    ): Promise<boolean> => {
      const key = favoriteKey(targetType, targetId);

      try {
        setActionLoading(key);

        await removeFavorite({ targetType, targetId });

        setFavorites((prev) =>
          prev.filter(
            (favorite) =>
              !(
                favorite.targetType === targetType &&
                favorite.targetId === targetId
              )
          )
        );

        return true;
      } catch (err) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  const toggleFavorite = useCallback(
    async (
      targetType: FavoriteTargetType,
      targetId: string
    ): Promise<boolean> => {
      const key = favoriteKey(targetType, targetId);
      const alreadyFavorited = isFavorited(targetType, targetId);

      try {
        setActionLoading(key);

        if (alreadyFavorited) {
          await removeFavorite({ targetType, targetId });

          setFavorites((prev) =>
            prev.filter(
              (favorite) =>
                !(
                  favorite.targetType === targetType &&
                  favorite.targetId === targetId
                )
            )
          );
        } else {
          await addFavorite({ targetType, targetId });
          await fetchFavorites();
        }

        return true;
      } catch (err) {
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [isFavorited, fetchFavorites]
  );

  return {
    favorites,
    loading,
    error,
    actionLoading,
    refetch: fetchFavorites,
    isFavorited,
    toggleFavorite,
    remove,
  };
};
