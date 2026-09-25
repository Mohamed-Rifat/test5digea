import {
  LayoutDashboard,
  BriefcaseBusiness,
  Tags,
  Building2,
  MessageSquareText,
  HelpCircle,
  Settings,
  Shield,
  Users,
  Crown,
} from "lucide-react";
import type { TranslationKey } from "@/locales";

// Navigation items
export const navigationItems: {
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
export const quickActions: {
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
