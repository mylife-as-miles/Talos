import Link from "next/link";
import { Box, Brain, ChevronsUp, Crosshair, Filter, Info, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { InvestigationPanel } from "@/components/dashboard/investigation-panel";
import { IncidentsTable } from "@/components/dashboard/incidents-table";
import { RuntimeChart } from "@/components/dashboard/runtime-chart";
import { buildDashboardStats, formatRelativeTime, runtimeLabel } from "@/lib/dashboard-stats";
import { listEvents } from "@/lib/store/events";
import { listReports } from "@/lib/store/reports";
import { CirclePlay } from "lucide-react";

function MetricSparkline({ tone = "cyan" }: { tone?: "cyan" | "red" }) {
  const stroke = tone === "cyan" ? "#26d7f5" : "#ff555d";
  const points = "0,25 13,20 25,24 38,18 51,25 63,22 76,27 89,20 102,26 115,22 128,28 141,19 154,17 167,14 180,18 193,15 206,20 219,11 232,17";
  return (
    <svg viewBox="0 0 232 40" className="mt-3 h-10 w-full" aria-hidden>
      <path d={`M${points}`} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  delta,
  tone,
  icon,
  stagger
}: {
  label: string;
  value: string;
  delta?: string;
  tone: "cyan" | "red";
  icon: React.ReactNode;
  stagger: string;
}) {
  return (
    <section className={`talos-panel talos-fade-up ${stagger} rounded-lg p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] uppercase tracking-[.09em] text-[#a8b3bd]">{label}</div>
          <div className={`mt-2 text-[38px] font-semibold leading-none ${tone === "cyan" ? "text-[#31d8f5]" : "text-[#ff5b62]"}`}>{value}</div>
        </div>
        <div className={`grid h-14 w-14 place-items-center rounded-2xl border ${tone === "cyan" ? "border-[#1c6d78] bg-[#0c3b45] text-[#28d7f5]" : "border-[#6b3035] bg-[#482128] text-[#ff656b]"}`}>
          {icon}
        </div>
      </div>
      {delta ? (
        <MetricSparkline tone={tone} />
      ) : (
        <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#233039]">
          <div className="talos-bar-segment h-full w-[87%] rounded-full bg-[#3bd8e7]" style={{ transformOrigin: "left" }} />
        </div>
      )}
      {delta ? (
        <div className={`mt-3 flex items-center gap-2 text-[13px] ${tone === "cyan" ? "text-[#37e9f9]" : "text-[#ff6169]"}`}>
          <ChevronsUp size={15} /> {delta} <span className="text-[#9ea8b2]">from demo intake</span>
        </div>
      ) : null}
    </section>
  );
}

export default async function DashboardPage() {
  const [events, reports] = await Promise.all([listEvents(), listReports()]);
  const stats = buildDashboardStats(events, reports);

  return (
    <AppShell>
      <PageHeader
        title="Talos Guardian Status"
        description="Real-time overview of SDK intake, Splunk investigations, and AI triage."
        actions={
          stats.hasData ? null : (
            <Link href="/demo" className="talos-btn-glow flex h-11 items-center gap-3 rounded-md border border-[#13566a] bg-[#0b2730] px-4 text-[15px] text-[#42e2ff]">
              <CirclePlay size={17} /> Run Demo Flow
            </Link>
          )
        }
      />

      {!stats.hasData ? (
        <div className="mt-8">
          <EmptyState
            icon={Crosshair}
            title="Guardian is standing by"
            description="Talos is ready to capture runtime failures, investigate through Splunk MCP, and generate fix-ready triage reports. Start with the guided demo flow."
            action={{ label: "Open Demo Flow", href: "/demo" }}
            secondaryAction={{ label: "Configure integrations", href: "/settings" }}
          />
        </div>
      ) : null}

      <div className="mt-7 grid gap-3 xl:grid-cols-4">
        <MetricCard
          label="Captured Errors"
          value={stats.eventCount.toLocaleString()}
          delta={stats.eventCount ? `${stats.eventCount} events` : undefined}
          tone="cyan"
          icon={<Crosshair size={28} />}
          stagger="talos-stagger-1"
        />
        <MetricCard
          label="Critical Incidents"
          value={String(stats.criticalCount)}
          delta={stats.criticalCount ? `${stats.criticalCount} critical` : undefined}
          tone="red"
          icon={<ShieldAlert size={27} />}
          stagger="talos-stagger-2"
        />
        <MetricCard
          label="Diagnosis Confidence"
          value={stats.avgConfidence ? `${stats.avgConfidence}%` : "—"}
          tone="cyan"
          icon={<Brain size={28} />}
          stagger="talos-stagger-3"
        />
        <section className="talos-panel talos-fade-up talos-stagger-4 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] uppercase tracking-[.09em] text-[#a8b3bd]">Latest Service</div>
              <div className="mt-5 text-[24px] font-semibold text-white">{stats.latestEvent?.service || "—"}</div>
              <div className="mt-4 text-[15px] text-[#9faab4]">
                {runtimeLabel(stats.latestEvent)} <span className="mx-4">•</span> {stats.latestEvent?.release || "—"}{" "}
                <span className="mx-4">•</span> {stats.latestEvent?.environment || "—"}
              </div>
              <div className="mt-7 text-[14px] text-[#a2acb5]">{formatRelativeTime(stats.latestEvent?.timestamp)}</div>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#1c6d78] bg-[#0c3b45] text-[#28d7f5]">
              <Box size={28} />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="talos-panel talos-fade-up talos-stagger-3 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">
              Runtime Error Intake <Info size={15} className="text-[#81909a]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 items-center rounded-md border border-[#24343c] px-4 text-[14px] text-[#8d99a3]">Last 24 hours</span>
              <span className="grid h-10 w-12 place-items-center rounded-md border border-[#24343c] text-[#66737c]">
                <Filter size={20} />
              </span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-6 text-[14px] text-[#c1cad2]">
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-[#ef4d55]" />
              Critical
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-[#f17b2d]" />
              High
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-[#efb53f]" />
              Medium
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-[#0a8ec1]" />
              Low
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded-sm bg-[#5d6870]" />
              Info
            </span>
          </div>
          <RuntimeChart bars={stats.intakeBars} empty={!stats.hasData} />
        </section>
        <InvestigationPanel report={stats.latestReport} />
      </div>

      <IncidentsTable reports={reports} />
    </AppShell>
  );
}
