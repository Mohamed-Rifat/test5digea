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
  } catch (error) {
    console.error("Failed to decode JWT role:", error);
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
