"use client";

import { Loader2 } from "lucide-react";

type Props = {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  size?: "sm" | "md";
  /** Track colour when on. */
  onColor?: string;
  className?: string;
};

/**
 * Accessible on/off switch that works in both directions: the knob sits at
 * the *start* when off and slides to the *end* when on (right→left in
 * Arabic, left→right in English).
 */
export default function Switch({
  checked,
  onChange,
  disabled,
  loading,
  label,
  size = "md",
  onColor = "#718b77",
  className = "",
}: Props) {
  const dims =
    size === "sm"
      ? { track: "h-[18px] w-8", knob: "h-3.5 w-3.5", travel: "ltr:translate-x-3.5 rtl:-translate-x-3.5" }
      : { track: "h-5 w-9", knob: "h-4 w-4", travel: "ltr:translate-x-4 rtl:-translate-x-4" };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={onChange}
      className={`relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b17c42]/25 disabled:cursor-not-allowed disabled:opacity-60 ${dims.track} ${className}`}
      style={{ backgroundColor: checked ? onColor : "#c9beb7" }}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] ${dims.knob} ${
          checked ? dims.travel : "translate-x-0"
        }`}
      >
        {loading && <Loader2 size={9} className="animate-spin text-[#6f625a]" />}
      </span>
    </button>
  );
}
