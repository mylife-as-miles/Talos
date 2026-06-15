import { CirclePlay } from "lucide-react";
import { DemoActions } from "@/components/demo-actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, CardHeader, CodeBlock } from "@/components/ui";
import { listReports } from "@/lib/store/reports";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const [latestReport] = await listReports();
  const steps = [
    "Trigger Backstage production incident",
    "Send structured event through ingest relay",
    "Run headless Splunk MCP resolver",
    "Generate AI triage report",
    "Send Discord or Slack notification"
  ];

  return (
    <>
      <PageHeader
        title="Simulation Sandbox"
        description="A guided simulation flow from runtime crash to fix recommendation."
        actions={<DemoActions />}
      />

      <div className="grid gap-5 xl:grid-cols-[.75fr_1fr]">
        <Card className="talos-fade-up talos-stagger-2 overflow-hidden">
          <CardHeader title="Simulation Steps" detail="Click the actions above left-to-right. Results persist and refresh automatically." />
          <div className="space-y-3 p-5">
            {steps.map((step, index) => (
              <div
                key={step}
                className="talos-row-enter talos-brutal-row flex items-center gap-3 border-[2px] border-black bg-[#e5e1cf] p-3 shadow-[4px_4px_0_#000]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Badge tone="cyan">{index + 1}</Badge>
                <span className="text-sm font-bold text-black">{step}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="talos-fade-up talos-stagger-3 overflow-hidden">
          <CardHeader title="AI Triage Report" action={<Badge tone={latestReport ? "ok" : "warn"}>{latestReport ? "Generated" : "Waiting"}</Badge>} />
          <div className="p-5">
            {latestReport ? (
              <div className="space-y-4">
                <p className="border-l-[6px] border-black bg-[#fffdf1] px-4 py-3 text-sm font-bold leading-6 text-black shadow-[4px_4px_0_#000]">
                  {latestReport.summary}
                </p>
                <CodeBlock value={latestReport.proposedFix.code || latestReport.proposedFix.explanation} />
              </div>
            ) : (
              <EmptyState
                compact
                icon={CirclePlay}
                title="Waiting for resolver output"
                description="Trigger a simulation, then run the resolver to generate a fix-ready triage report."
              />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
