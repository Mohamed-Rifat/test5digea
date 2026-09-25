"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import type { TranslationKey } from "@/locales";
import { RoadmapItemStatus } from "@/types/roadmap";

const ROLE_LABEL_KEY: Record<string, TranslationKey> = {
  Admin: "profile.roles.admin",
  Vendor: "profile.roles.vendor",
  User: "profile.roles.couple",
};

/** Signed-in user's data for the profile page (roadmap progress, favorites…). */
export function useProfileOverview() {
  const { user, role, isAuthenticated } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { roadmap, loading: roadmapLoading } = useRoadmap();
  const { t } = useLanguage();
  const { currentUser } = useCurrentUser(isAuthenticated);

  const totalItems = roadmap?.items.length ?? 0;

  const completedItems =
    roadmap?.items.filter((item) => item.status === RoadmapItemStatus.Completed)
      .length ?? 0;

  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const initial = user?.fullName?.trim()?.charAt(0).toUpperCase() || "?";

  const roleKey = role ? ROLE_LABEL_KEY[role] : undefined;
  const roleLabel = role
    ? roleKey
      ? t(roleKey)
      : role
    : t("profile.roles.couple");

  return {
    totalItems,
    completedItems,
    progress,
    initial,
    roleKey,
    roleLabel,
    user,
    role,
    favorites,
    favoritesLoading,
    roadmap,
    roadmapLoading,
    currentUser,
  };
}

export type ProfileOverviewState = ReturnType<typeof useProfileOverview>;
