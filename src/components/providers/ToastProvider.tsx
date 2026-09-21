"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };
type ConfirmOptions = { danger?: boolean; confirmLabel?: string; cancelLabel?: string };
type ConfirmItem = { id: number; message: string; resolve: (value: boolean) => void; options: ConfirmOptions };

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const [confirmItem, setConfirmItem] = useState<ConfirmItem | null>(null);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, type }].slice(-4));
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 3800);
  }, []);

  const confirm = useCallback((message: string, options: ConfirmOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setConfirmItem({ id: Date.now() + Math.random(), message, resolve, options });
    });
  }, []);

  useEffect(() => {
    if (!confirmItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      confirmItem.resolve(false);
      setConfirmItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmItem]);

  const resolveConfirm = useCallback((value: boolean) => {
    setConfirmItem((current) => {
      if (current) current.resolve(value);
      return null;
    });
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {confirmItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => { if (event.target === event.currentTarget) resolveConfirm(false); }}>
          <div className="w-full max-w-md rounded-3xl border border-[#eadfd8] bg-white p-6 shadow-[0_24px_80px_rgba(48,37,31,0.24)]">
            <p className="text-sm font-medium leading-6 text-[#30251f]">{confirmItem.message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => resolveConfirm(false)} className="rounded-xl border border-[#e5dbd4] px-4 py-2 text-sm font-medium text-[#756a63] transition hover:bg-[#faf7f4]">{confirmItem.options.cancelLabel ?? t("common.cancel")}</button>
              <button type="button" onClick={() => resolveConfirm(true)} className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${confirmItem.options.danger ? "bg-red-600 hover:bg-red-700" : "bg-[#30251f] hover:bg-[#46382f]"}`}>{confirmItem.options.confirmLabel ?? t("common.confirm")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:justify-end sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {items.map((item) => (
            <ToastItem key={item.id} item={item} onClose={() => setItems((current) => current.filter((x) => x.id !== item.id))} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onClose }: { item: Toast; onClose: () => void }) {
  const { t } = useLanguage();
  const Icon = item.type === "success" ? CheckCircle2 : item.type === "error" ? XCircle : Info;
  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_55px_rgba(48,37,31,0.16)] backdrop-blur-xl animate-toast-in">
      <Icon className={item.type === "success" ? "mt-0.5 shrink-0 text-emerald-600" : item.type === "error" ? "mt-0.5 shrink-0 text-red-500" : "mt-0.5 shrink-0 text-[#a47e43]"} size={19} />
      <p className="flex-1 text-sm font-medium leading-5 text-[#30251f]">{item.message}</p>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#9b8f86] transition hover:bg-[#f6f0eb] hover:text-[#30251f]" aria-label={t("common.close")}>
        <X size={15} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
