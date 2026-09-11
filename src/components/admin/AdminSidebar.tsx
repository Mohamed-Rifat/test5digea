"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  Store,
  BriefcaseBusiness,
  Star,
  ClipboardList,
  LogOut,
  X,
  Heart,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

// Only routes that actually exist under src/app/admin.
// Add Analytics / Users / Settings back here once their pages and APIs exist.
const navigation = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { label: "Moderation", href: "/admin/moderation", icon: ClipboardList },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Vendors", href: "/admin/vendors", icon: Store },
      { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
];

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

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
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-67.5 flex-col border-r border-[#eee5df] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20.5 items-center justify-between border-b border-[#f0e9e4] px-6">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#30251f] text-white shadow-sm">
              <Heart size={21} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide text-[#30251f]">
                5Digea
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#a28d7e]">
                Administration
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8d8179] hover:bg-[#faf7f4] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((section) => (
            <div key={section.title} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0a198]">
                {section.title}
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
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f0e9e4] p-4">
          <div className="mb-3 rounded-xl bg-[#faf7f4] p-3">
            <p className="text-xs font-semibold text-[#55483f]">Admin Portal</p>
            <p className="mt-1 text-[11px] leading-5 text-[#9b8d84]">
              Manage your 5Digea marketplace from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#8a7770] transition hover:bg-[#fff5f3] hover:text-[#9c5e59]"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
