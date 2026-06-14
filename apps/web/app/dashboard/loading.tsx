import { AppShell } from "@/components/app-shell";
import { DashboardSkeleton } from "@/components/skeleton";

export default function DashboardLoading() {
  return (
    <AppShell>
      <DashboardSkeleton />
    </AppShell>
  );
}
