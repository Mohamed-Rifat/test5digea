"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { changePassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/locales";

interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const evaluateRequirements = (
  password: string
): PasswordRequirements => ({
  minLength: password.length >= 8,
  hasUpperCase: /[A-Z]/.test(password),
  hasLowerCase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const getStrength = (requirements: PasswordRequirements) =>
  Object.values(requirements).filter(Boolean).length;

const getStrengthInfo = (
  strength: number
): { labelKey: TranslationKey | null; width: string; color: string; text: string } => {
  if (strength === 0) {
    return {
      labelKey: null,
      width: "0%",
      color: "bg-[#e8e1dc]",
      text: "text-[#8b7e76]",
    };
  }

  if (strength <= 2) {
    return {
      labelKey: "vendor.security.strengthWeak",
      width: "40%",
      color: "bg-[#d98b8b]",
      text: "text-[#b15f5f]",
    };
  }

  if (strength === 3) {
    return {
      labelKey: "vendor.security.strengthGood",
      width: "60%",
      color: "bg-[#c9a66b]",
      text: "text-[#9a773d]",
    };
  }

  if (strength === 4) {
    return {
      labelKey: "vendor.security.strengthStrong",
      width: "80%",
      color: "bg-[#8fa69a]",
      text: "text-[#637c6f]",
    };
  }

  return {
    labelKey: "vendor.security.strengthVeryStrong",
    width: "100%",
    color: "bg-[#71907f]",
    text: "text-[#527061]",
  };
};

const REQUIREMENTS: {
  key: keyof PasswordRequirements;
  labelKey: TranslationKey;
}[] = [
  { key: "minLength", labelKey: "vendor.security.reqMinLength" },
  { key: "hasUpperCase", labelKey: "vendor.security.reqUpper" },
  { key: "hasLowerCase", labelKey: "vendor.security.reqLower" },
  { key: "hasNumber", labelKey: "vendor.security.reqNumber" },
  { key: "hasSpecialChar", labelKey: "vendor.security.reqSpecial" },
];

const TIP_KEYS: TranslationKey[] = [
  "vendor.security.tip1",
  "vendor.security.tip2",
  "vendor.security.tip3",
];

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  autoComplete: string;
  disabled: boolean;
  showLabel: string;
  hideLabel: string;
}

// Declared at module level (not inside the page component): a component
// created during render gets a new identity on every keystroke, which
// remounts the <input> and drops focus after each character.
function PasswordInput({
  id,
  label,
  value,
  onChange,
  visible,
  setVisible,
  autoComplete,
  disabled,
  showLabel,
  hideLabel,
}: PasswordInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-medium text-[#51463f]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-12.5 w-full rounded-2xl border border-[#e5ddd7] bg-[#fcfbfa] px-4 pe-12 text-[14px] text-[#30251f] outline-none transition placeholder:text-[#b4aaa3] focus:border-[#b09a8c] focus:bg-white focus:ring-4 focus:ring-[#b09a8c]/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          disabled={disabled}
          aria-label={visible ? hideLabel : showLabel}
          className="absolute end-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#968981] transition hover:bg-[#f1ece8] hover:text-[#4b4039]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function VendorSecurityPage() {
  const { t } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  // Typing in any field clears the previous error / success message.
  const withReset =
    (setter: (value: string) => void) => (value: string) => {
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

  return (
    <div className="min-h-full bg-[#faf8f6]">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <header className="mb-7 lg:mb-9">
          <div className="mt-3 flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
                {t("vendor.security.title")}
              </h1>

              <p className="mt-1 text-sm text-[#81756e]">
                {t("vendor.security.subtitle")}
              </p>
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          {/* Password card */}
          <section className="border border-[#ebe3dd] bg-white p-5 shadow-[0_12px_40px_rgba(62,45,36,0.045)] sm:p-7 lg:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#f0ebe7] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound
                    size={17}
                    className="text-[#a27e50]"
                    strokeWidth={1.8}
                  />

                  <h2 className="text-base font-semibold text-[#30251f]">
                    {t("vendor.security.changeTitle")}
                  </h2>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-[#8c817a] sm:text-sm">
                  {t("vendor.security.changeSubtitle")}
                </p>
              </div>
            </div>

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mt-5 flex items-center gap-3 rounded-2xl border border-[#dcebe2] bg-[#f3faf5] px-4 py-3 text-sm text-[#557765]"
              >
                <CheckCircle2 size={17} className="shrink-0" />
                <span>{t("vendor.security.success")}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 space-y-5"
            >
              <PasswordInput
                id="currentPassword"
                label={fieldLabels.current}
                value={currentPassword}
                onChange={withReset(setCurrentPassword)}
                visible={showCurrent}
                setVisible={setShowCurrent}
                autoComplete="current-password"
                disabled={loading}
                {...toggleLabels(fieldLabels.current)}
              />

              <PasswordInput
                id="newPassword"
                label={fieldLabels.next}
                value={newPassword}
                onChange={withReset(setNewPassword)}
                visible={showNew}
                setVisible={setShowNew}
                autoComplete="new-password"
                disabled={loading}
                {...toggleLabels(fieldLabels.next)}
              />

              {/* Password strength */}
              {newPassword.length > 0 && (
                <div className="-mt-2 rounded-2xl bg-[#faf8f6] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e8e1dc]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strengthInfo.color}`}
                        style={{ width: strengthInfo.width }}
                      />
                    </div>

                    <span
                      className={`min-w-17 text-end text-[11px] font-semibold ${strengthInfo.text}`}
                    >
                      {strengthInfo.labelKey ? t(strengthInfo.labelKey) : ""}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    {REQUIREMENTS.map((item) => {
                      const fulfilled = requirements[item.key];

                      return (
                        <div
                          key={item.key}
                          className={`flex items-center gap-1.5 text-[11px] ${
                            fulfilled ? "text-[#66806f]" : "text-[#948982]"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                              fulfilled
                                ? "bg-[#e2eee6]"
                                : "border border-[#d8d0ca]"
                            }`}
                          >
                            {fulfilled && <Check size={10} />}
                          </span>

                          {t(item.labelKey)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <PasswordInput
                id="confirmPassword"
                label={fieldLabels.confirm}
                value={confirmPassword}
                onChange={withReset(setConfirmPassword)}
                visible={showConfirm}
                setVisible={setShowConfirm}
                autoComplete="new-password"
                disabled={loading}
                {...toggleLabels(fieldLabels.confirm)}
              />

              {confirmPassword.length > 0 && (
                <div
                  className={`-mt-2 flex items-center gap-1.5 text-[11px] ${
                    passwordsMatch ? "text-[#63806d]" : "text-[#b86565]"
                  }`}
                >
                  {passwordsMatch ? <Check size={13} /> : <X size={13} />}

                  {passwordsMatch
                    ? t("vendor.security.match")
                    : t("vendor.security.noMatch")}
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-2xl border border-[#efd9d7] bg-[#fff7f6] px-4 py-3 text-[13px] leading-5 text-[#a75e5a]"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="h-11 rounded-xl px-5 text-sm font-medium text-[#766a63] transition hover:bg-[#f6f2ef] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("vendor.security.clear")}
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-11 rounded-xl bg-[#30251f] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(48,37,31,0.12)] transition hover:bg-[#43352d] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading
                    ? t("vendor.security.updating")
                    : t("vendor.security.update")}
                </button>
              </div>
            </form>
          </section>

          {/* Security tips */}
          <aside className="space-y-4">
            <div className="border border-[#ebe3dd] bg-[#f5eee9] p-5 sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
                <Sparkles
                  size={18}
                  className="text-[#a17c4d]"
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#3a2e27]">
                {t("vendor.security.tipsTitle")}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#786c64]">
                {t("vendor.security.tipsText")}
              </p>

              <div className="mt-5 space-y-3">
                {TIP_KEYS.map((tipKey) => (
                  <div
                    key={tipKey}
                    className="flex gap-2.5 text-xs leading-5 text-[#6f625a]"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                      <Check
                        size={10}
                        className="text-[#7d927f]"
                        strokeWidth={2.5}
                      />
                    </span>

                    <span>{t(tipKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#ebe3dd] bg-white px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  size={17}
                  className="text-[#8b7668]"
                  strokeWidth={1.7}
                />

                <span className="text-xs font-medium text-[#5e5149]">
                  {t("vendor.security.sessionTitle")}
                </span>
              </div>

              <p className="mt-2 ps-6.75 text-[11px] leading-5 text-[#938780]">
                {t("vendor.security.sessionText")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
