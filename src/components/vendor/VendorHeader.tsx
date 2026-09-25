"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Building2,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Shield,
  Crown,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  Menu as MuiMenu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import { useVendorContext } from "@/context/VendorContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";
import NotificationBell from "@/components/notifications/NotificationBell";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import SessionCountdownBadge from "@/components/shared/SessionCountdownBadge";

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({ onMenuClick }: VendorHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { t, language, isArabic } = useLanguage();
  const { vendor, loading, refetch } = useVendorContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const runSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = query.trim();

    router.push(
      trimmed
        ? `/vendor/services?q=${encodeURIComponent(trimmed)}`
        : "/vendor/services"
    );

    setMobileSearchOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Navigate to vendor pages
   *
   * Change the paths here whenever you create your pages.
   */
  const handleNavigation = (path: string) => {
    handleClose();
    router.push(path);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleLogout = async () => {
    handleClose();

    await logout();

    router.replace("/login");
  };

  const statusConfig = {
    Approved: {
      labelKey: "vendor.status.approved" as const,
      icon: CheckCircle2,
      className: "text-emerald-600 bg-emerald-50",
      dotColor: "bg-emerald-500",
    },
    Pending: {
      labelKey: "vendor.status.pending" as const,
      icon: Clock3,
      className: "text-amber-600 bg-amber-50",
      dotColor: "bg-amber-500",
    },
    Rejected: {
      labelKey: "vendor.status.rejected" as const,
      icon: XCircle,
      className: "text-red-600 bg-red-50",
      dotColor: "bg-red-500",
    },
    Inactive: {
      labelKey: "vendor.status.inactive" as const,
      icon: XCircle,
      className: "text-gray-600 bg-gray-50",
      dotColor: "bg-gray-500",
    },
  };

  const status = vendor?.status
    ? statusConfig[vendor.status as keyof typeof statusConfig]
    : statusConfig.Pending;

  const StatusIcon = status?.icon || Clock3;

  const formattedTime = currentTime.toLocaleTimeString(LANGUAGE_DATE_LOCALE[language], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString(LANGUAGE_DATE_LOCALE[language], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-[#eee7e1] bg-white/95 px-3 backdrop-blur-md supports-backdrop-filter:bg-white/80 sm:h-18 sm:px-6 lg:px-8">
      {/* =================================================
          LEFT SECTION
      ================================================= */}

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("vendor.header.openSidebar")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee7e1] text-[#5f544d] transition hover:border-[#d5c8be] hover:bg-[#faf7f4] lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
            <Sparkles
              size={15}
              className="text-[#a47e43] sm:h-4.5 sm:w-4.5"
            />
          </div> */}

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#30251f] sm:text-base">
                {t("vendor.header.dashboard")}
              </p>

              <span
                className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${status?.className || ""} sm:inline-flex`}
              >
                <StatusIcon size={10} />
                {status ? t(status.labelKey) : ""}
              </span>
            </div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] rtl:tracking-normal text-[#a99d94] sm:text-[10px]">
              {t("vendor.header.portal")}
            </p>


          </div>
        </div>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="relative hidden max-w-xs flex-1 md:block">
        <form onSubmit={runSearch} className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-[#a89c92]"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("vendor.header.searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-[#eee7e1] bg-[#faf7f4] ps-10 pe-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#b2a59d] focus:border-[#c8b4a6] focus:bg-white"
          />
        </form>
      </div>

      {/* =================================================
          CURRENT TIME
      ================================================= */}

      <div className="hidden items-center gap-3 rounded-full bg-[#faf7f4] px-4 py-1.5 text-xs text-[#756b65] lg:flex">
        <span className="font-medium text-[#30251f]">
          {formattedTime}
        </span>

        <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

        <span>{formattedDate}</span>

        {vendor?.businessName && (
          <>
            <span className="h-1 w-1 rounded-full bg-[#d5c8be]" />

            <span className="font-medium text-[#a47e43]">
              {vendor.businessName}
            </span>
          </>
        )}
      </div>

      {/* =================================================
          RIGHT SECTION
      ================================================= */}

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] md:hidden"
          aria-label={t("vendor.header.searchLabel")}
          aria-expanded={mobileSearchOpen}
        >
          {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        {/* Refresh */}
        <Tooltip title={t("vendor.header.refresh")} arrow>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee7e1] text-[#756860] transition hover:bg-[#faf7f4] hover:text-[#30251f] disabled:opacity-50 sm:h-10 sm:w-10"
          >
            <RefreshCw
              size={16}
              strokeWidth={1.8}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </Tooltip>

        <SessionCountdownBadge compact />

        {/* Language switcher: compact code on phones, globe + name from sm up */}
        <LanguageSwitcher variant="compact" className="sm:hidden" />
        <LanguageSwitcher className="hidden sm:block" />

        {/* Notifications */}
        <NotificationBell viewAllHref="/vendor/notifications" />

        {/* Divider */}
        <div className="hidden h-7 w-px bg-[#eee7e1] sm:block" />

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={handleClick}
            aria-haspopup="menu"
            aria-label={t("vendor.header.vendor")}
            className="group flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-[#faf7f4] sm:gap-2.5 sm:px-2 sm:py-1.5"
          >
            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#f4eee9] ring-2 ring-transparent transition group-hover:ring-[#a47e43]/20 sm:h-10 sm:w-10">
              {loading ? (
                <CircularProgress
                  size={20}
                  thickness={3}
                  sx={{ color: "#a47e43" }}
                />
              ) : vendor?.profileImageUrl ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={vendor.profileImageUrl}
                  alt={vendor.businessName || t("vendor.header.vendor")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2
                  size={17}
                  className="text-[#8d7b70] sm:h-4.5 sm:w-4.5"
                />
              )}
            </div>

            {/* User Info */}
            <div className="hidden min-w-0 max-w-37.5 sm:block">
              <p className="truncate text-sm font-semibold text-[#30251f]">
                {loading
                  ? t("vendor.header.loading")
                  : vendor?.businessName || t("vendor.header.vendor")}
              </p>

              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-[#9a8d84]">{t("vendor.header.online")}</p>
              </div>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-[#9a8d84] sm:block"
              strokeWidth={2}
            />
          </button>

          {/* =================================================
              DROPDOWN MENU
          ================================================= */}

          <MuiMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{
              horizontal: isArabic ? "left" : "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: isArabic ? "left" : "right",
              vertical: "bottom",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: "16px",
                  minWidth: 240,
                  boxShadow:
                    "0 20px 60px rgba(48,37,31,0.15)",
                  border: "1px solid #eee7e1",
                  overflow: "hidden",
                },
              },
            }}
          >
            {/* User Info */}
            <div className="bg-[#faf7f4] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f4eee9]">
                  {vendor?.profileImageUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={vendor.profileImageUrl}
                      alt={vendor.businessName || t("vendor.header.vendor")}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <Building2
                      size={18}
                      className="text-[#8d7b70]"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#30251f]">
                    {vendor?.businessName || t("vendor.header.vendor")}
                  </p>

                  <p className="truncate text-xs text-[#9a8d84]">
                    {vendor?.contactEmail || t("vendor.header.noEmail")}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Profile */}
            <MenuItem
              onClick={() => handleNavigation("/vendor/profile")}
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon>
                <User size={18} className="text-[#756b65]" />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">
                  {t("vendor.header.profile")}
                </span>
              </ListItemText>
            </MenuItem>

            {/* Subscription */}
            <MenuItem
              onClick={() =>
                handleNavigation("/vendor/subscriptions")
              }
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon>
                <Crown size={18} className="text-[#756b65]" />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">
                  {t("vendor.header.subscriptions")}
                </span>
              </ListItemText>
            </MenuItem>

            {/* Settings */}
            <MenuItem
              onClick={() => handleNavigation("/vendor/profile")}
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon>
                <Settings size={18} className="text-[#756b65]" />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">
                  {t("vendor.header.settings")}
                </span>
              </ListItemText>
            </MenuItem>
            {/* Security */}
            <MenuItem
              onClick={() =>
                handleNavigation("/vendor/security")
              }
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon>
                <Shield size={18} className="text-[#756b65]" />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">
                  {t("vendor.header.security")}
                </span>
              </ListItemText>
            </MenuItem>

            {/* Help Center */}
            <MenuItem
              onClick={() =>
                handleNavigation("/vendor/support")
              }
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon>
                <HelpCircle size={18} className="text-[#756b65]" />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-[#30251f]">
                  {t("vendor.header.helpCenter")}
                </span>
              </ListItemText>
            </MenuItem>

            <Divider />

            {/* Logout */}
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
                <LogOut
                  size={18}
                  className="text-red-500"
                />
              </ListItemIcon>

              <ListItemText>
                <span className="text-sm font-medium text-red-600">
                  {t("vendor.header.logout")}
                </span>
              </ListItemText>
            </MenuItem>
          </MuiMenu>
        </div>
      </div>

      {/* =================================================
          MOBILE SEARCH PANEL
      ================================================= */}

      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-[#eee7e1] bg-white p-3 shadow-lg md:hidden">
          <form onSubmit={runSearch} className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-[#a89c92]"
            />

            <input
              ref={mobileSearchInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("vendor.header.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-[#eee7e1] bg-[#faf8f6] ps-10 pe-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#b2a59d] focus:border-[#c8b4a6] focus:bg-white"
            />
          </form>
        </div>
      )}
    </header>
  );
}