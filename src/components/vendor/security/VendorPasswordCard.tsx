"use client";

import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { FieldMessage, PasswordField } from "@/components/ui";
import { VendorPasswordStrength } from "./VendorPasswordStrength";
import { useVendorPasswordForm } from "./useVendorPasswordForm";

/** "Change password" card on the vendor security page. */
export function VendorPasswordCard() {
  const { t } = useLanguage();
  const form = useVendorPasswordForm();
  const { fieldLabels, toggleLabels } = form;

  return (
    <section className="border border-[#ebe3dd] bg-white p-5 shadow-[0_12px_40px_rgba(62,45,36,0.045)] sm:p-7 lg:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-[#f0ebe7] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound size={17} className="text-[#a27e50]" strokeWidth={1.8} />

            <h2 className="text-base font-semibold text-[#30251f]">
              {t("vendor.security.changeTitle")}
            </h2>
          </div>

          <p className="mt-1.5 text-xs leading-5 text-[#8c817a] sm:text-sm">
            {t("vendor.security.changeSubtitle")}
          </p>
        </div>
      </div>

      {form.success && (
        <div
          role="status"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-[#dcebe2] bg-[#f3faf5] px-4 py-3 text-sm text-[#557765]"
        >
          <CheckCircle2 size={17} className="shrink-0" />
          <span>{t("vendor.security.success")}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit} noValidate className="mt-7 space-y-7">
        <PasswordField
          id="currentPassword"
          label={fieldLabels.current}
          value={form.currentPassword}
          onChange={(e) => form.setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          disabled={form.loading}
          {...toggleLabels(fieldLabels.current)}
        />

        <PasswordField
          id="newPassword"
          label={fieldLabels.next}
          value={form.newPassword}
          onChange={(e) => form.setNewPassword(e.target.value)}
          autoComplete="new-password"
          disabled={form.loading}
          {...toggleLabels(fieldLabels.next)}
        >
          <VendorPasswordStrength password={form.newPassword} />
        </PasswordField>

        <PasswordField
          id="confirmPassword"
          label={fieldLabels.confirm}
          value={form.confirmPassword}
          onChange={(e) => form.setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={form.loading}
          tone={
            form.confirmPassword.length === 0
              ? "default"
              : form.passwordsMatch
                ? "success"
                : "error"
          }
          {...toggleLabels(fieldLabels.confirm)}
        >
          {form.confirmPassword.length > 0 && (
            <FieldMessage tone={form.passwordsMatch ? "success" : "error"}>
              {form.passwordsMatch
                ? t("vendor.security.match")
                : t("vendor.security.noMatch")}
            </FieldMessage>
          )}
        </PasswordField>

        {form.error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-[#efd9d7] bg-[#fff7f6] px-4 py-3 text-[13px] leading-5 text-[#a75e5a]"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{form.error}</span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={form.resetForm}
            disabled={form.loading}
            className="h-11 rounded-xl px-5 text-sm font-medium text-[#766a63] transition hover:bg-[#f6f2ef] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("vendor.security.clear")}
          </button>

          <button
            type="submit"
            disabled={!form.canSubmit}
            className="h-11 rounded-xl bg-[#30251f] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.12)] transition hover:bg-[#43352d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {form.loading
              ? t("vendor.security.updating")
              : t("vendor.security.update")}
          </button>
        </div>
      </form>
    </section>
  );
}
