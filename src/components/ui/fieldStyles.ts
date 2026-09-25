/**
 * Shared look of every text field on the site — the underlined,
 * floating-label style introduced on the login / register pages.
 *
 * - The underline changes colour on focus only (no hover border).
 * - No outline / ring is drawn around the field when it is clicked.
 */

export type FieldTone = "default" | "error" | "success" | "warning";
export type FieldSize = "md" | "sm";

export const FIELD_BORDER: Record<FieldTone, string> = {
  default: "border-[#ded5ce] focus:border-[#9a8171]",
  error: "border-red-300 focus:border-red-500",
  success: "border-emerald-400 focus:border-emerald-500",
  warning: "border-yellow-400 focus:border-yellow-500",
};

export const FIELD_LABEL_COLOR: Record<FieldTone, string> = {
  default: "text-[#a59a92] peer-focus:text-[#9a8171]",
  error: "text-red-500",
  success: "text-emerald-600",
  warning: "text-yellow-600",
};

export const FIELD_SIZE: Record<FieldSize, string> = {
  md: "py-3 text-[15px]",
  sm: "py-2 text-sm",
};

/** Base classes of the <input> / <textarea> / <select> element itself. */
export const FIELD_BASE =
  "field-underline peer block w-full appearance-none rounded-none border-0 border-b-2 bg-transparent px-0 text-[#30251f] outline-none transition-colors duration-300 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Label position: floated by default, dropped into the field while the
 * placeholder is shown, floated again on focus. Works for controlled and
 * uncontrolled fields alike (the field always has a placeholder).
 */
export const FIELD_LABEL_FLOAT: Record<FieldSize, string> = {
  md: "top-3 -translate-y-6 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75",
  sm: "top-2 -translate-y-5 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75",
};

/** Label that always stays floated (date pickers, selects, etc.). */
export const FIELD_LABEL_FIXED: Record<FieldSize, string> = {
  md: "top-3 -translate-y-6 scale-75",
  sm: "top-2 -translate-y-5 scale-75",
};

export const FIELD_LABEL_BASE =
  "pointer-events-none absolute -z-10 ltr:origin-left rtl:origin-right text-sm transition-all duration-300";

export function fieldClass({
  tone = "default",
  size = "md",
}: { tone?: FieldTone; size?: FieldSize } = {}) {
  return `${FIELD_BASE} ${FIELD_SIZE[size]} ${FIELD_BORDER[tone]}`;
}
