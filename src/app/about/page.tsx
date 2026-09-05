"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Heart,
    Search,
    Sparkles,
    Store,
} from "lucide-react";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f8f5ef] px-4 py-4 text-[#30251f] sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[18%] h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(205,171,111,0.12)_0%,rgba(205,171,111,0.04)_35%,transparent_70%)]" />

                <div className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.12),transparent_65%)]" />

                <div className="absolute -bottom-40 -right-40 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.10),transparent_65%)]" />

                <div className="absolute left-1/2 top-[48%] h-px w-[90%] -translate-x-1/2 bg-[#b99a62]/10" />

                <div className="absolute -left-36 top-1/2 h-105 w-105 rounded-full border border-[#b99a62]/10" />

                <div className="absolute -left-24 top-1/2 h-75 w-75 rounded-full border border-[#b99a62]/10" />

                <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full border border-[#b99a62]/10" />

                <div className="absolute -bottom-24 -right-24 h-90 w-90 rounded-full border border-[#b99a62]/10" />

                <span className="absolute left-[12%] top-[20%] h-2 w-4 rotate-45 rounded-full border border-[#b99a62]/30" />

                <span className="absolute right-[15%] top-[26%] h-2 w-4 -rotate-45 rounded-full border border-[#b99a62]/25" />

                <span className="absolute bottom-[20%] left-[18%] h-2 w-4 -rotate-12 rounded-full border border-[#b99a62]/25" />

                <span className="absolute bottom-[28%] right-[13%] h-2 w-4 rotate-12 rounded-full border border-[#b99a62]/25" />
            </div>

            <div className="pointer-events-none absolute inset-4 rounded-4xl border border-[#b99a62]/30 sm:inset-6 sm:rounded-[2.5rem]" />

            <div className="pointer-events-none absolute inset-5.5 rounded-[1.7rem] border border-[#b99a62]/10 sm:inset-7.5 sm:rounded-[2.2rem]" />

            <div className="pointer-events-none absolute left-4 top-4 h-14 w-14 border-l border-t border-[#b99a62]/50 sm:left-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 border-r border-t border-[#b99a62]/50 sm:right-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 left-4 h-14 w-14 border-b border-l border-[#b99a62]/50 sm:bottom-6 sm:left-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 right-4 h-14 w-14 border-b border-r border-[#b99a62]/50 sm:bottom-6 sm:right-6 sm:h-20 sm:w-20" />

            <div className="relative z-10 mx-auto max-w-85% px-6 py-10 sm:px-12 sm:py-12 lg:px-16">

                <section className="mx-auto flex flex-col items-center pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-14" />

                        <div className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-[#b99a62]" />

                            <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-[#9b8367] sm:text-[10px]">
                                Our Story
                            </span>

                            <Sparkles className="h-3 w-3 text-[#b99a62]" />
                        </div>

                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-14" />
                    </div>

                    <h1 className="max-w-4xl font-serif text-4xl font-light leading-[1.05] tracking-tight text-[#30251f] sm:text-6xl lg:text-[5.2rem]">
                        Where Every
                        <span className="relative mx-2 inline-block italic text-[#a47e43] sm:mx-3">
                            Love Story
                            <svg
                                viewBox="0 0 250 18"
                                className="absolute -bottom-3 left-0 w-full"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 12C65 2 157 4 247 8"
                                    stroke="#B99A62"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                        <br />
                        Deserves a Perfect Beginning.
                    </h1>

                    <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#766d67] sm:text-base">
                        5digea is a wedding marketplace created to make
                        discovering the right people, places, and services
                        for your special day feel effortless, beautiful,
                        and truly personal.
                    </p>

                    <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                        <Link
                            href="/services"
                            className="group inline-flex items-center gap-3 rounded-full border border-[#c6a66f] bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(48,37,31,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#42332a] hover:shadow-[0_14px_35px_rgba(48,37,31,0.22)]"
                        >
                            <Search className="h-4 w-4" />
                            Explore Services
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 rounded-full border border-[#b99a62]/40 bg-white/40 px-7 py-3.5 text-sm font-medium text-[#493b32] backdrop-blur-sm transition-all duration-300 hover:border-[#b99a62] hover:bg-white/80"
                        >
                            Talk to Us
                        </Link>
                    </div>
                </section>

                <section className="mx-auto max-w-10/12 pb-20 sm:pb-28">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative overflow-hidden rounded-md border border-[#b99a62]/20 bg-white/45 p-7 backdrop-blur-sm sm:p-10">
                            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[#b99a62]/10" />

                            <div className="relative">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                    <Heart className="h-5 w-5 text-[#a47e43]" />
                                </div>

                                <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.4em] text-[#9b8367]">
                                    Our Mission
                                </p>

                                <h2 className="max-w-xl font-serif text-3xl font-light leading-tight text-[#30251f] sm:text-4xl">
                                    Turning wedding planning into a
                                    <span className="italic text-[#a47e43]">
                                        {" "}beautiful journey.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-xl text-sm leading-7 text-[#766d67]">
                                    We believe finding wedding services
                                    should feel exciting rather than
                                    overwhelming. 5digea brings trusted
                                    vendors and couples together in one
                                    elegant, simple experience.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-md border border-[#b99a62]/20 bg-white/35 p-7 backdrop-blur-sm">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                        <Search className="h-4 w-4 text-[#a47e43]" />
                                    </div>

                                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#493b32]">
                                        Discover
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-[#766d67]">
                                    Explore wedding services and discover
                                    options that match your vision.
                                </p>
                            </div>

                            <div className="rounded-md border border-[#b99a62]/20 bg-white/35 p-7 backdrop-blur-sm">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                        <Store className="h-4 w-4 text-[#a47e43]" />
                                    </div>

                                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#493b32]">
                                        Connect
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-[#766d67]">
                                    Connect couples with talented vendors
                                    who can bring their dreams to life.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-10/12 pb-20 sm:pb-28">
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <span className="h-px flex-1 bg-[#b99a62]/20" />

                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]" />

                            <span className="text-[8px] font-medium uppercase tracking-[0.4em] text-[#9b8367] sm:text-[9px]">
                                What We Believe
                            </span>

                            <span className="h-1.5 w-1.5 rotate-45 border border-[#b99a62]" />
                        </div>

                        <span className="h-px flex-1 bg-[#b99a62]/20" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                number: "01",
                                title: "Meaningful",
                                text: "Every wedding is different. Your choices should feel like yours.",
                            },
                            {
                                number: "02",
                                title: "Beautiful",
                                text: "We believe the planning experience should be as beautiful as the day itself.",
                            },
                            {
                                number: "03",
                                title: "Trusted",
                                text: "We aim to make discovering the right wedding professionals easier and clearer.",
                            },
                        ].map((item) => (
                            <div
                                key={item.number}
                                className="group rounded-sm border border-[#b99a62]/20 bg-white/35 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a62]/40 hover:bg-white/60 hover:shadow-[0_15px_40px_rgba(80,60,40,0.06)]"
                            >
                                <span className="font-serif text-3xl font-light text-[#b99a62]/70">
                                    {item.number}
                                </span>

                                <h3 className="mt-5 font-serif text-2xl font-light text-[#30251f]">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-[#766d67]">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto  pb-8 text-center">
                    <div className=" px-6 py-12 backdrop-blur-sm sm:px-12 sm:py-16">
                        <Sparkles className="mx-auto h-5 w-5 text-[#b99a62]" />

                        <h2 className="mt-5 font-serif text-3xl font-light text-[#30251f] sm:text-4xl">
                            Let&apos;s make your day
                            <span className="italic text-[#a47e43]">
                                {" "}unforgettable.
                            </span>
                        </h2>

                        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#766d67]">
                            Start exploring the people and services that
                            will help turn your wedding vision into reality.
                        </p>

                        <Link
                            href="/services"
                            className="mt-7 inline-flex items-center gap-3 rounded-sm bg-[#30251f] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#42332a] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)]"
                        >
                            Begin Your Journey
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}