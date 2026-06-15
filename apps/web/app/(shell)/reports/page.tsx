import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, CardHeader } from "@/components/ui";
import { listReports } from "@/lib/store/reports";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await listReports();

  return (
    <>
      <PageHeader title="Reports" description="Generated triage reports optimized for Slack, Discord, and engineering handoff." />

      {reports.length ? (
        <div className="talos-fade-up talos-stagger-2 mt-6 grid gap-4">
          {reports.map((report, index) => (
            <div key={report.incidentId} className="talos-row-enter" style={{ animationDelay: `${index * 45}ms` }}>
              <Card className="overflow-hidden">
              <CardHeader title={report.incidentId} action={<Badge tone={report.priority === "critical" ? "critical" : "warn"}>{report.priority}</Badge>} />
              <div className="p-5">
                <p className="text-sm leading-6 text-slate-300">{report.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="cyan">Mode: {report.splunk.mode.toUpperCase()}</Badge>
                  <Badge tone="ok">{report.confidence}% confidence</Badge>
                  <Link className="text-sm font-medium text-talos-cyan transition hover:text-white" href={`/incidents/${report.incidentId}`}>
                    Open incident
                  </Link>
                </div>
              </div>
            </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={BarChart3}
            title="No reports generated yet"
            description="Reports appear after the headless resolver investigates Splunk context and produces fix-ready triage output."
            action={{ label: "Run Simulation", href: "/demo" }}
          />
        </div>
      )}
    </>
  );
}
