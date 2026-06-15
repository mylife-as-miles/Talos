import { notFound } from "next/navigation";
import { FileSearch, ScrollText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Badge, Card, CardHeader, CodeBlock } from "@/components/ui";
import { getEvent } from "@/lib/store/events";
import { getReport } from "@/lib/store/reports";

export const dynamic = "force-dynamic";

function SectionLabel({ children, tone }: { children: React.ReactNode; tone: "yellow" | "cyan" | "magenta" }) {
  const tones = {
    yellow: "bg-[#ffe100]",
    cyan: "bg-[#00c2c8]",
    magenta: "bg-[#ff00ff]"
  };

  return (
    <h2 className={`${tones[tone]} inline-block border-[3px] border-black px-3 py-1 text-sm font-black uppercase text-black shadow-[4px_4px_0_#000]`}>
      {children}
    </h2>
  );
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();
  const event = await getEvent(report.eventId);
  const splunkModeLabel =
    report.splunk.mode === "simulation"
      ? "Simulated Telemetry"
      : report.splunk.mode === "mcp"
        ? "Splunk MCP"
        : "REST Fallback";

  return (
    <>
      <div className="talos-fade-up mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="talos-poster-title text-4xl font-black uppercase leading-none text-black md:text-5xl">{report.incidentId}</h1>
          <p className="mt-3 max-w-4xl border-l-[6px] border-black bg-[#fffdf1] px-4 py-2 text-sm font-bold leading-6 text-black shadow-[5px_5px_0_#000]">
            {report.summary}
          </p>
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
          <div className="space-y-6 p-5 text-black">
            <section>
              <SectionLabel tone="yellow">Root Cause</SectionLabel>
              <p className="mt-4 text-base font-bold leading-7 text-black">{report.rootCause}</p>
            </section>

            <section>
              <SectionLabel tone="cyan">Evidence</SectionLabel>
              {report.evidence.length ? (
                <div className="mt-4 space-y-3">
                  {report.evidence.map((item, index) => (
                    <div
                      key={`${item.message}-${index}`}
                      className="talos-row-enter talos-brutal-row border-[2px] border-black bg-[#e5e1cf] p-3 text-sm shadow-[4px_4px_0_#000]"
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <Badge tone={item.source === "splunk" ? "cyan" : "neutral"}>{item.source}</Badge>
                      <span className="ml-3 font-bold leading-6 text-black">{item.message}</span>
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
              <SectionLabel tone="magenta">Proposed Fix</SectionLabel>
              <p className="mt-4 text-base font-bold leading-7 text-black">{report.proposedFix.explanation}</p>
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
            <dl className="grid gap-3 p-5 text-sm text-black">
              <div className="border-b-[2px] border-black pb-3">
                <dt className="text-xs font-black uppercase tracking-wide text-talos-muted">Trigger</dt>
                <dd className="mt-1 font-bold leading-6 text-black">{report.trigger}</dd>
              </div>
              <div className="border-b-[2px] border-black pb-3">
                <dt className="text-xs font-black uppercase tracking-wide text-talos-muted">Affected service</dt>
                <dd className="mt-1 font-bold text-black">{report.affectedService}</dd>
              </div>
              <div className="border-b-[2px] border-black pb-3">
                <dt className="text-xs font-black uppercase tracking-wide text-talos-muted">Affected route</dt>
                <dd className="mt-1 font-bold text-black">{report.affectedRoute}</dd>
              </div>
              <div className="border-b-[2px] border-black pb-3">
                <dt className="text-xs font-black uppercase tracking-wide text-talos-muted">Splunk mode</dt>
                <dd className="mt-1 font-bold text-black">{splunkModeLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-talos-muted">Anomaly score</dt>
                <dd className="mt-1 font-bold text-black">
                  {report.anomaly.score} - {report.anomaly.level}
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
                    className="talos-row-enter talos-brutal-row border-[2px] border-l-[8px] border-black bg-[#fffdf1] p-3 shadow-[4px_4px_0_#000]"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="text-xs font-black uppercase text-talos-muted">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="mt-1 text-sm font-black text-black">{item.title}</div>
                    <div className="mt-1 text-sm font-bold leading-6 text-black">{item.detail}</div>
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
              <EmptyState compact icon={FileSearch} title="Source event unavailable" description="The linked SDK event was not found in local storage." action={{ label: "Back to incidents", href: "/dashboard/incidents" }} />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
