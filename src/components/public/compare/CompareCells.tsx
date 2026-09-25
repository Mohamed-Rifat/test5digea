"use client";

import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

/** Sticky label cell — always visible when scrolling horizontally. */
export function LabelCell({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="sticky start-0 z-20 flex items-center gap-2 border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-3.5 text-[13px] font-medium text-[#111827]"
      style={{ width: LABEL_COL_WIDTH, minWidth: LABEL_COL_WIDTH }}
    >
      {icon && <span className="shrink-0 text-[#9ca3af]">{icon}</span>}
      <span className="truncate">{children}</span>
    </div>
  );
}

/** Value cell for a given column. */
export function ValueCell({
  children,
  emphasized = false,
  className = "",
}: {
  children: React.ReactNode;
  emphasized?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-l border-[#e5e7eb] px-4 py-3.5 text-[13px] leading-[1.55] ${
        emphasized ? "text-[#111827]" : "text-[#374151]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Number badge for ranking (#1, #2, ...). */
export function Rank({ n }: { n: number }) {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[10px] font-semibold text-white">
      {n}
    </span>
  );
}
