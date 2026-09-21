"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";

import { resetPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const evaluatePasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);

    const fulfilled = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength((fulfilled / 5) * 100);
  };

  const getStrengthInfo = (strength: number) => {
    if (strength === 0) return { color: "bg-gray-200", text: "", width: "0%" };
    if (strength <= 20)
      return { color: "bg-red-500", text: t("auth.passwordStrength.weak"), width: "20%" };
    if (strength <= 40)
      return { color: "bg-orange-500", text: t("auth.passwordStrength.fair"), width: "40%" };
    if (strength <= 60)
      return { color: "bg-yellow-500", text: t("auth.passwordStrength.good"), width: "60%" };
    if (strength <= 80)
      return { color: "bg-blue-500", text: t("auth.passwordStrength.strong"), width: "80%" };
    return { color: "bg-emerald-500", text: t("auth.passwordStrength.veryStrong"), width: "100%" };
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    evaluatePasswordStrength(value);
    if (error) setError("");
  };

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !otp) {
      setError(t("auth.resetPasswordPage.linkInvalid"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("auth.validation.passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.validation.passwordMismatch"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword({ email, otp, newPassword });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login?reset=success");
      }, 1200);
    } catch (err: unknown) {
      

      setError(
        getApiErrorMessage(
          err,
          t("auth.resetPasswordPage.failed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const linkInvalid = !email || !otp;

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
                    {t("auth.resetPasswordPage.eyebrow")}
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
                  {t("auth.resetPasswordPage.heroTitle")}
                </h2>

                <p
                  className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  {t("auth.resetPasswordPage.heroText")}
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
                  {t("auth.resetPasswordPage.title")}
                </h1>

                <p
                  className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {t("auth.resetPasswordPage.subtitle")}
                </p>
              </div>

              {success ? (
                <div
                  role="status"
                  className="animate-fade-in rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle size={22} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-emerald-700">
                    {t("auth.resetPasswordPage.successTitle")}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    {t("auth.resetPasswordPage.successMessage")}
                  </p>
                </div>
              ) : linkInvalid ? (
                <div className="animate-fade-in rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
                  <p className="text-sm font-semibold text-red-700">
                    {t("auth.resetPasswordPage.linkInvalid")}
                  </p>

                  <Link
                    href="/forgot-password"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#30251f] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#43352d]"
                  >
                    {t("auth.resetPasswordPage.requestNewCode")}
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* New password */}
                  <div className="relative z-0 w-full animate-fade-in group">
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) =>
                          handlePasswordChange(event.target.value)
                        }
                        placeholder=" "
                        autoComplete="new-password"
                        disabled={loading}
                        aria-invalid={!!error}
                        className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pe-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${
                          error
                            ? "border-red-300 focus:border-red-500"
                            : newPassword.length > 0 && passwordStrength > 0
                              ? passwordStrength >= 60
                                ? "border-emerald-400 focus:border-emerald-500"
                                : passwordStrength >= 40
                                  ? "border-yellow-400 focus:border-yellow-500"
                                  : "border-red-300 focus:border-red-500"
                              : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      />

                      <label
                        htmlFor="newPassword"
                        className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] duration-300 transform transition-all ${
                          newPassword
                            ? "-translate-y-6 scale-75"
                            : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${
                          error
                            ? "text-red-500 peer-focus:text-red-500"
                            : "peer-focus:text-[#9a8171]"
                        }`}
                      >
                        {t("auth.newPassword")}
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading}
                        aria-label={
                          showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                        }
                        className="absolute end-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff size={18} strokeWidth={1.8} />
                        ) : (
                          <Eye size={18} strokeWidth={1.8} />
                        )}
                      </button>
                    </div>

                    {newPassword.length > 0 && (
                      <div className="mt-2 space-y-2 animate-slide-up">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${getStrengthInfo(passwordStrength).color}`}
                              style={{
                                width: getStrengthInfo(passwordStrength).width,
                              }}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium transition-colors duration-300 ${
                              passwordStrength >= 80
                                ? "text-emerald-600"
                                : passwordStrength >= 60
                                  ? "text-blue-600"
                                  : passwordStrength >= 40
                                    ? "text-yellow-600"
                                    : passwordStrength > 0
                                      ? "text-red-500"
                                      : "text-gray-400"
                            }`}
                          >
                            {getStrengthInfo(passwordStrength).text}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                          {[
                            { key: "minLength", label: t("auth.passwordRequirements.minLength") },
                            { key: "hasUpperCase", label: t("auth.passwordRequirements.hasUpperCase") },
                            { key: "hasLowerCase", label: t("auth.passwordRequirements.hasLowerCase") },
                            { key: "hasNumber", label: t("auth.passwordRequirements.hasNumber") },
                            { key: "hasSpecialChar", label: t("auth.passwordRequirements.hasSpecialChar") },
                          ].map((req) => (
                            <div
                              key={req.key}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              {passwordRequirements[
                                req.key as keyof typeof passwordRequirements
                              ] ? (
                                <Check
                                  size={12}
                                  className="shrink-0 text-emerald-500"
                                />
                              ) : (
                                <div className="h-3 w-3 shrink-0 rounded-full border border-gray-300" />
                              )}
                              <span
                                className={`transition-colors duration-300 ${
                                  passwordRequirements[
                                    req.key as keyof typeof passwordRequirements
                                  ]
                                    ? "text-emerald-700"
                                    : "text-gray-500"
                                }`}
                              >
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="relative z-0 w-full animate-fade-in group">
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (error) setError("");
                        }}
                        placeholder=" "
                        autoComplete="new-password"
                        disabled={loading}
                        aria-invalid={passwordsDoNotMatch || !!error}
                        className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pe-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${
                          passwordsDoNotMatch || error
                            ? "border-red-300 focus:border-red-500"
                            : passwordsMatch
                              ? "border-emerald-400 focus:border-emerald-500"
                              : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      />

                      <label
                        htmlFor="confirmPassword"
                        className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right transform text-sm transition-all duration-300 ${
                          confirmPassword
                            ? "-translate-y-6 scale-75"
                            : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${
                          passwordsDoNotMatch
                            ? "text-red-500 peer-focus:text-red-500"
                            : passwordsMatch
                              ? "text-emerald-600 peer-focus:text-emerald-600"
                              : "text-[#a59a92] peer-focus:text-[#9a8171]"
                        }`}
                      >
                        {t("auth.confirmNewPassword")}
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? t("auth.hideConfirmPassword")
                            : t("auth.showConfirmPassword")
                        }
                        className="absolute end-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} strokeWidth={1.8} />
                        ) : (
                          <Eye size={18} strokeWidth={1.8} />
                        )}
                      </button>
                    </div>

                    {confirmPassword.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        {passwordsMatch ? (
                          <>
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-emerald-600">
                              {t("auth.feedback.passwordsMatch")}
                            </span>
                          </>
                        ) : (
                          <>
                            <X size={14} className="text-red-500" />
                            <span className="text-red-500">
                              {t("auth.feedback.passwordsDoNotMatch")}
                            </span>
                          </>
                        )}
                      </div>
                    )}
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
                    disabled={
                      loading || !passwordsMatch || passwordStrength < 20
                    }
                    className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {loading ? (
                      <span className="relative flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        {t("auth.resetPasswordPage.submitting")}
                      </span>
                    ) : (
                      <span className="relative">{t("auth.resetPassword")}</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
