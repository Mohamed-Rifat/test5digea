"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  /** "danger" styles the confirm button in red (delete, reject, deactivate…). */
  tone?: "default" | "danger";
}

type ConfirmFn = (options?: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

type PendingConfirm = ConfirmOptions & { resolve: (value: boolean) => void };

/**
 * Promise-based replacement for window.confirm():
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ message: "Delete?", tone: "danger" }))) return;
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    const normalized: ConfirmOptions =
      typeof options === "string" ? { message: options } : options ?? {};

    return new Promise<boolean>((resolve) => {
      setPending((previous) => {
        // Never leave an earlier caller hanging.
        previous?.resolve(false);
        return { ...normalized, resolve };
      });
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {pending && <ConfirmDialog options={pending} onSettle={settle} />}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialog({
  options,
  onSettle,
}: {
  options: ConfirmOptions;
  onSettle: (value: boolean) => void;
}) {
  const { t } = useLanguage();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const danger = options.tone === "danger";

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onSettle(false);
        return;
      }

      // Simple focus trap between the two buttons.
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onSettle]);

  const Icon = danger ? AlertTriangle : HelpCircle;

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={options.cancelText || t("common.cancel")}
        tabIndex={-1}
        onClick={() => onSettle(false)}
        className="absolute inset-0 cursor-default bg-[#1f1813]/45 backdrop-blur-[3px] animate-fade-in"
      />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#eee7e1] bg-white p-6 shadow-[0_30px_80px_rgba(48,37,31,0.28)] animate-dialog-in"
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              danger ? "bg-red-50 text-red-500" : "bg-[#f7efe4] text-[#a47e43]"
            }`}
          >
            <Icon size={21} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-base font-bold leading-6 text-[#30251f]"
            >
              {options.title || t("common.areYouSure")}
            </h2>
            <p
              id="confirm-dialog-message"
              className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#766d67]"
            >
              {options.message || t("common.confirmAction")}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onSettle(false)}
            className="h-11 rounded-2xl border border-[#e8dfd8] px-5 text-sm font-semibold text-[#5e524b] transition hover:bg-[#faf6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47e43]"
          >
            {options.cancelText || t("common.cancel")}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onSettle(true)}
            className={`h-11 rounded-2xl px-5 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-500"
                : "bg-[#30251f] hover:bg-[#1f1813] focus-visible:outline-[#a47e43]"
            }`}
          >
            {options.confirmText || t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside ConfirmProvider");
  return context;
}
