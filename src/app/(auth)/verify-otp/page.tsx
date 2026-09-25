"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { forgotPassword, verifyOtp } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";

import AuthShell from "@/components/auth/AuthShell";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import OtpInput, { type OtpInputHandle } from "@/components/auth/OtpInput";
import { BackToSignIn } from "@/components/auth/AuthLinks";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

function VerifyOtpForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const otpRef = useRef<OtpInputHandle>(null);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const otp = digits.join("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError(t("auth.verifyOtpPage.missingEmail"));
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      setError(t("auth.verifyOtpPage.enterCode", { length: OTP_LENGTH }));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email, otp });

      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(
          otp
        )}`
      );
    } catch (err: unknown) {

      setError(
        getApiErrorMessage(
          err,
          t("auth.verifyOtpPage.invalidCode")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || resending) return;

    setResending(true);
    setError("");

    try {
      await forgotPassword({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      otpRef.current?.focus();
    } catch (err: unknown) {

      setError(
        getApiErrorMessage(err, t("auth.verifyOtpPage.resendFailed"))
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      page="verifyOtpPage"
      icon={<ShieldCheck size={22} />}
      title={t("auth.verifyOtpPage.title")}
      subtitle={
        email ? (
          <>
            {t("auth.verifyOtpPage.sentToPrefix", { length: OTP_LENGTH })}{" "}
            <bdi className="font-semibold text-[#30251f]">{email}</bdi>.
          </>
        ) : (
          t("auth.verifyOtpPage.noEmail")
        )
      }
    >
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  <OtpInput
                    ref={otpRef}
                    digits={digits}
                    onChange={(next) => {
                      setDigits(next);
                      if (error) setError("");
                    }}
                    disabled={loading}
                    invalid={!!error}
                  />
                </div>

                <FormAlert>{error}</FormAlert>

                <AuthSubmitButton
                  loading={loading}
                  disabled={!email}
                  loadingText={t("auth.verifyOtpPage.submitting")}
                >
                  {t("auth.verifyOtpPage.submit")}
                </AuthSubmitButton>
              </form>

              {/* Resend */}
              <p className="mt-6 text-center text-sm text-[#7b7069]">
                {t("auth.verifyOtpPage.didntGetCode")}{" "}
                {cooldown > 0 ? (
                  <span className="font-semibold text-[#a59a92]">
                    {t("auth.verifyOtpPage.resendIn", { seconds: cooldown })}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || !email}
                    className="font-semibold text-[#30251f] transition-colors duration-200 hover:text-[#9a8171] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending ? t("auth.verifyOtpPage.resending") : t("auth.verifyOtpPage.resend")}
                  </button>
                )}
              </p>

              <BackToSignIn />
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
