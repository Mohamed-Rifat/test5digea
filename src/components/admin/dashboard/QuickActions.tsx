"use client";

import Link from "next/link";
import { BriefcaseBusiness, ChevronRight, Clock3, Store, Tags, type LucideIcon } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function QuickActions({ pendingVendors }: { pendingVendors: number }) {
  const { t } = useLanguage();

  return (
    <section className="mt-5 rounded-2xl border border-[#ebe3dd] bg-white p-5 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-[#30251f]">{t('admin.dashboard.quickActions.title')}</h2>

        <p className="mt-1 text-xs text-[#9b8e86]">
          {t('admin.dashboard.quickActions.subtitle')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          href="/admin/vendors"
          icon={Store}
          title={t('admin.dashboard.quickActions.manageVendors')}
          description={t('admin.dashboard.quickActions.manageVendorsDesc')}
        />

        <QuickAction
          href="/admin/categories"
          icon={Tags}
          title={t('admin.dashboard.quickActions.manageCategories')}
          description={t('admin.dashboard.quickActions.manageCategoriesDesc')}
        />

        <QuickAction
          href="/admin/services"
          icon={BriefcaseBusiness}
          title={t('admin.dashboard.quickActions.viewServices')}
          description={t('admin.dashboard.quickActions.viewServicesDesc')}
        />

        <QuickAction
          href="/admin/vendors"
          icon={Clock3}
          title={t('admin.dashboard.vendorStatus.pending')}
          description={t('admin.dashboard.pendingVendorsWaiting', { count: pendingVendors })}
        />
      </div>
    </section>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-[#eee6e1] p-4 text-left transition hover:border-[#dcd0c7] hover:bg-[#fcfaf8]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61] transition group-hover:bg-[#30251f] group-hover:text-white">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#40342d]">{title}</p>

        <p className="mt-1 text-[10px] leading-4 text-[#9b8e86]">{description}</p>
      </div>

      <ChevronRight
        size={15}
        className="shrink-0 text-[#b2a49b] transition group-hover:translate-x-0.5"
      />
    </Link>
  );
}
