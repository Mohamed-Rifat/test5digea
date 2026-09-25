"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Store,
  Tags,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { useAdminCategories } from "@/features/categories/hooks/useAdminCategories";
import { useModerationDashboard } from "@/features/moderation/hooks/useModerationDashboard";
import { useServices } from "@/features/services/hooks/useServices";
import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";
import { useContactMessagesAdmin } from "@/features/contactMessages/hooks/useContactMessagesAdmin";
import {
  ModerationEntityType,
  ModerationStatus,
} from "@/types/moderation";
import type { ModerationQueueItem } from "@/types/moderation";
import type { Service } from "@/types/service";
import type { Vendor } from "@/types/vendor";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE, type TranslationKey } from "@/locales";

// Where a recent request should send the admin — the dashboard summary
// is read-only, so it links out to the page that has the real actions
// for that entity type. Reviews don't have an individual admin page yet,
// only the list at /admin/reviews.
function requestHref(item: ModerationQueueItem): string {
  switch (item.entityType) {
    case ModerationEntityType.Vendor:
      return `/admin/vendors/${item.entityId}`;
    case ModerationEntityType.Service:
      return `/admin/services/${item.entityId}`;
    case ModerationEntityType.ServiceImage:
      return `/admin/services/${item.serviceId ?? item.entityId}`;
    case ModerationEntityType.Review:
    default:
      return "/admin/reviews";
  }
}

const requestEntityMeta: Record<
  ModerationEntityType,
  {
    labelKey: TranslationKey;
    icon: typeof Store;
    className: string;
  }
> = {
  [ModerationEntityType.Vendor]: {
    labelKey: "admin.moderation.entity.vendor" as const,
    icon: Store,
    className: "bg-[#f0e9e0] text-[#a47e43]",
  },

  [ModerationEntityType.Service]: {
    labelKey: "admin.moderation.entity.service" as const,
    icon: BriefcaseBusiness,
    className: "bg-[#eef2f7] text-[#4d6b8f]",
  },

  [ModerationEntityType.Review]: {
    labelKey: "admin.moderation.entity.review" as const,
    icon: Star,
    className: "bg-[#f7f0e8] text-[#b99a62]",
  },

  [ModerationEntityType.ServiceImage]: {
    labelKey: "admin.moderation.entity.image" as const,
    icon: ImageIcon,
    className: "bg-[#eaf2ee] text-[#4d8f6b]",
  },
};
const requestStatusStyles: Record<ModerationStatus, string> = {
  [ModerationStatus.Pending]: "bg-amber-50 text-amber-700",
  [ModerationStatus.Approved]: "bg-emerald-50 text-emerald-700",
  [ModerationStatus.Rejected]: "bg-red-50 text-red-600",
};

const requestStatusLabels: Record<ModerationStatus, TranslationKey> = {
  [ModerationStatus.Pending]: "admin.moderation.statuses.pending",
  [ModerationStatus.Approved]: "admin.moderation.statuses.approved",
  [ModerationStatus.Rejected]: "admin.moderation.statuses.rejected",
};

/* ========================================================= */
/* CHART PALETTE                                              */
/* ========================================================= */

const CHART_COLORS = {
  approved: "#718b77",
  pending: "#d7a85d",
  rejected: "#b97878",
  inactive: "#d7d0cb",
  dark: "#30251f",
  accent: "#806d61",
  accentLight: "#c9b8ab",
  grid: "#f0e9e4",
};

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

const normalizeStatus = (status?: string) => {
  return status?.toLowerCase().replace(/[_-]/g, " ").trim() || "";
};

const isApproved = (status?: string) => {
  const normalized = normalizeStatus(status);

  return normalized.includes("approve") || normalized === "active";
};

const isPending = (status?: string) => {
  return normalizeStatus(status).includes("pending");
};

const isRejected = (status?: string) => {
  return normalizeStatus(status).includes("reject");
};

const isInactive = (status?: string) => {
  const normalized = normalizeStatus(status);

  return normalized.includes("inactive") || normalized.includes("deactiv");
};

