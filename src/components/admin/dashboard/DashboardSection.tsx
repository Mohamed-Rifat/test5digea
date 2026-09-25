import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface DashboardSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** Right side of the header (legend, badge, …). */
  aside?: ReactNode;
  /** Shortcut link rendered as a small outlined button in the header. */
  action?: { href: string; label: string };
  className?: string;
  children: ReactNode;
}

/** White card with the icon + title header used by every dashboard block. */
export default function DashboardSection({
  icon: Icon,
  title,
  subtitle,
  aside,
  action,
  className = "",
  children,
}: DashboardSectionProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#ebe3dd] bg-white shadow-[0_2px_12px_rgba(48,37,31,0.03)] ${className}`}
    >
      <div className="flex flex-col justify-between gap-3 border-b border-[#f0e9e4] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6f0ec] text-[#806d61]">
            <Icon size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#30251f]">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-[#9b8e86]">{subtitle}</p>
            )}
          </div>
        </div>

        {aside}

        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1.5 self-start rounded-lg border border-[#e9e0da] px-3 py-2 text-xs font-semibold text-[#806d61] transition hover:bg-[#faf7f4] hover:text-[#30251f] sm:self-auto"
          >
            {action.label}
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
