import type { ReactNode } from "react";

interface AuthStatusCardProps {
  icon: ReactNode;
  title: ReactNode;
  message?: ReactNode;
}

/** Green confirmation card that replaces a form once it succeeded. */
export default function AuthStatusCard({ icon, title, message }: AuthStatusCardProps) {
  return (
    <div
      role="status"
      className="animate-fade-in rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold text-emerald-700">{title}</p>
      {message && (
        <p className="mt-1 text-xs leading-5 text-emerald-600">{message}</p>
      )}
    </div>
  );
}