const formatNumber = (value: number) => {
  return value.toLocaleString();
};

const formatRating = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
};

// Builds the last `count` month buckets (oldest -> newest), each keyed by
// "YYYY-M" so records can be grouped by the month they were created in.
function getLastMonthBuckets(count: number, locale = "en-US") {
  const buckets: { key: string; label: string }[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString(locale, { month: "short" }),
    });
  }

  return buckets;
}

function monthKeyOf(dateString?: string) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${date.getMonth()}`;
}

function buildGrowthSeries(
  vendors: Vendor[],
  services: Service[],
  months = 6,
  locale = "en-US"
) {
  const buckets = getLastMonthBuckets(months, locale);

  return buckets.map((bucket) => ({
    month: bucket.label,
    vendors: vendors.filter(
      (vendor) => monthKeyOf(vendor.createdAt) === bucket.key
    ).length,
    services: services.filter(
      (service) => monthKeyOf(service.createdAt) === bucket.key
    ).length,
  }));
}

function buildRatingDistribution(vendors: Vendor[]) {
  const buckets = [5, 4, 3, 2, 1].map((stars) => ({
    stars: `${stars} ★`,
    count: 0,
  }));

  vendors.forEach((vendor) => {
    const rating = Number(vendor.averageRating) || 0;

    if (rating <= 0) return;

    const rounded = Math.min(5, Math.max(1, Math.round(rating)));
    const bucket = buckets.find((b) => b.stars === `${rounded} ★`);

    if (bucket) bucket.count += 1;
  });

  return buckets;
}

/* ========================================================= */
/* CUSTOM TOOLTIP */
/* ========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#ebe3dd] bg-white px-3 py-2 shadow-lg">
      {label && (
        <p className="mb-1 text-[10px] font-semibold text-[#8a7d75]">
          {label}
        </p>
      )}

      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-[11px]"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />

          <span className="text-[#665951]">{entry.name}:</span>

          <span className="font-semibold text-[#30251f]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default function AdminPage() {
  const { t, language } = useLanguage();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAdminCategories();

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();

  const {
    vendors,
    loading: vendorsLoading,
    error: vendorsError,
  } = useAdminVendors();

  const {
    summary: dashboardSummary,
    loading: dashboardLoading,
    error: dashboardError,
  } = useModerationDashboard();

  // Only need the count, so page 1 with a small page size is enough.
  const { totalCount: unhandledMessagesCount } = useContactMessagesAdmin({
    isHandled: false,
    page: 1,
    pageSize: 1,
  });

  const loading =
    categoriesLoading || servicesLoading || vendorsLoading || dashboardLoading;

  const error =
    categoriesError || servicesError || vendorsError || dashboardError;

  const recentRequests: ModerationQueueItem[] =
    dashboardSummary?.recentRequests ?? [];

  /* ========================================================= */
  /* CATEGORY STATS */
  /* ========================================================= */

  const totalCategories = categories.length;

  const totalServices = services.length;

  const categoryStats = useMemo(() => {
    return categories
      .map((category) => {
        const serviceCount = services.filter(
          (service) => service.categoryId === category.id
        ).length;

        return { ...category, serviceCount };
      })
      .sort((a, b) => b.serviceCount - a.serviceCount);
  }, [categories, services]);

  const topCategories = categoryStats.slice(0, 6);

  /* ========================================================= */
  /* VENDOR STATS */
  /* ========================================================= */

  const vendorStats = useMemo(() => {
    const total = vendors.length;

    const approved = vendors.filter((vendor) => isApproved(vendor.status)).length;
    const pending = vendors.filter((vendor) => isPending(vendor.status)).length;
    const rejected = vendors.filter((vendor) => isRejected(vendor.status)).length;
    const inactive = vendors.filter((vendor) => isInactive(vendor.status)).length;

    const totalReviews = vendors.reduce(
      (sum, vendor) => sum + (Number(vendor.reviewsCount) || 0),
      0
    );

    const ratingSum = vendors.reduce(
      (sum, vendor) => sum + (Number(vendor.averageRating) || 0),
      0
    );

    const averageRating = total > 0 ? ratingSum / total : 0;

    const now = new Date();

    const newThisMonth = vendors.filter((vendor) => {
      const date = new Date(vendor.createdAt);

      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }).length;

    return {
      total,
      approved,
      pending,
      rejected,
      inactive,
      totalReviews,
      averageRating,
      newThisMonth,
    };
  }, [vendors]);

  const vendorStatusChartData = useMemo(
    () => [
      { name: t('admin.dashboard.approved'), value: vendorStats.approved, color: CHART_COLORS.approved },
      { name: t('admin.dashboard.pending'), value: vendorStats.pending, color: CHART_COLORS.pending },
      { name: t('admin.dashboard.rejected'), value: vendorStats.rejected, color: CHART_COLORS.rejected },
      { name: t('admin.dashboard.inactive'), value: vendorStats.inactive, color: CHART_COLORS.inactive },
    ].filter((item) => item.value > 0),
    [vendorStats, t]
  );

  /* ========================================================= */
  /* GROWTH + RATING DISTRIBUTION */
  /* ========================================================= */

  const growthData = useMemo(
    () => buildGrowthSeries(vendors, services, 6, LANGUAGE_DATE_LOCALE[language]),
    [vendors, services, language]
  );

  const ratingDistribution = useMemo(
    () => buildRatingDistribution(vendors),
    [vendors]
  );

  /* ========================================================= */
  /* TOP VENDORS */
  /* ========================================================= */

  const topVendorsByRating = useMemo(() => {
    return [...vendors]
      .filter((vendor) => Number(vendor.averageRating) > 0)
      .sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
      .slice(0, 5);
  }, [vendors]);

  const mostReviewedVendors = useMemo(() => {
    return [...vendors]
      .filter((vendor) => Number(vendor.reviewsCount) > 0)
      .sort((a, b) => Number(b.reviewsCount) - Number(a.reviewsCount))
      .slice(0, 5);
  }, [vendors]);

  /* ========================================================= */
  /* LOCATIONS */
  /* ========================================================= */

  const locationStats = useMemo(() => {
    const locationMap = new Map<string, number>();

    vendors.forEach((vendor) => {
      const location = vendor.location?.trim() || t('admin.dashboard.unknown');

      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [vendors, t]);

  /* ========================================================= */
  /* RECENT VENDORS */
  /* ========================================================= */

  const recentVendors = useMemo(() => {
    return [...vendors]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [vendors]);

  /* ========================================================= */
  /* DASHBOARD STATS */
  /* ========================================================= */

  const stats = [
    {
      title: t('admin.dashboard.stats.totalCategories'),
      value: totalCategories,
      description: t('admin.dashboard.stats.allCategories'),
      icon: Tags,
      href: "/admin/categories",
    },
    {
      title: t('admin.dashboard.stats.totalServices'),
      value: totalServices,
      description: t('admin.dashboard.stats.marketplaceServices'),
      icon: BriefcaseBusiness,
      href: "/admin/services",
    },
    {
      title: t('admin.dashboard.stats.totalVendors'),
      value: vendorStats.total,
      description: t('admin.dashboard.stats.registeredVendors'),
      icon: Store,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.approved'),
      value: vendorStats.approved,
      description: t('admin.dashboard.currentlyApproved'),
      icon: ShieldCheck,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.pending'),
      value: vendorStats.pending,
      description: t('admin.dashboard.vendorStatus.pendingLegend'),
      icon: Clock3,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorPerformance.reviews'),
      value: vendorStats.totalReviews,
      description: t('admin.dashboard.vendorReviews'),
      icon: MessageSquare,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.averageRating'),
      value: formatRating(vendorStats.averageRating),
      description: t('admin.dashboard.acrossAllVendors'),
      icon: Star,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.vendorStatus.inactive'),
      value: vendorStats.inactive,
      description: t('admin.dashboard.vendorStatus.inactiveLegend'),
      icon: UserX,
      href: "/admin/vendors",
    },
    {
      title: t('admin.dashboard.stats.totalUsers'),
      value: dashboardSummary?.totalUsers ?? 0,
      description: t('admin.dashboard.stats.registeredAccounts'),
      icon: Users,
      href: undefined,
    },
    {
      title: t('admin.dashboard.pendingReviews'),
      value: dashboardSummary?.pendingReviews ?? 0,
      description: t('admin.dashboard.awaitingModeration'),
      icon: ClipboardList,
      href: "/admin/moderation",
    },
    {
      title: t('admin.dashboard.unhandledMessages'),
      value: unhandledMessagesCount,
      description: t('admin.dashboard.unhandledMessagesDesc'),
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="mx-auto">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7d]">
            {t('admin.dashboard.overview')}
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
            {t('admin.dashboard.title')}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8a7d75]">
            {t('admin.dashboard.overviewDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#e8dfd9] bg-white px-4 py-2.5 text-sm font-medium text-[#665951] shadow-sm">
            <CalendarDays size={16} />
            <span>{new Intl.DateTimeFormat(LANGUAGE_DATE_LOCALE[language], { month: 'long', year: 'numeric' }).format(new Date())}</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ERROR */}
      {/* ========================================================= */}

      {error && !loading && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>

          <p className="mt-1 text-xs text-red-500">
            {t('admin.dashboard.loadError')}
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN STATS */}
      {/* ========================================================= */}

      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            const cardClassName = stat.href
              ? "group rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(48,37,31,0.06)] sm:p-5"
              : "group rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-5";

            const cardContent = (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1ed] text-[#79675c] transition group-hover:bg-[#30251f] group-hover:text-white">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-[#f8f4f1] px-2.5 py-1 text-[10px] font-semibold text-[#8a786d]">
                    <TrendingUp size={11} />
                    {t('admin.dashboard.live')}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-[#91847c]">{stat.title}</p>

                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-2xl font-semibold tracking-tight text-[#30251f]">
                      {typeof stat.value === "number"
                        ? formatNumber(stat.value)
                        : stat.value}
                    </p>

                    <p className="pb-1 text-[10px] text-[#a4978e]">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </>
            );

            if (!stat.href) {
              return (
                <div key={stat.title} className={cardClassName}>
                  {cardContent}
                </div>
              );
            }

            return (
              <Link key={stat.title} href={stat.href} className={cardClassName}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* VENDOR PERFORMANCE + STATUS DONUT */}
      {/* ========================================================= */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
              <Store size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30251f]">
                {t('admin.dashboard.vendorPerformance.title')}
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                {t('admin.dashboard.subtitle')}
              </p>
            </div>
          </div>

          <Link
            href="/admin/vendors"
            className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
          >
            {t('admin.dashboard.quickActions.manageVendors')}
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <VendorOverviewSkeleton />
        ) : (
          <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
            {/* ===================================================== */}
            {/* VENDOR STATUS DONUT (recharts) */}
            {/* ===================================================== */}

            <div className="border-b border-[#f0e9e4] p-5 lg:border-b-0 lg:border-r sm:p-6">
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#40342d]">
                  {t('admin.dashboard.vendorStatus.title')}
                </p>

                <p className="mt-1 text-[10px] text-[#a39790]">
                  {t('admin.dashboard.vendorStatus.subtitle')}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center">
                <div className="relative mx-auto h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          vendorStatusChartData.length > 0
                            ? vendorStatusChartData
                            : [{ name: t('admin.dashboard.noData'), value: 1, color: "#eee8e3" }]
                        }
                        dataKey="value"
                        nameKey="name"
                        innerRadius="68%"
                        outerRadius="100%"
                        paddingAngle={vendorStatusChartData.length > 1 ? 3 : 0}
                        stroke="none"
                      >
                        {(vendorStatusChartData.length > 0
                          ? vendorStatusChartData
                          : [{ name: t('admin.dashboard.noData'), value: 1, color: "#eee8e3" }]
                        ).map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>

                      {vendorStatusChartData.length > 0 && (
                        <Tooltip content={<ChartTooltip />} />
                      )}
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-[#30251f]">
                      {vendorStats.total}
                    </span>

                    <span className="text-[10px] text-[#9b8e86]">
                      {t('admin.dashboard.stats.totalVendors')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <VendorStatusRow
                    label={t('admin.dashboard.approved')}
                    value={vendorStats.approved}
                    total={vendorStats.total}
                    color={CHART_COLORS.approved}
                  />

                  <VendorStatusRow
                    label={t('admin.dashboard.pending')}
                    value={vendorStats.pending}
                    total={vendorStats.total}
                    color={CHART_COLORS.pending}
                  />

                  <VendorStatusRow
                    label={t('admin.dashboard.rejected')}
                    value={vendorStats.rejected}
                    total={vendorStats.total}
                    color={CHART_COLORS.rejected}
                  />

                  <VendorStatusRow
                    label={t('admin.dashboard.inactive')}
                    value={vendorStats.inactive}
                    total={vendorStats.total}
                    color={CHART_COLORS.inactive}
                  />
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* VENDOR KPIs */}
            {/* ===================================================== */}

            <div className="p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold text-[#40342d]">
                  {t('admin.dashboard.insights.title')}
                </p>

                <p className="mt-1 text-[10px] text-[#a39790]">
                  {t('admin.dashboard.metricsSubtitle')}
                </p>
              </div>

              <div className="space-y-3">
                <InsightCard
                  icon={Star}
                  title={t("admin.dashboard.averageRating")}
                  value={formatRating(vendorStats.averageRating)}
                  suffix="/ 5"
                  description={t("admin.dashboard.acrossAllVendors")}
                />

                <InsightCard
                  icon={UserCheck}
                  title={t("admin.dashboard.approvalRate")}
                  value={
                    vendorStats.total > 0
                      ? `${Math.round(
                          (vendorStats.approved / vendorStats.total) * 100
                        )}%`
                      : "0%"
                  }
                  description={t("admin.dashboard.vendorStatus.approvedLegend")}
                />

                <InsightCard
                  icon={UserPlus}
                  title={t("admin.dashboard.newThisMonth")}
                  value={formatNumber(vendorStats.newThisMonth)}
                  description={t("admin.dashboard.vendorsJoined")}
                />

                <InsightCard
                  icon={Clock3}
                  title={t("admin.dashboard.pendingReview")}
                  value={formatNumber(vendorStats.pending)}
                  description={t("admin.dashboard.insights.needsAttention")}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* MARKETPLACE GROWTH (NEW) */}
      {/* ========================================================= */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
              <TrendingUp size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30251f]">
                {t('admin.dashboard.growth.title')}
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                {t('admin.dashboard.growth.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 text-[#665951]">
              <span className="h-2 w-2 rounded-full bg-[#30251f]" />
              {t('admin.dashboard.vendorLocations.vendors')}
            </span>

            <span className="flex items-center gap-1.5 text-[#665951]">
              <span className="h-2 w-2 rounded-full bg-[#c9a877]" />
              {t('admin.dashboard.servicesByCategory.services')}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-72 animate-pulse bg-[#fcfaf8] p-6" />
        ) : (
          <div className="h-72 p-5 sm:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="vendorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30251f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#30251f" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a877" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a877" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#a39790" }}
                  axisLine={{ stroke: CHART_COLORS.grid }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#a39790" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />

                <Tooltip content={<ChartTooltip />} />

                <Area
                  type="monotone"
                  dataKey="vendors"
                  name={t('admin.dashboard.growth.newVendors')}
                  stroke="#30251f"
                  strokeWidth={2}
                  fill="url(#vendorsGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="services"
                  name={t('admin.dashboard.growth.newServices')}
                  stroke="#c9a877"
                  strokeWidth={2}
                  fill="url(#servicesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* CATEGORIES + TOP VENDORS */}
      {/* ========================================================= */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        {/* ======================================================= */}
        {/* SERVICES BY CATEGORY (recharts bar) */}
        {/* ======================================================= */}

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="flex items-center justify-between border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <BarChart3 size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t('admin.dashboard.servicesByCategory.title')}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.servicesByCategory.subtitle')}
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-[#f8f4f1] px-2.5 py-1.5 text-[10px] font-semibold text-[#806d61]">
              {formatNumber(totalServices)} services
            </span>
          </div>

          {loading ? (
            <div className="h-80 animate-pulse bg-[#fcfaf8] p-6" />
          ) : topCategories.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Tags} text={t('admin.dashboard.servicesByCategory.empty')} />
            </div>
          ) : (
            <div className="h-80 p-5 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCategories}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#a39790" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: "#4b3e36" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

                  <Bar
                    dataKey="serviceCount"
                    name={t('admin.dashboard.servicesByCategory.services')}
                    fill={CHART_COLORS.dark}
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* TOP VENDORS */}
        {/* ======================================================= */}

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <Star size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t("admin.dashboard.topVendors")}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.vendorPerformance.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#eee8e3]" />

                  <div className="flex-1">
                    <div className="h-2.5 w-28 rounded bg-[#eee8e3]" />
                    <div className="mt-2 h-2 w-20 rounded bg-[#f2ede9]" />
                  </div>

                  <div className="h-5 w-10 rounded-full bg-[#f1ece8]" />
                </div>
              ))}
            </div>
          ) : topVendorsByRating.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={Star} text={t('admin.dashboard.vendorPerformance.empty')} />
            </div>
          ) : (
            <div className="divide-y divide-[#f5efeb]">
              {topVendorsByRating.map((vendor, index) => (
                <VendorListItem
                  key={vendor.id}
                  vendor={vendor}
                  rank={index + 1}
                  showRating
                />
              ))}
            </div>
          )}

          <div className="border-t border-[#f0e9e4] p-4">
            <Link
              href="/admin/vendors"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9e0da] px-4 py-2.5 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
            >
              {t('admin.dashboard.quickActions.viewAllVendors')}
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* RATING DISTRIBUTION + LOCATIONS (recharts) */}
      {/* ========================================================= */}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* ======================================================= */}
        {/* RATING DISTRIBUTION (NEW) */}
        {/* ======================================================= */}

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <Star size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t('admin.dashboard.ratingDistribution.title')}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.ratingDistribution.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-64 animate-pulse bg-[#fcfaf8] p-6" />
          ) : (
            <div className="h-64 p-5 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="stars"
                    tick={{ fontSize: 11, fill: "#a39790" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#a39790" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />

                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

                  <Bar
                    dataKey="count"
                    name={t('admin.dashboard.vendorLocations.vendors')}
                    fill="#d7a85d"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* ======================================================= */}
        {/* VENDOR LOCATIONS (recharts) */}
        {/* ======================================================= */}

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <MapPin size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t('admin.dashboard.vendorLocations.title')}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.vendorLocations.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-64 animate-pulse bg-[#fcfaf8] p-6" />
          ) : locationStats.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={MapPin} text={t('admin.dashboard.vendorLocations.empty')} />
            </div>
          ) : (
            <div className="h-64 p-5 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationStats}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#a39790" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="location"
                    width={90}
                    tick={{ fontSize: 11, fill: "#4b3e36" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fcfaf8" }} />

                  <Bar
                    dataKey="count"
                    name={t('admin.dashboard.vendorLocations.vendors')}
                    fill="#8c786b"
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* ========================================================= */}
      {/* MOST REVIEWED + RECENT REQUESTS */}
      {/* ========================================================= */}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <MessageSquare size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t('admin.dashboard.mostReviewed')}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.mostReviewedSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {mostReviewedVendors.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={MessageSquare} text={t('admin.dashboard.ratingDistribution.empty')} />
            </div>
          ) : (
            <div className="divide-y divide-[#f5efeb]">
              {mostReviewedVendors.map((vendor, index) => (
                <VendorListItem
                  key={vendor.id}
                  vendor={vendor}
                  rank={index + 1}
                  showReviews
                />
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <ClipboardList size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  {t('admin.dashboard.insights.recentRequests')}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  {t('admin.dashboard.insights.recentSubmissions')}
                </p>
              </div>
            </div>

            <Link
              href="/admin/moderation"
              className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
            >
              {t('admin.dashboard.quickActions.viewQueue')}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={ClipboardList}
                text={t('admin.dashboard.quickActions.nothingWaiting')}
              />
            </div>
          ) : (
            <div className="divide-y divide-[#f0e9e4]">
              {recentRequests.slice(0, 5).map((item) => {
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
        </section>
      </div>

      {/* ========================================================= */}
      {/* RECENT VENDORS */}
      {/* ========================================================= */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
              <UserPlus size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30251f]">
                {t('admin.dashboard.insights.recentVendors')}
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                {t('admin.dashboard.insights.subtitle')}
              </p>
            </div>
          </div>

          <Link
            href="/admin/vendors"
            className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
          >
            {t('admin.dashboard.quickActions.manageVendors')}
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentVendors.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={Users} text={t('admin.dashboard.noVendorsAdded')} />
          </div>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {recentVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="group rounded-xl border border-[#eee6e1] p-4 transition hover:border-[#dcd0c7] hover:bg-[#fcfaf8]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#f6f0ec]">
                    {vendor.profileImageUrl ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={vendor.profileImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store size={17} className="text-[#806d61]" />
                    )}
                  </div>

                  <StatusBadge status={vendor.status} />
                </div>

                <p className="mt-3 truncate text-xs font-semibold text-[#40342d]">
                  {vendor.businessName}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9b8e86]">
                  <MapPin size={11} />
                  <span className="truncate">
                    {vendor.location || t('admin.dashboard.locationNotProvided')}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-[#8a786d]">
                    <Star size={11} fill="currentColor" />

                    {formatRating(Number(vendor.averageRating) || 0)}
                  </div>

                  <span className="text-[9px] text-[#b0a39b]">
                    {formatDate(vendor.createdAt, LANGUAGE_DATE_LOCALE[language])}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* QUICK ACTIONS */}
      {/* ========================================================= */}

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
            description={t('admin.dashboard.pendingVendorsWaiting', { count: vendorStats.pending })}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <div className="py-7 text-center">
        <p className="text-[11px] text-[#aa9c93]">{t('admin.dashboard.footer')}</p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* VENDOR STATUS ROW */
/* ========================================================= */

function VendorStatusRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />

          <span className="text-[10px] font-semibold text-[#665951]">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#a39790]">{percentage}%</span>

          <span className="text-[11px] font-semibold text-[#40342d]">
            {value}
          </span>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#f3eee9]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* INSIGHT CARD */
/* ========================================================= */

function InsightCard({
  icon: Icon,
  title,
  value,
  suffix,
  description,
}: {
  icon: typeof Star;
  title: string;
  value: string;
  suffix?: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#fcfaf8] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3ebe5] text-[#806d61]">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#91847c]">{title}</p>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-lg font-semibold text-[#30251f]">{value}</span>

          {suffix && <span className="text-[9px] text-[#a39790]">{suffix}</span>}
        </div>
      </div>

      <p className="hidden text-[9px] text-[#a39790] sm:block">{description}</p>
    </div>
  );
}

/* ========================================================= */
/* VENDOR LIST ITEM */
/* ========================================================= */

function VendorListItem({
  vendor,
  rank,
  showRating = false,
  showReviews = false,
}: {
  vendor: Vendor;
  rank: number;
  showRating?: boolean;
  showReviews?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#fcfaf8] sm:px-6">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f5eee9] text-[9px] font-semibold text-[#806d61]">
        {rank}
      </span>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6f0ec]">
        {vendor.profileImageUrl ? (
          <img
            loading="lazy"
            decoding="async"
            src={vendor.profileImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Store size={15} className="text-[#806d61]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#40342d]">
          {vendor.businessName}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="truncate text-[9px] text-[#a39790]">
            {vendor.location || t('admin.dashboard.locationNotProvided')}
          </span>
        </div>
      </div>

      {showRating && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff8e9] px-2 py-1 text-[9px] font-semibold text-[#9a7b36]">
          <Star size={10} fill="currentColor" />

          {formatRating(Number(vendor.averageRating) || 0)}
        </div>
      )}

      {showReviews && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f7f1ed] px-2 py-1 text-[9px] font-semibold text-[#806d61]">
          <MessageSquare size={10} />

          {formatNumber(Number(vendor.reviewsCount) || 0)}
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status?: string }) {
  const { t } = useLanguage();
  const normalized = normalizeStatus(status);

  let classes = "border-gray-200 bg-gray-50 text-gray-600";

  if (normalized.includes("approve")) {
    classes = "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (normalized.includes("pending")) {
    classes = "border-amber-200 bg-amber-50 text-amber-700";
  } else if (normalized.includes("reject")) {
    classes = "border-red-200 bg-red-50 text-red-700";
  } else if (normalized.includes("inactive") || normalized.includes("deactiv")) {
    classes = "border-gray-200 bg-gray-100 text-gray-600";
  }

  return (
    <span className={`rounded-full border px-2 py-1 text-[8px] font-semibold ${classes}`}>
      {normalized.includes("approve")
        ? t("admin.dashboard.approved")
        : normalized.includes("pending")
          ? t("admin.dashboard.pending")
          : normalized.includes("reject")
            ? t("admin.dashboard.rejected")
            : normalized.includes("inactive") || normalized.includes("deactiv")
              ? t("admin.dashboard.inactive")
              : status || t("admin.dashboard.unknown")}
    </span>
  );
}

/* ========================================================= */
/* QUICK ACTION */
/* ========================================================= */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Tags;
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

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({ icon: Icon, text }: { icon: typeof Tags; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#e6ddd7] bg-[#fcfaf8] px-4 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5eee9] text-[#9b8e86]">
        <Icon size={16} />
      </div>

      <p className="mt-3 text-xs font-medium text-[#8f8178]">{text}</p>
    </div>
  );
}

/* ========================================================= */
/* DATE FORMAT */
/* ========================================================= */

function formatDate(date?: string, locale = "en-US") {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/* ========================================================= */
/* DASHBOARD SKELETON */
/* ========================================================= */

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-5"
        >
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#eee8e3]" />

              <div className="h-5 w-12 rounded-full bg-[#f1ece8]" />
            </div>

            <div className="mt-4">
              <div className="h-3 w-24 rounded bg-[#eee8e3]" />

              <div className="mt-2 flex items-end justify-between">
                <div className="h-7 w-16 rounded bg-[#e9e2dd]" />

                <div className="h-2.5 w-20 rounded bg-[#f2ede9]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ========================================================= */
/* VENDOR OVERVIEW SKELETON */
/* ========================================================= */

function VendorOverviewSkeleton() {
  return (
    <div className="grid animate-pulse lg:grid-cols-[1.4fr_0.8fr]">
      <div className="border-b border-[#f0e9e4] p-6 lg:border-b-0 lg:border-r">
        <div className="mb-6 h-3 w-28 rounded bg-[#eee8e3]" />

        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div className="mx-auto h-40 w-40 rounded-full bg-[#eee8e3]" />

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-2 h-2.5 w-full rounded bg-[#f2ede9]" />
                <div className="h-1.5 rounded bg-[#f3eee9]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <div className="mb-5 h-3 w-28 rounded bg-[#eee8e3]" />

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-[#f4efeb]" />
        ))}
      </div>
    </div>
  );
}