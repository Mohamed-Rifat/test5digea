"use client";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "#a47e43",
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  color?: string;
  highlight?: boolean;
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
      highlight ? "border-[#dfd0bf]" : "border-[#e8dfd8]"
    }`}
  >
    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#f8f2ed] opacity-60 transition-transform duration-500 group-hover:scale-125 sm:h-24 sm:w-24" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#8d8077] sm:text-xs">
          {title}
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-tight text-[#30251f] sm:mt-2 sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 truncate text-[10px] text-[#9a8d85] sm:mt-1.5 sm:text-xs">
          {description}
        </p>
      </div>

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
      </div>
    </div>
  </div>
);
