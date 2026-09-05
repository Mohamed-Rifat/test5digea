"use client";

import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Loader2,
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
import { useServices } from "@/features/services/hooks/useServices";
import { useAdminVendors } from "@/features/vendors/hooks/useAdminVendors";


const normalizeStatus = (status?: string) => {
  return status?.toLowerCase().replace(/[_-]/g, " ").trim() || "";
};

const isApproved = (status?: string) => {
  const normalized = normalizeStatus(status);

  return (
    normalized.includes("approve") ||
    normalized === "active"
  );
};

const isPending = (status?: string) => {
  return normalizeStatus(status).includes("pending");
};

const isRejected = (status?: string) => {
  return normalizeStatus(status).includes("reject");
};

const isInactive = (status?: string) => {
  const normalized = normalizeStatus(status);

  return (
    normalized.includes("inactive") ||
    normalized.includes("deactiv")
  );
};

const formatNumber = (value: number) => {
  return value.toLocaleString();
};

const formatRating = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
};

export default function AdminPage() {
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

  const loading =
    categoriesLoading ||
    servicesLoading ||
    vendorsLoading;

  const error =
    categoriesError ||
    servicesError ||
    vendorsError;

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive
  ).length;

  const totalServices = services.length;

  const categoryStats = useMemo(() => {
    return categories
      .map((category) => {
        const serviceCount = services.filter(
          (service) =>
            service.categoryId === category.id
        ).length;

        return {
          ...category,
          serviceCount,
        };
      })
      .sort(
        (a, b) =>
          b.serviceCount - a.serviceCount
      );
  }, [categories, services]);

  const topCategories =
    categoryStats.slice(0, 5);

  const maxServiceCount = Math.max(
    ...categoryStats.map(
      (category) => category.serviceCount
    ),
    1
  );

  const vendorStats = useMemo(() => {
    const total = vendors.length;

    const approved = vendors.filter(
      (vendor) => isApproved(vendor.status)
    ).length;

    const pending = vendors.filter(
      (vendor) => isPending(vendor.status)
    ).length;

    const rejected = vendors.filter(
      (vendor) => isRejected(vendor.status)
    ).length;

    const inactive = vendors.filter(
      (vendor) => isInactive(vendor.status)
    ).length;

    const totalReviews = vendors.reduce(
      (sum, vendor) =>
        sum + (Number(vendor.reviewsCount) || 0),
      0
    );

    const ratingSum = vendors.reduce(
      (sum, vendor) =>
        sum + (Number(vendor.averageRating) || 0),
      0
    );

    const averageRating =
      total > 0 ? ratingSum / total : 0;

    return {
      total,
      approved,
      pending,
      rejected,
      inactive,
      totalReviews,
      averageRating,
    };
  }, [vendors]);

  const topVendorsByRating = useMemo(() => {
    return [...vendors]
      .filter(
        (vendor) =>
          Number(vendor.averageRating) > 0
      )
      .sort(
        (a, b) =>
          Number(b.averageRating) -
          Number(a.averageRating)
      )
      .slice(0, 5);
  }, [vendors]);

  const mostReviewedVendors = useMemo(() => {
    return [...vendors]
      .filter(
        (vendor) =>
          Number(vendor.reviewsCount) > 0
      )
      .sort(
        (a, b) =>
          Number(b.reviewsCount) -
          Number(a.reviewsCount)
      )
      .slice(0, 5);
  }, [vendors]);

  const locationStats = useMemo(() => {
    const locationMap =
      new Map<string, number>();

    vendors.forEach((vendor) => {
      const location =
        vendor.location?.trim() ||
        "Unknown";

      locationMap.set(
        location,
        (locationMap.get(location) || 0) + 1
      );
    });

    return Array.from(
      locationMap.entries()
    )
      .map(([location, count]) => ({
        location,
        count,
      }))
      .sort(
        (a, b) => b.count - a.count
      )
      .slice(0, 5);
  }, [vendors]);

  const maxLocationCount = Math.max(
    ...locationStats.map(
      (item) => item.count
    ),
    1
  );

  const recentVendors = useMemo(() => {
    return [...vendors]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [vendors]);

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      description: "all categories",
      icon: Tags,
      href: "/admin/categories",
    },
    {
      title: "Total Services",
      value: totalServices,
      description: "marketplace services",
      icon: BriefcaseBusiness,
      href: "/admin/services",
    },
    {
      title: "Total Vendors",
      value: vendorStats.total,
      description: "registered vendors",
      icon: Store,
      href: "/admin/vendors",
    },
    {
      title: "Approved Vendors",
      value: vendorStats.approved,
      description: "currently approved",
      icon: ShieldCheck,
      href: "/admin/vendors",
    },
    {
      title: "Pending Vendors",
      value: vendorStats.pending,
      description: "waiting for review",
      icon: Clock3,
      href: "/admin/vendors",
    },
    {
      title: "Reviews",
      value: vendorStats.totalReviews,
      description: "vendor reviews",
      icon: MessageSquare,
      href: "/admin/vendors",
    },
    {
      title: "Average Rating",
      value: formatRating(
        vendorStats.averageRating
      ),
      description: "across all vendors",
      icon: Star,
      href: "/admin/vendors",
    },
    {
      title: "Inactive Vendors",
      value: vendorStats.inactive,
      description: "currently inactive",
      icon: UserX,
      href: "/admin/vendors",
    },
  ];

  return (
    <div className="mx-auto">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a18c7d]">
            Marketplace Overview
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8a7d75]">
            A complete overview of your categories,
            services, vendors and marketplace activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#e8dfd9] bg-white px-4 py-2.5 text-sm font-medium text-[#665951] shadow-sm">
            <CalendarDays size={16} />
            <span>September 2026</span>
          </div>
        </div>
      </div>
      {error && !loading && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <p className="mt-1 text-xs text-red-500">
            Some dashboard data could not be loaded.
          </p>
        </div>
      )}

      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group rounded-2xl border border-[#ebe3dd] bg-white p-4 shadow-[0_2px_12px_rgba(48,37,31,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(48,37,31,0.06)] sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f1ed] text-[#79675c] transition group-hover:bg-[#30251f] group-hover:text-white">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-[#f8f4f1] px-2.5 py-1 text-[10px] font-semibold text-[#8a786d]">
                    <TrendingUp size={11} />
                    Live
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-[#91847c]">
                    {stat.title}
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-2xl font-semibold tracking-tight text-[#30251f]">
                      {typeof stat.value ===
                      "number"
                        ? formatNumber(stat.value)
                        : stat.value}
                    </p>

                    <p className="pb-1 text-[10px] text-[#a4978e]">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
              <Store size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30251f]">
                Vendor Performance
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                Overview of your marketplace partners
              </p>
            </div>
          </div>

          <Link
            href="/admin/vendors"
            className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
          >
            Manage Vendors
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <VendorOverviewSkeleton />
        ) : (
          <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
            <div className="border-b border-[#f0e9e4] p-5 lg:border-b-0 lg:border-r sm:p-6">
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#40342d]">
                  Vendor Status
                </p>

                <p className="mt-1 text-[10px] text-[#a39790]">
                  Current vendor approval distribution
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">

                <div className="mx-auto">
                  <div
                    className="relative flex h-40 w-40 items-center justify-center rounded-full"
                    style={{
                      background:
                        vendorStats.total > 0
                          ? `conic-gradient(
                              #718b77 0deg ${
                                (vendorStats.approved /
                                  vendorStats.total) *
                                360
                              }deg,
                              #d7a85d ${
                                (vendorStats.approved /
                                  vendorStats.total) *
                                360
                              }deg ${
                                ((vendorStats.approved +
                                  vendorStats.pending) /
                                  vendorStats.total) *
                                360
                              }deg,
                              #b97878 ${
                                ((vendorStats.approved +
                                  vendorStats.pending) /
                                  vendorStats.total) *
                                360
                              }deg ${
                                ((vendorStats.approved +
                                  vendorStats.pending +
                                  vendorStats.rejected) /
                                  vendorStats.total) *
                                360
                              }deg,
                              #d7d0cb ${
                                ((vendorStats.approved +
                                  vendorStats.pending +
                                  vendorStats.rejected) /
                                  vendorStats.total) *
                                360
                              }deg 360deg
                            )`
                          : "#eee8e3",
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-2xl font-semibold text-[#30251f]">
                        {vendorStats.total}
                      </span>

                      <span className="text-[10px] text-[#9b8e86]">
                        Total Vendors
                      </span>
                    </div>
                  </div>
                </div>


                <div className="space-y-3">
                  <VendorStatusRow
                    label="Approved"
                    value={vendorStats.approved}
                    total={vendorStats.total}
                    dotClass="bg-[#718b77]"
                  />

                  <VendorStatusRow
                    label="Pending"
                    value={vendorStats.pending}
                    total={vendorStats.total}
                    dotClass="bg-[#d7a85d]"
                  />

                  <VendorStatusRow
                    label="Rejected"
                    value={vendorStats.rejected}
                    total={vendorStats.total}
                    dotClass="bg-[#b97878]"
                  />

                  <VendorStatusRow
                    label="Inactive"
                    value={vendorStats.inactive}
                    total={vendorStats.total}
                    dotClass="bg-[#d7d0cb]"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold text-[#40342d]">
                  Vendor Insights
                </p>

                <p className="mt-1 text-[10px] text-[#a39790]">
                  Key marketplace partner metrics
                </p>
              </div>

              <div className="space-y-3">
                <InsightCard
                  icon={Star}
                  title="Average Rating"
                  value={formatRating(
                    vendorStats.averageRating
                  )}
                  suffix="/ 5"
                  description="Across all vendors"
                />

                <InsightCard
                  icon={MessageSquare}
                  title="Total Reviews"
                  value={formatNumber(
                    vendorStats.totalReviews
                  )}
                  description="Customer feedback"
                />

                <InsightCard
                  icon={UserCheck}
                  title="Approval Rate"
                  value={
                    vendorStats.total > 0
                      ? `${Math.round(
                          (vendorStats.approved /
                            vendorStats.total) *
                            100
                        )}%`
                      : "0%"
                  }
                  description="Vendors approved"
                />

                <InsightCard
                  icon={Clock3}
                  title="Pending Review"
                  value={formatNumber(
                    vendorStats.pending
                  )}
                  description="Needs admin attention"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="flex items-center justify-between border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <BarChart3 size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  Services by Category
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  Category performance
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-[#f8f4f1] px-2.5 py-1.5 text-[10px] font-semibold text-[#806d61]">
              {formatNumber(totalServices)} services
            </span>
          </div>

          {loading ? (
            <div className="space-y-5 p-6">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse"
                  >
                    <div className="mb-2 h-3 w-32 rounded bg-[#eee8e3]" />
                    <div className="h-2 rounded-full bg-[#f1ece8]" />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="space-y-5 p-5 sm:p-6">
              {topCategories.length === 0 ? (
                <EmptyState
                  icon={Tags}
                  text="No category data available yet."
                />
              ) : (
                topCategories.map(
                  (category, index) => {
                    const percentage =
                      totalServices > 0
                        ? Math.round(
                            (category.serviceCount /
                              totalServices) *
                              100
                          )
                        : 0;

                    const width =
                      category.serviceCount ===
                      0
                        ? 3
                        : Math.max(
                            (category.serviceCount /
                              maxServiceCount) *
                              100,
                            4
                          );

                    return (
                      <div key={category.id}>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#f5eee9] text-[9px] font-semibold text-[#806d61]">
                              {index + 1}
                            </span>

                            <span className="truncate text-[11px] font-semibold text-[#4b3e36]">
                              {category.name}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[10px] text-[#a0938b]">
                              {percentage}%
                            </span>

                            <span className="w-10 text-right text-[11px] font-semibold text-[#40342d]">
                              {category.serviceCount}
                            </span>
                          </div>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#f3eee9]">
                          <div
                            className="h-full rounded-full bg-[#30251f] transition-all duration-700"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <Star size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  Top Vendors
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  Highest rated partners
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center gap-3"
                  >
                    <div className="h-9 w-9 rounded-lg bg-[#eee8e3]" />

                    <div className="flex-1">
                      <div className="h-2.5 w-28 rounded bg-[#eee8e3]" />
                      <div className="mt-2 h-2 w-20 rounded bg-[#f2ede9]" />
                    </div>

                    <div className="h-5 w-10 rounded-full bg-[#f1ece8]" />
                  </div>
                )
              )}
            </div>
          ) : topVendorsByRating.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Star}
                text="No rated vendors yet."
              />
            </div>
          ) : (
            <div className="divide-y divide-[#f5efeb]">
              {topVendorsByRating.map(
                (vendor, index) => (
                  <VendorListItem
                    key={vendor.id}
                    vendor={vendor}
                    rank={index + 1}
                    showRating
                  />
                )
              )}
            </div>
          )}

          <div className="border-t border-[#f0e9e4] p-4">
            <Link
              href="/admin/vendors"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9e0da] px-4 py-2.5 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
            >
              View All Vendors
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <MapPin size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  Vendor Locations
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  Where your vendors are based
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {locationStats.length === 0 ? (
              <EmptyState
                icon={MapPin}
                text="No location data available."
              />
            ) : (
              locationStats.map((item) => {
                const percentage =
                  vendorStats.total > 0
                    ? Math.round(
                        (item.count /
                          vendorStats.total) *
                          100
                      )
                    : 0;

                const width = Math.max(
                  (item.count /
                    maxLocationCount) *
                    100,
                  4
                );

                return (
                  <div key={item.location}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin
                          size={13}
                          className="shrink-0 text-[#9b8e86]"
                        />

                        <span className="truncate text-[11px] font-semibold text-[#4b3e36]">
                          {item.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#a0938b]">
                          {percentage}%
                        </span>

                        <span className="text-[11px] font-semibold text-[#40342d]">
                          {item.count}
                        </span>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#f3eee9]">
                      <div
                        className="h-full rounded-full bg-[#8c786b] transition-all duration-700"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
          <div className="border-b border-[#f0e9e4] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
                <MessageSquare size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#30251f]">
                  Most Reviewed
                </h2>

                <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                  Vendors with the most customer feedback
                </p>
              </div>
            </div>
          </div>

          {mostReviewedVendors.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={MessageSquare}
                text="No reviews available yet."
              />
            </div>
          ) : (
            <div className="divide-y divide-[#f5efeb]">
              {mostReviewedVendors.map(
                (vendor, index) => (
                  <VendorListItem
                    key={vendor.id}
                    vendor={vendor}
                    rank={index + 1}
                    showReviews
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
              <UserPlus size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#30251f]">
                Recently Added Vendors
              </h2>

              <p className="mt-0.5 text-[11px] text-[#9b8e86]">
                Latest partners added to the marketplace
              </p>
            </div>
          </div>

          <Link
            href="/admin/vendors"
            className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
          >
            Manage Vendors
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentVendors.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              text="No vendors have been added yet."
            />
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
                        src={vendor.profileImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store
                        size={17}
                        className="text-[#806d61]"
                      />
                    )}
                  </div>

                  <StatusBadge
                    status={vendor.status}
                  />
                </div>

                <p className="mt-3 truncate text-xs font-semibold text-[#40342d]">
                  {vendor.businessName}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9b8e86]">
                  <MapPin size={11} />
                  <span className="truncate">
                    {vendor.location ||
                      "Location not provided"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-[#8a786d]">
                    <Star
                      size={11}
                      fill="currentColor"
                    />

                    {formatRating(
                      Number(
                        vendor.averageRating
                      ) || 0
                    )}
                  </div>

                  <span className="text-[9px] text-[#b0a39b]">
                    {formatDate(
                      vendor.createdAt
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-5 rounded-2xl border border-[#ebe3dd] bg-white p-5 shadow-[0_2px_12px_rgba(48,37,31,0.03)] sm:p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-[#30251f]">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-[#9b8e86]">
            Frequently used admin shortcuts
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/vendors"
            icon={Store}
            title="Manage Vendors"
            description="Review and manage marketplace vendors"
          />

          <QuickAction
            href="/admin/categories"
            icon={Tags}
            title="Manage Categories"
            description="Create, edit and organize categories"
          />

          <QuickAction
            href="/admin/services"
            icon={BriefcaseBusiness}
            title="View Services"
            description="Review marketplace services"
          />

          <QuickAction
            href="/admin/vendors"
            icon={Clock3}
            title="Pending Vendors"
            description={`${vendorStats.pending} vendors waiting for review`}
          />
        </div>
      </section>

      <div className="py-7 text-center">
        <p className="text-[11px] text-[#aa9c93]">
          5Digea Admin Panel • 2026
        </p>
      </div>
    </div>
  );
}

function VendorStatusRow({
  label,
  value,
  total,
  dotClass,
}: {
  label: string;
  value: number;
  total: number;
  dotClass: string;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${dotClass}`}
          />

          <span className="text-[10px] font-semibold text-[#665951]">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#a39790]">
            {percentage}%
          </span>

          <span className="text-[11px] font-semibold text-[#40342d]">
            {value}
          </span>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#f3eee9]">
        <div
          className={`h-full rounded-full ${dotClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

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
        <p className="text-[10px] text-[#91847c]">
          {title}
        </p>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-lg font-semibold text-[#30251f]">
            {value}
          </span>

          {suffix && (
            <span className="text-[9px] text-[#a39790]">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <p className="hidden text-[9px] text-[#a39790] sm:block">
        {description}
      </p>
    </div>
  );
}

function VendorListItem({
  vendor,
  rank,
  showRating = false,
  showReviews = false,
}: {
  vendor: any;
  rank: number;
  showRating?: boolean;
  showReviews?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#fcfaf8] sm:px-6">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f5eee9] text-[9px] font-semibold text-[#806d61]">
        {rank}
      </span>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6f0ec]">
        {vendor.profileImageUrl ? (
          <img
            src={vendor.profileImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Store
            size={15}
            className="text-[#806d61]"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#40342d]">
          {vendor.businessName}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="truncate text-[9px] text-[#a39790]">
            {vendor.location ||
              "Location not provided"}
          </span>
        </div>
      </div>

      {showRating && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff8e9] px-2 py-1 text-[9px] font-semibold text-[#9a7b36]">
          <Star
            size={10}
            fill="currentColor"
          />

          {formatRating(
            Number(vendor.averageRating) || 0
          )}
        </div>
      )}

      {showReviews && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f7f1ed] px-2 py-1 text-[9px] font-semibold text-[#806d61]">
          <MessageSquare size={10} />

          {formatNumber(
            Number(vendor.reviewsCount) || 0
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const normalized =
    normalizeStatus(status);

  let classes =
    "border-gray-200 bg-gray-50 text-gray-600";

  if (normalized.includes("approve")) {
    classes =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (normalized.includes("pending")) {
    classes =
      "border-amber-200 bg-amber-50 text-amber-700";
  } else if (normalized.includes("reject")) {
    classes =
      "border-red-200 bg-red-50 text-red-700";
  } else if (
    normalized.includes("inactive") ||
    normalized.includes("deactiv")
  ) {
    classes =
      "border-gray-200 bg-gray-100 text-gray-600";
  }

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[8px] font-semibold ${classes}`}
    >
      {status || "Unknown"}
    </span>
  );
}

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
        <p className="text-xs font-semibold text-[#40342d]">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-[#9b8e86]">
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="shrink-0 text-[#b2a49b] transition group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof Tags;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#e6ddd7] bg-[#fcfaf8] px-4 py-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5eee9] text-[#9b8e86]">
        <Icon size={16} />
      </div>

      <p className="mt-3 text-xs font-medium text-[#8f8178]">
        {text}
      </p>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map(
        (_, index) => (
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
        )
      )}
    </div>
  );
}

function VendorOverviewSkeleton() {
  return (
    <div className="grid animate-pulse lg:grid-cols-[1.4fr_0.8fr]">
      <div className="border-b border-[#f0e9e4] p-6 lg:border-b-0 lg:border-r">
        <div className="mb-6 h-3 w-28 rounded bg-[#eee8e3]" />

        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div className="mx-auto h-40 w-40 rounded-full bg-[#eee8e3]" />

          <div className="space-y-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div key={index}>
                  <div className="mb-2 h-2.5 w-full rounded bg-[#f2ede9]" />
                  <div className="h-1.5 rounded bg-[#f3eee9]" />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <div className="mb-5 h-3 w-28 rounded bg-[#eee8e3]" />

        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-16 rounded-xl bg-[#f4efeb]"
            />
          )
        )}
      </div>
    </div>
  );
}