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

// =========================================================
// Types
// =========================================================

type QuickAction = {
  title: string;
  icon: React.ElementType;
  href: string;
  color: string;
};

type SupportOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge: string | null;
};

// =========================================================
// Constants
// =========================================================

const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Review Reports",
    icon: FileText,
    href: "/admin/reports",
    color: "#a47e43",
  },
  {
    title: "Manage Users",
    icon: Users,
    href: "/admin/users",
    color: "#8b5cf6",
  },
  {
    title: "System Status",
    icon: Shield,
    href: "/admin/status",
    color: "#06b6d4",
  },
  {
    title: "Support Tickets",
    icon: Ticket,
    href: "/admin/tickets",
    color: "#ef4444",
  },
];

const VENDOR_QUICK_ACTIONS: QuickAction[] = [
  {
    title: "My Services",
    icon: Building2,
    href: "/vendor/services",
    color: "#a47e43",
  },
  {
    title: "Submit Ticket",
    icon: Ticket,
    href: "/vendor/support/ticket",
    color: "#f59e0b",
  },
  {
    title: "View FAQ",
    icon: FileText,
    href: "/support/faq",
    color: "#06b6d4",
  },
];

const USER_QUICK_ACTIONS: QuickAction[] = [
  {
    title: "My Account",
    icon: User,
    href: "/profile",
    color: "#a47e43",
  },
  {
    title: "Submit Ticket",
    icon: Ticket,
    href: "/support/ticket",
    color: "#f59e0b",
  },
  {
    title: "View FAQ",
    icon: FileText,
    href: "/support/faq",
    color: "#06b6d4",
  },
];

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: "docs",
    title: "Documentation",
    description: "Browse our detailed guides and tutorials",
    icon: FileText,
    color: "#a47e43",
    href: "/support/docs",
    badge: null,
  },
  {
    id: "chat",
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: MessageCircle,
    color: "#10b981",
    href: "/support/chat",
    badge: "Available",
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us an email and we'll get back to you",
    icon: Mail,
    color: "#8b5cf6",
    href: "mailto:support@5digea.com",
    badge: null,
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Frequently asked questions",
    icon: HelpCircle,
    color: "#06b6d4",
    href: "/support/faq",
    badge: null,
  },
  {
    id: "ticket",
    title: "Submit Ticket",
    description: "Open a support ticket for complex issues",
    icon: Ticket,
    color: "#f59e0b",
    href: "/support/ticket",
    badge: "New",
  },
  {
    id: "phone",
    title: "Phone Support",
    description: "Call us during business hours",
    icon: Phone,
    color: "#ef4444",
    href: "tel:+15551234567",
    badge: null,
  },
];

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

  const [searchQuery, setSearchQuery] = useState("");

  // =======================================================
  // User Information
  // =======================================================

  const userInfo = useMemo(() => {
    if (!isAuthenticated) {
      return {
        name: "Guest",
        role: "Guest",
        roleDescription: "👋 Welcome",
        icon: User,
        color: "bg-[#f5eee9] text-[#8b796d]",
      };
    }

    if (isAdmin) {
      return {
        name:
          user?.fullName ||
          user?.email?.split("@")[0] ||
          "Admin",
        role: "Administrator",
        roleDescription: "👑 Admin",
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
          "Vendor",
        role: "Vendor Partner",
        roleDescription: "🏪 Vendor",
        icon: Building2,
        color: "bg-amber-50 text-amber-700",
      };
    }

    return {
      name:
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "User",
      role: "Customer",
      roleDescription: "👤 Customer",
      icon: User,
      color: "bg-blue-50 text-blue-700",
    };
  }, [
    isAuthenticated,
    isAdmin,
    isVendor,
    isUser,
    user,
    vendor,
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
    ? "Guest"
    : role === "Admin"
      ? "Admin"
      : role === "Vendor"
        ? "Vendor"
        : "User";

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
        option.title.toLowerCase().includes(query) ||
        option.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

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
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b8171] sm:mb-2 sm:text-xs">
                <Sparkles
                  size={11}
                  className="sm:h-3.25 sm:w-3.25"
                />

                Support Center
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
                    How can we help you?
                  </h1>
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#756b65] sm:mt-3 sm:text-sm sm:leading-6">
                Get the support you need, whether you&apos;re a
                customer, vendor, or administrator. Our team is here
                to assist you.
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
            placeholder="Search for help, guides, or topics..."
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      size={18}
                      className="text-[#9b8f86]"
                    />
                  </InputAdornment>
                ),

                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
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
              Quick Actions
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
                  key={action.href}
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
                    {action.title}
                  </p>

                  <ChevronRight className="mt-1 h-3 w-3 text-[#9a8d85] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:h-4 sm:w-4" />
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
            Support Resources
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
                            {option.title}
                          </h3>

                          {option.badge && (
                            <Badge
                              badgeContent={option.badge}
                              color={
                                option.badge === "Available"
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
                                    option.badge === "Available"
                                      ? "#10b981"
                                      : "#f59e0b",
                                },
                              }}
                            />
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-[#756b65] sm:text-sm">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f0eae5] pt-3">
                      <span className="text-[10px] text-[#9a8d85] sm:text-xs">
                        {option.id === "chat"
                          ? "🟢 Online"
                          : option.id === "phone"
                            ? "📞 Call now"
                            : "Learn more"}
                      </span>

                      <ChevronRight className="h-4 w-4 text-[#a47e43] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
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
                No results found
              </h3>

              <p className="mt-1 text-xs text-[#756b65]">
                Try searching for a different topic or browse all
                support resources.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs font-semibold text-[#a47e43] hover:underline"
              >
                Clear search
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
                Support Hours
              </h3>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-[#756b65]">
              <p className="flex justify-between gap-4">
                <span>Monday - Friday</span>

                <span className="font-medium text-[#30251f]">
                  9:00 AM - 6:00 PM
                </span>
              </p>

              <p className="flex justify-between gap-4">
                <span>Saturday - Sunday</span>

                <span className="font-medium text-[#30251f]">
                  Closed
                </span>
              </p>

              <p className="flex justify-between gap-4 text-xs text-[#9a8d85]">
                <span>Average response time</span>

                <span className="font-medium text-emerald-600">
                  &lt; 2 hours
                </span>
              </p>
            </div>
          </div>

          {/* Quick Info */}

          <div className="rounded-2xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#a47e43]" />

              <h3 className="font-semibold text-[#30251f]">
                Quick Info
              </h3>
            </div>

            <div className="mt-3 space-y-2 text-sm">

              {isAdmin && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <Shield className="h-4 w-4 text-purple-500" />

                    <span>
                      You have{" "}
                      <strong className="text-[#30251f]">
                        Admin
                      </strong>{" "}
                      privileges
                    </span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <Ticket className="h-4 w-4 text-red-500" />

                    <span>
                      <strong className="text-[#30251f]">
                        12
                      </strong>{" "}
                      open tickets
                    </span>
                  </p>
                </>
              )}

              {isVendor && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <Building2 className="h-4 w-4 text-amber-500" />

                    <span>
                      Vendor{" "}
                      <strong className="text-[#30251f]">
                        {vendor?.businessName ||
                          user?.fullName ||
                          "Partner"}
                      </strong>
                    </span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>
                      Priority{" "}
                      <strong className="text-[#30251f]">
                        Support
                      </strong>{" "}
                      available
                    </span>
                  </p>
                </>
              )}

              {isUser && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <User className="h-4 w-4 text-blue-500" />

                    <span>
                      Welcome back,{" "}
                      <strong className="text-[#30251f]">
                        {userInfo.name}
                      </strong>
                    </span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>
                      Standard support available
                    </span>
                  </p>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <p className="flex items-center gap-2 text-[#756b65]">
                    <User className="h-4 w-4 text-[#a47e43]" />

                    <span>
                      You are browsing as a{" "}
                      <strong className="text-[#30251f]">
                        Guest
                      </strong>
                    </span>
                  </p>

                  <p className="flex items-center gap-2 text-[#756b65]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span>
                      Public support resources are available
                    </span>
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
              💡 Need immediate assistance? Contact us directly:
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