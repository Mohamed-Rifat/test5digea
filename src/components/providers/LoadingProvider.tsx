"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadingBus } from "@/lib/loading-bus";
import Loader5Digea from "@/components/shared/Loader5Digea";

type LoadingState = { loading: boolean; label?: string };

type LoadingContextValue = {
  isLoading: boolean;
  show: (label?: string) => void;
  hide: () => void;
  withLoading: <T>(task: () => Promise<T>, label?: string) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoadingState>({ loading: false, label: undefined });

  useEffect(() => {
    const unsubscribe = loadingBus.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  const show = useCallback((label?: string) => loadingBus.show(label), []);
  const hide = useCallback(() => loadingBus.hide(), []);

  const withLoading = useCallback(
    async <T,>(task: () => Promise<T>, label?: string): Promise<T> => {
      show(label);
      try {
        return await task();
      } finally {
        hide();
      }
    },
    [show, hide]
  );

  const value = useMemo(
    () => ({ isLoading: state.loading, show, hide, withLoading }),
    [state.loading, show, hide, withLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <div
        className={`fixed inset-0 z-999 flex items-center justify-center bg-[#faf8f6]/85 backdrop-blur-md transition-opacity duration-300 ${
          state.loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
        aria-busy={state.loading}
      >
        <Loader5Digea label={state.label} />
        <span className="sr-only">Loading</span>
      </div>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used inside LoadingProvider");
  return context;
}