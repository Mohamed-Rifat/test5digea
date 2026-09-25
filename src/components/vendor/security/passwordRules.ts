import type { TranslationKey } from "@/locales";

export interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const evaluateRequirements = (
  password: string,
): PasswordRequirements => ({
  minLength: password.length >= 8,
  hasUpperCase: /[A-Z]/.test(password),
  hasLowerCase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export const getStrength = (requirements: PasswordRequirements) =>
  Object.values(requirements).filter(Boolean).length;

export const getStrengthInfo = (
  strength: number,
): {
  labelKey: TranslationKey | null;
  width: string;
  color: string;
  text: string;
} => {
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

export const REQUIREMENTS: {
  key: keyof PasswordRequirements;
  labelKey: TranslationKey;
}[] = [
  { key: "minLength", labelKey: "vendor.security.reqMinLength" },
  { key: "hasUpperCase", labelKey: "vendor.security.reqUpper" },
  { key: "hasLowerCase", labelKey: "vendor.security.reqLower" },
  { key: "hasNumber", labelKey: "vendor.security.reqNumber" },
  { key: "hasSpecialChar", labelKey: "vendor.security.reqSpecial" },
];

export const TIP_KEYS: TranslationKey[] = [
  "vendor.security.tip1",
  "vendor.security.tip2",
  "vendor.security.tip3",
];
