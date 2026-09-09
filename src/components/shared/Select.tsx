"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * A styled dropdown that behaves like a native <select> (controlled
 * value/onChange of strings) but looks and feels like a modern component
 * library control — rounded trigger, floating panel, hover/selected states,
 * keyboard support (Escape to close, click-outside to close).
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  emptyMessage = "No options available.",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const isDisabled = disabled || loading || options.length === 0;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-[#fcfaf8] px-4 py-3 text-left text-sm outline-none transition ${
          open
            ? "border-[#30251f] ring-2 ring-[#30251f]/10"
            : "border-[#e3d9d1] hover:border-[#c9bcaf]"
        } ${
          isDisabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`truncate ${
            selected ? "text-[#30251f]" : "text-[#a99d94]"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>

        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#a47e43]" />
        ) : (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#8d7b70] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && !isDisabled && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#e8dfd8] bg-white shadow-lg"
        >
          <div className="max-h-64 overflow-y-auto py-1.5">
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#9a8d85]">
                {emptyMessage}
              </p>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? "bg-[#f7f1ea] text-[#30251f]"
                        : "text-[#4c423b] hover:bg-[#faf7f4]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="block truncate text-xs text-[#9a8d85]">
                          {option.description}
                        </span>
                      )}
                    </span>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-[#a47e43]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
