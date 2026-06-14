import { AppShell } from "@/components/app-shell";
import { DemoActions } from "@/components/demo-actions";
import { Badge, Card, CardHeader, CodeBlock } from "@/components/ui";
import { listReports } from "@/lib/store/reports";

export default async function DemoPage() {
  const [latestReport] = await listReports();
  const steps = [
    "Trigger checkout crash",
    "Send structured event through ingest relay",
    "Run headless Splunk MCP resolver",
    "Generate AI triage report",
    "Send Discord or Slack notification"
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Hackathon Demo Flow</h1>
          <p className="mt-2 text-sm text-talos-muted">A guided Devpost-ready flow from runtime crash to fix recommendation.</p>
        </div>
        <DemoActions />
      </div>
      <div className="grid gap-5 xl:grid-cols-[.75fr_1fr]">
        <Card>
          <CardHeader title="Demo Runbook" detail="Click the actions left-to-right and refresh to see persisted results." />
          <div className="space-y-3 p-5">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border border-talos-line bg-black/20 p-3">
                <Badge tone="cyan">{index + 1}</Badge>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="AI Triage Report" action={<Badge tone={latestReport ? "ok" : "warn"}>{latestReport ? "Generated" : "Waiting"}</Badge>} />
          <div className="p-5">
            {latestReport ? (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-300">{latestReport.summary}</p>
                <CodeBlock value={latestReport.proposedFix.code || latestReport.proposedFix.explanation} />
              </div>
            ) : (
              <p className="text-sm text-talos-muted">Run the resolver after triggering the crash to generate the report.</p>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
