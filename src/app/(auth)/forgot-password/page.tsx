"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import Image from "next/image";

import { forgotPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError(t("auth.validation.invalidEmail"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });

      setSent(true);

      // Give the success state a moment to show, then move on to OTP entry.
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 900);
    } catch (err: unknown) {
      

      setError(
        getApiErrorMessage(
          err,
          t("auth.forgotPasswordPage.failed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf8f6] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-sm border border-[#e8e1dc] bg-white shadow-[0_24px_80px_rgba(48,37,31,0.08)] transition-all duration-500 hover:shadow-[0_32px_100px_rgba(48,37,31,0.15)] lg:min-h-170 lg:grid-cols-2">
          {/* Left Section */}
          <section className="relative hidden animate-slide-in-left overflow-hidden bg-[#30251f] lg:flex">
            <div className="absolute -left-32 -top-32 h-80 w-80 animate-pulse-slow rounded-full bg-white/4 blur-3xl" />

            <div
              className="absolute -bottom-32 -right-20 h-96 w-96 animate-pulse-slow rounded-full bg-[#9a8171]/10 blur-3xl"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
              <Link
                href="/"
                className="w-fit text-3xl font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:opacity-80"
              >
                5Digea
              </Link>

              <div className="max-w-lg">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#d8c8bc]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] rtl:tracking-normal text-[#d8c8bc]">
                    {t("auth.forgotPasswordPage.eyebrow")}
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
                  {t("auth.forgotPasswordPage.heroTitle")}
                </h2>

                <p
                  className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  {t("auth.forgotPasswordPage.heroText")}
                </p>
              </div>

              <p
                className="text-sm tracking-wide rtl:tracking-normal text-[#bdb1a8] animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                {t("auth.brand.tagline")}
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
            <div className="w-full max-w-107.5 text-center">
              {/* Logo */}
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:opacity-70"
              >
                <Image
                  src="/Logo.png"
                  alt="5digea"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Heading */}
              <div className="mb-9">
                <h1
                  className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] rtl:tracking-normal rtl:leading-snug text-[#30251f] sm:text-4xl animate-slide-up"
                  style={{ animationDelay: "0.05s" }}
                >
                  {t("auth.forgotPasswordPage.title")}
                </h1>

                <p
                  className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {t("auth.forgotPasswordPage.subtitle")}
                </p>
              </div>

              {sent ? (
                <div
                  role="status"
                  className="animate-fade-in rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <MailCheck size={22} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-emerald-700">
                    {t("auth.forgotPasswordPage.sentTitle")}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    {t("auth.forgotPasswordPage.sentMessage", { email })}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* Email */}
                  <div className="relative z-0 w-full animate-fade-in group">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder=" "
                      autoComplete="email"
                      disabled={loading}
                      aria-invalid={!!error}
                      className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${
                        error
                          ? "border-red-300 focus:border-red-500"
                          : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    />

                    <label
                      htmlFor="email"
                      className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] duration-300 transform transition-all ${
                        email
                          ? "-translate-y-6 scale-75"
                          : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${
                        error
                          ? "text-red-500 peer-focus:text-red-500"
                          : "peer-focus:text-[#9a8171]"
                      }`}
                    >
                      {t("auth.email")}
                    </label>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="animate-shake rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {loading ? (
                      <span className="relative flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        {t("auth.forgotPasswordPage.submitting")}
                      </span>
                    ) : (
                      <span className="relative">{t("auth.forgotPasswordPage.submit")}</span>
                    )}
                  </button>
                </form>
              )}

              {/* Back to login */}
              <div className="mt-7 flex justify-center">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#9a8171] transition-all duration-200 hover:gap-3 hover:text-[#30251f]"
                >
                  <ArrowLeft
                    size={15}
                    className="transition-transform duration-200 rtl:rotate-180 ltr:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
                  />
                  {t("auth.brand.backToSignIn")}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
