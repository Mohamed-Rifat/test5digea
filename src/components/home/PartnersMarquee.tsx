"use client";

import Link from "next/link";
import { Building2, ShieldCheck, Star } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import type { Vendor } from "@/types/vendor";

/**
 * "Our trusted partners": vendor portraits in gold-ringed circles gliding
 * right-to-left in an endless loop. Pauses on hover so a partner can be
 * clicked; stops for visitors who prefer reduced motion.
 */
export default function PartnersMarquee({ vendors }: { vendors: Vendor[] }) {
  const { t } = useLanguage();
  const partners = vendors.filter((v) => v.profileImageUrl);
  if (partners.length < 3) return null;

  // Repeat so one half is always wider than the screen, then double it
  // for a seamless -50% loop.
  const reps = Math.max(1, Math.ceil(14 / partners.length));
  const half = Array.from({ length: reps }, () => partners).flat();
  const track = [...half, ...half];
  const duration = Math.max(28, half.length * 3.2);

  return (
    <section
      aria-labelledby="partners-title"
      className="relative overflow-hidden bg-[#1f1613] py-16 text-white sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(226,183,119,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#e2b777]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#e2b777]/40 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b777]/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#ecc98f]">
          <ShieldCheck size={14} aria-hidden="true" />
          {t("home.partners.eyebrow")}
        </p>
        <h2 id="partners-title" className="mt-4 text-2xl font-bold sm:text-3xl">
          {t("home.partners.title")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
          {t("home.partners.description")}
        </p>
      </div>

      <div
        className="group/marquee relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        dir="ltr"
      >
        <ul
          className="flex w-max gap-6 py-3 motion-safe:animate-[partnersMarquee_var(--marquee-duration)_linear_infinite] group-hover/marquee:[animation-play-state:paused] sm:gap-10"
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          {track.map((vendor, i) => (
            <li key={`${vendor.id}-${i}`} aria-hidden={i >= half.length}>
              <Link
                href={`/vendors/${vendor.id}`}
                tabIndex={i >= half.length ? -1 : undefined}
                className="group/partner flex w-24 flex-col items-center gap-3 sm:w-28"
              >
                <span className="relative block rounded-full bg-linear-to-br from-[#f3d6a8] via-[#c9914f] to-[#8a5a2b] p-[2px] shadow-[0_10px_30px_-10px_rgba(226,183,119,0.55)] transition-transform duration-500 group-hover/partner:scale-110">
                  <span className="block h-20 w-20 overflow-hidden rounded-full border-2 border-[#1f1613] bg-[#2a1f1b] sm:h-24 sm:w-24">
                    {vendor.profileImageUrl ? (
                      <img
                        src={vendor.profileImageUrl}
                        alt={vendor.businessName}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover grayscale-[35%] transition duration-500 group-hover/partner:grayscale-0"
                      />
                    ) : (
                      <Building2 className="m-auto mt-7 text-[#e2b777]" size={24} />
                    )}
                  </span>
                  {(vendor.averageRating ?? 0) > 0 && (
                    <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-[#e7c089] px-1.5 py-0.5 text-[10px] font-bold text-[#2a1c16] shadow">
                      <Star size={9} fill="currentColor" strokeWidth={0} />
                      {vendor.averageRating?.toFixed(1)}
                    </span>
                  )}
                </span>
                <span className="line-clamp-1 max-w-full text-center text-xs font-semibold text-white/75 transition-colors group-hover/partner:text-[#ecc98f]">
                  {vendor.businessName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
