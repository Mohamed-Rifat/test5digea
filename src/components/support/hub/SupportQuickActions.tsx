"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Chip } from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { SupportHubState } from "./useSupportHub";

/** Role-specific shortcut tiles. */
export function SupportQuickActions({ hub }: { hub: SupportHubState }) {
  const { t } = useLanguage();
  const { quickActions, roleLabel, roleColor } = hub;

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
          {t("support.quickActions.title")}
        </h2>

        <Chip
          label={roleLabel}
          size="small"
          sx={{
            height: 22,
            fontSize: "9px",
            fontWeight: 600,
            backgroundColor: roleColor,
            color: "white",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.titleKey}
              href={action.href}
              className="group flex flex-col items-center rounded-2xl border border-[#e8dfd8] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110 sm:h-12 sm:w-12"
                style={{
                  backgroundColor: `${action.color}15`,
                }}
              >
                <Icon
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{
                    color: action.color,
                  }}
                />
              </div>

              <p className="mt-2 text-xs font-semibold text-[#30251f] sm:mt-3 sm:text-sm">
                {t(action.titleKey)}
              </p>

              <ChevronRight className="mt-1 h-3 w-3 text-[#9a8d85] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:h-4 sm:w-4 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
