import { PageHeader } from "@/components/page-header";
import { SkeletonCardList } from "@/components/skeleton";

export default function ReportsLoading() {
  return (
    <>
      <PageHeader title="Reports" description="Generated triage reports optimized for Slack, Discord, and engineering handoff." />
      <div className="mt-6">
        <SkeletonCardList count={4} />
      </div>
    </>
  );
}
