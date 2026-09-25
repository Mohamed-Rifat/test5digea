"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Full-page spinner while the roadmap loads. */
export function RoadmapLoading() {
  const { t } = useLanguage();

  return (
    <div
      className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f4]"
      role="status"
    >
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfd6] bg-white shadow-sm">
          <Loader2
            size={26}
            className="animate-spin text-[#ae7b40]"
            aria-hidden="true"
          />
        </span>
        <p className="mt-5 text-lg font-bold text-[#30251f]">
          {t("roadmap.loading.title")}
        </p>
        <p className="mt-1 text-sm text-[#a3978f]">
          {t("roadmap.loading.subtitle")}
        </p>
      </div>
    </div>
  );
}

/** Full-page error when the roadmap could not be loaded. */
export function RoadmapError({ message }: { message: string }) {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f4] px-4">
      <div
        className="max-w-md rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm"
        role="alert"
      >
        <AlertCircle
          size={30}
          className="mx-auto text-red-500"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-bold text-[#30251f]">
          {t("roadmap.errorState.title")}
        </h1>
        <p className="mt-2 text-sm text-[#8b7e76]">{message}</p>
      </div>
    </div>
  );
}
