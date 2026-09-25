interface InfoBoxProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}

export function InfoBox({ icon: Icon, label, value }: InfoBoxProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={16} />

        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

/* =========================
   Technical Row
========================= */

interface TechnicalRowProps {
  label: string;
  value: string;
}

export function TechnicalRow({ label, value }: TechnicalRowProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-all font-mono text-xs leading-5 text-gray-600">
        {value || "-"}
      </p>
    </div>
  );
}
