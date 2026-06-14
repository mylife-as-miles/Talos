import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SkeletonText } from "@/components/skeleton";
import { Skeleton } from "@/components/skeleton";

export default function SettingsLoading() {
  return (
    <AppShell>
      <PageHeader title="Settings" description="Runtime configuration status for local demos and Splunk-backed operation." />
      <div className="talos-panel mt-6 rounded-lg p-5">
        <Skeleton className="h-4 w-40" />
        <SkeletonText lines={5} className="mt-6" />
      </div>
    </AppShell>
  );
}
