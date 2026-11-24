export function DonorCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 dark:bg-slate-700" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-32 rounded-md bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 w-20 rounded-md bg-gray-200 dark:bg-slate-700" />
        </div>
        <div className="h-6 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 h-3 w-28 rounded-md bg-gray-200 dark:bg-slate-700" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-slate-700" />
        <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="flex animate-pulse gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700">
      <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-200 dark:bg-slate-700" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-48 rounded-md bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-28 rounded-md bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function DonorGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <DonorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RequestGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <RequestCardSkeleton key={i} />
      ))}
    </div>
  );
}
