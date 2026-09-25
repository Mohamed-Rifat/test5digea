"use client";

import Link from "next/link";
import Image from "next/image";

/** Logo + "5Digea / Wedding Marketplace" wordmark. */
export function NavBrand({ scrolled }: { scrolled: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="relative flex shrink-0 items-center justify-center rounded-full ring-1 ring-[#e7d9c2] transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/Logo.png"
          alt="5digea"
          width={36}
          height={36}
          className={`rounded-full transition-all duration-300 ${scrolled ? "h-8 w-8" : "h-9 w-9"}`}
        />
      </span>
      <span className="hidden flex-col leading-none 2xl:flex">
        <span className="font-serif text-lg font-medium tracking-tight text-[#30251f]">
          5Digea
        </span>
        <span
          lang="en"
          className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a47e43]"
        >
          Wedding Marketplace
        </span>
      </span>
    </Link>
  );
}
