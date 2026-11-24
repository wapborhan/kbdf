import { RequestGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="h-9 w-44 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800" />
      <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
      <div className="mt-8 h-7 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800" />
      <div className="mt-3">
        <RequestGridSkeleton count={6} />
      </div>
    </div>
  );
}
