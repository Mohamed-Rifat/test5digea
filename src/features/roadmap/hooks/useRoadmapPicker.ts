"use client";

import { useCallback, useState } from "react";

import { useRoadmap } from "@/features/roadmap/hooks/useRoadmap";
import { selectRoadmapVendor } from "@/features/roadmap/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/providers/ToastProvider";
import { useConfirm } from "@/components/providers/ConfirmProvider";
import { getApiErrorMessage } from "@/lib/error";
import type { RoadmapItem } from "@/types/roadmap";

export interface PickVendor {
  id: string;
  name: string;
}

const normalize = (value: string | null | undefined) =>
  (value ?? "").trim().toLowerCase();

/**
 * Everything a public page needs to let a couple add a vendor to their
 * wedding roadmap in one click: loads the roadmap once, finds the matching
 * roadmap step (by category id or name), asks before replacing another
 * vendor, and gives clear success / error feedback with a link back to the
 * roadmap.
 */
export function useRoadmapPicker() {
  const { isAuthenticated, isUser, isLoading: authLoading } = useAuth();
  const { roadmap, loading, refetch } = useRoadmap();
  const { t } = useLanguage();
  const { toast } = useToast();
  const confirm = useConfirm();
  const [pickingCategoryId, setPickingCategoryId] = useState<string | null>(null);

  const findItem = useCallback(
    (categoryId?: string | null, categoryName?: string | null): RoadmapItem | null => {
      if (!roadmap) return null;
      const byId = categoryId
        ? roadmap.items.find((item) => normalize(String(item.categoryId)) === normalize(categoryId))
        : undefined;
      if (byId) return byId;
      const name = normalize(categoryName);
      return name ? roadmap.items.find((item) => normalize(item.categoryName) === name) ?? null : null;
    },
    [roadmap]
  );

  /** Roadmap steps that match any of the vendor's category names. */
  const matchingItems = useCallback(
    (categoryNames: string[] | undefined): RoadmapItem[] => {
      if (!roadmap || !categoryNames?.length) return [];
      const names = new Set(categoryNames.map(normalize));
      return roadmap.items.filter((item) => names.has(normalize(item.categoryName)));
    },
    [roadmap]
  );

  const pick = useCallback(
    async (item: RoadmapItem, vendor: PickVendor): Promise<boolean> => {
      if (item.selectedVendorId === vendor.id) return true;

      if (item.selectedVendorId) {
        const ok = await confirm({
          title: t("roadmap.pick.replaceTitle"),
          message: t("roadmap.pick.replaceBody", {
            old: item.selectedVendorName || "—",
            category: item.categoryName,
            new: vendor.name,
          }),
          confirmText: t("roadmap.pick.replaceConfirm"),
        });
        if (!ok) return false;
      }

      const categoryId = String(item.categoryId);
      setPickingCategoryId(categoryId);
      try {
        await selectRoadmapVendor(categoryId, { vendorId: vendor.id });
        await refetch();
        toast(
          t("roadmap.pick.success", { vendor: vendor.name, category: item.categoryName }),
          "success",
          { action: { label: t("roadmap.pick.openRoadmap"), href: "/roadmap" } }
        );
        return true;
      } catch (err) {
        toast(getApiErrorMessage(err, t("roadmap.pick.failed")), "error");
        return false;
      } finally {
        setPickingCategoryId(null);
      }
    },
    [confirm, refetch, t, toast]
  );

  return {
    /** Signed-in couple (the only role that has a roadmap). */
    canUse: isAuthenticated && isUser,
    isGuest: !authLoading && !isAuthenticated,
    // Stay "ready" while refreshing after a pick, so buttons don't flicker.
    ready: !authLoading && (!loading || roadmap !== null),
    roadmap,
    findItem,
    matchingItems,
    pick,
    pickingCategoryId,
  };
}

export type RoadmapPicker = ReturnType<typeof useRoadmapPicker>;
