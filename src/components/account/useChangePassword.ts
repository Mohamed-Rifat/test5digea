"use client";

import { FormEvent, useState } from "react";

import { changePassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import { passwordStrength } from "@/components/auth/passwordStrength";

/** State + submit of the signed-in user's "change password" form. */
export function useChangePassword() {
  const { t } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const withReset = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword) {
      setError(t("auth.changePasswordPage.errors.currentRequired"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("auth.changePasswordPage.errors.tooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.changePasswordPage.errors.mismatch"));
      return;
    }

    if (newPassword === currentPassword) {
      setError(t("auth.changePasswordPage.errors.sameAsCurrent"));
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, t("auth.changePasswordPage.errors.failed")),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword: withReset(setCurrentPassword),
    newPassword,
    setNewPassword: withReset(setNewPassword),
    confirmPassword,
    setConfirmPassword: withReset(setConfirmPassword),
    loading,
    error,
    success,
    strength,
    passwordsMatch,
    passwordsDoNotMatch,
    handleSubmit,
  };
}
