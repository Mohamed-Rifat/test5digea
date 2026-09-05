"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { register } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
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
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
    if (strength <= 20) return { color: 'bg-red-500', text: 'Weak', width: '20%' };
    if (strength <= 40) return { color: 'bg-orange-500', text: 'Fair', width: '40%' };
    if (strength <= 60) return { color: 'bg-yellow-500', text: 'Good', width: '60%' };
    if (strength <= 80) return { color: 'bg-blue-500', text: 'Strong', width: '80%' };
    return { color: 'bg-emerald-500', text: 'Very Strong', width: '100%' };
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
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setAuth(data);
      router.push("/");
    } catch (err: unknown) {
      const responseError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const errorMessage =
        responseError.response?.data?.message ||
        responseError.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);
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
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8c8bc]">
                    Your wedding journey
                  </p>
                </div>

                <h2 className="animate-slide-up text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[3.25rem]">
                  Every beautiful moment starts with a plan.
                </h2>

                <p className="mt-7 max-w-md text-[15px] leading-7 text-[#d9d0ca] animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  Create your account, discover trusted partners, and start
                  building the wedding day you&apos;ve always imagined.
                </p>
              </div>

              <p className="text-sm tracking-wide text-[#bdb1a8] animate-fade-in" style={{ animationDelay: "0.3s" }}>
                Plan it. Celebrate it. Remember it.
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
                <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.03em] text-[#30251f] sm:text-4xl animate-slide-up" style={{ animationDelay: "0.05s" }}>
                  Create your account
                </h1>
                <p
                  className="mx-auto mt-2 text-xs font-semibold leading-6 text-[#7b7069] animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  Join 5digea and start planning your perfect wedding.
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
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 ${error
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="fullName"
                    className={`pointer-events-none absolute left-0 top-3 -z-10 origin-left text-sm text-[#a59a92] transform transition-all duration-300 ${formData.fullName
                      ? "-translate-y-6 scale-75"
                      : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${error
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                      }`}
                  >
                    Full name
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
                    className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 ${error || (!isEmailValid && touched.email)
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#ded5ce] hover:border-[#cbbdb3] focus:border-[#9a8171]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                  />

                  <label
                    htmlFor="email"
                    className={`pointer-events-none absolute left-0 top-3 -z-10 origin-left text-sm text-[#a59a92] transform transition-all duration-300 ${formData.email
                      ? "-translate-y-6 scale-75"
                      : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                      } ${error || (!isEmailValid && touched.email)
                        ? "text-red-500 peer-focus:text-red-500"
                        : "peer-focus:text-[#9a8171]"
                      }`}
                  >
                    Email address
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
                        {isEmailValid ? "Valid email" : "Invalid email format"}
                      </span>
                    </div>
                  )}
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
                      className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pr-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 ${error
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
                      className={`pointer-events-none absolute left-0 top-3 -z-10 origin-left text-sm text-[#a59a92] transform transition-all duration-300 ${formData.password
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${error
                          ? "text-red-500 peer-focus:text-red-500"
                          : "peer-focus:text-[#9a8171]"
                        }`}
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                          <span>Example: <span className="font-mono text-gray-500 bg-gray-50/80 px-1.5 py-0.5 rounded border border-gray-100/60">Aa@12345</span></span>
                          <span className="text-gray-300 text-[10px]">(uppercase, lowercase, number, special)</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                        {[
                          { key: 'minLength', label: 'At least 8 characters' },
                          { key: 'hasUpperCase', label: 'Uppercase letter' },
                          { key: 'hasLowerCase', label: 'Lowercase letter' },
                          { key: 'hasNumber', label: 'Number' },
                          { key: 'hasSpecialChar', label: 'Special character' },
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
                      className={`peer block w-full border-0 border-b-2 bg-transparent px-0 py-3 pr-12 text-[15px] text-[#30251f] appearance-none outline-none transition-all duration-300 placeholder:text-transparent focus:ring-0 ${passwordsDoNotMatch || error
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
                      className={`pointer-events-none absolute left-0 top-3 -z-10 origin-left transform text-sm transition-all duration-300 ${confirmPassword
                        ? "-translate-y-6 scale-75"
                        : "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                        } ${passwordsDoNotMatch
                          ? "text-red-500 peer-focus:text-red-500"
                          : passwordsMatch
                            ? "text-emerald-600 peer-focus:text-emerald-600"
                            : "text-[#a59a92] peer-focus:text-[#9a8171]"
                        }`}
                    >
                      Confirm password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c7d73] transition-all duration-200 hover:bg-[#f0ebe7] hover:text-[#30251f] focus:outline-none focus:ring-2 focus:ring-[#9a8171]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                            Passwords match
                          </span>
                        </>
                      ) : (
                        <>
                          <X size={14} className="text-red-500" />
                          <span className="text-red-500">
                            Passwords do not match
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
                  disabled={loading || !passwordsMatch || passwordStrength < 20}
                  className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="relative">Create account</span>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
                <div className="h-px flex-1 bg-[#e8e1dc]" />
                <span className="text-[10px] font-medium tracking-[0.18em] text-[#a59a92]">
                  OR
                </span>
                <div className="h-px flex-1 bg-[#e8e1dc]" />
              </div>

              <p className="text-center text-sm text-[#7b7069] animate-fade-in" style={{ animationDelay: "0.5s" }}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="group relative font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171]"
                >
                  <span className="relative">
                    Sign in
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#9a8171] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </p>

              <div className="mt-7 flex justify-center animate-fade-in" style={{ animationDelay: "0.55s" }}>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#9a8171] transition-all duration-200 hover:gap-3 hover:text-[#30251f]"
                >
                  Home - Guest Mode
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}