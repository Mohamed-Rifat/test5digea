"use client";

import { FormEvent, useState } from "react";
import {
AlertCircle,
Check,
CheckCircle2,
Eye,
EyeOff,
KeyRound,
Lock,
ShieldCheck,
Sparkles,
X,
} from "lucide-react";

import { changePassword } from "@/features/auth/api";
import { getApiErrorMessage } from "@/lib/error";

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

const getStrengthInfo = (strength: number) => {
if (strength === 0) {
return {
label: "",
width: "0%",
color: "bg-[#e8e1dc]",
text: "text-[#8b7e76]",
};
}

if (strength <= 2) {
return {
label: "Weak",
width: "40%",
color: "bg-[#d98b8b]",
text: "text-[#b15f5f]",
};
}

if (strength === 3) {
return {
label: "Good",
width: "60%",
color: "bg-[#c9a66b]",
text: "text-[#9a773d]",
};
}

if (strength === 4) {
return {
label: "Strong",
width: "80%",
color: "bg-[#8fa69a]",
text: "text-[#637c6f]",
};
}

return {
label: "Very strong",
width: "100%",
color: "bg-[#71907f]",
text: "text-[#527061]",
};
};

const REQUIREMENTS: {
key: keyof PasswordRequirements;
label: string;
}[] = [
{ key: "minLength", label: "8+ characters" },
{ key: "hasUpperCase", label: "Uppercase" },
{ key: "hasLowerCase", label: "Lowercase" },
{ key: "hasNumber", label: "Number" },
{ key: "hasSpecialChar", label: "Special character" },
];

export default function VendorSecurityPage() {
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

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


setError("");
setSuccess(false);

if (!currentPassword) {
  setError("Please enter your current password.");
  return;
}

if (!isStrongEnough) {
  setError("Please make sure your new password meets all requirements.");
  return;
}

if (newPassword !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

if (samePasswordAsCurrent) {
  setError(
    "Your new password must be different from your current password."
  );
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
  setError(
    getApiErrorMessage(
      err,
      "We couldn't update your password. Please check your current password and try again."
    )
  );
} finally {
  setLoading(false);
}

};

const PasswordInput = ({
id,
label,
value,
onChange,
visible,
setVisible,
autoComplete,
}: {
id: string;
label: string;
value: string;
onChange: (value: string) => void;
visible: boolean;
setVisible: (value: boolean) => void;
autoComplete: string;
}) => ( <div> <label
     htmlFor={id}
     className="mb-2 block text-[13px] font-medium text-[#51463f]"
   >
{label} </label>


  <div className="relative">
    <input
      id={id}
      type={visible ? "text" : "password"}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        if (error) setError("");
        if (success) setSuccess(false);
      }}
      autoComplete={autoComplete}
      disabled={loading}
      className="
        h-[50px]
        w-full
        rounded-2xl
        border
        border-[#e5ddd7]
        bg-[#fcfbfa]
        px-4
        pr-12
        text-[14px]
        text-[#30251f]
        outline-none
        transition
        placeholder:text-[#b4aaa3]
        focus:border-[#b09a8c]
        focus:bg-white
        focus:ring-4
        focus:ring-[#b09a8c]/10
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    />

    <button
      type="button"
      onClick={() => setVisible(!visible)}
      disabled={loading}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      className="
        absolute
        right-1.5
        top-1/2
        flex
        h-9
        w-9
        -translate-y-1/2
        items-center
        justify-center
        rounded-xl
        text-[#968981]
        transition
        hover:bg-[#f1ece8]
        hover:text-[#4b4039]
      "
    >
      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  </div>
</div>


);

return ( <main className="min-h-full bg-[#faf8f6]"> <div className="mx-auto max-w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
{/* Header */} <header className="mb-7 lg:mb-9"> <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a28c7e]"> <ShieldCheck size={14} strokeWidth={1.8} />
Account security </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0e7e1]">
          <Lock
            size={20}
            strokeWidth={1.7}
            className="text-[#92704e]"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#30251f] sm:text-3xl">
            Security
          </h1>

          <p className="mt-1 text-sm text-[#81756e]">
            Keep your vendor account protected.
          </p>
        </div>
      </div>
    </header>

    {/* Main layout */}
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
      {/* Password card */}
      <section className=" border border-[#ebe3dd] bg-white p-5 shadow-[0_12px_40px_rgba(62,45,36,0.045)] sm:p-7 lg:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#f0ebe7] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound
                size={17}
                className="text-[#a27e50]"
                strokeWidth={1.8}
              />

              <h2 className="text-base font-semibold text-[#30251f]">
                Change password
              </h2>
            </div>

            <p className="mt-1.5 text-xs leading-5 text-[#8c817a] sm:text-sm">
              Choose a strong password that you do not use elsewhere.
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
            <span>Password updated successfully.</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-5"
        >
          <PasswordInput
            id="currentPassword"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrent}
            setVisible={setShowCurrent}
            autoComplete="current-password"
          />

          <PasswordInput
            id="newPassword"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showNew}
            setVisible={setShowNew}
            autoComplete="new-password"
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
                  className={`min-w-[68px] text-right text-[11px] font-semibold ${strengthInfo.text}`}
                >
                  {strengthInfo.label}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {REQUIREMENTS.map((item) => {
                  const fulfilled = requirements[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        fulfilled
                          ? "text-[#66806f]"
                          : "text-[#948982]"
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

                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <PasswordInput
            id="confirmPassword"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirm}
            setVisible={setShowConfirm}
            autoComplete="new-password"
          />

          {confirmPassword.length > 0 && (
            <div
              className={`-mt-2 flex items-center gap-1.5 text-[11px] ${
                passwordsMatch
                  ? "text-[#63806d]"
                  : "text-[#b86565]"
              }`}
            >
              {passwordsMatch ? (
                <Check size={13} />
              ) : (
                <X size={13} />
              )}

              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"}
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
              className="
                h-11
                rounded-xl
                px-5
                text-sm
                font-medium
                text-[#766a63]
                transition
                hover:bg-[#f6f2ef]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="
                h-11
                rounded-xl
                bg-[#30251f]
                px-6
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_22px_rgba(48,37,31,0.12)]
                transition
                hover:bg-[#43352d]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>

      {/* Security tips */}
      <aside className="space-y-4">
        <div className=" border border-[#ebe3dd] bg-[#f5eee9] p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
            <Sparkles
              size={18}
              className="text-[#a17c4d]"
              strokeWidth={1.7}
            />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-[#3a2e27]">
            A safer password
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#786c64]">
            A unique password helps protect your vendor account even if
            another service you use is compromised.
          </p>

          <div className="mt-5 space-y-3">
            {[
              "Use a password you don't use elsewhere.",
              "Avoid names, birthdays, or business details.",
              "A password manager can help you create unique passwords.",
            ].map((tip) => (
              <div
                key={tip}
                className="flex gap-2.5 text-xs leading-5 text-[#6f625a]"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                  <Check
                    size={10}
                    className="text-[#7d927f]"
                    strokeWidth={2.5}
                  />
                </span>

                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className=" border border-[#ebe3dd] bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck
              size={17}
              className="text-[#8b7668]"
              strokeWidth={1.7}
            />

            <span className="text-xs font-medium text-[#5e5149]">
              Your session stays active
            </span>
          </div>

          <p className="mt-2 pl-[27px] text-[11px] leading-5 text-[#938780]">
            Changing your password will not sign you out from this
            device.
          </p>
        </div>
      </aside>
    </div>
  </div>
</main>


);
}
