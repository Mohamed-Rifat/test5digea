"use client";

import { ChevronRight, Search } from "lucide-react";
import { Badge } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { SupportHubState } from "./useSupportHub";
import { SmartLink } from "@/components/support/hub/SupportBits";

/** Contact channels, filtered by the search box. */
export function SupportOptionsList({ hub }: { hub: SupportHubState }) {
  const { t } = useLanguage();
  const { setSearchQuery, filteredOptions } = hub;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-semibold text-[#30251f] sm:mb-4 sm:text-base">
        {t("support.resources.title")}
      </h2>

      {filteredOptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOptions.map((option) => {
            const Icon = option.icon;

            return (
              <SmartLink
                key={option.id}
                href={option.href}
                className="group rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110 sm:h-12 sm:w-12"
                    style={{
                      backgroundColor: `${option.color}15`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      style={{
                        color: option.color,
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                        {t(option.titleKey)}
                      </h3>

                      {option.badge && (
                        <Badge
                          badgeContent={
                            option.badge === "available"
                              ? t("support.resources.badgeAvailable")
                              : t("support.resources.badgeNew")
                          }
                          color={
                            option.badge === "available" ? "success" : "warning"
                          }
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "8px",
                              height: 16,
                              minWidth: 16,
                              fontWeight: 600,
                              backgroundColor:
                                option.badge === "available"
                                  ? "#10b981"
                                  : "#f59e0b",
                            },
                          }}
                        />
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-[#756b65] sm:text-sm">
                      {t(option.descriptionKey)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#f0eae5] pt-3">
                  <span className="text-[10px] text-[#9a8d85] sm:text-xs">
                    {option.id === "phone"
                      ? t("support.resources.callNow")
                      : t("support.resources.learnMore")}
                  </span>

                  <ChevronRight className="h-4 w-4 text-[#a47e43] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </div>
              </SmartLink>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e0d5cd] bg-white px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5eee9]">
            <Search className="h-5 w-5 text-[#a47e43]" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-[#30251f]">
            {t("support.noResults.title")}
          </h3>

          <p className="mt-1 text-xs text-[#756b65]">
            {t("support.noResults.text")}
          </p>

          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-4 text-xs font-semibold text-[#a47e43] hover:underline"
          >
            {t("support.noResults.clear")}
          </button>
        </div>
      )}
    </div>
  );
}
