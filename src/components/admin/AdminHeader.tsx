"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, Store, Tags, BriefcaseBusiness, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/notifications/NotificationBell";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

// Where the quick search in the header can jump to. Each admin list page
// reads the `q` param on mount and seeds its own local search with it.
const searchTargets = [
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
  { label: "Categories", href: "/admin/categories", icon: Tags },
];

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [showTargets, setShowTargets] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showTargets) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowTargets(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTargets]);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const goTo = (href: string) => {
    const trimmed = query.trim();

    router.push(trimmed ? `${href}?q=${encodeURIComponent(trimmed)}` : href);

    setShowTargets(false);
    setMobileSearchOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Enter with no target chosen defaults to Vendors, the most common
    // place an admin is looking for a match.
    goTo(searchTargets[0].href);
  };

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

        {/* Desktop search */}

        <div
          ref={desktopSearchRef}
          className="relative hidden max-w-md flex-1 md:block"
        >
          <form onSubmit={handleSubmit} className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b0a39b]"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowTargets(true);
              }}
              onFocus={() => setShowTargets(true)}
              placeholder="Search vendors, services, categories..."
              className="h-11 w-full rounded-xl border border-[#eee5df] bg-[#faf8f6] pl-11 pr-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#b2a59d] focus:border-[#c8b4a6] focus:bg-white"
            />
          </form>

          {showTargets && (
            <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-xl border border-[#eee5df] bg-white p-1.5 shadow-xl">
              {searchTargets.map((target) => {
                const Icon = target.icon;

                return (
                  <button
                    key={target.href}
                    type="button"
                    onClick={() => goTo(target.href)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-[#4f4540] transition hover:bg-[#f5f1ee]"
                  >
                    <Icon size={15} className="text-[#a08e82]" />
                    {query.trim() ? (
                      <span>
                        Search <span className="font-semibold">{target.label}</span>{" "}
                        for &ldquo;{query.trim()}&rdquo;
                      </span>
                    ) : (
                      <span>Browse {target.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}

          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee5df] text-[#665951] hover:bg-[#faf7f4] md:hidden"
            aria-label="Search"
            aria-expanded={mobileSearchOpen}
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

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

      {/* Mobile search panel */}

      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-[#eee5df] bg-white p-3 shadow-lg md:hidden">
          <form onSubmit={handleSubmit} className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a39b]"
            />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vendors, services..."
              className="h-11 w-full rounded-xl border border-[#eee5df] bg-[#faf8f6] pl-10 pr-4 text-sm text-[#30251f] outline-none transition placeholder:text-[#b2a59d] focus:border-[#c8b4a6] focus:bg-white"
            />
          </form>

          <div className="mt-2 space-y-1">
            {searchTargets.map((target) => {
              const Icon = target.icon;

              return (
                <button
                  key={target.href}
                  type="button"
                  onClick={() => goTo(target.href)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-[#4f4540] transition hover:bg-[#f5f1ee]"
                >
                  <Icon size={15} className="text-[#a08e82]" />
                  {query.trim() ? (
                    <span>
                      Search <span className="font-semibold">{target.label}</span>
                    </span>
                  ) : (
                    <span>Browse {target.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
