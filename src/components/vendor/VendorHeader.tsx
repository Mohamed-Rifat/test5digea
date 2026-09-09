"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Sparkles,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Shield,
  Award,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";

import {
  Menu as MuiMenu,
  MenuItem,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useAuth } from "@/context/AuthContext";

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({ onMenuClick }: VendorHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { vendor, loading, refetch } = useVendor();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleLogout = async () => {
    handleClose();
    await logout();
    router.replace("/login");
  };

  // ✅ Vendor status config
  const statusConfig = {
    Approved: {
      label: "Active",
      icon: CheckCircle2,
      className: "text-emerald-600 bg-emerald-50",
      dotColor: "bg-emerald-500",
    },
    Pending: {
      label: "Under Review",
      icon: Clock3,
      className: "text-amber-600 bg-amber-50",
      dotColor: "bg-amber-500",
    },
    Rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "text-red-600 bg-red-50",
      dotColor: "bg-red-500",
    },
    Inactive: {
      label: "Inactive",
      icon: XCircle,
      className: "text-gray-600 bg-gray-50",
      dotColor: "bg-gray-500",
    },
  };

  const status = vendor?.status 
    ? statusConfig[vendor.status as keyof typeof statusConfig] 
    : statusConfig.Pending;

  const StatusIcon = status?.icon || Clock3;

  // ✅ Format time
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // ✅ حساب عدد الإشعارات الحقيقية (من الـ API)
  // ملاحظة: دي هتجيبيها من API حقيقي، حالياً صفر
  const notificationCount = 0;

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-[#eee7e1] bg-white/95 px-3 backdrop-blur-md supports-backdrop-filter:bg-white/80 sm:h-18 sm:px-6 lg:px-8">
      {/* =================================================
          LEFT SECTION
      ================================================= */}

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Menu Button - Mobile */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee7e1] text-[#5f544d] transition hover:bg-[#faf7f4] hover:border-[#d5c8be] lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
            <Sparkles size={15} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a99d94] sm:text-[10px]">
              Vendor Portal
            </p>

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-[#30251f] sm:text-base">
                Dashboard
              </h1>

              {/* Status Dot - حقيقي */}
              <Tooltip title={`Status: ${status?.label || "Unknown"}`} arrow>
                <span className={`inline-flex h-1.5 w-1.5 rounded-full ${status?.dotColor || "bg-gray-400"} animate-pulse`} />
              </Tooltip>

              {/* Status Badge - حقيقي */}
              <span className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${status?.className || ""} sm:inline-flex`}>
                <StatusIcon size={10} />
                {status?.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CENTER - Current Time
      ================================================= */}

      <div className="hidden items-center gap-3 rounded-full bg-[#faf7f4] px-4 py-1.5 text-xs text-[#756b65] lg:flex">
        <span className="font-medium text-[#30251f]">{formattedTime}</span>
        <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />
        <span>{formattedDate}</span>
        {vendor?.businessName && (
          <>
            <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />
            <span className="text-[#a47e43] font-medium">{vendor.businessName}</span>
          </>
        )}
      </div>

      {/* =================================================
          RIGHT SECTION
      ================================================= */}

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Refresh Button */}
        <Tooltip title="Refresh data" arrow>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] disabled:opacity-50 sm:h-10 sm:w-10"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} strokeWidth={1.8} />
          </button>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications" arrow>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:h-10 sm:w-10"
          >
            <Bell size={16} strokeWidth={1.8} className="sm:h-4.5 sm:w-4.5" />
            
            {/* ✅ Badge حقيقي - يظهر بس لو في إشعارات */}
            {notificationCount > 0 && (
              <Badge
                badgeContent={notificationCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#ef4444",
                    fontSize: 10,
                    height: 18,
                    minWidth: 18,
                    fontWeight: 600,
                    top: 4,
                    right: 4,
                  },
                }}
              />
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-[#eee7e1] sm:block" />

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-[#faf7f4] sm:gap-2.5 sm:px-2 sm:py-1.5"
          >
            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[#f4eee9] ring-2 ring-transparent transition group-hover:ring-[#a47e43]/20 sm:h-10 sm:w-10">
              {loading ? (
                <CircularProgress size={20} thickness={3} sx={{ color: "#a47e43" }} />
              ) : vendor?.profileImageUrl ? (
                <img
                  src={vendor.profileImageUrl}
                  alt={vendor.businessName || "Vendor"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={17} className="text-[#8d7b70] sm:h-4.5 sm:w-4.5" />
              )}

              {/* Online status indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {/* User Info */}
            <div className="hidden min-w-0 max-w-37.5 sm:block">
              <p className="truncate text-sm font-semibold text-[#30251f]">
                {loading ? "Loading..." : vendor?.businessName || "Vendor"}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-[#9a8d84]">Online</p>
              </div>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-[#9a8d84] sm:block"
              strokeWidth={2}
            />
          </button>

          {/* Dropdown Menu */}
          <MuiMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: "16px",
                  minWidth: 240,
                  boxShadow: "0 20px 60px rgba(48,37,31,0.15)",
                  border: "1px solid #eee7e1",
                  overflow: "hidden",
                },
              },
            }}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 bg-[#faf7f4]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4eee9]">
                  {vendor?.profileImageUrl ? (
                    <img
                      src={vendor.profileImageUrl}
                      alt={vendor.businessName || "Vendor"}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <Building2 size={18} className="text-[#8d7b70]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#30251f]">
                    {vendor?.businessName || "Vendor"}
                  </p>
                  <p className="text-xs text-[#9a8d84]">
                    {vendor?.contactEmail || "No email"}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <User size={18} className="text-[#756b65]" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">Profile</span>
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <Settings size={18} className="text-[#756b65]" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">Settings</span>
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <Award size={18} className="text-[#756b65]" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">Subscription</span>
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <Shield size={18} className="text-[#756b65]" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">Security</span>
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <HelpCircle size={18} className="text-[#756b65]" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">Help Center</span>
              </ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                py: 1.5, 
                px: 2,
                color: "#ef4444",
                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              <ListItemIcon>
                <LogOut size={18} className="text-red-500" />
              </ListItemIcon>
              <ListItemText>
                <span className="text-sm font-medium text-red-600">Logout</span>
              </ListItemText>
            </MenuItem>
          </MuiMenu>
        </div>
      </div>
    </header>
  );
}