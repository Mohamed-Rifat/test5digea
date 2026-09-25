"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

import { login } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  getPostLoginPath,
  getRoleFromToken,
} from "@/lib/auth-utils";

function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { setAuth, isAuthenticated, isLoading: authLoading, role: currentRole } = useAuth();

  // Already signed in: skip the form.
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    router.replace(getPostLoginPath(currentRole, searchParams.get("next")));
  }, [authLoading, isAuthenticated, currentRole, router, searchParams]);

  const justReset = searchParams.get("reset") === "success";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    if (id === "email") {
      setIsEmailValid(validateEmail(value));
    }

    if (error) {
      setError("");
    }
  };

  const handleBlur = (id: string) => {
    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isEmailValid) {
      setError(t("auth.validation.invalidEmail"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await login(formData);

      // Save authentication data
      setAuth(data);

      // Get role directly from the newly received JWT
      const role = getRoleFromToken(data.token);

      // Redirect according to the user's role
      router.replace(getPostLoginPath(role, searchParams.get("next")));
    } catch (err: unknown) {

      setError(getApiErrorMessage(err, t("auth.loginPage.invalidCredentials")));
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
                    {t("auth.loginPage.eyebrow")}
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
                  {t("auth.loginPage.heroTitle")}
                </h2>

                <p
                  className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  {t("auth.loginPage.heroText")}
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
                  {t("auth.loginPage.title")}
                </h1>

                <p
                  className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {t("auth.loginPage.subtitle")}
                </p>
              </div>

              {/* Reset success banner */}
              {justReset && (
                <div
                  role="status"
                  className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 animate-fade-in"
                >
                  <CheckCircle size={16} />
                  {t("auth.loginPage.resetSuccess")}
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >

                {/* Email */}
                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.15s" }}
                >
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    placeholder=" "
                    autoComplete="email"
                    disabled={loading}
                    aria-invalid={
                      !!error ||
                      (!isEmailValid && touched.email)
                    }
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${
                      error ||
                      (!isEmailValid && touched.email)
                        ? "border-red-300 focus:border-red-500"
                        : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="email"
                    className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] duration-300 transform transition-all ${
                      formData.email
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                    } ${
                      error ||
                      (!isEmailValid && touched.email)
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                    }`}
                  >
                    {t("auth.email")}
                  </label>

                  {touched.email &&
                    formData.email.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 px-0 text-xs">
                        {isEmailValid ? (
                          <CheckCircle
                            size={14}
                            className="text-emerald-500"
                          />
                        ) : (
                          <AlertCircle
                            size={14}
                            className="text-red-500"
                          />
                        )}

                        <span
                          className={
                            isEmailValid
                              ? "text-emerald-600"
                              : "text-red-500"
                          }
                        >
                          {isEmailValid
                            ? t("auth.feedback.validEmail")
                            : t("auth.feedback.invalidEmailFormat")}
                        </span>
                      </div>
                    )}
                </div>

                {/* Password */}
                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.2s" }}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    placeholder=" "
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={!!error}
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pe-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${
                      error
                        ? "border-red-300 focus:border-red-500"
                        : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                    } disabled:cursor-not-allowed disabled:opacity-60 [&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden`}
                  />

                  <label
                    htmlFor="password"
                    className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] duration-300 transform transition-all ${
                      formData.password
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                    } ${
                      error
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                    }`}
                  >
                    {t("auth.password")}
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")
                    }
                    className="absolute end-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        size={18}
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {/* Forgot Password */}
                <div
                  className="flex justify-end pt-0.5 animate-fade-in"
                  style={{ animationDelay: "0.25s" }}
                >
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#9a8171] transition-all duration-200 hover:text-[#30251f] hover:underline hover:underline-offset-4"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>

                {/* Error */}
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  {error && (
                    <div
                      role="alert"
                      className="animate-shake rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 animate-fade-in"
                  style={{ animationDelay: "0.35s" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      {t("auth.loginPage.submitting")}
                    </span>
                  ) : (
                    <span className="relative">
                      {t("auth.signIn")}
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div
                className="my-7 flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="h-px flex-1 bg-[#e8e1dc]" />

                <span className="text-[10px] font-medium tracking-[0.18em] text-[#a59a92]">
                  {t("auth.brand.or")}
                </span>

                <div className="h-px flex-1 bg-[#e8e1dc]" />
              </div>

              {/* Register */}
              <p
                className="text-center text-sm text-[#7b7069] animate-fade-in"
                style={{ animationDelay: "0.45s" }}
              >
                {t("auth.noAccount")}{" "}
                <Link
                  href="/register"
                  className="group relative font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171]"
                >
                  <span className="relative">
                    {t("auth.createAccount")}

                    <span className="absolute -bottom-0.5 start-0 h-0.5 w-0 bg-[#9a8171] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </p>

              {/* Guest Mode */}
              <div
                className="mt-7 flex justify-center animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#9a8171] transition-all duration-200 hover:gap-3 hover:text-[#30251f]"
                >
                  {t("auth.brand.guestMode")}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
