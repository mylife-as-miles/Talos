import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, CardHeader } from "@/components/ui";
import { listReports } from "@/lib/store/reports";

export default async function ReportsPage() {
  const reports = await listReports();
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Reports</h1>
      <p className="mt-2 text-sm text-talos-muted">Generated triage reports optimized for Slack, Discord, and engineering handoff.</p>
      <div className="mt-6 grid gap-4">
        {reports.map((report) => (
          <Card key={report.incidentId}>
            <CardHeader title={report.incidentId} action={<Badge tone={report.priority === "critical" ? "critical" : "warn"}>{report.priority}</Badge>} />
            <div className="p-5">
              <p className="text-sm leading-6 text-slate-300">{report.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="cyan">Mode: {report.splunk.mode.toUpperCase()}</Badge>
                <Badge tone="ok">{report.confidence}% confidence</Badge>
                <Link className="text-sm font-medium text-talos-cyan" href={`/incidents/${report.incidentId}`}>Open incident</Link>
              </div>
            </div>
          </Card>
        ))}
        {!reports.length ? <Card className="p-8 text-sm text-talos-muted">No reports generated yet.</Card> : null}
      </div>
    </AppShell>
  );
}
