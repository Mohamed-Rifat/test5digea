"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Tags,
  Building2,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/features/vendors/hooks/useVendor";

interface VendorSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    label: "My Services",
    href: "/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "My Categories",
    href: "/vendor/categories",
    icon: Tags,
  },
  {
    label: "Company Profile",
    href: "/vendor/profile",
    icon: Building2,
  },
];

export default function VendorSidebar({
  mobileOpen,
  onClose,
}: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();
  const { vendor, loading } = useVendor();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/vendor") {
      return pathname === "/vendor";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const statusLabel = vendor?.status ?? "Loading";

  const statusClasses =
    vendor?.status === "Approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : vendor?.status === "Pending"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : vendor?.status === "Rejected"
          ? "bg-red-50 text-red-700 border-red-100"
          : vendor?.status === "Inactive"
            ? "bg-gray-100 text-gray-600 border-gray-200"
            : "bg-gray-50 text-gray-500 border-gray-100";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          border-r border-[#eee7e1] bg-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-[#eee7e1] px-6">
          <Link
            href="/vendor"
            onClick={onClose}
            className="flex items-center"
          >
            <img
              src="/Logo.png"
              alt="5digea"
              className="h-auto w-[112px] object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7d7169] transition hover:bg-[#faf7f4] hover:text-[#30251f] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="border-b border-[#eee7e1] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4eee9]">
              {vendor?.profileImageUrl ? (
                <img
                  src={vendor.profileImageUrl}
                  alt={vendor.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={20} className="text-[#8d7b70]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {loading ? (
                <>
                  <div className="h-4 w-28 animate-pulse rounded bg-[#eee7e1]" />
                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[#f3eeea]" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-semibold text-[#30251f]">
                    {vendor?.businessName || "Vendor Account"}
                  </p>

                  <span
                    className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses}`}
                  >
                    {statusLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a99d94]">
            Workspace
          </p>

          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3.5 py-3
                    text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-[#30251f] text-white shadow-sm"
                        : "text-[#665a52] hover:bg-[#faf7f4] hover:text-[#30251f]"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={
                      active
                        ? "text-white"
                        : "text-[#9a8d84] group-hover:text-[#30251f]"
                    }
                  />

                  <span className="flex-1">{item.label}</span>

                  <ChevronRight
                    size={15}
                    className={`
                      transition-transform
                      ${
                        active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#eee7e1] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#756860] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Logout</span>
          </button>

          <p className="mt-4 px-3 text-[10px] text-[#b1a59d]">
            © {new Date().getFullYear()} 5digea
          </p>
        </div>
      </aside>
    </>
  );
}
