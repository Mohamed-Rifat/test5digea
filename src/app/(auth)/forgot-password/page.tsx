"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";

import { forgotPassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { isValidEmail } from "@/lib/validation";
import { useLanguage } from "@/context/LanguageContext";

import AuthShell from "@/components/auth/AuthShell";
import AuthStatusCard from "@/components/auth/AuthStatusCard";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import { BackToSignIn } from "@/components/auth/AuthLinks";
import { TextField } from "@/components/ui";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
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
      setError(getApiErrorMessage(err, t("auth.forgotPasswordPage.failed")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      page="forgotPasswordPage"
      title={t("auth.forgotPasswordPage.title")}
      subtitle={t("auth.forgotPasswordPage.subtitle")}
    >
      {sent ? (
        <AuthStatusCard
          icon={<MailCheck size={22} />}
          title={t("auth.forgotPasswordPage.sentTitle")}
          message={t("auth.forgotPasswordPage.sentMessage", { email })}
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            id="email"
            type="email"
            label={t("auth.email")}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            autoComplete="email"
            disabled={loading}
            tone={error ? "error" : "default"}
            containerClassName="animate-fade-in"
          />

          <FormAlert>{error}</FormAlert>

          <AuthSubmitButton
            loading={loading}
            loadingText={t("auth.forgotPasswordPage.submitting")}
          >
            {t("auth.forgotPasswordPage.submit")}
          </AuthSubmitButton>
        </form>
      )}

      <BackToSignIn />
    </AuthShell>
  );
}
