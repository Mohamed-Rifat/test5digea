"use client";

import { Menu, Search } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/notifications/NotificationBell";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-18 sm:h-20.5 items-center border-b border-[#eee5df] bg-white/90 px-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-[#eee5df] p-2.5 text-[#665951] hover:bg-[#faf7f4] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block">
            <p className="text-xs text-[#a09289]">Welcome back</p>
            <h2 className="text-sm font-semibold text-[#30251f]">Admin Dashboard</h2>
          </div>
        </div>

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

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell viewAllHref="/admin/notifications" />

          <div className="h-8 w-px bg-[#eee5df]" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-[#3c3029]">
                {user?.fullName || "Administrator"}
              </p>
              <p className="text-[11px] text-[#a09289]">Admin</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30251f] text-sm font-semibold text-white">
              {(user?.fullName || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
