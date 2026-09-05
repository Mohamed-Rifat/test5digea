"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Heart,
    Home,
    MessageCircle,
    Search,
    Sparkles,
} from "lucide-react";

export default function NotFound() {
    return (
        <main className=" relative min-h-screen overflow-hidden bg-[#f8f5ef] px-4 py-4 text-[#30251f] sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[30%] h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(205,171,111,0.10)_0%,rgba(205,171,111,0.04)_35%,transparent_70%)]" />
                <div className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.12),transparent_65%)]" />
                <div className="absolute -bottom-40 -right-40 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.10),transparent_65%)]" />
                <div className="absolute left-1/2 top-[52%] h-px w-[90%] -translate-x-1/2 bg-[#b99a62]/10" />
                <div className="absolute -left-36 top-1/2 h-105 w-105 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -left-24 top-1/2 h-75 w-75 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -bottom-24 -right-24 h-90 w-90 rounded-full border border-[#b99a62]/10" />
                <span className="absolute left-[12%] top-[22%] h-2 w-4 rotate-45 rounded-full border border-[#b99a62]/30" />
                <span className="absolute right-[15%] top-[30%] h-2 w-4 -rotate-45 rounded-full border border-[#b99a62]/25" />
                <span className="absolute bottom-[22%] left-[18%] h-2 w-4 -rotate-12 rounded-full border border-[#b99a62]/25" />
                <span className="absolute bottom-[30%] right-[13%] h-2 w-4 rotate-12 rounded-full border border-[#b99a62]/25" />
            </div>

            <div className="pointer-events-none absolute inset-4 rounded-4xl border border-[#b99a62]/30 sm:inset-6 sm:rounded-[2.5rem]" />

            <div className="pointer-events-none absolute inset-5.5 rounded-[1.7rem] border border-[#b99a62]/10 sm:inset-7.5 sm:rounded-[2.2rem]" />

            <div className="pointer-events-none absolute left-4 top-4 h-14 w-14 border-l border-t border-[#b99a62]/50 sm:left-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 border-r border-t border-[#b99a62]/50 sm:right-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 left-4 h-14 w-14 border-b border-l border-[#b99a62]/50 sm:bottom-6 sm:left-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 right-4 h-14 w-14 border-b border-r border-[#b99a62]/50 sm:bottom-6 sm:right-6 sm:h-20 sm:w-20" />

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-full flex-col px-6 py-8 sm:min-h-[calc(100vh-6rem)] sm:px-12 sm:py-10 lg:px-16">

                {/* <div className=" mt-14 flex items-center justify-between">
                    <Link
                        href="/about"
                        className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8d7b67] transition-colors duration-300 hover:text-[#30251f] sm:text-sm"
                    >
                        <Sparkles className="h-3 w-3" />
                        <span>About</span>
                        <Sparkles className="h-3 w-3" />

                    </Link>

                    <div className="flex items-center gap-2 text-[#b99a62]">
                        <Sparkles className="h-3 w-3" />
                        <span className="h-1 w-1 rounded-full bg-[#b99a62]" />
                        <span className="h-1 w-1 rounded-full bg-[#b99a62]" />
                        <Sparkles className="h-3 w-3" />
                    </div>
                </div> */}

                <section className="flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-0">
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-12" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-[#9b8367] sm:text-[10px]">
                            Page Not Found
                        </span>

                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-12" />
                    </div>

                    <div className="relative mb-5 flex items-center justify-center">
                        <div className="pointer-events-none absolute -left-20 top-1/2 hidden -translate-y-1/2 sm:block lg:-left-28">
                            <svg
                                width="120"
                                height="110"
                                viewBox="0 0 120 110"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="opacity-70"
                            >
                                <path
                                    d="M112 85C84 73 62 52 43 20"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M62 52C57 37 45 31 35 31C42 42 52 48 62 52Z"
                                    fill="#B99A62"
                                    fillOpacity=".14"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M76 66C74 50 65 42 54 39C58 52 66 61 76 66Z"
                                    fill="#B99A62"
                                    fillOpacity=".10"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M45 25C39 14 30 10 21 12C26 21 34 25 45 25Z"
                                    fill="#B99A62"
                                    fillOpacity=".12"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>

                        <div className="pointer-events-none absolute -right-20 top-1/2 hidden -translate-y-1/2 rotate-180 sm:block lg:-right-28">
                            <svg
                                width="120"
                                height="110"
                                viewBox="0 0 120 110"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="opacity-70"
                            >
                                <path
                                    d="M112 85C84 73 62 52 43 20"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M62 52C57 37 45 31 35 31C42 42 52 48 62 52Z"
                                    fill="#B99A62"
                                    fillOpacity=".14"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M76 66C74 50 65 42 54 39C58 52 66 61 76 66Z"
                                    fill="#B99A62"
                                    fillOpacity=".10"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />

                                <path
                                    d="M45 25C39 14 30 10 21 12C26 21 34 25 45 25Z"
                                    fill="#B99A62"
                                    fillOpacity=".12"
                                    stroke="#B99A62"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>

                        <div className="flex items-center font-serif text-[clamp(7rem,23vw,15rem)] font-light leading-[0.72] tracking-[-0.09em] text-[#30251f]">
                            <span>4</span>
                            <span className="relative mx-[-0.02em] inline-flex h-[0.9em] w-[0.68em] items-center justify-center">
                                <span className="absolute inset-[5%] rounded-[50%] border border-[#b99a62]/70" />
                                <span className="absolute inset-[9%] rounded-[50%] border border-[#b99a62]/20" />
                                <span className="absolute inset-[16%] rounded-[50%] bg-[radial-gradient(circle,rgba(185,154,98,0.14),transparent_65%)]" />
                                <svg
                                    viewBox="0 0 70 110"
                                    className="absolute h-[68%] w-[48%] opacity-80"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M35 96C34 74 34 45 36 14"
                                        stroke="#B99A62"
                                        strokeWidth="1.2"
                                    />

                                    <path
                                        d="M35 68C24 58 15 57 9 61C18 68 27 70 35 68Z"
                                        fill="#B99A62"
                                        fillOpacity=".18"
                                        stroke="#B99A62"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M35 53C45 43 53 42 60 45C53 53 44 56 35 53Z"
                                        fill="#B99A62"
                                        fillOpacity=".18"
                                        stroke="#B99A62"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M35 38C27 30 20 28 14 31C19 38 27 41 35 38Z"
                                        fill="#B99A62"
                                        fillOpacity=".18"
                                        stroke="#B99A62"
                                        strokeWidth="1"
                                    />

                                    <path
                                        d="M36 27C43 20 49 19 55 22C50 28 43 30 36 27Z"
                                        fill="#B99A62"
                                        fillOpacity=".18"
                                        stroke="#B99A62"
                                        strokeWidth="1"
                                    />

                                    <circle
                                        cx="36"
                                        cy="12"
                                        r="2"
                                        fill="#B99A62"
                                    />
                                </svg>
                            </span>
                            <span>4</span>
                        </div>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="font-serif text-3xl font-light leading-[1.1] tracking-tight text-[#30251f] sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                            Oops! This Page Got{" "}
                            <span className="relative inline-block italic text-[#a47e43]">
                                Lost
                                <svg
                                    viewBox="0 0 170 18"
                                    className="absolute -bottom-3 left-0 w-full"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3 12C42 2 103 4 166 8"
                                        stroke="#B99A62"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#766d67] sm:text-base">
                            Looks like this page took a different path — just like a
                            couple finding their perfect match. Let&apos;s get you back
                            on track.
                        </p>
                    </div>
                    <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
                        <Link
                            href="/"
                            className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#c6a66f] bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(48,37,31,0.15)] transition-all duration-300 hover:bg-[#42332a] hover:shadow-[0_14px_35px_rgba(48,37,31,0.22)] sm:w-auto"
                        >
                            <Home className="h-4 w-4" />

                            <span>Go to Homepage</span>
                        </Link>

                        <Link
                            href="/services"
                            className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#b99a62]/50 bg-white/40 px-7 py-3.5 text-sm font-medium text-[#493b32] backdrop-blur-sm transition-all duration-300 hover:border-[#b99a62] hover:bg-white/80 sm:w-auto"
                        >
                            <Search className="h-4 w-4 text-[#a47e43]" />

                            <span>Browse Services</span>
                        </Link>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-5xl pb-2">
                    <div className="mb-5 flex items-center justify-center gap-4">
                        <span className="h-px flex-1 bg-[#b99a62]/20" />

                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]" />

                            <span className="text-[8px] font-medium uppercase tracking-[0.4em] text-[#9b8367] sm:text-[9px]">
                                You Might Be Looking For
                            </span>

                            <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]" />
                        </div>

                        <span className="h-px flex-1 bg-[#b99a62]/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 rounded-xl border border-[#b99a62]/20 bg-white/35 px-3 py-3 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a62]/45 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(80,60,40,0.07)] sm:px-4"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4] text-[#a47e43]">
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[#493b32]">
                                    Wedding Ideas
                                </p>

                                <p className="mt-0.5 hidden truncate text-[10px] text-[#978a80] sm:block">
                                    Inspiration &amp; tips
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/vendors"
                            className="group flex items-center gap-3 rounded-xl border border-[#b99a62]/20 bg-white/35 px-3 py-3 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a62]/45 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(80,60,40,0.07)] sm:px-4"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4] text-[#a47e43]">
                                <Heart className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[#493b32]">
                                    Find a Vendor
                                </p>

                                <p className="mt-0.5 hidden truncate text-[10px] text-[#978a80] sm:block">
                                    Photographers, planners & more
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/services"
                            className="group flex items-center gap-3 rounded-xl border border-[#b99a62]/20 bg-white/35 px-3 py-3 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a62]/45 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(80,60,40,0.07)] sm:px-4"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4] text-[#a47e43]">
                                <CalendarDays className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[#493b32]">
                                    Explore Services
                                </p>

                                <p className="mt-0.5 hidden truncate text-[10px] text-[#978a80] sm:block">
                                    Make your day special
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/contact"
                            className="group flex items-center gap-3 rounded-xl border border-[#b99a62]/20 bg-white/35 px-3 py-3 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a62]/45 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(80,60,40,0.07)] sm:px-4"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4] text-[#a47e43]">
                                <MessageCircle className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-[#493b32]">
                                    Contact Us
                                </p>

                                <p className="mt-0.5 hidden truncate text-[10px] text-[#978a80] sm:block">
                                    We&apos;re here to help
                                </p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}