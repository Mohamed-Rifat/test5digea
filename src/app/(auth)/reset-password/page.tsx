"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { resetPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

import AuthShell from "@/components/auth/AuthShell";
import AuthStatusCard from "@/components/auth/AuthStatusCard";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import PasswordMatchMessage from "@/components/auth/PasswordMatchMessage";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { BackToSignIn } from "@/components/auth/AuthLinks";
import { passwordStrength, strengthTone } from "@/components/auth/passwordStrength";
import { PasswordField } from "@/components/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const passwordsDoNotMatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const linkInvalid = !email || !otp;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (linkInvalid) {
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
      setError(getApiErrorMessage(err, t("auth.resetPasswordPage.failed")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      page="resetPasswordPage"
      title={t("auth.resetPasswordPage.title")}
      subtitle={t("auth.resetPasswordPage.subtitle")}
    >
      {success ? (
        <AuthStatusCard
          icon={<CheckCircle size={22} />}
          title={t("auth.resetPasswordPage.successTitle")}
          message={t("auth.resetPasswordPage.successMessage")}
        />
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
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <PasswordField
            id="newPassword"
            label={t("auth.newPassword")}
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              if (error) setError("");
            }}
            autoComplete="new-password"
            disabled={loading}
            tone={error ? "error" : strengthTone(newPassword, strength)}
            containerClassName="animate-fade-in"
          >
            <PasswordStrengthMeter password={newPassword} />
          </PasswordField>

          <PasswordField
            id="confirmPassword"
            label={t("auth.confirmNewPassword")}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error) setError("");
            }}
            autoComplete="new-password"
            disabled={loading}
            showLabel={t("auth.showConfirmPassword")}
            hideLabel={t("auth.hideConfirmPassword")}
            tone={
              passwordsDoNotMatch || error
                ? "error"
                : passwordsMatch
                  ? "success"
                  : "default"
            }
            containerClassName="animate-fade-in"
          >
            <PasswordMatchMessage password={newPassword} confirmation={confirmPassword} />
          </PasswordField>

          <FormAlert>{error}</FormAlert>

          <AuthSubmitButton
            loading={loading}
            disabled={!passwordsMatch || strength < 20}
            loadingText={t("auth.resetPasswordPage.submitting")}
          >
            {t("auth.resetPassword")}
          </AuthSubmitButton>
        </form>
      )}

      <BackToSignIn />
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
