"use client";

import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button, useMediaQuery, useTheme } from "@mui/material";

import { useLanguage } from "@/context/LanguageContext";

interface ReviewsPageHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onExport: () => void;
  canExport: boolean;
}

export function ReviewsPageHeader({ isRefreshing, onRefresh, onExport, canExport }: ReviewsPageHeaderProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <header className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>

          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl lg:text-4xl">
              {t("vendor.reviews.title")}
            </h1>
          </div>

          <p className="mt-2 max-w-xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
            {t("vendor.reviews.subtitle")}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={t("vendor.reviews.refresh")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3d9d1] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#665950] transition-all hover:border-[#cfc1b7] hover:bg-[#faf8f6] disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin sm:h-5 sm:w-5" : "sm:h-5 sm:w-5"} />
          </button>

          <div>
            <Button
              onClick={onExport}
              disabled={!canExport}
              startIcon={<FileSpreadsheet size={16} className="sm:h-4.5 sm:w-4.5" />}
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderRadius: "12px",
                backgroundColor: "#30251f",
                textTransform: "none",
                fontSize: isMobile ? "11px" : "14px",
                fontWeight: 500,
                padding: isMobile ? "4px 12px" : "8px 18px",
                minHeight: isMobile ? "32px" : "auto",
                "&:hover": { backgroundColor: "#46382f" },
                "&:disabled": { opacity: 0.5 },
              }}
            >
              <span className="">{t("vendor.reviews.export")}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
