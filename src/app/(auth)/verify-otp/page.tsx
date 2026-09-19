"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

import { forgotPassword, verifyOtp } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeDigits } from "@/lib/i18n";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

function VerifyOtpForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const otp = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = normalizeDigits(value).replace(/\D/g, "");

    if (!sanitized) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];

    const chars = sanitized.split("");
    chars.forEach((char, offset) => {
      if (index + offset < OTP_LENGTH) {
        next[index + offset] = char;
      }
    });

    setDigits(next);

    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (error) setError("");
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError(t("auth.verifyOtpPage.missingEmail"));
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      setError(t("auth.verifyOtpPage.enterCode", { length: OTP_LENGTH }));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email, otp });

      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(
          otp
        )}`
      );
    } catch (err: unknown) {
      console.error("OTP verification failed:", err);

      setError(
        getApiErrorMessage(
          err,
          t("auth.verifyOtpPage.invalidCode")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || resending) return;

    setResending(true);
    setError("");

    try {
      await forgotPassword({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      console.error("Resending OTP failed:", err);

      setError(
        getApiErrorMessage(err, t("auth.verifyOtpPage.resendFailed"))
      );
    } finally {
      setResending(false);
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
                    {t("auth.verifyOtpPage.eyebrow")}
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
                  {t("auth.verifyOtpPage.heroTitle")}
                </h2>

                <p
                  className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  {t("auth.verifyOtpPage.heroText")}
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#faf5ee] text-[#a47e43]">
                  <ShieldCheck size={22} />
                </div>

                <h1
                  className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] rtl:tracking-normal rtl:leading-snug text-[#30251f] sm:text-4xl animate-slide-up"
                  style={{ animationDelay: "0.05s" }}
                >
                  {t("auth.verifyOtpPage.title")}
                </h1>

                <p
                  className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {email ? (
                    <>
                      {t("auth.verifyOtpPage.sentToPrefix", { length: OTP_LENGTH })}{" "}
                      <bdi className="font-semibold text-[#30251f]">
                        {email}
                      </bdi>
                      .
                    </>
                  ) : (
                    t("auth.verifyOtpPage.noEmail")
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* OTP boxes */}
                <div
                  dir="ltr"
                  className="flex justify-center gap-2 animate-fade-in sm:gap-3"
                  style={{ animationDelay: "0.15s" }}
                >
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={OTP_LENGTH}
                      value={digit}
                      onChange={(event) =>
                        handleDigitChange(index, event.target.value)
                      }
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      disabled={loading}
                      aria-label={t("auth.verifyOtpPage.digitLabel", { number: index + 1 })}
                      aria-invalid={!!error}
                      className={`h-13 w-11 rounded-xl border-2 bg-transparent text-center text-lg font-semibold text-[#30251f] outline-none transition-all duration-200 sm:h-14 sm:w-12 ${
                        error
                          ? "border-red-300 focus:border-red-500"
                          : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    />
                  ))}
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
                  disabled={loading || !email}
                  className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {t("auth.verifyOtpPage.submitting")}
                    </span>
                  ) : (
                    <span className="relative">{t("auth.verifyOtpPage.submit")}</span>
                  )}
                </button>
              </form>

              {/* Resend */}
              <p className="mt-6 text-center text-sm text-[#7b7069]">
                {t("auth.verifyOtpPage.didntGetCode")}{" "}
                {cooldown > 0 ? (
                  <span className="font-semibold text-[#a59a92]">
                    {t("auth.verifyOtpPage.resendIn", { seconds: cooldown })}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || !email}
                    className="font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending ? t("auth.verifyOtpPage.resending") : t("auth.verifyOtpPage.resend")}
                  </button>
                )}
              </p>

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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
