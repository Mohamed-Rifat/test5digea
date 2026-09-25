"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Gender } from "@/types/auth";

import AuthShell from "@/components/auth/AuthShell";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import GenderPicker from "@/components/auth/GenderPicker";
import PasswordMatchMessage from "@/components/auth/PasswordMatchMessage";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { AuthDivider, AuthSwitchLink, GuestModeLink } from "@/components/auth/AuthLinks";
import { passwordStrength, strengthTone } from "@/components/auth/passwordStrength";
import DateOfBirthField from "@/components/shared/DateOfBirthField";
import { FieldMessage, PasswordField, TextField } from "@/components/ui";

interface RegisterForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender | "";
  password: string;
}

const EMPTY_FORM: RegisterForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setAuth } = useAuth();

  const [form, setForm] = useState<RegisterForm>(EMPTY_FORM);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = isValidEmail(form.email);
  const isPhoneValid = isValidPhone(form.phoneNumber);
  const strength = passwordStrength(form.password);
  const passwordsMatch = form.password.length > 0 && form.password === confirmPassword;
  const passwordsDoNotMatch = confirmPassword.length > 0 && form.password !== confirmPassword;

  const showEmailFeedback = touched.email && form.email.length > 0;
  const showPhoneFeedback = touched.phoneNumber && form.phoneNumber.length > 0;

  const update = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (error) setError("");
  };

  const touch = (key: string) => setTouched((previous) => ({ ...previous, [key]: true }));

  const validate = (): string | null => {
    if (!isEmailValid) return t("auth.validation.invalidEmail");
    if (!form.phoneNumber.trim()) return t("auth.validation.phoneRequired");
    if (!isPhoneValid) return t("auth.validation.phoneInvalid");
    if (!form.dateOfBirth) return t("auth.validation.dobRequired");
    if (!form.gender) return t("auth.validation.genderRequired");
    if (form.password !== confirmPassword) return t("auth.validation.passwordMismatch");
    if (form.password.length < 8) return t("auth.validation.passwordTooShort");
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    setError(validationError ?? "");
    if (validationError || !form.gender) return;

    setLoading(true);

    try {
      const data = await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        password: form.password,
      });

      setAuth(data);
      router.push("/");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("auth.registerPage.failed")));
    } finally {
      setLoading(false);
    }
  };

  const fade = (delay: string) => ({
    className: "animate-fade-in",
    style: { animationDelay: delay },
  });

  return (
    <AuthShell
      page="registerPage"
      title={t("auth.registerPage.title")}
      subtitle={t("auth.registerPage.subtitle")}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div {...fade("0.15s")}>
          <TextField
            id="fullName"
            label={t("auth.fullName")}
            value={form.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            onBlur={() => touch("fullName")}
            autoComplete="name"
            disabled={loading}
            required
            tone={error ? "error" : "default"}
          />
        </div>

        <div {...fade("0.2s")}>
          <TextField
            id="email"
            type="email"
            label={t("auth.email")}
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => touch("email")}
            autoComplete="email"
            disabled={loading}
            required
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

        <div {...fade("0.22s")}>
          <TextField
            id="phoneNumber"
            type="tel"
            inputMode="tel"
            label={t("auth.phoneNumber")}
            value={form.phoneNumber}
            onChange={(event) => update("phoneNumber", event.target.value)}
            onBlur={() => touch("phoneNumber")}
            autoComplete="tel"
            disabled={loading}
            required
            tone={error || (showPhoneFeedback && !isPhoneValid) ? "error" : "default"}
          >
            {showPhoneFeedback && (
              <FieldMessage tone={isPhoneValid ? "success" : "error"}>
                {isPhoneValid ? t("auth.feedback.validPhone") : t("auth.feedback.invalidPhone")}
              </FieldMessage>
            )}
          </TextField>
        </div>

        <div {...fade("0.23s")}>
          <DateOfBirthField
            id="dateOfBirth"
            label={t("auth.dateOfBirth")}
            value={form.dateOfBirth}
            onChange={(value) => update("dateOfBirth", value)}
            onBlur={() => touch("dateOfBirth")}
            disabled={loading}
            invalid={!!error && !form.dateOfBirth}
          />
        </div>

        <div {...fade("0.24s")}>
          <GenderPicker
            value={form.gender}
            onChange={(value) => {
              update("gender", value);
              touch("gender");
            }}
            disabled={loading}
            invalid={!!error && !form.gender}
          />
        </div>

        <div {...fade("0.25s")}>
          <PasswordField
            id="password"
            label={t("auth.password")}
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            onBlur={() => touch("password")}
            autoComplete="new-password"
            disabled={loading}
            required
            tone={error ? "error" : strengthTone(form.password, strength)}
          >
            <PasswordStrengthMeter password={form.password} showExample />
          </PasswordField>
        </div>

        <div {...fade("0.3s")}>
          <PasswordField
            id="confirmPassword"
            label={t("auth.confirmPassword")}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error) setError("");
            }}
            onBlur={() => touch("confirmPassword")}
            autoComplete="new-password"
            disabled={loading}
            required
            showLabel={t("auth.showConfirmPassword")}
            hideLabel={t("auth.hideConfirmPassword")}
            tone={
              passwordsDoNotMatch || error
                ? "error"
                : passwordsMatch
                  ? "success"
                  : "default"
            }
          >
            <PasswordMatchMessage password={form.password} confirmation={confirmPassword} />
          </PasswordField>
        </div>

        <FormAlert>{error}</FormAlert>

        <AuthSubmitButton
          loading={loading}
          disabled={
            !passwordsMatch ||
            strength < 20 ||
            !form.phoneNumber ||
            !form.dateOfBirth ||
            !form.gender
          }
          loadingText={t("auth.registerPage.submitting")}
          {...fade("0.4s")}
        >
          {t("auth.createAccount")}
        </AuthSubmitButton>
      </form>

      <AuthDivider delay="0.45s" />
      <AuthSwitchLink
        prompt={t("auth.haveAccount")}
        href="/login"
        label={t("auth.signIn")}
        delay="0.5s"
      />
      <GuestModeLink delay="0.55s" />
    </AuthShell>
  );
}
