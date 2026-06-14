import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("talos-skeleton rounded-md", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={clsx("h-3", index === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonMetricGrid() {
  return (
    <div className="grid gap-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="talos-panel rounded-lg p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-10 w-32" />
          <Skeleton className="mt-6 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="talos-panel overflow-hidden rounded-lg">
      <div className="border-b border-[#1f2d34] px-5 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-0 p-2">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid gap-4 border-b border-[#1c2930] px-3 py-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((__, col) => (
              <Skeleton key={col} className="h-3 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-36" />
          <SkeletonText lines={2} className="mt-4" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-36" />
        </div>
      </div>
      <SkeletonMetricGrid />
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-8 h-[250px] w-full" />
        </div>
        <div className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-56" />
          <SkeletonText lines={4} className="mt-6" />
        </div>
      </div>
      <SkeletonTable rows={4} cols={8} />
    </div>
  );
}
