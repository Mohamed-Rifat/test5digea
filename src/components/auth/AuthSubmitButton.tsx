import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  loadingText: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Full-width dark submit button with the shine sweep on hover. */
export default function AuthSubmitButton({
  loading,
  disabled,
  loadingText,
  children,
  className = "",
  style,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={style}
      className={`group relative flex h-13.5 w-full items-center justify-center overflow-hidden bg-[#30251f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(48,37,31,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#43352d] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] focus:outline-none focus:ring-4 focus:ring-[#30251f]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {loading ? (
        <span className="relative flex items-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          {loadingText}
        </span>
      ) : (
        <span className="relative">{children}</span>
      )}
    </button>
  );
}
