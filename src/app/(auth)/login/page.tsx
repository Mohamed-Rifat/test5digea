"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { login } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getPostLoginPath, getRoleFromToken } from "@/lib/auth-utils";
import { isValidEmail } from "@/lib/validation";

import AuthShell from "@/components/auth/AuthShell";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import { AuthDivider, AuthSwitchLink, GuestModeLink } from "@/components/auth/AuthLinks";
import { FieldMessage, PasswordField, TextField } from "@/components/ui";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = isValidEmail(email);
  const showEmailFeedback = emailTouched && email.length > 0;

  const clearError = () => {
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmailValid) {
      setError(t("auth.validation.invalidEmail"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      setAuth(data);

      // Redirect according to the role in the newly received JWT.
      const role = getRoleFromToken(data.token);
      router.replace(getPostLoginPath(role, searchParams.get("next")));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("auth.loginPage.invalidCredentials")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      page="loginPage"
      title={t("auth.loginPage.title")}
      subtitle={t("auth.loginPage.subtitle")}
    >
      {justReset && (
        <div
          role="status"
          className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 animate-fade-in"
        >
          <CheckCircle size={16} />
          {t("auth.loginPage.resetSuccess")}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <TextField
            id="email"
            type="email"
            label={t("auth.email")}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
            }}
            onBlur={() => setEmailTouched(true)}
            autoComplete="email"
            disabled={loading}
            tone={error || (showEmailFeedback && !isEmailValid) ? "error" : "default"}
          >
            {showEmailFeedback && (
              <FieldMessage tone={isEmailValid ? "success" : "error"}>
                {isEmailValid
                  ? t("auth.feedback.validEmail")
                  : t("auth.feedback.invalidEmailFormat")}
              </FieldMessage>
            )}
          </TextField>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <PasswordField
            id="password"
            label={t("auth.password")}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError();
            }}
            autoComplete="current-password"
            disabled={loading}
            tone={error ? "error" : "default"}
          />
        </div>

        <div className="flex justify-end pt-0.5 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[#9a8171] transition-all duration-200 hover:text-[#30251f] hover:underline hover:underline-offset-4"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <FormAlert>{error}</FormAlert>

        <AuthSubmitButton
          loading={loading}
          loadingText={t("auth.loginPage.submitting")}
          className="animate-fade-in"
          style={{ animationDelay: "0.35s" }}
        >
          {t("auth.signIn")}
        </AuthSubmitButton>
      </form>

      <AuthDivider delay="0.4s" />
      <AuthSwitchLink
        prompt={t("auth.noAccount")}
        href="/register"
        label={t("auth.createAccount")}
        delay="0.45s"
      />
      <GuestModeLink delay="0.5s" />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
