import type { FieldTone } from "@/components/ui/fieldStyles";

export interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const PASSWORD_REQUIREMENT_KEYS: (keyof PasswordRequirements)[] = [
  "minLength",
  "hasUpperCase",
  "hasLowerCase",
  "hasNumber",
  "hasSpecialChar",
];

export function checkPassword(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

/** 0–100, in steps of 20 (one step per satisfied requirement). */
export function passwordStrength(password: string): number {
  const fulfilled = Object.values(checkPassword(password)).filter(Boolean).length;
  return (fulfilled / PASSWORD_REQUIREMENT_KEYS.length) * 100;
}

/** Underline colour of a password field for a given strength. */
export function strengthTone(password: string, strength: number): FieldTone {
  if (!password || strength === 0) return "default";
  if (strength >= 60) return "success";
  if (strength >= 40) return "warning";
  return "error";
}
