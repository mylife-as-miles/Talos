import { SkeletonTable } from "@/components/skeleton";
import { PageHeader } from "@/components/page-header";

export default function IncidentsLoading() {
  return (
    <>
      <PageHeader title="Incidents" description="AI-generated Splunk investigations ready for engineering triage." />
      <div className="mt-6">
        <SkeletonTable rows={6} cols={8} />
      </div>
    </>
  );
}
