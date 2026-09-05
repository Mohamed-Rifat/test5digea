"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import RoleGuard from "@/components/guards/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Tags,
  Store,
  BriefcaseBusiness,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Categories",
        href: "/admin/categories",
        icon: Tags,
      },
      {
        label: "Vendors",
        href: "/admin/vendors",
        icon: Store,
      },
      {
        label: "Services",
        href: "/admin/services",
        icon: BriefcaseBusiness,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div className="min-h-screen bg-[#faf8f6] text-[#30251f]">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-67.5 flex-col border-r border-[#eee5df] bg-white transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-20.5 items-center justify-between border-b border-[#f0e9e4] px-6">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3"
            >
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
              onClick={() => setSidebarOpen(false)}
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
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                          active
                            ? "bg-[#30251f] text-white shadow-sm"
                            : "text-[#756960] hover:bg-[#faf7f4] hover:text-[#30251f]"
                        }`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={active ? 2 : 1.8}
                          className={
                            active
                              ? "text-white"
                              : "text-[#a08e82] group-hover:text-[#30251f]"
                          }
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
              <p className="text-xs font-semibold text-[#55483f]">
                Admin Portal
              </p>

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

        {/* Main Area */}
        <div className="lg:pl-67.5">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20.5 items-center border-b border-[#eee5df] bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex w-full items-center justify-between gap-4">
              {/* Left */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-[#eee5df] p-2.5 text-[#665951] hover:bg-[#faf7f4] lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>

                <div className="hidden md:block">
                  <p className="text-xs text-[#a09289]">Welcome back</p>

                  <h2 className="text-sm font-semibold text-[#30251f]">
                    Admin Dashboard
                  </h2>
                </div>
              </div>

              {/* Search */}
              <div className="hidden max-w-md flex-1 md:block">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a39b]"
                  />

                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="h-11 w-full rounded-xl border border-[#eee5df] bg-[#faf8f6] pl-11 pr-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#b2a59d] focus:border-[#c8b4a6] focus:bg-white"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="relative rounded-xl border border-[#eee5df] p-2.5 text-[#766860] transition hover:bg-[#faf7f4]"
                  aria-label="Notifications"
                >
                  <Bell size={19} strokeWidth={1.8} />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a76a63]" />
                </button>

                <div className="h-8 w-px bg-[#eee5df]" />

                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-semibold text-[#3c3029]">
                      Administrator
                    </p>

                    <p className="text-[11px] text-[#a09289]">
                      Super Admin
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30251f] text-sm font-semibold text-white">
                    A
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-82px)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}