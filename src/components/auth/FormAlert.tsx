import type { ReactNode } from "react";

/** Red error box shown above a form's submit button. */
export default function FormAlert({ children }: { children?: ReactNode }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className="animate-shake rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
    >
      {children}
    </div>
  );
}
