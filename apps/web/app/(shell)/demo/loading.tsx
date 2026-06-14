import { PageHeader } from "@/components/page-header";
import { Skeleton, SkeletonText } from "@/components/skeleton";

export default function DemoLoading() {
  return (
    <>
      <PageHeader title="Hackathon Demo Flow" description="A guided Devpost-ready flow from runtime crash to fix recommendation." />
      <div className="grid gap-5 xl:grid-cols-[.75fr_1fr]">
        <div className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-32" />
          <SkeletonText lines={5} className="mt-6" />
        </div>
        <div className="talos-panel rounded-lg p-5">
          <Skeleton className="h-4 w-40" />
          <SkeletonText lines={6} className="mt-6" />
        </div>
      </div>
    </>
  );
}
