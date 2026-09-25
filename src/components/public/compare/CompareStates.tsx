"use client";

import Link from "next/link";
import { ChevronRight, GitCompare } from "lucide-react";

import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

export function LoadingState({ columns }: { columns: number }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[#e5e7eb]">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `${LABEL_COL_WIDTH}px repeat(${columns}, minmax(220px, 1fr))`,
        }}
      >
        <div className="border-b border-[#e5e7eb] bg-[#fafafa]" />
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="border-b border-l border-[#e5e7eb] px-4 py-5">
            <div className="animate-pulse space-y-3">
              <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
              <div className="aspect-[4/3] w-full rounded-md bg-[#f3f4f6]" />
              <div className="h-4 w-3/4 rounded bg-[#f3f4f6]" />
              <div className="h-3 w-1/2 rounded bg-[#f3f4f6]" />
            </div>
          </div>
        ))}
        {[1, 2, 3].map((r) => (
          <div key={`row-${r}`} className="contents">
            <div className="border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-3.5">
              <div className="h-3 w-20 animate-pulse rounded bg-[#f3f4f6]" />
            </div>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`r${r}-c${i}`}
                className="border-b border-l border-[#e5e7eb] px-4 py-3.5"
              >
                <div className="h-3 w-full animate-pulse rounded bg-[#f3f4f6]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorStateBlock({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-12 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fef2f2]">
        <GitCompare size={18} className="text-[#b91c1c]" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-[#111827]">{text}</h3>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 rounded-md bg-[#111827] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1f2937]"
      >
        {cta}
        <ChevronRight size={14} className="rtl:rotate-180" />
      </Link>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-[#e5e7eb] bg-[#fafafa] p-12 text-center">
      <GitCompare size={22} className="mx-auto text-[#d1d5db]" />
      <p className="mt-3 text-[13px] text-[#6b7280]">{text}</p>
    </div>
  );
}
