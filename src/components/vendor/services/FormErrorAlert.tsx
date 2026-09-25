import { AlertCircle } from "lucide-react";

/** Red alert box at the top of a service form. */
export default function FormErrorAlert({
  message,
  title,
}: {
  message?: string | null;
  title?: string;
}) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:mb-6">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
      <div className="leading-5">
        {title && <p className="font-semibold">{title}</p>}
        <p className={title ? "mt-1 text-red-600" : undefined}>{message}</p>
      </div>
    </div>
  );
}
