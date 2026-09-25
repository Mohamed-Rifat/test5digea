import {
  Building2,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Ticket,
  User,
  Users,
} from "lucide-react";
import type { TranslationKey } from "@/locales";

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

export const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  {
    titleKey: "support.quickActions.reviewReports",
    icon: FileText,
    href: "/admin/reviews",
    color: "#a47e43",
  },
  {
    titleKey: "support.quickActions.adminDashboard",
    icon: Users,
    href: "/admin",
    color: "#8b5cf6",
  },
  {
    titleKey: "support.quickActions.systemStatus",
    icon: Shield,
    href: "/admin/moderation",
    color: "#06b6d4",
  },
  {
    titleKey: "support.quickActions.supportTickets",
    icon: Ticket,
    href: "/admin/messages",
    color: "#ef4444",
  },
];

export const VENDOR_QUICK_ACTIONS: QuickAction[] = [
  {
    titleKey: "support.quickActions.myServices",
    icon: Building2,
    href: "/vendor/services",
    color: "#a47e43",
  },
  {
    titleKey: "support.quickActions.submitTicket",
    icon: Ticket,
    href: "/contact",
    color: "#f59e0b",
  },
  {
    titleKey: "support.quickActions.viewFaq",
    icon: FileText,
    href: "#faq",
    color: "#06b6d4",
  },
];

export const USER_QUICK_ACTIONS: QuickAction[] = [
  {
    titleKey: "support.quickActions.myAccount",
    icon: User,
    href: "/profile",
    color: "#a47e43",
  },
  {
    titleKey: "support.quickActions.submitTicket",
    icon: Ticket,
    href: "/contact",
    color: "#f59e0b",
  },
  {
    titleKey: "support.quickActions.viewFaq",
    icon: FileText,
    href: "#faq",
    color: "#06b6d4",
  },
];

export const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: "docs",
    titleKey: "support.resources.docs.title",
    descriptionKey: "support.resources.docs.description",
    icon: FileText,
    color: "#a47e43",
    href: "/about",
    badge: null,
  },
  {
    id: "chat",
    titleKey: "support.resources.chat.title",
    descriptionKey: "support.resources.chat.description",
    icon: MessageCircle,
    color: "#10b981",
    href: "/contact",
    badge: null,
  },
  {
    id: "email",
    titleKey: "support.resources.email.title",
    descriptionKey: "support.resources.email.description",
    icon: Mail,
    color: "#8b5cf6",
    href: "mailto:support@5digea.com",
    badge: null,
  },
  {
    id: "faq",
    titleKey: "support.resources.faq.title",
    descriptionKey: "support.resources.faq.description",
    icon: HelpCircle,
    color: "#06b6d4",
    href: "#faq",
    badge: null,
  },
  {
    id: "ticket",
    titleKey: "support.resources.ticket.title",
    descriptionKey: "support.resources.ticket.description",
    icon: Ticket,
    color: "#f59e0b",
    href: "/contact",
    badge: "new",
  },
  {
    id: "phone",
    titleKey: "support.resources.phone.title",
    descriptionKey: "support.resources.phone.description",
    icon: Phone,
    color: "#ef4444",
    href: "tel:+201222800121",
    badge: null,
  },
];

export const FAQ_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
] as const;
