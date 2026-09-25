"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { register } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import DateOfBirthField from "@/components/shared/DateOfBirthField";
import type { Gender } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setAuth } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    dateOfBirth: false,
    gender: false,
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: Gender | "";
    password: string;
  }>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    password: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Digits with an optional leading +, spaces, dashes and brackets.
  const validatePhone = (phone: string) => /^\+?[\d\s\-()]{6,20}$/.test(phone.trim());

  const isPhoneValid = validatePhone(formData.phoneNumber);

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
    const strength = (fulfilled / 5) * 100;
    setPasswordStrength(strength);

    return requirements;
  };

  const getStrengthInfo = (strength: number) => {
    if (strength === 0) return { color: 'bg-gray-200', text: '', width: '0%' };
    if (strength <= 20) return { color: 'bg-red-500', text: t("auth.passwordStrength.weak"), width: '20%' };
    if (strength <= 40) return { color: 'bg-orange-500', text: t("auth.passwordStrength.fair"), width: '40%' };
    if (strength <= 60) return { color: 'bg-yellow-500', text: t("auth.passwordStrength.good"), width: '60%' };
    if (strength <= 80) return { color: 'bg-blue-500', text: t("auth.passwordStrength.strong"), width: '80%' };
    return { color: 'bg-emerald-500', text: t("auth.passwordStrength.veryStrong"), width: '100%' };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    if (id === "email") {
      setIsEmailValid(validateEmail(value));
    }

    if (id === "password") {
      evaluatePasswordStrength(value);
    }

    if (error) {
      setError("");
    }
  };

  const handleDateOfBirthChange = (value: string) => {
    setFormData((previous) => ({ ...previous, dateOfBirth: value }));

    if (error) {
      setError("");
    }
  };

  const handleGenderChange = (value: Gender) => {
    setFormData((previous) => ({ ...previous, gender: value }));
    setTouched((previous) => ({ ...previous, gender: true }));

    if (error) {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    if (error) {
      setError("");
    }
  };

  const handleBlur = (id: string) => {
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const passwordsMatch =
    formData.password.length > 0 &&
    confirmPassword.length > 0 &&
    formData.password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    formData.password !== confirmPassword;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!isEmailValid) {
      setError(t("auth.validation.invalidEmail"));
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError(t("auth.validation.phoneRequired"));
      return;
    }

    if (!isPhoneValid) {
      setError(t("auth.validation.phoneInvalid"));
      return;
    }

    if (!formData.dateOfBirth) {
      setError(t("auth.validation.dobRequired"));
      return;
    }

    if (!formData.gender) {
      setError(t("auth.validation.genderRequired"));
      return;
    }

    if (formData.password !== confirmPassword) {
      setError(t("auth.validation.passwordMismatch"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("auth.validation.passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        password: formData.password,
      });

      setAuth(data);
      router.push("/");
    } catch (err: unknown) {

      setError(getApiErrorMessage(err, t("auth.registerPage.failed")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf8f6] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-sm border border-[#e8e1dc] bg-white shadow-[0_24px_80px_rgba(48,37,31,0.08)] transition-all duration-500 hover:shadow-[0_32px_100px_rgba(48,37,31,0.15)] lg:min-h-170 lg:grid-cols-2">
          <section className="relative hidden animate-slide-in-left overflow-hidden bg-[#30251f] lg:flex">
            <div className="absolute -left-32 -top-32 h-80 w-80 animate-pulse-slow rounded-full bg-white/4 blur-3xl" />
            <div className=" absolute -bottom-32 -right-20 h-96 w-96 animate-pulse-slow rounded-full bg-[#9a8171]/10 blur-3xl" style={{ animationDelay: "1s" }} />

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
                    {t("auth.registerPage.eyebrow")}
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem] rtl:leading-[1.4] rtl:tracking-normal">
                  {t("auth.registerPage.heroTitle")}
                </h2>

                <p className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  {t("auth.registerPage.heroText")}
                </p>
              </div>

              <p className="text-sm tracking-wide rtl:tracking-normal text-[#bdb1a8] animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {t("auth.brand.tagline")}
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
            <div className="w-full max-w-107.5 text-center">
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
              <div className="mb-9">
                <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.03em] rtl:tracking-normal rtl:leading-snug text-[#30251f] sm:text-4xl animate-slide-up" style={{ animationDelay: "0.05s" }}>
                  {t("auth.registerPage.title")}
                </h1>
                <p
                  className="mx-auto mt-2 text-xs font-semibold leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {t("auth.registerPage.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.15s" }}
                >
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    placeholder=" "
                    autoComplete="name"
                    disabled={loading}
                    required
                    aria-invalid={!!error}
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${error
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="fullName"
                    className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] transform transition-all duration-300 ${formData.fullName
                      ? "-translate-y-6 scale-75"
                      : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${error
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                      }`}
                  >
                    {t("auth.fullName")}
                  </label>
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.2s" }}
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
                    required
                    aria-invalid={!!error || (!isEmailValid && touched.email)}
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${error || (!isEmailValid && touched.email)
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="email"
                    className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] transform transition-all duration-300 ${formData.email
                      ? "-translate-y-6 scale-75"
                      : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${error || (!isEmailValid && touched.email)
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                      }`}
                  >
                    {t("auth.email")}
                  </label>

                  {touched.email && formData.email.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      {isEmailValid ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={14} className="text-red-500" />
                      )}

                      <span
                        className={
                          isEmailValid ? "text-emerald-600" : "text-red-500"
                        }
                      >
                        {isEmailValid ? t("auth.feedback.validEmail") : t("auth.feedback.invalidEmailFormat")}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.22s" }}
                >
                  <input
                    id="phoneNumber"
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phoneNumber")}
                    placeholder=" "
                    autoComplete="tel"
                    disabled={loading}
                    required
                    aria-invalid={!!error || (!isPhoneValid && touched.phoneNumber && formData.phoneNumber.length > 0)}
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 ltr:text-left rtl:text-right ${error || (!isPhoneValid && touched.phoneNumber && formData.phoneNumber.length > 0)
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="phoneNumber"
                    className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] transform transition-all duration-300 ${formData.phoneNumber
                      ? "-translate-y-6 scale-75"
                      : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${error || (!isPhoneValid && touched.phoneNumber && formData.phoneNumber.length > 0)
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                      }`}
                  >
                    {t("auth.phoneNumber")}
                  </label>

                  {touched.phoneNumber && formData.phoneNumber.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      {isPhoneValid ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={14} className="text-red-500" />
                      )}

                      <span
                        className={
                          isPhoneValid ? "text-emerald-600" : "text-red-500"
                        }
                      >
                        {isPhoneValid ? t("auth.feedback.validPhone") : t("auth.feedback.invalidPhone")}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in"
                  style={{ animationDelay: "0.23s" }}
                >
                  <DateOfBirthField
                    id="dateOfBirth"
                    label={t("auth.dateOfBirth")}
                    value={formData.dateOfBirth}
                    onChange={handleDateOfBirthChange}
                    onBlur={() => handleBlur("dateOfBirth")}
                    disabled={loading}
                    invalid={!!error && !formData.dateOfBirth}
                  />
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in text-start"
                  style={{ animationDelay: "0.24s" }}
                >
                  <p
                    id="gender-label"
                    className={`mb-2 text-xs ${!!error && !formData.gender ? "text-red-500" : "text-[#a59a92]"}`}
                  >
                    {t("auth.gender")}
                  </p>

                  <div
                    role="radiogroup"
                    aria-labelledby="gender-label"
                    className="grid grid-cols-2 gap-3"
                  >
                    {(["Male", "Female"] as const).map((option) => {
                      const selected = formData.gender === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          disabled={loading}
                          onClick={() => handleGenderChange(option)}
                          className={`flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9a8171]/25 disabled:cursor-not-allowed disabled:opacity-60 ${selected
                            ? "border-[#30251f] bg-[#30251f] text-white shadow-[0_6px_18px_rgba(48,37,31,0.15)]"
                            : "border-[#ded5ce] bg-transparent text-[#6f625b] hover:border-[#9a8171] hover:text-[#30251f]"
                            }`}
                        >
                          {selected && <Check size={14} />}
                          {option === "Male" ? t("auth.male") : t("auth.female")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.25s" }}
                >
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      placeholder=" "
                      autoComplete="new-password"
                      disabled={loading}
                      required
                      aria-invalid={!!error}
                      className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pe-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${error
                        ? "border-red-300 focus:border-red-500"
                        : formData.password.length > 0 && passwordStrength > 0
                          ? passwordStrength >= 60
                            ? "border-emerald-400 focus:border-emerald-500"
                            : passwordStrength >= 40
                              ? "border-yellow-400 focus:border-yellow-500"
                              : "border-red-300 focus:border-red-500"
                          : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                        } disabled:cursor-not-allowed disabled:opacity-60
                      [&::-webkit-reveal]:hidden
                      [&::-ms-reveal]:hidden
                      [&::-moz-reveal]:hidden`}
                    />

                    <label
                      htmlFor="password"
                      className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right text-sm text-[#a59a92] transform transition-all duration-300 ${formData.password
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${error
                          ? "text-red-500 peer-focus:text-red-500"
                          : "peer-focus:text-[#9a8171]"
                        }`}
                    >
                      {t("auth.password")}
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      disabled={loading}
                      aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                      className="absolute end-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>

                  {formData.password.length > 0 && (
                    <div className="mt-2 space-y-2 animate-slide-up">

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${getStrengthInfo(passwordStrength).color}`}
                            style={{ width: getStrengthInfo(passwordStrength).width }}
                          />
                        </div>
                        <span className={`text-xs font-medium transition-colors duration-300 ${passwordStrength >= 80 ? 'text-emerald-600' :
                          passwordStrength >= 60 ? 'text-blue-600' :
                            passwordStrength >= 40 ? 'text-yellow-600' :
                              passwordStrength > 0 ? 'text-red-500' : 'text-gray-400'
                          }`}>
                          {getStrengthInfo(passwordStrength).text}
                        </span>
                      </div>
                      <div className="mt-2 pt-1 border-t border-gray-100/80">
                        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                          <span className="text-gray-300">💡</span>
                          <span>{t("auth.passwordStrength.example")} <span className="font-mono text-gray-500 bg-gray-50/80 px-1.5 py-0.5 rounded border border-gray-100/60">Aa@12345</span></span>
                          <span className="text-gray-300 text-[10px]">{t("auth.passwordStrength.exampleHint")}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                        {[
                          { key: 'minLength', label: t("auth.passwordRequirements.minLength") },
                          { key: 'hasUpperCase', label: t("auth.passwordRequirements.hasUpperCase") },
                          { key: 'hasLowerCase', label: t("auth.passwordRequirements.hasLowerCase") },
                          { key: 'hasNumber', label: t("auth.passwordRequirements.hasNumber") },
                          { key: 'hasSpecialChar', label: t("auth.passwordRequirements.hasSpecialChar") },
                        ].map((req) => (
                          <div key={req.key} className="flex items-center gap-1.5 text-xs">
                            {passwordRequirements[req.key as keyof typeof passwordRequirements] ? (
                              <Check size={12} className="text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-gray-300 shrink-0" />
                            )}
                            <span className={`transition-colors duration-300 ${passwordRequirements[req.key as keyof typeof passwordRequirements]
                              ? 'text-emerald-700'
                              : 'text-gray-500'
                              }`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="relative z-0 w-full animate-fade-in group"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder=" "
                      autoComplete="new-password"
                      disabled={loading}
                      required
                      aria-invalid={passwordsDoNotMatch || !!error}
                      className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pe-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 [unicode-bidi:plaintext] ltr:text-left rtl:text-right ${passwordsDoNotMatch || error
                        ? "border-red-300 focus:border-red-500"
                        : passwordsMatch
                          ? "border-emerald-400 focus:border-emerald-500"
                          : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                        } disabled:cursor-not-allowed disabled:opacity-60
                      [&::-webkit-reveal]:hidden
                      [&::-ms-reveal]:hidden
                      [&::-moz-reveal]:hidden`}
                    />

                    <label
                      htmlFor="confirmPassword"
                      className={`pointer-events-none absolute start-0 top-3 -z-10 ltr:origin-left rtl:origin-right transform text-sm transition-all duration-300 ${confirmPassword
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${passwordsDoNotMatch
                          ? "text-red-500 peer-focus:text-red-500"
                          : passwordsMatch
                            ? "text-emerald-600 peer-focus:text-emerald-600"
                            : "text-[#a59a92] peer-focus:text-[#9a8171]"
                        }`}
                    >
                      {t("auth.confirmPassword")}
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
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

                <div className="animate-fade-in" style={{ animationDelay: "0.35s" }}>
                  {error && (
                    <div
                      role="alert"
                      className="animate-shake rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !passwordsMatch ||
                    passwordStrength < 20 ||
                    !formData.phoneNumber ||
                    !formData.dateOfBirth ||
                    !formData.gender
                  }
                  className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {t("auth.registerPage.submitting")}
                    </span>
                  ) : (
                    <span className="relative">{t("auth.createAccount")}</span>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
                <div className="h-px flex-1 bg-[#e8e1dc]" />
                <span className="text-[10px] font-medium tracking-[0.18em] text-[#a59a92]">
                  {t("auth.brand.or")}
                </span>
                <div className="h-px flex-1 bg-[#e8e1dc]" />
              </div>

              <p className="text-center text-sm text-[#7b7069] animate-fade-in" style={{ animationDelay: "0.5s" }}>
                {t("auth.haveAccount")}{" "}
                <Link
                  href="/login"
                  className="group relative font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171]"
                >
                  <span className="relative">
                    {t("auth.signIn")}
                    <span className="absolute -bottom-0.5 start-0 h-0.5 w-0 bg-[#9a8171] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </p>

              <div className="mt-7 flex justify-center animate-fade-in" style={{ animationDelay: "0.55s" }}>
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