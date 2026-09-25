"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { useVendorContext } from "@/context/VendorContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGE_DATE_LOCALE } from "@/locales/config";

/** Header state: clock, search, account menu, refresh and logout. */
export function useVendorHeader() {
  const router = useRouter();
  const { logout } = useAuth();
  const { language } = useLanguage();
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
        : "/vendor/services",
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

  const formattedTime = currentTime.toLocaleTimeString(
    LANGUAGE_DATE_LOCALE[language],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const formattedDate = currentTime.toLocaleDateString(
    LANGUAGE_DATE_LOCALE[language],
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );

  return {
    router,
    anchorEl,
    setAnchorEl,
    isRefreshing,
    setIsRefreshing,
    currentTime,
    setCurrentTime,
    query,
    setQuery,
    mobileSearchOpen,
    setMobileSearchOpen,
    mobileSearchInputRef,
    runSearch,
    open,
    handleClick,
    handleClose,
    handleNavigation,
    handleRefresh,
    handleLogout,
    statusConfig,
    status,
    StatusIcon,
    formattedTime,
    formattedDate,
    logout,
    vendor,
    loading,
    refetch,
  };
}

export type VendorHeaderState = ReturnType<typeof useVendorHeader>;
