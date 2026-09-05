import api from "@/lib/axios";

import type {
  Favorite,
  AddFavoriteRequest,
  RemoveFavoriteRequest,
  GetFavoritesParams,
} from "@/types/favorite";

export const getFavorites = async (
  params?: GetFavoritesParams
): Promise<Favorite[]> => {
  const response = await api.get<Favorite[]>("/api/Favorites", {
    params,
  });

  return response.data;
};

export const addFavorite = async (
  data: AddFavoriteRequest
): Promise<void> => {
  await api.post("/api/Favorites", data);
};

export const removeFavorite = async (
  data: RemoveFavoriteRequest
): Promise<void> => {
  await api.delete("/api/Favorites", {
    data,
  });
};
