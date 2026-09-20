// app/support/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Sparkles,
  Ticket,
  User,
  Users,
} from "lucide-react";

import {
  Badge,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/features/vendors/hooks/useVendor";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

// =========================================================
// Types
// =========================================================

type QuickAction = {
  titleKey: TranslationKey;
  icon: React.ElementType;
  href: string;
  color: string;
};

type SupportOption = {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: React.ElementType;
  color: string;
  href: string;
  badge: "available" | "new" | null;
};

// =========================================================
// Constants
// =========================================================

const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  { titleKey: "support.quickActions.reviewReports", icon: FileText, href: "/admin/reports", color: "#a47e43" },
  { titleKey: "support.quickActions.adminDashboard", icon: Users, href: "/admin", color: "#8b5cf6" },
  { titleKey: "support.quickActions.systemStatus", icon: Shield, href: "/admin/status", color: "#06b6d4" },
  { titleKey: "support.quickActions.supportTickets", icon: Ticket, href: "/admin/tickets", color: "#ef4444" },
];

const VENDOR_QUICK_ACTIONS: QuickAction[] = [
  { titleKey: "support.quickActions.myServices", icon: Building2, href: "/vendor/services", color: "#a47e43" },
  { titleKey: "support.quickActions.submitTicket", icon: Ticket, href: "/vendor/support/ticket", color: "#f59e0b" },
  { titleKey: "support.quickActions.viewFaq", icon: FileText, href: "/support/faq", color: "#06b6d4" },
];

const USER_QUICK_ACTIONS: QuickAction[] = [
  { titleKey: "support.quickActions.myAccount", icon: User, href: "/profile", color: "#a47e43" },
  { titleKey: "support.quickActions.submitTicket", icon: Ticket, href: "/support/ticket", color: "#f59e0b" },
  { titleKey: "support.quickActions.viewFaq", icon: FileText, href: "/support/faq", color: "#06b6d4" },
];

const SUPPORT_OPTIONS: SupportOption[] = [
  { id: "docs", titleKey: "support.resources.docs.title", descriptionKey: "support.resources.docs.description", icon: FileText, color: "#a47e43", href: "/support/docs", badge: null },
  { id: "chat", titleKey: "support.resources.chat.title", descriptionKey: "support.resources.chat.description", icon: MessageCircle, color: "#10b981", href: "/support/chat", badge: "available" },
  { id: "email", titleKey: "support.resources.email.title", descriptionKey: "support.resources.email.description", icon: Mail, color: "#8b5cf6", href: "mailto:support@5digea.com", badge: null },
  { id: "faq", titleKey: "support.resources.faq.title", descriptionKey: "support.resources.faq.description", icon: HelpCircle, color: "#06b6d4", href: "/support/faq", badge: null },
  { id: "ticket", titleKey: "support.resources.ticket.title", descriptionKey: "support.resources.ticket.description", icon: Ticket, color: "#f59e0b", href: "/support/ticket", badge: "new" },
  { id: "phone", titleKey: "support.resources.phone.title", descriptionKey: "support.resources.phone.description", icon: Phone, color: "#ef4444", href: "tel:+15551234567", badge: null },
];

// Renders a translated sentence containing a {bold} placeholder, so the
// highlighted word can sit anywhere in the sentence in either language.
function Rich({ text, bold }: { text: string; bold: string }) {
  const [before, after = ""] = text.split("{bold}");

  return (
    <>
      {before}
      <strong className="text-[#30251f]">{bold}</strong>
      {after}
    </>
  );
}

// =========================================================
// Main Component
// =========================================================

