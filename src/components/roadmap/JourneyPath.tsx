"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { RoadmapItemStatus, type RoadmapItem } from "@/types/roadmap";
import type { MyReview } from "@/features/reviews/hooks/useMyReviews";
import { useLanguage } from "@/context/LanguageContext";

import { JourneyCard } from "@/components/roadmap/JourneyCard";
import { GOLD, getRoadmapItemKey, getStepState } from "@/components/roadmap/roadmapUtils";
import { useJourneyColumns } from "@/components/roadmap/useJourneyColumns";

export type JourneyHandlers = {
  actionLoading: string | null;
  onReview: (item: RoadmapItem) => void;
  onComplete: (categoryId: string | number) => Promise<boolean>;
  onUncomplete: (categoryId: string | number) => Promise<boolean>;
  onRemove: (categoryId: string | number) => Promise<boolean>;
  onRequestExternalComplete: (item: RoadmapItem) => void;
  onCompletedWithVendor: (item: RoadmapItem) => void;
  /** The couple's existing review for this step's vendor, if any. */
  reviewOf: (item: RoadmapItem) => MyReview | undefined;
  /** Name of the outside vendor the couple reported for this step, if any. */
  referralOf: (item: RoadmapItem) => string | undefined;
  onViewReview: (review: MyReview) => void;
  /** Share an outside vendor's details for a step that's already done. */
  onShareExternal?: (item: RoadmapItem) => void;
};

type RoadSegment = { d: string; done: boolean };

export function JourneyPath({
  items,
  nextItem,
  numberOf,
  total,
  ...handlers
}: {
  items: RoadmapItem[];
  nextItem: RoadmapItem | null;
  /** 1-based step number of an item in the full, ordered roadmap. */
  numberOf: (item: RoadmapItem) => number;
  total: number;
} & JourneyHandlers) {
  const { dir } = useLanguage();
  const columns = useJourneyColumns();

  const rows = useMemo(() => {
    const result: RoadmapItem[][] = [];
    for (let i = 0; i < items.length; i += columns)
      result.push(items.slice(i, i + columns));
    return result;
  }, [items, columns]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [segments, setSegments] = useState<RoadSegment[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const c = container.getBoundingClientRect();
      setBox({ width: c.width, height: c.height });

      if (columns === 1) {
        setSegments([]);
        return;
      }

      const points = items.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - c.left + r.width / 2,
          y: r.top - c.top + r.height / 2,
          w: r.width,
        };
      });

      const next: RoadSegment[] = [];
      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i];
        const b = points[i + 1];
        if (!a || !b) continue;
        const done = items[i].status === RoadmapItemStatus.Completed;

        if (Math.abs(a.y - b.y) < 4) {
          next.push({ d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, done });
        } else {
          // U-turn outside the row, on the side where this row ends.
          const side = a.x > c.width / 2 ? 1 : -1;
          const edge = a.x + side * (a.w / 2 + 34);
          next.push({
            d: `M ${a.x} ${a.y} C ${edge} ${a.y} ${edge} ${b.y} ${b.x} ${b.y}`,
            done,
          });
        }
      }
      setSegments(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [items, columns, dir]);

  return (
    <div ref={containerRef} className="relative">
      {columns > 1 && box.width > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={box.width}
          height={box.height}
          aria-hidden="true"
        >
          {segments.map((s, i) => (
            <g key={i}>
              <path
                d={s.d}
                fill="none"
                stroke="#efe6dd"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d={s.d}
                fill="none"
                stroke={s.done ? GOLD : "#cdb9a5"}
                strokeWidth={s.done ? 4 : 2.5}
                strokeLinecap="round"
                strokeDasharray={s.done ? undefined : "2 10"}
                className={
                  s.done ? undefined : "animate-[dashMove_3s_linear_infinite]"
                }
              />
            </g>
          ))}
        </svg>
      )}

      {columns === 1 ? (
        /* Mobile: vertical timeline on the start side */
        <ol className="relative space-y-4 ps-9">
          <span
            className="absolute bottom-6 start-[15px] top-6 w-0.5 rounded-full bg-linear-to-b from-[#d8b98f] via-[#e7d9cb] to-[#efe6dd]"
            aria-hidden="true"
          />
          {items.map((item, index) => (
            <li key={getRoadmapItemKey(item, index)} className="relative">
              <span
                className={`absolute -start-9 top-6 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#fbf8f4] text-[11px] font-bold text-white ${
                  getStepState(item) === "completed"
                    ? "bg-emerald-500"
                    : getStepState(item) === "selected"
                      ? "bg-[#c08a4a]"
                      : "bg-[#30251f]"
                }`}
                aria-hidden="true"
              >
                {getStepState(item) === "completed" ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  numberOf(item)
                )}
              </span>
              <JourneyCard
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                item={item}
                index={numberOf(item) - 1}
                total={total}
                isNext={nextItem === item}
                {...handlers}
              />
            </li>
          ))}
        </ol>
      ) : (
        <div className="relative space-y-10 px-2 lg:space-y-14 lg:px-6">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`flex items-stretch gap-8 lg:gap-12 ${rowIndex % 2 === 1 ? "flex-row-reverse" : ""}`}
            >
              {row.map((item) => {
                const index = items.indexOf(item);
                return (
                  <div
                    key={getRoadmapItemKey(item, index)}
                    className="min-w-0 flex-1 basis-0"
                  >
                    <JourneyCard
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      item={item}
                      index={numberOf(item) - 1}
                      total={total}
                      isNext={nextItem === item}
                      {...handlers}
                    />
                  </div>
                );
              })}
              {Array.from({ length: columns - row.length }).map((_, i) => (
                <div
                  key={`spacer-${i}`}
                  className="min-w-0 flex-1 basis-0"
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
