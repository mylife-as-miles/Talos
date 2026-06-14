import Link from "next/link";
import { Brain, ChevronDown, ChevronRight, Crosshair, FlaskConical, Info, Link2, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatRelativeTime } from "@/lib/dashboard-stats";
import { isMockMode } from "@/lib/config";
import type { TalosTriageReport } from "@/lib/types";

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "green" | "cyan" | "purple" | "red" | "amber" | "blue" }) {
  const tones = {
    green: "border-[#1d6e55] bg-[#0a362e] text-[#3df49a]",
    cyan: "border-[#185871] bg-[#0b2a37] text-[#35dffc]",
    purple: "border-[#5e3b8d] bg-[#241b3d] text-[#bb91ff]",
    red: "border-[#6d2f35] bg-[#391a20] text-[#ff6d73]",
    amber: "border-[#724b15] bg-[#342713] text-[#ffb331]",
    blue: "border-[#154966] bg-[#0a2739] text-[#26baff]"
  };
  return <span className={`inline-flex h-9 items-center rounded-md border px-4 text-[13px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function InvestigationPanel({ report }: { report?: TalosTriageReport }) {
  const mock = isMockMode();

  if (!report) {
    return (
      <section className="talos-panel talos-fade-up talos-stagger-4 rounded-lg p-6">
        <EmptyState
          compact
          icon={Brain}
          title="No active investigation"
          description="Trigger a demo crash and run the headless resolver to populate Splunk MCP investigation steps."
          action={{ label: "Open Demo Flow", href: "/demo" }}
        />
      </section>
    );
  }

  const steps = [
    ["Querying Splunk via MCP", `${report.splunk.queryUsed.slice(0, 72)}...`, "done"],
    ["Correlating Events", `${report.splunk.eventCount} correlated events`, "done"],
    ["Root Cause Analysis", `${report.rootCause.slice(0, 72)}...`, "done"],
    ["Remediation Recommendation", `${report.proposedFix.explanation.slice(0, 72)}...`, "spin"]
  ] as const;

  return (
    <section className="talos-panel talos-fade-up talos-stagger-4 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">
          Splunk MCP Investigation <Info size={15} className="text-[#81909a]" />
        </div>
        <ChevronDown size={17} className="rotate-180 text-[#c3ccd3]" />
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        <StatusBadge tone="green">
          <Link2 size={17} className="mr-2" /> MCP Connected
        </StatusBadge>
        <StatusBadge tone="cyan">
          <Crosshair size={17} className="mr-2" /> HEC Ready
        </StatusBadge>
        {mock ? (
          <StatusBadge tone="purple">
            <FlaskConical size={17} className="mr-2" /> Mock Mode
          </StatusBadge>
        ) : null}
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-[15px] text-[#dce4ea]">Active Investigation</div>
          <div className="mt-3 text-[14px] text-[#aeb9c1]">
            {report.affectedService} / {report.trigger}
          </div>
          <div className="mt-2 text-[14px] text-[#87939e]">
            {formatRelativeTime(report.createdAt)} <span className="mx-2">•</span> Confidence <span className="text-[#3beaa5]">{report.confidence}%</span>
          </div>
        </div>
        <div className="text-[14px] text-[#9da8b2]">{report.incidentId}</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#223038]">
        <div className="talos-bar-segment h-full rounded-full bg-[#35d8e8]" style={{ width: `${report.confidence}%`, transformOrigin: "left" }} />
      </div>
      <div className="mt-6 text-[15px] text-[#dce4ea]">Investigation Steps</div>
      <div className="mt-3 rounded-lg border border-[#24333b] bg-[#0b1418]">
        {steps.map(([title, detail, state]) => (
          <div key={title} className="grid grid-cols-[34px_1fr_auto] gap-3 border-b border-[#1d2b32] px-4 py-3 last:border-b-0">
            <div className={`mt-1 grid h-5 w-5 place-items-center rounded-full border ${state === "spin" ? "border-[#27d6e8] text-[#27d6e8]" : "border-[#28d786] text-[#28d786]"}`}>
              {state === "spin" ? <RefreshCw size={13} className="talos-spinner" /> : <ChevronDown size={13} />}
            </div>
            <div>
              <div className="text-[15px] text-[#dce5eb]">{title}</div>
              <div className="text-[13px] text-[#8d99a3]">{detail}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href={`/incidents/${report.incidentId}`} className="talos-btn-glow mt-4 flex h-10 w-72 items-center justify-center gap-3 rounded-md border border-[#13566a] bg-[#0b2730] text-[14px] text-[#42e2ff]">
        View Full Investigation <ChevronRight size={17} />
      </Link>
    </section>
  );
}
