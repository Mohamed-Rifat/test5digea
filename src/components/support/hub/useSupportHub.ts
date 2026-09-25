"use client";

import { useMemo, useState } from "react";
import { Building2, Shield, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOptionalVendorContext } from "@/context/VendorContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  ADMIN_QUICK_ACTIONS,
  SUPPORT_OPTIONS,
  USER_QUICK_ACTIONS,
  VENDOR_QUICK_ACTIONS,
} from "@/components/support/hub/supportConfig";

/** Who is asking (guest / user / vendor / admin), quick actions and search. */
export function useSupportHub() {
  const { user, role, isAuthenticated, isAdmin, isVendor, isUser } = useAuth();

  // Only available inside the vendor dashboard - no extra API call elsewhere.
  const vendor = useOptionalVendorContext()?.vendor ?? null;
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");

  // =======================================================
  // User Information
  // =======================================================

  const userInfo = useMemo(() => {
    if (!isAuthenticated) {
      return {
        name: t("support.user.guestName"),
        role: t("support.user.guestRole"),
        roleDescription: t("support.user.guestDescription"),
        icon: User,
        color: "bg-[#f5eee9] text-[#8b796d]",
      };
    }

    if (isAdmin) {
      return {
        name:
          user?.fullName ||
          user?.email?.split("@")[0] ||
          t("support.user.adminName"),
        role: t("support.user.adminRole"),
        roleDescription: t("support.user.adminDescription"),
        icon: Shield,
        color: "bg-purple-50 text-purple-700",
      };
    }

    if (isVendor) {
      return {
        name:
          vendor?.businessName ||
          user?.fullName ||
          user?.email?.split("@")[0] ||
          t("support.user.vendorName"),
        role: t("support.user.vendorRole"),
        roleDescription: t("support.user.vendorDescription"),
        icon: Building2,
        color: "bg-amber-50 text-amber-700",
      };
    }

    return {
      name:
        user?.fullName ||
        user?.email?.split("@")[0] ||
        t("support.user.customerName"),
      role: t("support.user.customerRole"),
      roleDescription: t("support.user.customerDescription"),
      icon: User,
      color: "bg-blue-50 text-blue-700",
    };
  }, [isAuthenticated, isAdmin, isVendor, user, vendor, t]);

  // =======================================================
  // Quick Actions
  // =======================================================

  const quickActions = useMemo(() => {
    if (isAdmin) {
      return ADMIN_QUICK_ACTIONS;
    }

    if (isVendor) {
      return VENDOR_QUICK_ACTIONS;
    }

    return USER_QUICK_ACTIONS;
  }, [isAdmin, isVendor]);

  // =======================================================
  // Role Label
  // =======================================================

  const roleLabel = !isAuthenticated
    ? t("support.roleLabel.guest")
    : role === "Admin"
      ? t("support.roleLabel.admin")
      : role === "Vendor"
        ? t("support.roleLabel.vendor")
        : t("support.roleLabel.user");

  const roleColor = !isAuthenticated
    ? "#8b796d"
    : isAdmin
      ? "#8b5cf6"
      : isVendor
        ? "#f59e0b"
        : "#06b6d4";

  // =======================================================
  // Search
  // =======================================================

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return SUPPORT_OPTIONS;
    }

    return SUPPORT_OPTIONS.filter((option) => {
      return (
        t(option.titleKey).toLowerCase().includes(query) ||
        t(option.descriptionKey).toLowerCase().includes(query)
      );
    });
  }, [searchQuery, t]);

  const UserIcon = userInfo.icon;

  return {
    vendor,
    searchQuery,
    setSearchQuery,
    userInfo,
    quickActions,
    roleLabel,
    roleColor,
    filteredOptions,
    UserIcon,
    user,
    role,
    isAuthenticated,
    isAdmin,
    isVendor,
    isUser,
  };
}

export type SupportHubState = ReturnType<typeof useSupportHub>;
