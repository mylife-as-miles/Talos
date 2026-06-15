import Link from "next/link";
import { notFound } from "next/navigation";
import { FileSearch, ScrollText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Badge, Card, CardHeader, CodeBlock } from "@/components/ui";
import { getEvent } from "@/lib/store/events";
import { getReport } from "@/lib/store/reports";

export const dynamic = "force-dynamic";

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();
  const event = await getEvent(report.eventId);

  return (
    <>
      <div className="talos-fade-up mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{report.incidentId}</h1>
          <p className="mt-2 text-sm text-talos-muted">{report.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="critical">{report.priority}</Badge>
          <Badge tone="ok">{report.status}</Badge>
          <Badge tone="cyan">{report.confidence}% confidence</Badge>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <Card className="talos-fade-up talos-stagger-1 overflow-hidden">
          <CardHeader title="AI Triage Report" detail="Root cause, evidence, and practical fix recommendation." />
          <div className="space-y-5 p-5">
            <section>
              <h2 className="text-sm font-semibold">Root Cause</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{report.rootCause}</p>
            </section>
            <section>
              <h2 className="text-sm font-semibold">Evidence</h2>
              {report.evidence.length ? (
                <div className="mt-3 space-y-2">
                  {report.evidence.map((item, index) => (
                    <div
                      key={`${item.message}-${index}`}
                      className="talos-row-enter rounded-lg border border-talos-line bg-black/20 p-3 text-sm"
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <Badge tone={item.source === "splunk" ? "cyan" : "neutral"}>{item.source}</Badge>
                      <span className="ml-3 text-slate-300">{item.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3">
                  <EmptyState compact icon={FileSearch} title="No evidence captured" description="Evidence will appear after Splunk MCP investigation completes." />
                </div>
              )}
            </section>
            <section>
              <h2 className="text-sm font-semibold">Proposed Fix</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{report.proposedFix.explanation}</p>
              {report.proposedFix.code ? (
                <div className="mt-3">
                  <CodeBlock value={report.proposedFix.code} />
                </div>
              ) : null}
            </section>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="talos-fade-up talos-stagger-2">
            <CardHeader title="Incident Metadata" />
            <dl className="grid gap-3 p-5 text-sm">
              <div>
                <dt className="text-talos-muted">Trigger</dt>
                <dd className="mt-1">{report.trigger}</dd>
              </div>
              <div>
                <dt className="text-talos-muted">Affected service</dt>
                <dd className="mt-1">{report.affectedService}</dd>
              </div>
              <div>
                <dt className="text-talos-muted">Affected route</dt>
                <dd className="mt-1">{report.affectedRoute}</dd>
              </div>
              <div>
                <dt className="text-talos-muted">Splunk mode</dt>
                <dd className="mt-1">Mode: {report.splunk.mode.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-talos-muted">Anomaly score</dt>
                <dd className="mt-1">
                  {report.anomaly.score} · {report.anomaly.level}
                </dd>
              </div>
            </dl>
          </Card>
          <Card className="talos-fade-up talos-stagger-3">
            <CardHeader title="Evidence Timeline" />
            {report.timeline.length ? (
              <div className="space-y-3 p-5">
                {report.timeline.map((item, index) => (
                  <div
                    key={`${item.timestamp}-${index}`}
                    className="talos-row-enter border-l border-talos-bronze/50 pl-4"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="text-xs text-talos-muted">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="mt-1 text-sm font-medium">{item.title}</div>
                    <div className="text-sm text-slate-300">{item.detail}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState compact icon={ScrollText} title="No timeline entries" description="Timeline events populate from SDK breadcrumbs and Splunk correlation." />
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="talos-fade-up talos-stagger-4">
          <CardHeader title="Splunk Query Used" />
          <div className="p-5">
            <CodeBlock value={report.splunk.queryUsed} />
          </div>
        </Card>
        <Card className="talos-fade-up talos-stagger-5">
          <CardHeader title="Raw Event JSON" />
          <div className="p-5">
            {event ? (
              <CodeBlock value={JSON.stringify(event, null, 2)} />
            ) : (
              <EmptyState compact icon={FileSearch} title="Source event unavailable" description="The linked SDK event was not found in local storage." action={{ label: "Back to incidents", href: "/incidents" }} />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
