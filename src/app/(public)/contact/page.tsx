"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Sparkles,
} from "lucide-react";

export default function ContactPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f8f5ef] px-4 py-4 text-[#30251f] sm:px-6 sm:py-6">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[25%] h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(205,171,111,0.12)_0%,rgba(205,171,111,0.04)_35%,transparent_70%)]" />
                <div className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.12),transparent_65%)]" />
                <div className="absolute -bottom-40 -right-40 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(183,154,103,0.10),transparent_65%)]" />
                <div className="absolute left-1/2 top-[50%] h-px w-[90%] -translate-x-1/2 bg-[#b99a62]/10" />
                <div className="absolute -left-36 top-1/2 h-105 w-105 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -left-24 top-1/2 h-75 w-75 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full border border-[#b99a62]/10" />
                <div className="absolute -bottom-24 -right-24 h-90 w-90 rounded-full border border-[#b99a62]/10" />
                <span className="absolute left-[13%] top-[22%] h-2 w-4 rotate-45 rounded-full border border-[#b99a62]/30" />
                <span className="absolute right-[14%] top-[30%] h-2 w-4 -rotate-45 rounded-full border border-[#b99a62]/25" />
                <span className="absolute bottom-[24%] left-[17%] h-2 w-4 -rotate-12 rounded-full border border-[#b99a62]/25" />
                <span className="absolute bottom-[28%] right-[12%] h-2 w-4 rotate-12 rounded-full border border-[#b99a62]/25" />
            </div>

            <div className="pointer-events-none absolute inset-4 rounded-4xl border border-[#b99a62]/30 sm:inset-6 sm:rounded-[2.5rem]" />

            <div className="pointer-events-none absolute inset-5.5 rounded-[1.7rem] border border-[#b99a62]/10 sm:inset-7.5 sm:rounded-[2.2rem]" />

            <div className="pointer-events-none absolute left-4 top-4 h-14 w-14 border-l border-t border-[#b99a62]/50 sm:left-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 border-r border-t border-[#b99a62]/50 sm:right-6 sm:top-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 left-4 h-14 w-14 border-b border-l border-[#b99a62]/50 sm:bottom-6 sm:left-6 sm:h-20 sm:w-20" />

            <div className="pointer-events-none absolute bottom-4 right-4 h-14 w-14 border-b border-r border-[#b99a62]/50 sm:bottom-6 sm:right-6 sm:h-20 sm:w-20" />

            <div className="relative z-10 mx-auto px-6 py-10 sm:px-12 sm:py-12 lg:px-16">

                <section className="mx-auto max-w-8/12 pb-16 pt-24 text-center sm:pb-20 sm:pt-28">
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-14" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.45em] text-[#9b8367] sm:text-[10px]">
                            We&apos;d Love To Hear From You
                        </span>

                        <span className="h-px w-8 bg-[#b99a62]/50 sm:w-14" />
                    </div>

                    <h1 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-[#30251f] sm:text-6xl lg:text-[5rem]">
                        Let&apos;s Start a
                        <span className="relative mx-2 inline-block italic text-[#a47e43] sm:mx-3">
                            Conversation
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
                    </h1>

                    <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#766d67] sm:text-base">
                        Have a question, need some help, or simply want to
                        learn more about 5digea? We&apos;re here and happy
                        to help.
                    </p>
                </section>

                <section className="mx-auto max-w-10/12 pb-20">
                    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

                        <div className="space-y-4">
                            <div className="rounded-md border border-[#b99a62]/20 bg-white/40 p-7 backdrop-blur-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                    <Mail className="h-4 w-4 text-[#a47e43]" />
                                </div>

                                <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8367]">
                                    Email
                                </p>

                                <h2 className="mt-2 font-serif text-xl font-light text-[#30251f]">
                                    hello@5digea.com
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-[#766d67]">
                                    Send us an email and our team will
                                    get back to you.
                                </p>
                            </div>

                            <div className="rounded-md border border-[#b99a62]/20 bg-white/40 p-7 backdrop-blur-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                    <Phone className="h-4 w-4 text-[#a47e43]" />
                                </div>

                                <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8367]">
                                    Phone
                                </p>

                                <h2 className="mt-2 font-serif text-xl font-light text-[#30251f]">
                                    +20 100 000 0000
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-[#766d67]">
                                    Prefer a conversation? We&apos;re
                                    happy to hear from you.
                                </p>
                            </div>

                            <div className="rounded-md border border-[#b99a62]/20 bg-white/40 p-7 backdrop-blur-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b99a62]/30 bg-[#f8f1e4]">
                                    <Clock3 className="h-4 w-4 text-[#a47e43]" />
                                </div>

                                <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8367]">
                                    Availability
                                </p>

                                <h2 className="mt-2 font-serif text-xl font-light text-[#30251f]">
                                    Saturday — Thursday
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-[#766d67]">
                                    10:00 AM — 6:00 PM
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xs border border-[#b99a62]/25 bg-white/45 p-6 shadow-[0_15px_50px_rgba(80,60,40,0.05)] backdrop-blur-sm sm:p-9">
                            <div className="mb-8">
                                <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#9b8367]">
                                    Send a Message
                                </p>

                                <h2 className="mt-2 font-serif text-3xl font-light text-[#30251f]">
                                    How can we help?
                                </h2>
                            </div>

                            <form className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-xs font-medium text-[#493b32]"
                                        >
                                            Your Name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Mohamed Refaat"
                                            className="w-full rounded-2xl border border-[#b99a62]/20 bg-white/50 px-4 py-3.5 text-sm text-[#30251f] outline-none transition-all duration-300 placeholder:text-[#a69a91] focus:border-[#b99a62]/60 focus:bg-white/80 focus:ring-2 focus:ring-[#b99a62]/10"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-xs font-medium text-[#493b32]"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full rounded-2xl border border-[#b99a62]/20 bg-white/50 px-4 py-3.5 text-sm text-[#30251f] outline-none transition-all duration-300 placeholder:text-[#a69a91] focus:border-[#b99a62]/60 focus:bg-white/80 focus:ring-2 focus:ring-[#b99a62]/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-xs font-medium text-[#493b32]"
                                    >
                                        Subject
                                    </label>

                                    <input
                                        id="subject"
                                        type="text"
                                        placeholder="How can we help?"
                                        className="w-full rounded-2xl border border-[#b99a62]/20 bg-white/50 px-4 py-3.5 text-sm text-[#30251f] outline-none transition-all duration-300 placeholder:text-[#a69a91] focus:border-[#b99a62]/60 focus:bg-white/80 focus:ring-2 focus:ring-[#b99a62]/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-xs font-medium text-[#493b32]"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        rows={6}
                                        placeholder="Tell us a little about what you need..."
                                        className="w-full resize-none rounded-2xl border border-[#b99a62]/20 bg-white/50 px-4 py-3.5 text-sm text-[#30251f] outline-none transition-all duration-300 placeholder:text-[#a69a91] focus:border-[#b99a62]/60 focus:bg-white/80 focus:ring-2 focus:ring-[#b99a62]/10"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#c6a66f] bg-[#30251f] px-7 py-4 text-sm font-medium text-white shadow-[0_8px_30px_rgba(48,37,31,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#42332a] hover:shadow-[0_14px_35px_rgba(48,37,31,0.20)]"
                                >
                                    <MessageCircle className="h-4 w-4" />

                                    Send Message

                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-10/12 pb-8 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px flex-1 bg-[#b99a62]/20" />

                        <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-[#b99a62]" />

                            <span className="text-[8px] font-medium uppercase tracking-[0.4em] text-[#9b8367] sm:text-[9px]">
                                Making Every Connection Meaningful
                            </span>

                            <MapPin className="h-3 w-3 text-[#b99a62]" />
                        </div>

                        <span className="h-px flex-1 bg-[#b99a62]/20" />
                    </div>
                </section>
            </div>
        </main>
    );
}