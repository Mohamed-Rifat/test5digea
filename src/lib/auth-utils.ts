import { jwtDecode } from "jwt-decode";

import type { JwtPayload } from "@/types/auth";

export type UserRole = "Admin" | "Vendor" | "User";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

/**
 * Decode the role from the JWT token.
 */
export const getRoleFromToken = (
  token: string
): UserRole | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const role =
      decoded[ROLE_CLAIM] ??
      decoded.role;

    if (
      role === "Admin" ||
      role === "Vendor" ||
      role === "User"
    ) {
      return role;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Get the default/home page for each role.
 */
export const getHomePath = (
  role: UserRole | null
): string => {
  switch (role) {
    case "Admin":
      return "/admin";

    case "Vendor":
      return "/vendor";

    case "User":
      return "/";

    default:
      return "/login";
  }
};

/**
 * Check whether a role is allowed to access a route.
 */
export const isRoleAllowed = (
  role: UserRole | null,
  allowedRoles: UserRole[]
): boolean => {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
};

/**
 * Where to send the user after login: the page they originally wanted
 * (`?next=`) when it is a safe, same-site path their role may open,
 * otherwise their role's home page.
 */
export const getPostLoginPath = (
  role: UserRole | null,
  next: string | null | undefined
): string => {
  const home = getHomePath(role);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return home;
  if (/^\/(login|register|forgot-password|verify-otp|reset-password)\b/.test(next)) return home;

  const inAdmin = next === "/admin" || next.startsWith("/admin/");
  const inVendor = next === "/vendor" || next.startsWith("/vendor/");

  if (role === "Admin") return inAdmin ? next : home;
  if (role === "Vendor") return inVendor ? next : home;
  if (role === "User") return inAdmin || inVendor ? home : next;
  return home;
};

/** Login URL that brings the user back to `path` afterwards. */
export const loginPathFor = (path: string | null | undefined) =>
  path && path !== "/" ? `/login?next=${encodeURIComponent(path)}` : "/login";
