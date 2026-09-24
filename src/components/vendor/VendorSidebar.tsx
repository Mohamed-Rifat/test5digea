"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Tags,
  Building2,
  MessageSquareText,
  LogOut,
  ChevronRight,
  X,
  Sparkles,
  Award,
  Bell,
  HelpCircle,
  Settings,
  Shield,
  ChevronDown,
  Package,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  Crown,
} from "lucide-react";

import {
  Tooltip,
  Badge,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { ReviewStatus } from "@/types/review";

interface VendorSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

// Navigation items
const navigationItems: {
  labelKey: TranslationKey;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}[] = [
  {
    labelKey: "vendor.sidebar.dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    labelKey: "vendor.sidebar.companyProfile",
    href: "/vendor/profile",
    icon: Building2,
  },
  {
    labelKey: "vendor.sidebar.categories",
    href: "/vendor/categories",
    icon: Tags,
  },
  {
    labelKey: "vendor.sidebar.myServices",
    href: "/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    labelKey: "vendor.sidebar.reviews",
    href: "/vendor/reviews",
    icon: MessageSquareText,
  },
  {
    labelKey: "vendor.sidebar.security",
    href: "/vendor/security",
    icon: Shield,
  },
  {
    labelKey: "vendor.sidebar.userMode",
    href: "/",
    icon: Users,
    disabled: true,
  },
  {
    labelKey: "vendor.sidebar.subscriptions",
    href: "/vendor/subscriptions",
    icon: Crown,
  },
];

// Quick actions
const quickActions: {
  labelKey: TranslationKey;
  icon: typeof LayoutDashboard;
  href: string;
  disabled?: boolean;
}[] = [
  {
    labelKey: "vendor.sidebar.helpCenter",
    icon: HelpCircle,
    href: "/vendor/support",
    disabled: true,
  },
  {
    labelKey: "vendor.sidebar.settings",
    icon: Settings,
    href: "/vendor/profile",
  },
];

export default function VendorSidebar({
  mobileOpen,
  onClose,
}: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();
  const { t } = useLanguage();

  const { vendor, loading: vendorLoading } = useVendor();
  const { services, loading: servicesLoading } = useVendorServices();
  const { reviews, loading: reviewsLoading } = useVendorReviews();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await logout();

    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/vendor") {
      return pathname === "/vendor";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // حساب الإحصائيات الحقيقية
  const totalServices = services.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(
    (r) => r.status === ReviewStatus.Pending
  ).length;

  // Vendor status config
  const statusConfig = {
    Approved: {
      labelKey: "vendor.status.approved" as const,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    Pending: {
      labelKey: "vendor.status.pending" as const,
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dotColor: "bg-amber-500",
    },
    Rejected: {
      labelKey: "vendor.status.rejected" as const,
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    },
    Inactive: {
      labelKey: "vendor.status.inactive" as const,
      className: "bg-gray-100 text-gray-600 border-gray-200",
      dotColor: "bg-gray-500",
    },
  };

  const status = vendor?.status
    ? statusConfig[vendor.status as keyof typeof statusConfig]
    : statusConfig.Pending;

  const loading =
    vendorLoading || servicesLoading || reviewsLoading;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("vendor.sidebar.close")}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 start-0 z-50 flex w-70 flex-col
          border-e border-[#eee7e1] bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0 lg:rtl:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full rtl:translate-x-full"
          }
        `}
      >
        {/* =================================================
            BRAND / HEADER
        ================================================= */}

        <div className="flex h-18 items-center justify-between border-b border-[#eee7e1] px-5">
          <Link
            href="/vendor"
            className="flex shrink-0 items-center gap-2"
          >
            <Image
              src="/Logo.png"
              alt="5Digea"
              width={36}
              height={36}
              className="rounded-full"
            />

            <span className="font-serif text-lg font-medium text-[#30251f]">
              5Digea
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("vendor.sidebar.close")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7d7169] transition hover:bg-[#faf7f4] hover:text-[#30251f] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            VENDOR PROFILE
        ================================================= */}

        <div className="border-b border-[#eee7e1] px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#f5eee9] to-[#e8dfd8]">
              {loading ? (
                <div className="h-full w-full animate-pulse bg-[#e8dfd8]" />
              ) : vendor?.profileImageUrl ? (
                <img
                  src={vendor.profileImageUrl}
                  alt={
                    vendor.businessName ||
                    t("vendor.header.vendor")
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2
                  size={22}
                  className="text-[#8d7b70]"
                />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              {loading ? (
                <>
                  <div className="h-4 w-28 animate-pulse rounded bg-[#eee7e1]" />

                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[#f3eeea]" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-semibold text-[#30251f]">
                    {vendor?.businessName ||
                      t("vendor.sidebar.vendorAccount")}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex h-1.5 w-1.5 rounded-full ${status.dotColor} animate-pulse`}
                    />

                    <span
                      className={`text-[10px] font-medium ${
                        vendor?.status === "Approved"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {status
                        ? t(status.labelKey)
                        : t("vendor.status.loading")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!loading && vendor && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p className="text-xs font-semibold text-[#30251f]">
                  {totalServices}
                </p>

                <p className="text-[8px] text-[#9a8d84]">
                  {t("vendor.sidebar.statServices")}
                </p>
              </div>

              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p className="text-xs font-semibold text-[#30251f]">
                  {totalReviews}
                </p>

                <p className="text-[8px] text-[#9a8d84]">
                  {t("vendor.sidebar.statReviews")}
                </p>
              </div>

              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p
                  className={`text-xs font-semibold ${
                    pendingReviews > 0
                      ? "text-amber-600"
                      : "text-[#30251f]"
                  }`}
                >
                  {pendingReviews}
                </p>

                <p className="text-[8px] text-[#9a8d84]">
                  {t("vendor.sidebar.statPending")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a99d94]">
            {t("vendor.sidebar.mainMenu")}
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.disabled) {
                return (
                  <Tooltip
                    key={item.href}
                    title={t(
                      "vendor.sidebar.userModeTooltip"
                    )}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          maxWidth: 280,
                          fontSize: "12px",
                          lineHeight: 1.6,
                          textAlign: "start",
                          padding: "10px 12px",
                          borderRadius: "10px",
                        },
                      },
                    }}
                  >
                    <div
                      className="
                        group relative flex cursor-not-allowed
                        items-center gap-3 rounded-xl
                        px-3.5 py-2.5
                        text-sm font-medium
                        text-[#b8aea7] opacity-60
                      "
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#b8aea7]"
                      />

                      <span className="flex-1">
                        {t(item.labelKey)}
                      </span>

                      <span
                        className="
                          shrink-0 rounded-full
                          bg-[#f5f1ed]
                          px-2 py-0.5
                          text-[8px] font-medium
                          text-[#a99d94]
                        "
                      >
                        {t("vendor.sidebar.comingSoon")}
                      </span>
                    </div>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-3.5 py-2.5
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#30251f] text-white shadow-lg shadow-[#30251f]/10"
                        : "text-[#665a52] hover:bg-[#faf7f4] hover:text-[#30251f]"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute start-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-e-full bg-[#a47e43]" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={
                      active
                        ? "text-white"
                        : "text-[#9a8d84] group-hover:text-[#30251f]"
                    }
                  />

                  <span className="flex-1">
                    {t(item.labelKey)}
                  </span>

                  {item.href === "/vendor/reviews" &&
                    pendingReviews > 0 && (
                      <Badge
                        badgeContent={pendingReviews}
                        color="warning"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: 10,
                            height: 20,
                            minWidth: 20,
                            fontWeight: 600,
                            backgroundColor: "#f59e0b",
                          },
                        }}
                      />
                    )}

                  <ChevronRight
                    size={14}
                    className={`
                      transition-all duration-200
                      rtl:rotate-180
                      ${
                        active
                          ? "translate-x-0 opacity-100 text-white"
                          : "-translate-x-1 rtl:translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-[#f0eae5]" />

          {/* =================================================
              QUICK ACTIONS / SUPPORT
          ================================================= */}

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#a99d94]">
            {t("vendor.sidebar.support")}
          </p>

          <div className="space-y-1">
            {quickActions.map((item) => {
              const Icon = item.icon;

              {/* Disabled Support */}
              if (item.disabled) {
                return (
                  <Tooltip
                    key={item.href}
                    title={t("vendor.sidebar.comingSoon")}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          maxWidth: 280,
                          fontSize: "12px",
                          lineHeight: 1.6,
                          textAlign: "start",
                          padding: "10px 12px",
                          borderRadius: "10px",
                        },
                      },
                    }}
                  >
                    <div
                      className="
                        group relative flex cursor-not-allowed
                        items-center gap-3
                        rounded-xl px-3.5 py-2.5
                        text-sm font-medium
                        text-[#b8aea7]
                        opacity-60
                      "
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#b8aea7]"
                      />

                      <span className="flex-1">
                        {t(item.labelKey)}
                      </span>

                      <span
                        className="
                          shrink-0 rounded-full
                          bg-[#f5f1ed]
                          px-2 py-0.5
                          text-[8px] font-medium
                          text-[#a99d94]
                        "
                      >
                        {t("vendor.sidebar.comingSoon")}
                      </span>
                    </div>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="
                    flex items-center gap-3
                    rounded-xl px-3.5 py-2.5
                    text-sm font-medium
                    text-[#665a52]
                    transition
                    hover:bg-[#faf7f4]
                    hover:text-[#30251f]
                  "
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className="text-[#9a8d84]"
                  />

                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            BOTTOM - Logout & Footer
        ================================================= */}

        <div className="border-t border-[#eee7e1] p-4">
          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              group flex w-full items-center gap-3
              rounded-xl px-3.5 py-2.5
              text-sm font-medium
              text-[#756860]
              transition-all
              hover:bg-red-50
              hover:text-red-600
              disabled:opacity-50
            "
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
              className="transition-colors group-hover:text-red-500"
            />

            <span>
              {isLoggingOut
                ? t("vendor.sidebar.loggingOut")
                : t("vendor.sidebar.logout")}
            </span>

            {isLoggingOut && (
              <span className="ms-auto inline-flex h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            )}
          </button>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between px-3">
            <p className="text-[9px] text-[#b1a59d]">
              © {new Date().getFullYear()} 5digea
            </p>

            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-[#b1a59d]">
                v2.0
              </span>

              <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}