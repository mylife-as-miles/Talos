import { Skeleton, SkeletonText } from "@/components/skeleton";

export default function IncidentDetailLoading() {
  return (
    <>
      <div className="mb-6 space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <div className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-40" />
          <SkeletonText lines={5} className="mt-6" />
        </div>
        <div className="space-y-5">
          <div className="talos-panel rounded-lg p-5">
            <Skeleton className="h-4 w-36" />
            <SkeletonText lines={4} className="mt-6" />
          </div>
          <div className="talos-panel rounded-lg p-5">
            <Skeleton className="h-4 w-40" />
            <SkeletonText lines={3} className="mt-6" />
          </div>
        </div>
      </div>
    </>
  );
}
