import Link from "next/link";
import { Brain, ChevronDown, ChevronRight, Crosshair, FlaskConical, Info, Link2, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatRelativeTime } from "@/lib/dashboard-stats";
import { isMockMode } from "@/lib/config";
import type { TalosTriageReport } from "@/lib/types";

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "green" | "cyan" | "purple" | "amber" }) {
  const tones = {
    green: "bg-[#d8ff2f]",
    cyan: "bg-[#00c2c8]",
    purple: "bg-[#ff00ff]",
    amber: "bg-[#ffe100]"
  };
  return <span className={`inline-flex h-7 items-center border-2 border-black px-2.5 text-[11px] font-black uppercase text-black shadow-[2px_2px_0_#000] ${tones[tone]}`}>{children}</span>;
}

export function InvestigationPanel({ report }: { report?: TalosTriageReport }) {
  const mock = isMockMode();

  if (!report) {
    return (
      <section className="talos-panel talos-fade-up talos-stagger-4 p-4">
        <EmptyState
          compact
          icon={Brain}
          title="No active investigation"
          description="Trigger a simulation and run the resolver to populate Splunk MCP investigation steps."
          action={{ label: "Run Simulation", href: "/dashboard/demo" }}
        />
      </section>
    );
  }

  const steps = [
    ["Querying Splunk via MCP", `${report.splunk.queryUsed.slice(0, 72)}...`, "spin"],
    ["Correlating Events", `${report.splunk.eventCount} correlated events`, "done"],
    ["Root Cause Analysis", `${report.rootCause.slice(0, 72)}...`, "done"],
    ["Remediation Recommendation", `${report.proposedFix.explanation.slice(0, 72)}...`, "done"]
  ] as const;

  return (
    <section className="talos-panel talos-fade-up talos-stagger-4 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b-[3px] border-black bg-black px-4 py-2.5 text-white">
        <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[.08em]">
          Splunk MCP Investigation <Info size={12} className="text-white" />
        </div>
        <ChevronDown size={14} className="rotate-180 text-white" />
      </div>
      <div className="p-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone="green">
          <Link2 size={13} className="mr-1.5" /> MCP Connected
        </StatusBadge>
        <StatusBadge tone="cyan">
          <Crosshair size={13} className="mr-1.5" /> HEC Ready
        </StatusBadge>
        {mock ? (
          <StatusBadge tone="purple">
            <FlaskConical size={13} className="mr-1.5" /> Mock Mode
          </StatusBadge>
        ) : null}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-black text-black">Active Investigation</div>
          <div className="mt-1.5 text-[11px] font-bold text-[#3d392f]">
            {report.affectedService} / {report.trigger}
          </div>
          <div className="mt-1 text-[11px] font-bold text-[#4d473c]">
            {formatRelativeTime(report.createdAt)} <span className="mx-1.5">/</span> Confidence <span className="bg-[#d8ff2f] px-1 py-0.5 text-black">{report.confidence}%</span>
          </div>
        </div>
        <div className="text-[11px] font-black text-black">{report.incidentId}</div>
      </div>

      <div className="mt-2 h-2.5 overflow-hidden border-2 border-black bg-white">
        <div className="talos-bar-segment h-full bg-[#00c2c8]" style={{ width: `${report.confidence}%`, transformOrigin: "left" }} />
      </div>

      <div className="mt-3 text-[12px] font-black text-black">Investigation Steps</div>
      <div className="mt-2 border-[2px] border-black bg-white">
        {steps.map(([title, detail, state]) => (
          <div key={title} className="grid grid-cols-[26px_1fr] gap-2 border-b border-black px-3 py-2 last:border-b-0">
            <div className={`mt-0.5 grid h-4.5 w-4.5 place-items-center border-2 border-black ${state === "spin" ? "bg-[#00c2c8]" : "bg-[#d8ff2f]"}`}>
              {state === "spin" ? <RefreshCw size={10} className="talos-spinner" /> : <ChevronDown size={10} />}
            </div>
            <div>
              <div className="text-[12px] font-black text-black">{title}</div>
              <div className="text-[10px] font-bold text-[#4d473c]">{detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Link href={`/dashboard/incidents/${report.incidentId}`} className="talos-btn-glow mt-3 flex h-9 w-60 items-center justify-center gap-2 border-[2px] border-black bg-[#f5a019] text-[12px] font-black text-black shadow-[3px_3px_0_#000]">
        View Full Investigation <ChevronRight size={14} />
      </Link>
      </div>
    </section>
  );
}
