import type { ReactNode } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

type Tone = "error" | "success" | "info";

const STYLES: Record<Tone, { icon: typeof Info; text: string; iconColor: string }> = {
  error: { icon: AlertCircle, text: "text-red-500", iconColor: "text-red-500" },
  success: { icon: CheckCircle, text: "text-emerald-600", iconColor: "text-emerald-500" },
  info: { icon: Info, text: "text-[#9b8f86]", iconColor: "text-[#b3a79f]" },
};

interface FieldMessageProps {
  tone?: Tone;
  id?: string;
  /** Hide the leading icon (plain helper text). */
  plain?: boolean;
  children: ReactNode;
}

/** Small status line under a field ("valid email", "required", …). */
export default function FieldMessage({
  tone = "error",
  id,
  plain = false,
  children,
}: FieldMessageProps) {
  const { icon: Icon, text, iconColor } = STYLES[tone];

  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : undefined}
      className={`mt-1.5 flex items-center gap-1.5 text-start text-xs ${text}`}
    >
      {!plain && <Icon size={14} className={`shrink-0 ${iconColor}`} />}
      <span>{children}</span>
    </p>
  );
}
