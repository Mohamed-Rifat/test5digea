"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Map,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  User,
  Search,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getHomePath } from "@/lib/auth-utils";
import { useCategories } from "@/features/categories/hooks/useCategories";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Vendors", href: "/vendors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isVendor, isUser, user, role, logout } =
    useAuth();
  const { categories } = useCategories();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [search, setSearch] = useState("");

  const categoriesRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const activeCategories = categories.filter((c) => c.isActive);

  // Close the desktop categories dropdown on outside click.
  useEffect(() => {
    if (!categoriesOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoriesOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCategoriesOpen(false);
  };

  const goToCategory = (categoryId: string) => {
    router.push(`/vendors?categoryId=${categoryId}`);
    setCategoriesOpen(false);
    closeMobile();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/vendors?search=${encodeURIComponent(query)}` : "/vendors");
    closeMobile();
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-[#eee7e1] bg-[#f8f5ef]/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 lg:max-w-10/12 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/Logo.png"
            alt="5digea"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-serif text-lg font-medium text-[#30251f]">
            5digea
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-[#30251f] text-white"
                  : "text-[#5f544d] hover:bg-[#f0e9e0] hover:text-[#30251f]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* CATEGORIES (mega-menu) */}
          <div className="relative" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                categoriesOpen
                  ? "bg-[#f0e9e0] text-[#30251f]"
                  : "text-[#5f544d] hover:bg-[#f0e9e0] hover:text-[#30251f]"
              }`}
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute left-1/2 top-full z-30 mt-3 w-[min(90vw,720px)] -translate-x-1/2 rounded-2xl border border-[#eee7e1] bg-white p-4 shadow-[0_18px_40px_rgba(48,37,31,0.14)]">
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#a47e43]">
                  Browse by category
                </p>
                {activeCategories.length === 0 ? (
                  <p className="px-1 py-2 text-sm text-[#766d67]">
                    No categories available yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {activeCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => goToCategory(category.id)}
                        className="rounded-xl px-3 py-2 text-left text-sm text-[#5f544d] transition hover:bg-[#faf7f4] hover:text-[#30251f]"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-2 border-t border-[#f0e9e0] pt-2">
                  <Link
                    href="/vendors"
                    onClick={() => setCategoriesOpen(false)}
                    className="flex items-center gap-1 px-1 py-1 text-sm font-medium text-[#a47e43] hover:text-[#8a6836]"
                  >
                    View all vendors
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {/* SEARCH */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a89c92]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search…"
              className="w-40 rounded-full border border-[#e4dbd0] bg-white py-2 pl-9 pr-3 text-sm text-[#30251f] outline-none transition focus:w-56 focus:border-[#b99a62]"
            />
          </form>

          {isAuthenticated && isUser && (
            <>
              <Link
                href="/favorites"
                aria-label="Favorites"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#a47e43] ${
                  isActive("/favorites") ? "border-[#b99a62] text-[#a47e43]" : ""
                }`}
              >
                <Heart size={18} />
              </Link>

              <Link
                href="/roadmap"
                aria-label="Wedding Roadmap"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dbd0] text-[#5f544d] transition hover:border-[#b99a62] hover:text-[#a47e43] ${
                  isActive("/roadmap") ? "border-[#b99a62] text-[#a47e43]" : ""
                }`}
              >
                <Map size={18} />
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-[#5f544d] transition hover:text-[#30251f]"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-[#c6a66f] bg-[#30251f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#42332a]"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative pl-2">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-[#e4dbd0] py-1.5 pl-1.5 pr-3 text-sm font-medium text-[#30251f] transition hover:border-[#b99a62]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0e9e0] text-[#a47e43]">
                  <UserIcon size={16} />
                </span>
                <span className="max-w-27.5 truncate">
                  {user?.fullName || "Account"}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-[#eee7e1] bg-white py-2 shadow-[0_18px_40px_rgba(48,37,31,0.14)]">
                    {(isAdmin || isVendor) && (
                      <Link
                        href={getHomePath(role)}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5f544d] hover:bg-[#faf7f4] hover:text-[#30251f]"
                      >
                        <LayoutDashboard size={16} />
                        {isAdmin ? "Admin Dashboard" : "Vendor Dashboard"}
                      </Link>
                    )}

                    {isUser && (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5f544d] hover:bg-[#faf7f4] hover:text-[#30251f]"
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5f544d] hover:bg-[#faf7f4] hover:text-[#30251f]"
                        >
                          <Heart size={16} />
                          Favorites
                        </Link>
                        <Link
                          href="/roadmap"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5f544d] hover:bg-[#faf7f4] hover:text-[#30251f]"
                        >
                          <Map size={16} />
                          Wedding Roadmap
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 border-t border-[#f0e9e0] px-4 py-2.5 text-left text-sm text-[#b3453a] hover:bg-[#faf7f4]"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dbd0] text-[#30251f] lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>

    {/* MOBILE SIDE DRAWER (rendered outside <header> on purpose: the header
       uses backdrop-blur, and any ancestor with a filter/backdrop-filter/
       transform creates a new containing block for position:fixed children,
       which was squashing this drawer into the header's own box instead of
       the full viewport) */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
      >
        {/* backdrop */}
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* panel */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-[#f8f5ef] shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-[#eee7e1] px-4 py-4">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex items-center gap-2"
            >
              <Image
                src="/Logo.png"
                alt="5digea"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-serif text-base font-medium text-[#30251f]">
                5digea
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobile}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4dbd0] text-[#30251f]"
            >
              <X size={18} />
            </button>
          </div>

          {/* search */}
          <form onSubmit={handleSearchSubmit} className="border-b border-[#eee7e1] px-4 py-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a89c92]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search vendors…"
                className="w-full rounded-full border border-[#e4dbd0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#30251f] outline-none focus:border-[#b99a62]"
              />
            </div>
          </form>

          {/* scrollable content */}
          <div className="flex-1 overflow-y-auto px-2 py-3">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-[#30251f] text-white"
                      : "text-[#5f544d] hover:bg-[#f0e9e0]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-1 border-t border-[#eee7e1]" />

              {/* CATEGORIES accordion */}
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen((v) => !v)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  mobileCategoriesOpen ? "bg-[#f0e9e0] text-[#a47e43]" : "text-[#a47e43]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={16} />
                  Categories
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileCategoriesOpen && (
                <div className="ml-2 flex flex-col gap-0.5 border-l border-[#eee7e1] pl-3">
                  {activeCategories.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-[#766d67]">
                      No categories available yet.
                    </p>
                  ) : (
                    activeCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => goToCategory(category.id)}
                        className="rounded-lg px-3 py-2 text-left text-sm text-[#5f544d] hover:bg-[#f0e9e0] hover:text-[#30251f]"
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              )}

              <div className="my-1 border-t border-[#eee7e1]" />

              {isAuthenticated && isUser && (
                <>
                  <Link
                    href="/favorites"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                  >
                    <Heart size={16} />
                    Favorites
                  </Link>
                  <Link
                    href="/roadmap"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                  >
                    <Map size={16} />
                    Wedding Roadmap
                  </Link>
                </>
              )}

              {(isAdmin || isVendor) && (
                <Link
                  href={getHomePath(role)}
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                >
                  <LayoutDashboard size={16} />
                  {isAdmin ? "Admin Dashboard" : "Vendor Dashboard"}
                </Link>
              )}

              {isUser && (
                <Link
                  href="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                >
                  <User size={16} />
                  My Profile
                </Link>
              )}
            </nav>
          </div>

          {/* footer */}
          <div className="border-t border-[#eee7e1] bg-[#fafafa] p-4">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="flex-1 rounded-full border border-[#e4dbd0] px-4 py-2.5 text-center text-sm font-medium text-[#30251f]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
                  className="flex-1 rounded-full bg-[#30251f] px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-bold text-[#30251f]">
                    <UserIcon size={16} className="shrink-0 text-[#a47e43]" />
                    <span className="truncate">{user?.fullName || "Account"}</span>
                  </p>
                  <p className="text-xs text-[#766d67]">Signed in</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f6dedb] px-3 py-2 text-sm font-medium text-[#b3453a] hover:bg-[#f0d0cc]"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
