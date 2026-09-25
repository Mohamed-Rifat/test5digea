"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

import type { ModerationQueueItem } from "@/types/moderation";
import { LANGUAGE_DATE_LOCALE } from "@/locales";
import EmptyState from "./EmptyState";
import {
  formatDate,
  requestEntityMeta,
  requestHref,
  requestStatusLabels,
  requestStatusStyles,
} from "./utils";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSection from "./DashboardSection";

export default function RecentRequestsList({ requests }: { requests: ModerationQueueItem[] }) {
  const { t, language } = useLanguage();

  return (
    <DashboardSection
      icon={ClipboardList}
      title={t("admin.dashboard.insights.recentRequests")}
      subtitle={t("admin.dashboard.insights.recentSubmissions")}
      action={{ href: "/admin/moderation", label: t("admin.dashboard.quickActions.viewQueue") }}
    >
      {requests.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={ClipboardList}
            text={t('admin.dashboard.quickActions.nothingWaiting')}
          />
        </div>
      ) : (
        <div className="divide-y divide-[#f0e9e4]">
          {requests.slice(0, 5).map((item) => {
            const meta = requestEntityMeta[item.entityType] ?? {
              labelKey: "admin.moderation.entity.item" as const,
              icon: ClipboardList,
              className: "bg-[#f0e9e0] text-[#a47e43]",
            };

            const Icon = meta.icon;

            return (
              <Link
                key={`${item.entityType}-${item.entityId}`}
                href={requestHref(item)}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-[#fcfaf8] sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.className}`}
                  >
                    <Icon size={15} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-xs font-semibold text-[#30251f]">
                        {item.title}
                      </p>

                      <span className="shrink-0 rounded-full bg-[#f4eee9] px-2 py-0.5 text-[9px] font-medium text-[#766d67]">
                        {t(meta.labelKey)}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-[10px] text-[#9b8e86]">
                      {item.vendorBusinessName} · {formatDate(item.submittedAt, LANGUAGE_DATE_LOCALE[language])}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    requestStatusStyles[item.status] ??
                    "bg-[#f4eee9] text-[#766d67]"
                  }`}
                >
                  {requestStatusLabels[item.status] ? t(requestStatusLabels[item.status]) : t('admin.dashboard.unknown')}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardSection>
  );
}
