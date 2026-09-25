export default function VendorsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded-lg bg-[#e9e1dc]" />
        <div className="mt-4 h-10 w-72 rounded-xl bg-[#e9e1dc]" />
        <div className="mt-3 h-4 w-[420px] max-w-full rounded-lg bg-[#eee8e4]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-[#eee8e4] bg-white"
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="h-20 animate-pulse rounded-3xl border border-[#eee8e4] bg-white" />

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[#e9e1dc] bg-white">
        <div className="h-14 animate-pulse bg-[#f8f5f3]" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse border-t border-[#eee8e4] bg-white"
          />
        ))}
      </div>
    </div>
  );
}
