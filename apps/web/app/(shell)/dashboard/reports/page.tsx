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
        <div className="talos-fade-up talos-stagger-2 mt-5 grid gap-4">
          {reports.map((report, index) => (
            <div key={report.incidentId} className="talos-row-enter" style={{ animationDelay: `${index * 45}ms` }}>
              <Card className="overflow-hidden">
                <CardHeader
                  title={report.incidentId}
                  action={<Badge tone={report.priority === "critical" ? "critical" : "warn"}>{report.priority}</Badge>}
                />
                <div className="p-4">
                  <p className="border-l-[6px] border-black bg-[#fffdf1] px-4 py-3 text-sm font-bold leading-6 text-black shadow-[4px_4px_0_#000]">
                    {report.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Badge tone="cyan">{report.splunk.mode === "mcp" ? "Splunk MCP" : "REST Fallback"}</Badge>
                    <Badge tone="ok">{report.confidence}% confidence</Badge>
                    <Link
                      className="inline-flex min-h-9 items-center border-[3px] border-black bg-[#ffe100] px-3 text-xs font-black uppercase text-black shadow-[4px_4px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]"
                      href={`/dashboard/incidents/${report.incidentId}`}
                    >
                      Open incident
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={BarChart3}
            title="No reports generated yet"
            description="Reports appear after the headless resolver investigates Splunk context and produces fix-ready triage output."
            action={{ label: "Open Live Console", href: "/dashboard/demo" }}
          />
        </div>
      )}
    </>
  );
}
