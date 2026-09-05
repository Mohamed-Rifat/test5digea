export enum FavoriteTargetType {
  Vendor = 1,
  Service = 2,
}

export interface Favorite {
  id: string;
  targetType: FavoriteTargetType;
  targetId: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export interface AddFavoriteRequest {
  targetType: FavoriteTargetType;
  targetId: string;
}

export interface RemoveFavoriteRequest {
  targetType: FavoriteTargetType;
  targetId: string;
}

export interface GetFavoritesParams {
  targetType?: FavoriteTargetType;
}
