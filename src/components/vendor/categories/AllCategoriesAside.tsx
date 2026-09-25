"use client";

import { Info, Tags, CheckCircle2, Lock, Search } from "lucide-react";
import { Badge } from "@mui/material";
import { TextField } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";
import TextWithSlots from "@/components/shared/TextWithSlots";
import { CategoryCard } from "@/components/vendor/CategoryRequest";

import type { VendorCategoriesPageState } from "./useVendorCategoriesPage";

/** Searchable catalogue of all categories. */
export function AllCategoriesAside({
  page,
}: {
  page: VendorCategoriesPageState;
}) {
  const { t } = useLanguage();
  const {
    categorySearch,
    setCategorySearch,
    assignedCategoryNames,
    filteredAllCategories,
    assignedCountInFiltered,
    handleContactAdmin,
    categoriesLoading,
  } = page;

  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
      <div className="rounded-3xl border border-[#e8dfd8] bg-white shadow-sm">
        <div className="border-b border-[#f0eae5] p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
              <Tags size={16} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
                {t("vendor.services.detail.categoriesTitle")}
              </h2>
              <p className="text-[10px] text-[#9b8f86] sm:text-xs">
                {t("vendor.services.detail.categoriesSub")}
              </p>
            </div>

            <Badge
              badgeContent={filteredAllCategories.length}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#a47e43",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 600,
                  height: 20,
                  minWidth: 20,
                },
              }}
            >
              <span className="h-2 w-2" />
            </Badge>
          </div>

          <div className="mt-3">
            <TextField
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder={t("vendor.services.detail.searchCategories")}
              aria-label={t("vendor.services.detail.searchCategories")}
              startIcon={<Search size={14} />}
              size="sm"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-[#9b8f86] sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              <span className="font-medium text-emerald-700">
                {assignedCountInFiltered}
              </span>{" "}
              {t("vendor.services.detail.activeCount")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock size={11} className="text-[#a47e43]" />
              <span className="font-medium text-[#a47e43]">
                {filteredAllCategories.length - assignedCountInFiltered}
              </span>{" "}
              {t("vendor.services.detail.availableCount")}
            </span>
          </div>
        </div>

        <div className="max-h-150 overflow-y-auto p-3 sm:p-4">
          {categoriesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-[#f5f1ee]"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : filteredAllCategories.length === 0 ? (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-[#d5c8be]" />
              <p className="mt-3 text-xs text-[#9b8f86]">
                {t("vendor.services.detail.noCategories")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAllCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isAssigned={assignedCategoryNames.has(category.name)}
                  onRequest={handleContactAdmin}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#f0eae5] p-3 sm:p-4">
          <div className="flex items-start gap-2 rounded-xl bg-[#fbf6f1] p-2.5 text-[10px] text-[#6f625a] sm:p-3 sm:text-xs">
            <Info
              size={12}
              className="mt-0.5 shrink-0 text-[#a47e43] sm:h-3.5 sm:w-3.5"
            />
            <p className="leading-4 sm:leading-5">
              <TextWithSlots
                text={t("vendor.services.detail.categoriesFooter")}
                slots={{
                  bold: (
                    <strong className="text-[#a47e43]">
                      {t("vendor.services.detail.notifyAdminBold")}
                    </strong>
                  ),
                }}
              />
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
