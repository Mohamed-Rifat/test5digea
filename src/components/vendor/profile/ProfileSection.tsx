import type { ReactNode } from "react";

interface ProfileSectionProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Extra classes for the section (grid spans, padding tweaks). */
  className?: string;
  children: ReactNode;
}

/** White rounded card with eyebrow / title / subtitle (vendor profile). */
export function ProfileSection({
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}: ProfileSectionProps) {
  return (
    <section
      className={`rounded-4xl border border-[#e8dfd8] bg-white p-6 shadow-[0_10px_40px_rgba(48,37,31,0.04)] sm:p-8 ${className}`}
    >
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] rtl:tracking-normal text-[#9b8171]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#30251f]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#756b65]">{subtitle}</p>}
      </div>

      {children}
    </section>
  );
}
