"use client";

import {
  CheckCircle,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { PasswordField } from "@/components/ui";
import PasswordMatchMessage from "@/components/auth/PasswordMatchMessage";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { strengthTone } from "@/components/auth/passwordStrength";
import { useChangePassword } from "./useChangePassword";

/** Current / new / confirm password form for signed-in users. */
export function ChangePasswordForm() {
  const { t } = useLanguage();
  const form = useChangePassword();

  const toggleLabels = (label: string) => ({
    showLabel: t("auth.changePasswordPage.showField", { label }),
    hideLabel: t("auth.changePasswordPage.hideField", { label }),
  });

  const currentLabel = t("auth.changePasswordPage.currentPassword");
  const newLabel = t("auth.newPassword");
  const confirmLabel = t("auth.confirmNewPassword");

  return (
    <section className="rounded-[30px] border border-[#e9dfd8] bg-white p-6 shadow-[0_12px_45px_rgba(48,37,31,0.06)] sm:p-8 lg:p-10">
      <div className="flex items-start gap-4 border-b border-[#f0e9e4] pb-7">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#faf5ee] text-[#a47e43]">
          <KeyRound size={21} strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#30251f]">
            {t("auth.changePasswordPage.formTitle")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#8a7d74]">
            {t("auth.changePasswordPage.formSubtitle")}
          </p>
        </div>
      </div>

      {form.success && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700"
        >
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={15} />
          </div>
          <div>
            <p className="font-semibold">
              {t("auth.changePasswordPage.successTitle")}
            </p>
            <p className="mt-0.5 text-xs text-emerald-600/80">
              {t("auth.changePasswordPage.successText")}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit} noValidate className="mt-8 space-y-7">
        <PasswordField
          id="currentPassword"
          label={currentLabel}
          placeholder={t("auth.changePasswordPage.currentPasswordPlaceholder")}
          value={form.currentPassword}
          onChange={(e) => form.setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          disabled={form.loading}
          startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
          tone={form.error ? "error" : "default"}
          {...toggleLabels(currentLabel)}
        />

        <PasswordField
          id="newPassword"
          label={newLabel}
          placeholder={t("auth.changePasswordPage.newPasswordPlaceholder")}
          value={form.newPassword}
          onChange={(e) => form.setNewPassword(e.target.value)}
          autoComplete="new-password"
          disabled={form.loading}
          startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
          tone={strengthTone(form.newPassword, form.strength)}
          {...toggleLabels(newLabel)}
        >
          <PasswordStrengthMeter password={form.newPassword} />
        </PasswordField>

        <PasswordField
          id="confirmPassword"
          label={confirmLabel}
          placeholder={t("auth.changePasswordPage.confirmPasswordPlaceholder")}
          value={form.confirmPassword}
          onChange={(e) => form.setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={form.loading}
          startIcon={<LockKeyhole size={17} strokeWidth={1.8} />}
          tone={
            form.passwordsDoNotMatch
              ? "error"
              : form.passwordsMatch
                ? "success"
                : "default"
          }
          {...toggleLabels(confirmLabel)}
        >
          <PasswordMatchMessage
            password={form.newPassword}
            confirmation={form.confirmPassword}
          />
        </PasswordField>

        {form.error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
              <X size={14} />
            </div>
            <div>
              <p className="font-semibold">
                {t("auth.changePasswordPage.errorTitle")}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-red-600/80">
                {form.error}
              </p>
            </div>
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={
              form.loading || !form.passwordsMatch || form.strength < 20
            }
            className="group relative flex h-13.5 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(48,37,31,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#45362d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/10 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <span className="absolute inset-0 ltr:-translate-x-full rtl:translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ltr:group-hover:translate-x-full rtl:group-hover:-translate-x-full" />
            {form.loading ? (
              <span className="relative flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {t("auth.changePasswordPage.submitting")}
              </span>
            ) : (
              <span className="relative flex items-center gap-2">
                <ShieldCheck size={17} />
                {t("auth.changePasswordPage.submit")}
              </span>
            )}
          </button>

          <p className="mt-3 text-center text-[10px] leading-5 text-[#aaa099]">
            {t("auth.changePasswordPage.note")}
          </p>
        </div>
      </form>
    </section>
  );
}
