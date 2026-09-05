"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, X, UserRound, LogOut, Map, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, isAdmin, isVendor, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/vendor")) return null;

  const links = [
    { label: "Home", href: "/" },
    { label: "Vendors", href: "/vendors" },
    { label: "Services", href: "/services" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Favorites", href: "/favorites" },
  ];

  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <header className="sticky top-0 z-40 border-b border-[#eee5df] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/Logo.png" alt="5digea" className="w-[108px] object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-[#30251f] text-white"
                  : "text-[#675b54] hover:bg-[#faf7f4] hover:text-[#30251f]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/services" aria-label="Search services" className="rounded-xl border border-[#eee5df] p-2.5 text-[#756960] hover:bg-[#faf7f4]">
            <Search size={18} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link href={isAdmin ? "/admin" : isVendor ? "/vendor" : "/profile"} className="flex items-center gap-2 rounded-xl border border-[#eee5df] px-3 py-2 text-sm font-medium text-[#514740] hover:bg-[#faf7f4]">
                <UserRound size={17} />
                <span className="max-w-24 truncate">{user?.fullName || "Account"}</span>
              </Link>
              <button onClick={() => { logout(); router.push("/"); }} className="rounded-xl p-2.5 text-[#756960] hover:bg-red-50 hover:text-red-600" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#514740] hover:bg-[#faf7f4]">Sign in</Link>
              <Link href="/register" className="rounded-xl bg-[#30251f] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#463831]">Get started</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-xl border border-[#eee5df] p-2.5 text-[#514740] lg:hidden" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#eee5df] bg-white px-4 pb-5 pt-3 lg:hidden">
          <nav className="space-y-1">
            {links.map((link) => (
              <button key={link.href} onClick={() => go(link.href)} className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium text-[#514740] hover:bg-[#faf7f4]">
                {link.label}
              </button>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#eee5df] pt-3">
            {isAuthenticated ? (
              <button onClick={() => { logout(); go("/"); }} className="col-span-2 rounded-xl bg-[#30251f] px-4 py-3 text-sm font-medium text-white">Logout</button>
            ) : (
              <>
                <button onClick={() => go("/login")} className="rounded-xl border border-[#e3d9d1] px-4 py-3 text-sm font-medium text-[#514740]">Sign in</button>
                <button onClick={() => go("/register")} className="rounded-xl bg-[#30251f] px-4 py-3 text-sm font-medium text-white">Get started</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
