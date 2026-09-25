/** Small white tooltip used by every recharts chart on the dashboard. */
export default function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#ebe3dd] bg-white px-3 py-2 shadow-lg">
      {label && (
        <p className="mb-1 text-[10px] font-semibold text-[#8a7d75]">
          {label}
        </p>
      )}

      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-[11px]"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />

          <span className="text-[#665951]">{entry.name}:</span>

          <span className="font-semibold text-[#30251f]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
