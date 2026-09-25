"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FolderPlus,
  GitCompare,
  Heart,
  HelpCircle,
  LifeBuoy,
  Mail,
  Map as MapIcon,
  MessageCircleQuestion,
  PlusSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tags,
  UserCog,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

type Role = "admin" | "vendor" | "user" | "guest";
type Action = { key: string; label: TranslationKey; href: string; icon: LucideIcon; primary?: boolean };

const ACTIONS: Record<Role, Action[]> = {
  admin: [
    { key: "moderation", label: "common.quick.admin.moderation", href: "/admin/moderation", icon: ShieldCheck, primary: true },
    { key: "addVendor", label: "common.quick.admin.addVendor", href: "/admin/vendors?create=1", icon: UserPlus },
    { key: "addCategory", label: "common.quick.admin.addCategory", href: "/admin/categories?create=1", icon: FolderPlus },
    { key: "messages", label: "common.quick.admin.messages", href: "/admin/messages", icon: Mail },
    { key: "reviews", label: "common.quick.admin.reviews", href: "/admin/reviews", icon: Star },
    { key: "support", label: "common.quick.admin.support", href: "/admin/support", icon: LifeBuoy },
  ],
  vendor: [
    { key: "addService", label: "common.quick.vendor.addService", href: "/vendor/services/new", icon: PlusSquare, primary: true },
    { key: "requestCategory", label: "common.quick.vendor.requestCategory", href: "/vendor/categories", icon: Tags },
    { key: "profile", label: "common.quick.vendor.profile", href: "/vendor/profile", icon: UserCog },
    { key: "reviews", label: "common.quick.vendor.reviews", href: "/vendor/reviews", icon: Star },
    { key: "publicPage", label: "common.quick.vendor.publicPage", href: "", icon: ExternalLink },
    { key: "support", label: "common.quick.vendor.support", href: "/vendor/support", icon: LifeBuoy },
  ],
  user: [
    { key: "roadmap", label: "common.quick.user.roadmap", href: "/roadmap", icon: MapIcon, primary: true },
    { key: "services", label: "common.quick.user.services", href: "/services", icon: Search },
    { key: "favorites", label: "common.quick.user.favorites", href: "/favorites", icon: Heart },
    { key: "compare", label: "common.quick.user.compare", href: "/compare", icon: GitCompare },
    { key: "faq", label: "common.quick.user.faq", href: "/support#faq", icon: HelpCircle },
    { key: "help", label: "common.quick.user.help", href: "/contact", icon: MessageCircleQuestion },
  ],
  guest: [
    { key: "start", label: "common.quick.guest.start", href: "/register", icon: MapIcon, primary: true },
    { key: "services", label: "common.quick.guest.services", href: "/services", icon: Search },
    { key: "vendors", label: "common.quick.guest.vendors", href: "/vendors", icon: Users },
    { key: "faq", label: "common.quick.guest.faq", href: "/support#faq", icon: HelpCircle },
    { key: "contact", label: "common.quick.guest.contact", href: "/contact", icon: MessageCircleQuestion },
    { key: "joinVendor", label: "common.quick.guest.joinVendor", href: "/become-a-vendor", icon: Store },
  ],
};

const SEEN_KEY = "5digea-quickdial-seen";

/**
 * Floating "quick actions" speed dial (bottom corner, every page). The
 * actions depend on who is signed in: admin, vendor, couple or guest.
 * Opens with a staggered spring animation, closes on Esc / outside click /
 * navigation, is fully keyboard-navigable, and lifts itself above bottom
 * bars (see useReserveFabSpace).
 */
