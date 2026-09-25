"use client";

import { HelpCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import type { SupportHubState } from "./useSupportHub";

/** Title, subtitle and the "signed in as" badge. */
export function SupportHeader({ hub }: { hub: SupportHubState }) {
  const { t } = useLanguage();
  const { userInfo, UserIcon } = hub;

  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rtl:tracking-normal text-[#9b8171] sm:mb-2 sm:text-xs">
            <Sparkles size={11} className="sm:h-3.25 sm:w-3.25" />

            {t("support.eyebrow")}
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
              <HelpCircle
                size={16}
                className="text-[#a47e43] sm:h-5 sm:w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                {t("support.title")}
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
            {t("support.intro")}
          </p>
        </div>

        {/* User Badge */}

        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${userInfo.color} sm:h-9 sm:w-9`}
          >
            <UserIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#30251f]">
              {userInfo.name}
            </p>

            <p className="text-[10px] text-[#9a8d85] sm:text-xs">
              {userInfo.role} • {userInfo.roleDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
