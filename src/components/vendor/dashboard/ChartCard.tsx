import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  className?: string;
  children: ReactNode;
}

/** White card with title, subtitle and an icon badge, wrapping one chart. */
export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  className = "",
  children,
}: ChartCardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#e8dfd8] bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#30251f]">{title}</h3>
          <p className="text-xs text-[#9b8f86]">{subtitle}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5eee9]">
          <Icon size={16} className="text-[#a47e43]" />
        </div>
      </div>
      {children}
    </div>
  );
}
