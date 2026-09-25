"use client";

import { FormEvent, useState } from "react";
import { changePassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

import {
  evaluateRequirements,
  getStrength,
  getStrengthInfo,
} from "./passwordRules";

/** State + submit of the vendor "change password" card. */
export function useVendorPasswordForm() {
  const { t } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requirements = evaluateRequirements(newPassword);
  const strength = getStrength(requirements);
  const strengthInfo = getStrengthInfo(strength);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const samePasswordAsCurrent =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    currentPassword === newPassword;

  const isStrongEnough = strength === 5;

  const canSubmit =
    !loading &&
    currentPassword.length > 0 &&
    isStrongEnough &&
    passwordsMatch &&
    !samePasswordAsCurrent;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Typing in any field clears the previous error / success message.
  const withReset = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError(t("vendor.security.errors.enterCurrent"));
      return;
    }

    if (!isStrongEnough) {
      setError(t("vendor.security.errors.requirements"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("vendor.security.errors.mismatch"));
      return;
    }

    if (samePasswordAsCurrent) {
      setError(t("vendor.security.errors.same"));
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(true);
      resetForm();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("vendor.security.errors.failed")));
    } finally {
      setLoading(false);
    }
  };

  const fieldLabels = {
    current: t("auth.changePasswordPage.currentPassword"),
    next: t("vendor.security.newPassword"),
    confirm: t("vendor.security.confirmPassword"),
  };

  const toggleLabels = (label: string) => ({
    showLabel: t("auth.changePasswordPage.showField", { label }),
    hideLabel: t("auth.changePasswordPage.hideField", { label }),
  });

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword: withReset(setCurrentPassword),
    setNewPassword: withReset(setNewPassword),
    setConfirmPassword: withReset(setConfirmPassword),
    loading,
    error,
    success,
    requirements,
    strengthInfo,
    passwordsMatch,
    canSubmit,
    resetForm,
    handleSubmit,
    fieldLabels,
    toggleLabels,
  };
}
