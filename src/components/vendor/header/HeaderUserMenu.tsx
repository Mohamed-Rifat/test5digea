"use client";

import {
  ChevronDown,
  Building2,
  LogOut,
  Settings,
  User,
  HelpCircle,
  Shield,
  Crown,
} from "lucide-react";
import {
  Menu as MuiMenu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useLanguage } from "@/context/LanguageContext";

import type { VendorHeaderState } from "./useVendorHeader";

/** Account button and dropdown menu. */
export function HeaderUserMenu({ header }: { header: VendorHeaderState }) {
  const { t, isArabic } = useLanguage();
  const {
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleNavigation,
    handleLogout,
    vendor,
    loading,
  } = header;

  return (
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
            <Building2 size={17} className="text-[#8d7b70] sm:h-4.5 sm:w-4.5" />
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
            <p className="text-[10px] text-[#9a8d84]">
              {t("vendor.header.online")}
            </p>
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
              boxShadow: "0 20px 60px rgba(48,37,31,0.15)",
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
                <Building2 size={18} className="text-[#8d7b70]" />
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
          onClick={() => handleNavigation("/vendor/subscriptions")}
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
          onClick={() => handleNavigation("/vendor/security")}
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
          onClick={() => handleNavigation("/vendor/support")}
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
            <LogOut size={18} className="text-red-500" />
          </ListItemIcon>

          <ListItemText>
            <span className="text-sm font-medium text-red-600">
              {t("vendor.header.logout")}
            </span>
          </ListItemText>
        </MenuItem>
      </MuiMenu>
    </div>
  );
}
