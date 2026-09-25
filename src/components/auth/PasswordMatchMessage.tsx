"use client";

import FieldMessage from "@/components/ui/FieldMessage";
import { useLanguage } from "@/context/LanguageContext";

/** "Passwords match / do not match" line under a confirm-password field. */
export default function PasswordMatchMessage({
  password,
  confirmation,
}: {
  password: string;
  confirmation: string;
}) {
  const { t } = useLanguage();

  if (!confirmation) return null;

  return password === confirmation ? (
    <FieldMessage tone="success">{t("auth.feedback.passwordsMatch")}</FieldMessage>
  ) : (
    <FieldMessage tone="error">{t("auth.feedback.passwordsDoNotMatch")}</FieldMessage>
  );
}
