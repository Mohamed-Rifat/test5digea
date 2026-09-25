"use client";


export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-[#faf8f6]">
      {/* Hero */}
      <section className="h-48 animate-pulse bg-[#eee6dc] sm:h-64" />

      <div className="mx-auto lg:max-w-10/12 px-4 sm:px-6 lg:px-8">
        {/* Vendor header */}
        <div className="-mt-14 rounded-3xl border border-[#eee7e1] bg-white p-5 shadow-sm sm:-mt-16 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-[#f4eee9] sm:h-28 sm:w-28" />

            <div className="flex-1 space-y-3">
              <div className="h-7 w-2/3 animate-pulse rounded-lg bg-[#f4eee9]" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-[#f4eee9]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#f4eee9]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-7 w-32 animate-pulse rounded bg-[#f4eee9]" />
              <div className="h-20 animate-pulse rounded-2xl bg-[#f4eee9]" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-40 animate-pulse rounded bg-[#f4eee9]" />

              <div className="grid gap-5 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-3xl bg-white"
                  >
                    <div className="aspect-4/3 animate-pulse bg-[#f4eee9]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#f4eee9]" />
                      <div className="h-3 w-full animate-pulse rounded bg-[#f4eee9]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[#f4eee9]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden h-72 animate-pulse rounded-3xl bg-white lg:block" />
        </div>
      </div>
    </main>
  );
}
