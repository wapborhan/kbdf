import { DonorGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-9 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800" />
      <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
      <div className="mt-6">
        <DonorGridSkeleton count={9} />
      </div>
    </div>
  );
}
