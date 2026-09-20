"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Tags,
  Store,
  BriefcaseBusiness,
  Star,
  ClipboardList,
  FilePenLine,
  LogOut,
  X,
  Heart,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation: {
  titleKey: TranslationKey;
  items: { labelKey: TranslationKey; href: string; icon: typeof Tags }[];
}[] = [
  {
    titleKey: "admin.sidebar.overview",
    items: [
      { labelKey: "admin.sidebar.dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    titleKey: "admin.sidebar.management",
    items: [
      { labelKey: "admin.sidebar.moderation", href: "/admin/moderation", icon: ClipboardList },
      { labelKey: "admin.sidebar.vendorUpdates", href: "/admin/vendor-updates", icon: FilePenLine },
      { labelKey: "admin.sidebar.categories", href: "/admin/categories", icon: Tags },
      { labelKey: "admin.sidebar.vendors", href: "/admin/vendors", icon: Store },
      { labelKey: "admin.sidebar.services", href: "/admin/services", icon: BriefcaseBusiness },
      { labelKey: "admin.sidebar.reviews", href: "/admin/reviews", icon: Star },
    ],
  },
];

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("admin.sidebar.close")}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-67.5 flex-col border-e border-[#eee5df] bg-white transition-transform duration-300 lg:translate-x-0 lg:rtl:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex h-20.5 items-center justify-between border-b border-[#f0e9e4] px-6">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full">
              <Image
                          src="/Logo.png"
                          alt="5Digea"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide text-[#30251f]">
                5Digea
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] rtl:tracking-normal text-[#a28d7e]">
                {t("admin.sidebar.administration")}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8d8179] hover:bg-[#faf7f4] lg:hidden"
            aria-label={t("admin.sidebar.close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((section) => (
            <div key={section.titleKey} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#b0a198]">
                {t(section.titleKey)}
              </p>

              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                        active
                          ? "bg-[#30251f] text-white shadow-sm"
                          : "text-[#756960] hover:bg-[#faf7f4] hover:text-[#30251f]"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2 : 1.8}
                        className={active ? "text-white" : "text-[#a08e82] group-hover:text-[#30251f]"}
                      />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f0e9e4] p-4">
          <div className="mb-3 rounded-xl bg-[#faf7f4] p-3">
            <p className="text-xs font-semibold text-[#55483f]">
              {t("admin.sidebar.portalTitle")}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#9b8d84]">
              {t("admin.sidebar.portalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#8a7770] transition hover:bg-[#fff5f3] hover:text-[#9c5e59]"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>{t("admin.sidebar.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
