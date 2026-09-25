"use client";

import { X } from "lucide-react";
import { Divider, IconButton, SwipeableDrawer } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";
import { ReviewFilterFields } from "./ReviewFilterFields";
import type { ReviewFilters } from "./useVendorReviewsPage";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ReviewFilters;
  serviceOptions: { id: string; name: string }[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  serviceOptions,
  hasActiveFilters,
  clearFilters,
}: MobileFilterDrawerProps) {
  const { t } = useLanguage();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          maxHeight: "90vh",
          padding: "20px",
        },
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#30251f]">{t("vendor.reviews.drawer.title")}</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-[#8b6d55] transition-colors hover:text-[#30251f]"
            >
              {t("vendor.reviews.filters.clearAll")}
            </button>
          )}
          <IconButton onClick={onClose} size="small" aria-label={t("common.close")}>
            <X size={20} />
          </IconButton>
        </div>
      </div>

      <Divider className="mb-4" />

      <ReviewFilterFields filters={filters} serviceOptions={serviceOptions} className="space-y-4" />

      <button
        onClick={onClose}
        className="mt-6 w-full rounded-xl bg-[#30251f] py-3 text-sm font-semibold text-white transition hover:bg-[#46382f]"
      >
        {t("vendor.reviews.drawer.apply")}
      </button>
    </SwipeableDrawer>
  );
}
