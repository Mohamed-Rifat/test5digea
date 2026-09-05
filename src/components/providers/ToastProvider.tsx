"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, type }].slice(-4));
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 3800);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
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
  const Icon = item.type === "success" ? CheckCircle2 : item.type === "error" ? XCircle : Info;
  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_55px_rgba(48,37,31,0.16)] backdrop-blur-xl animate-toast-in">
      <Icon className={item.type === "success" ? "mt-0.5 shrink-0 text-emerald-600" : item.type === "error" ? "mt-0.5 shrink-0 text-red-500" : "mt-0.5 shrink-0 text-[#a47e43]"} size={19} />
      <p className="flex-1 text-sm font-medium leading-5 text-[#30251f]">{item.message}</p>
      <button type="button" onClick={onClose} className="rounded-full p-1 text-[#9b8f86] transition hover:bg-[#f6f0eb] hover:text-[#30251f]" aria-label="Close notification">
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
