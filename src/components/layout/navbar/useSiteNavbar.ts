"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/features/categories/hooks/useCategories";

import { searchTargets } from "./navConfig";

/** All navbar state: menus, search, scroll hide/show and navigation helpers. */
export function useSiteNavbar() {
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
  const [showSearchTargets, setShowSearchTargets] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  // Premium chrome behaviour: the bar compacts and gains a soft shadow once
  // the page scrolls, and tucks itself away on the way down so it never
  // competes with the page — it reappears the moment the person scrolls
  // back up, the way most flagship product sites behave.
  const [scrolled, setScrolled] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const lastScrollY = useRef(0);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const activeCategories = categories.filter((c) => c.isActive);
  const canJoinAsVendor = !isAuthenticated || isUser;

  // Any open overlay pauses the auto-hide behaviour, so the bar never slides
  // away while someone is mid-interaction with it.
  const anyOverlayOpen =
    mobileOpen ||
    mobileSearchOpen ||
    mobileAccountOpen ||
    categoriesOpen ||
    menuOpen ||
    showSearchTargets;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      if (y < 96) {
        setHideOnScroll(false);
      } else if (y > lastScrollY.current + 6) {
        setHideOnScroll(true);
      } else if (y < lastScrollY.current - 6) {
        setHideOnScroll(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Close the desktop search targets dropdown on outside click.
  useEffect(() => {
    if (!showSearchTargets) return;

    const handleClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchTargets(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearchTargets]);

  // Close the mobile account dropdown (Roadmap / Profile / Security) on
  // outside click.
  useEffect(() => {
    if (!mobileAccountOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        mobileAccountRef.current &&
        !mobileAccountRef.current.contains(event.target as Node)
      ) {
        setMobileAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileAccountOpen]);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

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

  const openMobileDrawer = () => {
    setMobileSearchOpen(false);
    setMobileAccountOpen(false);
    setMobileOpen(true);
  };

  const goToCategory = (categoryId: string) => {
    router.push(`/vendors?categoryId=${categoryId}`);
    setCategoriesOpen(false);
    closeMobile();
  };

  // Jump to a search target (Vendors or Services) with the current query.
  const goToSearch = (href: string) => {
    const query = search.trim();
    router.push(query ? `${href}?search=${encodeURIComponent(query)}` : href);
    setShowSearchTargets(false);
    setMobileSearchOpen(false);
    closeMobile();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enter with no target chosen defaults to Vendors.
    goToSearch(searchTargets[0].href);
  };

  return {
    isAuthenticated,
    isAdmin,
    isVendor,
    isUser,
    user,
    role,
    logout,
    mobileOpen,
    setMobileOpen,
    menuOpen,
    setMenuOpen,
    categoriesOpen,
    setCategoriesOpen,
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
    search,
    setSearch,
    showSearchTargets,
    setShowSearchTargets,
    mobileSearchOpen,
    setMobileSearchOpen,
    mobileAccountOpen,
    setMobileAccountOpen,
    scrolled,
    hideOnScroll,
    categoriesRef,
    searchRef,
    mobileSearchInputRef,
    mobileAccountRef,
    isActive,
    activeCategories,
    canJoinAsVendor,
    anyOverlayOpen,
    closeMobile,
    openMobileDrawer,
    goToCategory,
    goToSearch,
    handleSearchSubmit,
  };
}

export type SiteNavbarState = ReturnType<typeof useSiteNavbar>;
