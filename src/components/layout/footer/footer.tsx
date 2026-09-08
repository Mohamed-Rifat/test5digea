"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, } from "react-icons/fa";
import Image from "next/image";

const footerLinks = {
    explore: [
        { label: "Services", href: "/services" },
        { label: "Vendors", href: "/vendors" },
        { label: "Categories", href: "/categories" },
        { label: "Search", href: "/search" },
    ],

    company: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Our Journey", href: "/journey" },
    ],

    support: [
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
    ],

    information: [
        { label: "test", href: "/help" },
        { label: "test", href: "/privacy" },
        { label: "test", href: "/terms" },
    ],
};

const socialLinks = [
    {
        label: "Instagram",
        href: "#",
        icon: FaInstagram,
    },
    {
        label: "Facebook",
        href: "#",
        icon: FaFacebookF,
    },
    {
        label: "TikTok",
        href: "#",
        icon: FaTiktok,
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#30251f] text-white">
            {/* =========================================================
          BACKGROUND DETAILS
      ========================================================= */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#cdb9aa]/5 blur-3xl" />

                <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#cdb9aa]/5 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full 2xl:max-w-10/12 px-5 sm:px-8 lg:px-10 xl:px-12">
                {/* =======================================================
            MAIN FOOTER CONTENT
        ======================================================= */}
                <div className="grid gap-12 py-14 sm:gap-14 sm:py-16 lg:grid-cols-[minmax(260px,1.15fr)_2fr] lg:gap-16 lg:pt-12 lg:pb-6 xl:gap-24">
                    {/* =====================================================
              BRAND
          ===================================================== */}
                    <div className="max-w-md">
                        <Link
                            href="/"
                            className="group inline-flex items-center"
                        >
                            <Image
                                src="/Logo.png"
                                alt="5digea"
                                width={80}
                                height={80}
                                className="object-contain"
                                priority
                            />
                            <span className="text-[30px] font-semibold leading-none tracking-[-0.06em] text-white transition-opacity duration-300 group-hover:opacity-80">
                                5digea
                                <span className="text-[#cdb9aa]">.</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-90 text-[13px] leading-6 text-white/45 sm:text-sm sm:leading-7">
                            Your trusted destination for discovering the people,
                            places, and services that make every celebration
                            unforgettable.
                        </p>

                        {/* Contact */}
                        <div className="mt-6 space-y-3">
                            <a
                                href="mailto:hello@5digea.com"
                                className="group flex w-fit items-center gap-3 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                                    <Mail className="h-3.5 w-3.5" />
                                </span>

                                <span>hello@5digea.com</span>
                            </a>

                            <a
                                href="tel:+2001222800121"
                                className="group flex w-fit items-center gap-3 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                                    <Phone className="h-3.5 w-3.5" />
                                </span>

                                <span>+2001222800121</span>
                            </a>

                            <div className="flex items-center gap-3 text-[13px] text-white/45 sm:text-sm">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3">
                                    <MapPin className="h-3.5 w-3.5" />
                                </span>

                                <span>Egypt</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-10 lg:pt-8 ">
                        {/* Explore */}
                        <FooterColumn
                            title="Explore"
                            links={footerLinks.explore}
                        />

                        {/* Company */}
                        <FooterColumn
                            title="Company"
                            links={footerLinks.company}
                        />

                        {/* Support */}
                        <FooterColumn
                            title="Support"
                            links={footerLinks.support}
                        />
                         {/* Support */}
                        <FooterColumn
                            title="information"
                            links={footerLinks.information}
                        />
                    </div>
                </div>

                {/* =======================================================
            DIVIDER
        ======================================================= */}
                <div className="h-px w-full bg-white/10" />

                {/* =======================================================
    FOOTER BOTTOM
======================================================= */}
                <div className="flex items-center justify-between gap-4 py-6 sm:py-7">
                    {/* Copyright */}
                    <p className="text-[14px] leading-5 text-white/30 sm:text-xs">
                        © {new Date().getFullYear()} 5digea. All rights reserved.
                    </p>

                    {/* Social */}
                    <div className="flex shrink-0 items-center gap-2">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white sm:h-9 sm:w-9"
                                >
                                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ===============================================================
   FOOTER COLUMN
================================================================ */

interface FooterColumnProps {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
}

function FooterColumn({
    title,
    links,
}: FooterColumnProps) {
    return (
        <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cdb9aa] sm:text-[11px]">
                {title}
            </h3>

            <ul className="space-y-3.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center gap-1.5 text-[13px] text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
                        >
                            <span>{link.label}</span>

                            <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-60" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
