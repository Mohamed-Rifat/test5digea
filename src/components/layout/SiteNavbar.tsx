"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  Map,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { getHomePath } from "@/lib/auth-utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Vendors", href: "/vendors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isVendor, isUser, user, role, logout } =
    useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="relative z-40 border-b border-[#eee7e1] bg-[#f8f5ef]/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 lg:max-w-10/12 items-center justify-between px-4 sm:px-6 lg:px-8">
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
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
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

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4dbd0] text-[#30251f] lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#eee7e1] bg-[#f8f5ef] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-[#30251f] text-white"
                    : "text-[#5f544d] hover:bg-[#f0e9e0]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && isUser && (
              <>
                <Link
                  href="/favorites"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                >
                  Favorites
                </Link>
                <Link
                  href="/roadmap"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
                >
                  Wedding Roadmap
                </Link>
              </>
            )}

            {(isAdmin || isVendor) && (
              <Link
                href={getHomePath(role)}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#5f544d] hover:bg-[#f0e9e0]"
              >
                {isAdmin ? "Admin Dashboard" : "Vendor Dashboard"}
              </Link>
            )}

            <div className="mt-2 flex gap-2 border-t border-[#eee7e1] pt-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full border border-[#e4dbd0] px-4 py-2.5 text-center text-sm font-medium text-[#30251f]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full bg-[#30251f] px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex-1 rounded-full border border-[#f0d8d4] px-4 py-2.5 text-center text-sm font-medium text-[#b3453a]"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
