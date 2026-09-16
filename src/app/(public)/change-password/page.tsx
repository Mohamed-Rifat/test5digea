"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { changePassword } from "@/features/auth/api";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/error";

function SignedOutState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f6] px-4 py-20">
      <div className="w-full max-w-md overflow-hidden rounded-4xl border border-[#eee5df] bg-white shadow-[0_20px_60px_rgba(48,37,31,0.08)]">
        <div className="h-2 bg-[#30251f]" />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#faf5ee] text-[#a47e43]">
            <KeyRound size={26} strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43]">
            Account Security
          </p>

          <h1 className="mt-3 font-serif text-3xl font-light text-[#30251f]">
            Change your password
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81746d]">
            Sign in to update your password and keep your Digea account secure.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#30251f] px-6 text-sm font-semibold text-white transition hover:bg-[#45362d]"
          >
            Sign in
            <ArrowLeft size={15} className="rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
  status,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  disabled: boolean;
  status?: "success" | "error";
}) {
  const borderClass =
    status === "error"
      ? "border-red-300 focus-within:border-red-500"
      : status === "success"
        ? "border-emerald-400 focus-within:border-emerald-500"
        : "border-[#e1d8d1] focus-within:border-[#9a8171]";

  return (
    <div className="group">
      <label
        htmlFor={id}
        className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#81746d]"
      >
        {label}
      </label>

      <div
        className={`flex h-13.5 items-center rounded-2xl border bg-[#fdfcfb] px-4 transition-all duration-200 focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(48,37,31,0.05)] ${borderClass}`}
      >
        <LockKeyhole
          size={17}
          strokeWidth={1.8}
          className="mr-3 shrink-0 text-[#a3978f] transition-colors group-focus-within:text-[#a47e43]"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={
            id === "currentPassword"
              ? "current-password"
              : "new-password"
          }
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#30251f] outline-none placeholder:text-[#b6aaa1] disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#91847b] transition hover:bg-[#f3eee9] hover:text-[#30251f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {visible ? (
            <EyeOff size={17} strokeWidth={1.8} />
          ) : (
            <Eye size={17} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const { isAuthenticated } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  if (!isAuthenticated) return <SignedOutState />;

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
    if (strength === 0) {
      return {
        text: "",
        width: "0%",
        level: "empty",
      };
    }

    if (strength <= 20) {
      return {
        text: "Weak",
        width: "20%",
        level: "weak",
      };
    }

    if (strength <= 40) {
      return {
        text: "Fair",
        width: "40%",
        level: "fair",
      };
    }

    if (strength <= 60) {
      return {
        text: "Good",
        width: "60%",
        level: "good",
      };
    }

    if (strength <= 80) {
      return {
        text: "Strong",
        width: "80%",
        level: "strong",
      };
    }

    return {
      text: "Very Strong",
      width: "100%",
      level: "veryStrong",
    };
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    evaluatePasswordStrength(value);

    if (error) {
      setError("");
    }
  };

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStrength(0);

    setPasswordRequirements({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(true);
      resetForm();
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "We couldn't update your password. Please check your current password and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const strengthInfo = getStrengthInfo(passwordStrength);

  const requirementItems = [
    {
      key: "minLength",
      label: "At least 8 characters",
    },
    {
      key: "hasUpperCase",
      label: "Uppercase letter",
    },
    {
      key: "hasLowerCase",
      label: "Lowercase letter",
    },
    {
      key: "hasNumber",
      label: "Number",
    },
    {
      key: "hasSpecialChar",
      label: "Special character",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#faf8f6]">
      <div className="mx-auto w-full xl:max-w-10/12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          href="/profile"
          className="group mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#8e7c72] transition hover:text-[#30251f]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6ddd6] bg-white transition group-hover:border-[#cfc0b5]">
            <ArrowLeft size={14} />
          </span>

          Back to account
        </Link>

        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47e43]">
            Security settings
          </p>

          <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#30251f] sm:text-4xl lg:text-[44px]">
            Protect your account
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#81746d]">
            Keep your Digea account secure with a strong, unique password.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          {/* Security information */}
          <aside className="overflow-hidden rounded-[30px] border border-[#e9dfd8] bg-[#30251f] text-white shadow-[0_18px_50px_rgba(48,37,31,0.12)]">
            <div className="relative overflow-hidden p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-25 border-white/5" />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#a47e43]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/10 text-[#d5b67d] backdrop-blur">
                  <ShieldCheck size={26} strokeWidth={1.5} />
                </div>

                <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.22em] text-[#cdb58d]">
                  Account security
                </p>

                <h2 className="mt-2 font-serif text-3xl font-light leading-tight">
                  A stronger password,
                  <br />
                  a safer account.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/60">
                  Your password protects your personal information, saved
                  vendors, favorites, and wedding planning journey.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                      <Check size={13} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Use a unique password
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-white/45">
                        Avoid reusing passwords from other websites.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                      <Check size={13} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Mix different characters
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-white/45">
                        Combine letters, numbers, and symbols.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d5b67d]">
                      <Check size={13} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Keep it private
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-white/45">
                        Never share your password with anyone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    <Sparkles size={13} className="text-[#cdb58d]" />
                    Digea security
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <section className="rounded-[30px] border border-[#e9dfd8] bg-white p-6 shadow-[0_12px_45px_rgba(48,37,31,0.06)] sm:p-8 lg:p-10">
            <div className="flex items-start gap-4 border-b border-[#f0e9e4] pb-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43]">
                <KeyRound size={21} strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#30251f]">
                  Change password
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#8a7d74]">
                  Enter your current password and choose a new one.
                </p>
              </div>
            </div>

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle size={15} />
                </div>

                <div>
                  <p className="font-semibold">Password updated successfully</p>
                  <p className="mt-0.5 text-xs text-emerald-600/80">
                    Your account password has been changed securely.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-7 space-y-6"
            >
              <PasswordField
                id="currentPassword"
                label="Current password"
                value={currentPassword}
                onChange={(value) => {
                  setCurrentPassword(value);
                  if (error) setError("");
                }}
                visible={showCurrent}
                onToggle={() => setShowCurrent((prev) => !prev)}
                disabled={loading}
                status={error ? "error" : undefined}
              />

              <div className="h-px bg-[#f3eee9]" />

              <div>
                <PasswordField
                  id="newPassword"
                  label="New password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  visible={showNew}
                  onToggle={() => setShowNew((prev) => !prev)}
                  disabled={loading}
                  status={
                    newPassword.length > 0
                      ? passwordStrength >= 60
                        ? "success"
                        : "error"
                      : undefined
                  }
                />

                {/* Password strength */}
                {newPassword.length > 0 && (
                  <div className="mt-4 rounded-2xl bg-[#faf8f6] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8d7f76]">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          strengthInfo.level === "veryStrong"
                            ? "text-emerald-600"
                            : strengthInfo.level === "strong"
                              ? "text-[#527d67]"
                              : strengthInfo.level === "good"
                                ? "text-[#9a7b36]"
                                : strengthInfo.level === "fair"
                                  ? "text-[#b77a38]"
                                  : "text-red-500"
                        }`}
                      >
                        {strengthInfo.text}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((segment) => {
                        const active =
                          passwordStrength >= segment * 20;

                        return (
                          <div
                            key={segment}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              active
                                ? passwordStrength >= 80
                                  ? "bg-emerald-500"
                                  : passwordStrength >= 60
                                    ? "bg-[#718c77]"
                                    : passwordStrength >= 40
                                      ? "bg-[#c39b4d]"
                                      : "bg-red-400"
                                : "bg-[#e6dfda]"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {requirementItems.map((req) => {
                        const fulfilled =
                          passwordRequirements[req.key];

                        return (
                          <div
                            key={req.key}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                              fulfilled
                                ? "text-emerald-700"
                                : "text-[#9a8d85]"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                fulfilled
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-white text-[#b6aaa1]"
                              }`}
                            >
                              {fulfilled ? (
                                <Check size={11} strokeWidth={2.5} />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#cfc5be]" />
                              )}
                            </span>

                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  if (error) setError("");
                }}
                visible={showConfirm}
                onToggle={() => setShowConfirm((prev) => !prev)}
                disabled={loading}
                status={
                  passwordsDoNotMatch
                    ? "error"
                    : passwordsMatch
                      ? "success"
                      : undefined
                }
              />

              {/* Match state */}
              {confirmPassword.length > 0 && (
                <div
                  className={`-mt-3 flex items-center gap-2 text-xs font-medium ${
                    passwordsMatch
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      passwordsMatch
                        ? "bg-emerald-100"
                        : "bg-red-100"
                    }`}
                  >
                    {passwordsMatch ? (
                      <Check size={11} />
                    ) : (
                      <X size={11} />
                    )}
                  </span>

                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <X size={14} />
                  </div>

                  <div>
                    <p className="font-semibold">Unable to update password</p>
                    <p className="mt-0.5 text-xs leading-5 text-red-600/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !passwordsMatch ||
                    passwordStrength < 20
                  }
                  className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(48,37,31,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/10 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {loading ? (
                    <span className="relative flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Updating password...
                    </span>
                  ) : (
                    <span className="relative flex items-center gap-2">
                      <ShieldCheck size={17} />
                      Update password
                    </span>
                  )}
                </button>

                <p className="mt-3 text-center text-[10px] leading-5 text-[#aaa099]">
                  You&apos;ll need your current password to make this change.
                </p>
              </div>
            </form>
          </section>
        </div>

        {/* Bottom reassurance */}
        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#aaa099]">
          <ShieldCheck size={13} />
          Your account security matters
        </div>
      </div>
    </main>
  );
}
