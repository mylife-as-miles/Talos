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
  return <span className={`inline-flex h-9 items-center border-2 border-black px-4 text-[13px] font-black uppercase text-black shadow-[3px_3px_0_#000] ${tones[tone]}`}>{children}</span>;
}

export function InvestigationPanel({ report }: { report?: TalosTriageReport }) {
  const mock = isMockMode();

  if (!report) {
    return (
      <section className="talos-panel talos-fade-up talos-stagger-4 p-6">
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
    ["Querying Splunk via MCP", `${report.splunk.queryUsed.slice(0, 72)}...`, "spin"],
    ["Correlating Events", `${report.splunk.eventCount} correlated events`, "done"],
    ["Root Cause Analysis", `${report.rootCause.slice(0, 72)}...`, "done"],
    ["Remediation Recommendation", `${report.proposedFix.explanation.slice(0, 72)}...`, "done"]
  ] as const;

  return (
    <section className="talos-panel talos-fade-up talos-stagger-4 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b-[4px] border-black bg-black px-6 py-4 text-white">
        <div className="flex items-center gap-2 text-[15px] font-black uppercase tracking-[.08em]">
          Splunk MCP Investigation <Info size={15} className="text-white" />
        </div>
        <ChevronDown size={17} className="rotate-180 text-white" />
      </div>
      <div className="p-6">
      <div className="flex flex-wrap gap-4">
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
          <div className="text-[15px] font-black text-black">Active Investigation</div>
          <div className="mt-3 text-[14px] font-bold text-[#3d392f]">
            {report.affectedService} / {report.trigger}
          </div>
          <div className="mt-2 text-[14px] font-bold text-[#4d473c]">
            {formatRelativeTime(report.createdAt)} <span className="mx-2">/</span> Confidence <span className="bg-[#d8ff2f] px-1 text-black">{report.confidence}%</span>
          </div>
        </div>
        <div className="text-[14px] font-black text-black">{report.incidentId}</div>
      </div>

      <div className="mt-4 h-3 overflow-hidden border-2 border-black bg-white">
        <div className="talos-bar-segment h-full bg-[#00c2c8]" style={{ width: `${report.confidence}%`, transformOrigin: "left" }} />
      </div>

      <div className="mt-6 text-[15px] font-black text-black">Investigation Steps</div>
      <div className="mt-3 border-[3px] border-black bg-white">
        {steps.map(([title, detail, state]) => (
          <div key={title} className="grid grid-cols-[34px_1fr] gap-3 border-b-2 border-black px-4 py-3 last:border-b-0">
            <div className={`mt-1 grid h-5 w-5 place-items-center border-2 border-black ${state === "spin" ? "bg-[#00c2c8]" : "bg-[#d8ff2f]"}`}>
              {state === "spin" ? <RefreshCw size={13} className="talos-spinner" /> : <ChevronDown size={13} />}
            </div>
            <div>
              <div className="text-[15px] font-black text-black">{title}</div>
              <div className="text-[13px] font-bold text-[#4d473c]">{detail}</div>
            </div>
          </div>
        ))}
      </div>

      <Link href={`/incidents/${report.incidentId}`} className="talos-btn-glow mt-4 flex h-11 w-72 items-center justify-center gap-3 border-[3px] border-black bg-[#f5a019] text-[14px] font-black text-black shadow-[4px_4px_0_#000]">
        View Full Investigation <ChevronRight size={17} />
      </Link>
      </div>
    </section>
  );
}
