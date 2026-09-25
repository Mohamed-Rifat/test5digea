"use client";

import { LabelCell, ValueCell } from "@/components/public/compare/CompareCells";
import { LABEL_COL_WIDTH } from "@/components/public/compare/compareUtils";

import type { CompareData } from "./useCompareData";

/** One row per compared attribute. */
export function CompareAttributeRows({ data }: { data: CompareData }) {
  const { items, visibleRows, gridTemplate } = data;

  return (
    <>
      {visibleRows.map((row) => (
        <div
          key={row.key}
          className="grid hover:bg-[#fafafa]"
          style={{
            gridTemplateColumns: `${LABEL_COL_WIDTH}px ${gridTemplate}`,
          }}
        >
          <LabelCell>{row.label}</LabelCell>
          {items.map((item) => (
            <ValueCell
              key={`${row.key}-${item.id}`}
              emphasized={!row.multiline}
            >
              {row.multiline ? (
                <p className="line-clamp-4 text-[#4b5563]">
                  {row.get(item as never)}
                </p>
              ) : (
                row.get(item as never)
              )}
            </ValueCell>
          ))}
        </div>
      ))}
    </>
  );
}
