"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

import {
  Tooltip,
  Badge,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useVendorServices } from "@/features/services/hooks/useVendorServices";
import { useVendorReviews } from "@/features/reviews/hooks/useVendorReviews";
import { ReviewStatus } from "@/types/review";

interface VendorSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

// ✅ Navigation items (بدون بيانات وهمية)
const navigationItems = [
  {
    label: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
     {
    label: "Company Profile",
    href: "/vendor/profile",
    icon: Building2,
  },
  {
    label: "Categories",
    href: "/vendor/categories",
    icon: Tags,
  },
    {
    label: "My Services",
    href: "/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Reviews",
    href: "/vendor/reviews",
    icon: MessageSquareText,
  },
];

// ✅ Quick actions
const quickActions = [
  { label: "Help Center", icon: HelpCircle, href: "/vendor/support" },
  { label: "Settings", icon: Settings, href: "/vendor/profile" },
];

export default function VendorSidebar({
  mobileOpen,
  onClose,
}: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
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

  // ✅ حساب الإحصائيات الحقيقية
  const totalServices = services.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === ReviewStatus.Pending).length;

  // ✅ Vendor status config
  const statusConfig = {
    Approved: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    Pending: {
      label: "Under Review",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dotColor: "bg-amber-500",
    },
    Rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    },
    Inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      dotColor: "bg-gray-500",
    },
  };

  const status = vendor?.status 
    ? statusConfig[vendor.status as keyof typeof statusConfig] 
    : statusConfig.Pending;

  const loading = vendorLoading || servicesLoading || reviewsLoading;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-70 flex-col
          border-r border-[#eee7e1] bg-white
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =================================================
            BRAND / HEADER
        ================================================= */}

        <div className="flex h-18 items-center justify-between border-b border-[#eee7e1] px-5">
          <Link
            href="/vendor"
            onClick={onClose}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] group-hover:scale-105 transition">
              <Sparkles size={16} className="text-[#a47e43]" />
            </div>
            <span className="text-lg font-bold text-[#30251f]">
              5digea
              <span className="text-[#a47e43]">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
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
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#f5eee9] to-[#e8dfd8]">
              {loading ? (
                <div className="h-full w-full animate-pulse bg-[#e8dfd8]" />
              ) : vendor?.profileImageUrl ? (
                <img
                  src={vendor.profileImageUrl}
                  alt={vendor.businessName || "Vendor"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={22} className="text-[#8d7b70]" />
              )}
              
              {/* Online status dot */}
              <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${status.dotColor}`} />
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
                    {vendor?.businessName || "Vendor Account"}
                  </p>
                  
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex h-1.5 w-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                    <span className={`text-[10px] font-medium ${
                      vendor?.status === "Approved" ? "text-emerald-700" : "text-amber-700"
                    }`}>
                      {status?.label || "Loading"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ✅ Quick stats - بيانات حقيقية */}
          {!loading && vendor && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p className="text-xs font-semibold text-[#30251f]">{totalServices}</p>
                <p className="text-[8px] text-[#9a8d84]">Services</p>
              </div>
              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p className="text-xs font-semibold text-[#30251f]">{totalReviews}</p>
                <p className="text-[8px] text-[#9a8d84]">Reviews</p>
              </div>
              <div className="rounded-lg bg-[#faf7f4] px-2 py-1.5 text-center">
                <p className={`text-xs font-semibold ${pendingReviews > 0 ? "text-amber-600" : "text-[#30251f]"}`}>
                  {pendingReviews}
                </p>
                <p className="text-[8px] text-[#9a8d84]">Pending</p>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99d94]">
            Main Menu
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5
                    text-sm font-medium transition-all duration-200
                    ${active
                      ? "bg-[#30251f] text-white shadow-lg shadow-[#30251f]/10"
                      : "text-[#665a52] hover:bg-[#faf7f4] hover:text-[#30251f]"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-[#a47e43]" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={active ? "text-white" : "text-[#9a8d84] group-hover:text-[#30251f]"}
                  />

                  <span className="flex-1">{item.label}</span>

                  {/* ✅ Badge حقيقي للمراجعات */}
                  {item.href === "/vendor/reviews" && pendingReviews > 0 && (
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
                      ${active
                        ? "translate-x-0 opacity-100 text-white"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-[#f0eae5]" />

          {/* Quick Actions */}
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99d94]">
            Support
          </p>

          <div className="space-y-1">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#665a52] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
                >
                  <Icon size={18} strokeWidth={1.8} className="text-[#9a8d84]" />
                  <span>{item.label}</span>
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
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#756860] transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut 
              size={18} 
              strokeWidth={1.8} 
              className="transition-colors group-hover:text-red-500" 
            />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            {isLoggingOut && (
              <span className="ml-auto inline-flex h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            )}
          </button>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between px-3">
            <p className="text-[9px] text-[#b1a59d]">
              © {new Date().getFullYear()} 5digea
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-[#b1a59d]">v2.0</span>
              <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}