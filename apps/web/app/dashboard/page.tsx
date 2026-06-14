import { AlertTriangle, Brain, Clock, ServerCrash } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DemoActions } from "@/components/demo-actions";
import { Badge, Card, CardHeader } from "@/components/ui";
import { listEvents } from "@/lib/store/events";
import { listReports } from "@/lib/store/reports";

export default async function DashboardPage() {
  const [events, reports] = await Promise.all([listEvents(), listReports()]);
  const latestEvent = events[0];
  const latestReport = reports[0];
  const avgConfidence = reports.length ? Math.round(reports.reduce((sum, report) => sum + report.confidence, 0) / reports.length) : 0;

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Talos Guardian Status</h1>
          <p className="mt-2 max-w-3xl text-sm text-talos-muted">
            Self-healing developer operations for Splunk: SDK intake, HEC forwarding, MCP investigation, and fix-ready AI reports.
          </p>
        </div>
        <DemoActions />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total captured errors", events.length, ServerCrash, "SDK runtime intake"],
          ["Critical incidents", reports.filter((report) => report.priority === "critical").length, AlertTriangle, "AI triaged"],
          ["Avg diagnosis confidence", `${avgConfidence}%`, Brain, "Resolver scoring"],
          ["Latest service affected", latestEvent?.service || "none", Clock, latestEvent?.route || "Awaiting event"]
        ].map(([label, value, Icon, detail]) => (
          <Card key={String(label)} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[.18em] text-talos-muted">{label}</span>
              <Icon className="text-talos-bronze" size={18} />
            </div>
            <div className="mt-4 text-2xl font-semibold">{value}</div>
            <p className="mt-2 text-xs text-talos-muted">{detail}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.9fr]">
        <Card>
          <CardHeader title="Runtime Error Intake" detail="Recent SDK events received by the Next.js ingest relay." action={<Badge tone="cyan">HEC Ready</Badge>} />
          <div className="divide-y divide-talos-line">
            {events.slice(0, 5).map((event) => (
              <div key={event.eventId} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-medium">{event.error.message}</div>
                  <div className="mt-1 text-xs text-talos-muted">{event.service} · {event.route || "unknown route"} · {new Date(event.timestamp).toLocaleString()}</div>
                </div>
                <Badge tone={event.environment === "production" ? "critical" : "neutral"}>{event.environment}</Badge>
              </div>
            ))}
            {!events.length ? <div className="px-5 py-10 text-sm text-talos-muted">No events yet. Trigger the demo crash to seed the intake pipeline.</div> : null}
          </div>
        </Card>

        <Card>
          <CardHeader title="Splunk MCP Investigation" detail="Resolver status and latest report context." action={<Badge tone={latestReport?.splunk.mode === "mock" ? "warn" : "ok"}>Mode: {latestReport?.splunk.mode?.toUpperCase() || "MOCK"}</Badge>} />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="ok">MCP Connected</Badge>
              <Badge tone="cyan">HEC Ready</Badge>
              <Badge tone="warn">Mock Mode</Badge>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              {latestReport?.summary || "The resolver will query Splunk MCP first, then REST fallback, then mock context when local demo mode is enabled."}
            </p>
            {latestReport ? (
              <div className="rounded-lg border border-talos-line bg-black/25 p-4">
                <div className="text-xs uppercase tracking-[.18em] text-talos-muted">Latest root cause</div>
                <p className="mt-2 text-sm text-slate-200">{latestReport.rootCause}</p>
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader title="Incident Queue" detail="Sentry/PostHog-style incident surface for engineering teams." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-talos-line text-xs uppercase tracking-[.14em] text-talos-muted">
              <tr>
                <th className="px-5 py-3">Incident ID</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Root Cause</th>
                <th className="px-5 py-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-talos-line">
              {reports.slice(0, 6).map((report) => (
                <tr key={report.incidentId} className="hover:bg-white/[.03]">
                  <td className="px-5 py-4 font-medium">{report.incidentId}</td>
                  <td className="px-5 py-4">{report.affectedService}</td>
                  <td className="px-5 py-4 text-talos-muted">{report.affectedRoute}</td>
                  <td className="px-5 py-4"><Badge tone={report.priority === "critical" ? "critical" : "warn"}>{report.priority}</Badge></td>
                  <td className="max-w-md px-5 py-4 text-slate-300">{report.rootCause}</td>
                  <td className="px-5 py-4">{report.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
