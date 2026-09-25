import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right side of the header (button, counter, …). */
  aside?: ReactNode;
  children: ReactNode;
}

/** White rounded card with an icon + title header (service forms). */
export default function SectionCard({ icon: Icon, title, subtitle, aside, children }: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-[#e8dfd8] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5eee9] sm:h-9 sm:w-9">
            <Icon size={14} className="text-[#a47e43] sm:h-4.5 sm:w-4.5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#30251f] sm:text-base">{title}</h2>
            {subtitle && <p className="text-[10px] text-[#9b8f86] sm:text-xs">{subtitle}</p>}
          </div>
        </div>

        {aside}
      </div>

      {children}
    </div>
  );
}
