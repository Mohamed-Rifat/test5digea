"use client";

import { Calendar, Clock3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { DAYS_OF_WEEK, type WorkingHours } from "@/components/public/vendor-detail/vendorDetailUtils";

export function WorkingHoursCard({
  workingHours,
  todayJsDay,
}: {
  workingHours: WorkingHours;
  todayJsDay: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-[#eee7e1] bg-white p-6">

      <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-light text-[#30251f]">
        <Calendar
          size={16}
          className="text-[#a47e43]"
        />

        {t("vendors.detail.hours.title")}
      </h2>

      <div className="space-y-2">

        {DAYS_OF_WEEK.map(
          ({
            labelKey,
            shortKey,
            key,
            jsDay,
          }) => {
            const value = workingHours[key];

            if (!value) return null;

            const isOff = value === "OFF";
            const isToday =
              jsDay === todayJsDay;

            return (
              <div
                key={key}
                className={`flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-sm ${
                  isToday
                    ? "bg-[#f3e6e1] ring-1 ring-[#ead8ca]"
                    : "bg-[#faf7f4]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">

                  <Clock3
                    size={14}
                    className={
                      isToday
                        ? "text-[#a47e43]"
                        : "text-[#c2b5aa]"
                    }
                  />

                  <span className="hidden text-[#5f544d] sm:inline">
                    {t(labelKey)}
                  </span>

                  <span className="text-[#5f544d] sm:hidden">
                    {t(shortKey)}
                  </span>

                  {isToday && (
                    <span className="rounded-full bg-[#a47e43] px-2 py-0.5 text-[9px] font-semibold text-white">
                      {t("vendors.detail.hours.today")}
                    </span>
                  )}
                </div>

                <span
                  className={
                    isOff
                      ? "shrink-0 text-xs font-semibold text-rose-500"
                      : "shrink-0 text-xs font-medium text-[#5f544d]"
                  }
                >
                  {isOff
                    ? t("vendors.detail.hours.dayOff")
                    : value}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