export default function SupportHubPage() {
  const {
    user,
    role,
    isAuthenticated,
    isAdmin,
    isVendor,
    isUser,
  } = useAuth();

  const { vendor } = useVendor();
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
  }, [
    isAuthenticated,
    isAdmin,
    isVendor,
    user,
    vendor,
    t,
  ]);

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

  // =======================================================
  // Render
  // =======================================================

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex-1">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rtl:tracking-normal text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles
                  size={11}
                  className="sm:h-3.25 sm:w-3.25"
                />

                {t("support.eyebrow")}
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-10 sm:w-10">
                  <HelpCircle
                    size={16}
                    className="text-[#a47e43] sm:h-5 sm:w-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-[#30251f] sm:text-2xl lg:text-3xl">
                    {t("support.title")}
                  </h1>
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                {t("support.intro")}
              </p>
            </div>

            {/* User Badge */}

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#e8dfd8] bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${userInfo.color} sm:h-9 sm:w-9`}
              >
                <UserIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#30251f]">
                  {userInfo.name}
                </p>

                <p className="text-[10px] text-[#9a8d85] sm:text-xs">
                  {userInfo.role} • {userInfo.roleDescription}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div className="mb-6">
          <TextField
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder={t("support.searchPlaceholder")}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0, marginInlineEnd: "8px" }}>
                    <Search
                      size={18}
                      className="text-[#9b8f86]"
                    />
                  </InputAdornment>
                ),

                endAdornment: searchQuery ? (
                  <InputAdornment position="end" sx={{ ml: 0, marginInlineStart: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label={t("support.clearSearch")}
                      className="rounded-md p-1 text-[#9b8f86] transition hover:bg-[#f5eee9] hover:text-[#30251f]"
                    >
                      <span className="text-sm">✕</span>
                    </button>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 50,
                borderRadius: "16px",
                backgroundColor: "white",
                fontSize: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",

                "& fieldset": {
                  borderColor: "#e8dfd8",
                },

                "&:hover fieldset": {
                  borderColor: "#d5c8be",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#a47e43",
                  borderWidth: "1px",
                },
              },
            }}
          />
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">
              {t("support.quickActions.title")}
            </h2>

            <Chip
              label={roleLabel}
              size="small"
              sx={{
                height: 22,
                fontSize: "9px",
                fontWeight: 600,
                backgroundColor: roleColor,
                color: "white",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.titleKey}
                  href={action.href}
                  className="group flex flex-col items-center rounded-2xl border border-[#e8dfd8] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110 sm:h-12 sm:w-12"
                    style={{
                      backgroundColor: `${action.color}15`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      style={{
                        color: action.color,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-[#30251f] sm:mt-3 sm:text-sm">
                    {t(action.titleKey)}
                  </p>

                  <ChevronRight className="mt-1 h-3 w-3 text-[#9a8d85] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:h-4 sm:w-4 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* =================================================
            SUPPORT OPTIONS
        ================================================= */}

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-[#30251f] sm:mb-4 sm:text-base">
            {t("support.resources.title")}
          </h2>

          {filteredOptions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <Link
                    key={option.id}
                    href={option.href}
                    className="group rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110 sm:h-12 sm:w-12"
                        style={{
                          backgroundColor: `${option.color}15`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          style={{
                            color: option.color,
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#30251f] sm:text-base">
                            {t(option.titleKey)}
                          </h3>

                          {option.badge && (
                            <Badge
                              badgeContent={
                                option.badge === "available"
                                  ? t("support.resources.badgeAvailable")
                                  : t("support.resources.badgeNew")
                              }
                              color={
                                option.badge === "available"
                                  ? "success"
                                  : "warning"
                              }
                              sx={{
                                "& .MuiBadge-badge": {
                                  fontSize: "8px",
                                  height: 16,
                                  minWidth: 16,
                                  fontWeight: 600,
                                  backgroundColor:
                                    option.badge === "available"
                                      ? "#10b981"
                                      : "#f59e0b",
                                },
                              }}
                            />
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-[#756b65] sm:text-sm">
                          {t(option.descriptionKey)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f0eae5] pt-3">
                      <span className="text-[10px] text-[#9a8d85] sm:text-xs">
                        {option.id === "chat"
                          ? t("support.resources.online")
                          : option.id === "phone"
                            ? t("support.resources.callNow")
                            : t("support.resources.learnMore")}
                      </span>

                      <ChevronRight className="h-4 w-4 text-[#a47e43] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e0d5cd] bg-white px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5eee9]">
                <Search className="h-5 w-5 text-[#a47e43]" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-[#30251f]">
                {t("support.noResults.title")}
              </h3>

              <p className="mt-1 text-xs text-[#756b65]">
                {t("support.noResults.text")}
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs font-semibold text-[#a47e43] hover:underline"
              >
                {t("support.noResults.clear")}
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            SUPPORT INFO
        ================================================= */}

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">

          {/* Support Hours */}

          <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#a47e43]" />

              <h3 className="font-semibold text-[#30251f]">
                {t("support.hours.title")}
              </h3>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-[#756b65]">
              <p className="flex justify-between gap-4">
                <span>{t("support.hours.weekdays")}</span>

                <span className="font-medium text-[#30251f]">
                  {t("support.hours.weekdayTime")}
                </span>
              </p>

              <p className="flex justify-between gap-4">
                <span>{t("support.hours.weekend")}</span>

                <span className="font-medium text-[#30251f]">
                  {t("support.hours.closed")}
                </span>
              </p>

              <p className="flex justify-between gap-4 text-xs text-[#9a8d85]">
                <span>{t("support.hours.responseTime")}</span>

                <span className="font-medium text-emerald-600">
                  {t("support.hours.responseValue")}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Info */}

          <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#a47e43]" />

              <h3 className="font-semibold text-[#30251f]">
                {t("support.info.title")}
              </h3>
            </div>

            <div className="mt-3 space-y-2 text-sm">

              {isAdmin && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <Shield className="h-4 w-4 text-purple-500" />

                    <span><Rich text={t("support.info.adminPrivileges")} bold={t("support.info.adminBold")} /></span>
                  </p>
                </>
              )}

              {isVendor && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <Building2 className="h-4 w-4 text-amber-500" />

                    <span><Rich
                        text={t("support.info.vendor")}
                        bold={
                          vendor?.businessName ||
                          user?.fullName ||
                          t("support.info.vendorFallback")
                        }
                      /></span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span><Rich text={t("support.info.priority")} bold={t("support.info.priorityBold")} /></span>
                  </p>
                </>
              )}

              {isUser && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <User className="h-4 w-4 text-blue-500" />

                    <span><Rich text={t("support.info.welcomeBack")} bold={userInfo.name} /></span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>{t("support.info.standardSupport")}</span>
                  </p>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <User className="h-4 w-4 text-[#a47e43]" />

                    <span><Rich text={t("support.info.guestBrowsing")} bold={t("support.info.guestBold")} /></span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>{t("support.info.publicResources")}</span>
                  </p>
                </>
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            CONTACT
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-[#e8dfd8] bg-[#fbf6f1] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-[#756b65]">
              {t("support.contact.text")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="mailto:support@5digea.com"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a47e43] hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@5digea.com
              </Link>

              <span className="hidden h-4 w-px bg-[#d5c8be] sm:block" />

              <Link
                href="tel:+15551234567"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a47e43] hover:underline"
              >
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}