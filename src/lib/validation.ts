const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Digits with an optional leading +, spaces, dashes and brackets.
const PHONE_RE = /^\+?[\d\s\-()]{6,20}$/;

export const isValidEmail = (email: string): boolean => EMAIL_RE.test(email.trim());

export const isValidPhone = (phone: string): boolean => PHONE_RE.test(phone.trim());
