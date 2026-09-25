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
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  /** Optional bold heading shown above the message. */
  title?: string;
  /** Auto-dismiss delay in ms (default depends on the type). */
  duration?: number;
  /** Optional call-to-action shown under the message (e.g. "Open roadmap"). */
  action?: { label: string; href?: string; onClick?: () => void };
}

type ToastItemData = {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
  duration: number;
  action?: ToastOptions["action"];
};

type ToastFn = (message: string, type?: ToastType, options?: ToastOptions) => void;

type ToastContextValue = {
  toast: ToastFn;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 4;
const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3800,
  info: 4200,
  warning: 5200,
  error: 6000,
};

const STYLES: Record<
  ToastType,
  { icon: typeof Info; iconClass: string; bar: string; ring: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
    ring: "border-emerald-100",
  },
  error: {
    icon: XCircle,
    iconClass: "bg-red-50 text-red-500",
    bar: "bg-red-500",
    ring: "border-red-100",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
    ring: "border-amber-100",
  },
  info: {
    icon: Info,
    iconClass: "bg-[#f7efe4] text-[#a47e43]",
    bar: "bg-[#a47e43]",
    ring: "border-[#eee2d2]",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItemData[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback<ToastFn>((message, type = "info", options) => {
    const text = String(message ?? "").trim();
    if (!text) return;

    counter.current += 1;
    const id = counter.current;

    setItems((current) => {
      // Don't stack the exact same message twice (e.g. double clicks).
      const withoutDuplicate = current.filter(
        (item) => !(item.message === text && item.type === type),
      );
      return [
        ...withoutDuplicate,
        {
          id,
          message: text,
          type,
          title: options?.title,
          action: options?.action,
          duration:
            options?.duration ?? DEFAULT_DURATION[type] + (options?.action ? 2500 : 0),
        },
      ].slice(-MAX_TOASTS);
    });
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItemData[];
  onDismiss: (id: number) => void;
}) {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t("common.notificationsRegion")}
      className="pointer-events-none fixed inset-x-0 top-3 z-[1000] flex justify-center px-3 sm:top-5 sm:justify-end sm:px-6"
    >
      <ol className="flex w-full max-w-sm flex-col gap-2.5">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </ol>
    </section>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItemData;
  onDismiss: (id: number) => void;
}) {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  const close = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => onDismiss(item.id), 180);
  }, [item.id, onDismiss]);

  // Auto-dismiss timer that pauses while hovered / focused.
  useEffect(() => {
    if (paused || leaving) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(close, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, leaving, close]);

  const style = STYLES[item.type];
  const Icon = style.icon;
  const title =
    item.title ??
    (item.type === "error"
      ? t("common.errorTitle")
      : item.type === "success"
        ? t("common.successTitle")
        : item.type === "warning"
          ? t("common.warningTitle")
          : undefined);

  return (
    <li
      role={item.type === "error" || item.type === "warning" ? "alert" : "status"}
      aria-live={item.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${style.ring} bg-white/95 shadow-[0_18px_55px_rgba(48,37,31,0.16)] backdrop-blur-xl ${
        leaving ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5 pe-2.5">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}
        >
          <Icon size={17} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          {title && (
            <p className="text-[13px] font-bold leading-5 text-[#30251f]">
              {title}
            </p>
          )}
          <p className="break-words text-[13px] font-medium leading-5 text-[#5e524b]">
            {item.message}
          </p>
          {item.action &&
            (item.action.href ? (
              <Link
                href={item.action.href}
                onClick={() => {
                  item.action?.onClick?.();
                  close();
                }}
                className="mt-2 inline-flex items-center rounded-lg bg-[#30251f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#46382f]"
              >
                {item.action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick?.();
                  close();
                }}
                className="mt-2 inline-flex items-center rounded-lg bg-[#30251f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#46382f]"
              >
                {item.action.label}
              </button>
            ))}
        </div>

        <button
          type="button"
          onClick={close}
          className="rounded-full p-1.5 text-[#9b8f86] transition hover:bg-[#f6f0eb] hover:text-[#30251f] focus-visible:outline-2 focus-visible:outline-[#a47e43]"
          aria-label={t("common.dismiss")}
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>

      <span
        aria-hidden="true"
        className={`absolute bottom-0 start-0 h-0.5 ${style.bar} opacity-60`}
        style={{
          width: "100%",
          animation: `toast-progress ${item.duration}ms linear forwards`,
          animationPlayState: paused || leaving ? "paused" : "running",
        }}
      />
    </li>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