export default function QuickDial({ vendorId }: { vendorId?: string }) {
  const { t } = useLanguage();
  const { isAdmin, isVendor, isUser, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const menuId = useId();

  const role: Role = isAdmin ? "admin" : isVendor ? "vendor" : isUser ? "user" : "guest";
  const actions = ACTIONS[role]
    .map((a) => (a.key === "publicPage" ? { ...a, href: vendorId ? `/vendors/${vendorId}` : "" } : a))
    .filter((a) => a.href);

  const close = useCallback((focusButton = false) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  // Close whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // One-time hint bubble for first-time visitors.
  useEffect(() => {
    let seen = true;
    try {
      seen = !!window.localStorage.getItem(SEEN_KEY);
    } catch {
      // storage blocked: skip the hint
    }
    if (seen) return;
    const show = window.setTimeout(() => setHint(true), 2500);
    const hide = window.setTimeout(() => setHint(false), 9500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const markSeen = () => {
    setHint(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
      const i = items.indexOf(document.activeElement as HTMLAnchorElement);
      const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (isLoading || (!isAuthenticated && !actions.length)) return null;

  const isCurrent = (href: string) => {
    const path = href.split(/[?#]/)[0];
    return path === pathname;
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => close()}
        className={`fixed inset-0 z-[44] cursor-default bg-[#1f1613]/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className="fixed end-4 z-[45] flex flex-col items-end gap-3 transition-[bottom] duration-300 sm:end-6"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px) + var(--fab-offset, 0px))" }}
        data-quick-dial
      >
        {/* Menu */}
        <div
          id={menuId}
          role="menu"
          aria-label={t("common.quick.title")}
          aria-hidden={!open}
          className={`flex flex-col items-end gap-2 ${open ? "" : "pointer-events-none"}`}
        >
          <div
            className={`mb-1 rounded-2xl bg-[#30251f] px-4 py-2.5 text-end text-white shadow-lg transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${actions.length * 40}ms` : "0ms" }}
          >
            <p className="text-sm font-bold">{t("common.quick.title")}</p>
            <p className="text-[11px] text-white/60">{t(`common.quick.subtitle.${role}`)}</p>
          </div>

          {[...actions].reverse().map((action, ri) => {
            const i = actions.length - 1 - ri; // original index (0 = closest to the button)
            const Icon = action.icon;
            const current = isCurrent(action.href);
            return (
              <Link
                key={action.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={action.href}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                aria-current={current ? "page" : undefined}
                onClick={() => close()}
                className={`group flex items-center gap-3 outline-none transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] ${
                  open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-75 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${i * 40}ms` : `${(actions.length - i) * 20}ms` }}
              >
                <span
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-[13px] font-semibold shadow-md ring-1 transition-colors group-hover:bg-[#30251f] group-hover:text-white group-focus-visible:bg-[#30251f] group-focus-visible:text-white ${
                    action.primary
                      ? "bg-[#fbf1e3] text-[#7a5428] ring-[#ecd6b5]"
                      : "bg-white text-[#30251f] ring-[#eee5dc]"
                  }`}
                >
                  {t(action.label)}
                  {current && (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      {t("common.quick.current")}
                    </span>
                  )}
                </span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-1 transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-[#b17c42]/30 ${
                    action.primary
                      ? "bg-linear-to-br from-[#e7c089] to-[#b27a3d] text-white ring-white/40"
                      : "bg-white text-[#a47e43] ring-[#eee5dc]"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Hint bubble */}
        {hint && !open && (
          <div className="pointer-events-none absolute bottom-3 end-16 whitespace-nowrap rounded-xl bg-[#30251f] px-3 py-2 text-xs font-medium text-white shadow-lg motion-safe:animate-[catIn_.5s_ease_both]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#e7c089]" />
              {t("common.quick.hint")}
            </span>
          </div>
        )}

        {/* Main button */}
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t("common.quick.close") : t("common.quick.open")}
          title={open ? undefined : t("common.quick.open")}
          onClick={() => {
            markSeen();
            setOpen((o) => !o);
          }}
          className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-[#3a2c24] to-[#1f1613] text-[#f1d4a6] shadow-[0_14px_34px_-10px_rgba(31,22,19,0.7)] ring-1 ring-[#e2b777]/40 transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b17c42]/40 sm:h-14 sm:w-14"
        >
          {hint && !open && (
            <span className="absolute inset-0 animate-ping rounded-full bg-[#e2b777]/40" aria-hidden="true" />
          )}
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_60%)]" aria-hidden="true" />
          <Sparkles
            size={22}
            className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          />
          <X
            size={22}
            className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
          />
        </button>
      </div>
    </>
  );
}
