import { Brain, Box, CalendarDays, ChevronDown, Crosshair, Filter, Info, RefreshCw, ShieldAlert } from "lucide-react";
import { DemoActions } from "@/components/demo-actions";
import { IncidentsTable } from "@/components/dashboard/incidents-table";
import { InvestigationPanel } from "@/components/dashboard/investigation-panel";
import { RuntimeChart } from "@/components/dashboard/runtime-chart";
import { buildDashboardStats, formatRelativeTime, runtimeLabel } from "@/lib/dashboard-stats";
import { isMockMode } from "@/lib/config";
import { listEvents } from "@/lib/store/events";
import { listReports } from "@/lib/store/reports";

function MetricSparkline({ tone = "cyan" }: { tone?: "cyan" | "red" | "yellow" }) {
  const stroke = tone === "red" ? "#ff4d5a" : tone === "yellow" ? "#f5a019" : "#00c2c8";
  const points = "0,25 13,20 25,24 38,18 51,25 63,22 76,27 89,20 102,26 115,22 128,28 141,19 154,17 167,14 180,18 193,15 206,20 219,11 232,17";
  return (
    <svg viewBox="0 0 232 40" className="mt-3 h-10 w-full" aria-hidden>
      <path d={`M${points}`} fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
  icon
}: {
  label: string;
  value: string;
  detail: string;
  tone: "cyan" | "red" | "yellow";
  icon: React.ReactNode;
}) {
  const accent = tone === "red" ? "bg-[#ff4d5a]" : tone === "yellow" ? "bg-[#ffe100]" : "bg-[#00c2c8]";
  return (
    <section className={`talos-panel talos-scanline talos-fade-up p-5 ${tone === "red" ? "bg-[#fff7ea]" : tone === "yellow" ? "bg-[#fffce2]" : "bg-[#f7fffb]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex border-2 border-black bg-black px-2 py-1 text-[12px] font-black uppercase tracking-[.09em] text-white">{label}</div>
          <div className={`mt-3 text-[48px] font-black leading-none ${tone === "red" ? "text-[#ff0000]" : tone === "yellow" ? "text-black" : "text-[#0000ff]"}`}>{value}</div>
        </div>
        <div className={`grid h-14 w-14 place-items-center border-[3px] border-black text-black shadow-[6px_6px_0_#000] ${accent}`}>{icon}</div>
      </div>
      <MetricSparkline tone={tone} />
      <div className="mt-3 inline-flex rotate-[-1deg] border-2 border-black bg-[#d8ff2f] px-2 py-1 text-[12px] font-black uppercase text-black shadow-[3px_3px_0_#000]">{detail}</div>
    </section>
  );
}

function Legend() {
  const items = [
    ["Critical", "bg-[#ee4b59]"],
    ["High", "bg-[#f17b2d]"],
    ["Medium", "bg-[#efb53f]"],
    ["Low", "bg-[#00c2c8]"],
    ["Info", "bg-[#b8b3a0]"]
  ];
  return (
    <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] font-black text-black">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-2">
          <i className={`h-4 w-4 border-2 border-black ${color}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const [events, reports] = await Promise.all([listEvents(), listReports()]);
  const stats = buildDashboardStats(events, reports);
  const latestService = stats.latestEvent?.service || stats.latestReport?.affectedService || "none";
  const latestRuntime = runtimeLabel(stats.latestEvent);
  const mock = isMockMode();

  return (
    <>
      <div className="talos-black-strip relative flex items-start justify-between gap-6 p-5 max-xl:flex-col">
        <div>
          <h1 className="talos-poster-title text-[clamp(3.2rem,7vw,6.6rem)] font-black uppercase leading-[0.82] text-[#fffdf1]">Talos Guardian Status</h1>
          <p className="mt-4 max-w-3xl text-[18px] font-black leading-7 text-[#d8ff2f]">SDK intake, Splunk HEC forwarding, MCP investigation, and AI triage in one loud little operations OS.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="talos-brutal-control flex h-12 items-center gap-3 border-[3px] border-black bg-white px-4 text-[15px] font-black text-black shadow-[4px_4px_0_#000]">
            <CalendarDays size={17} /> Last 24 hours <ChevronDown size={16} />
          </button>
          <button className="talos-brutal-control flex h-12 items-center gap-3 border-[3px] border-black bg-[#d8ff2f] px-4 text-[15px] font-black text-black shadow-[4px_4px_0_#000]">
            <RefreshCw size={17} /> Auto-refresh <span className="h-3 w-3 border-2 border-black bg-[#00c2c8]" />
          </button>
        </div>
        <div className="talos-sticker absolute -bottom-7 right-8 hidden px-4 py-2 text-center text-xl font-black uppercase leading-none md:block">Focus always visible</div>
      </div>

      <section className="talos-panel talos-scanline talos-fade-up mt-7 p-6 bg-[#fffce2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex border-2 border-black bg-black px-2 py-1 text-[11px] font-black uppercase tracking-[.09em] text-white">Simulation Mode</div>
            <h3 className="mt-2.5 text-[20px] font-black leading-none text-black">Simulate Incident</h3>
            <p className="mt-2 max-w-xl text-[14px] font-bold leading-normal text-[#4d473c]">Trigger a sample checkout failure and watch Talos generate a Splunk-backed AI triage report.</p>
          </div>
          <div>
            <DemoActions />
          </div>
        </div>
      </section>

      <div className="mt-7 grid gap-4 xl:grid-cols-4">
        <MetricCard label="Captured Errors" value={String(stats.eventCount)} detail="SDK runtime intake" tone="cyan" icon={<Crosshair size={28} strokeWidth={2.7} />} />
        <MetricCard label="Critical Incidents" value={String(stats.criticalCount)} detail="Production blast radius" tone="red" icon={<ShieldAlert size={27} strokeWidth={2.7} />} />
        <MetricCard label="Diagnosis Confidence" value={`${stats.avgConfidence}%`} detail="Resolver scoring" tone="yellow" icon={<Brain size={28} strokeWidth={2.7} />} />
        <section className="talos-panel talos-scanline talos-fade-up bg-[#fffce2] p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex border-2 border-black bg-black px-2 py-1 text-[12px] font-black uppercase tracking-[.09em] text-white">Latest Service</div>
              <div className="mt-5 text-[28px] font-black text-black">{latestService}</div>
              <div className="mt-4 text-[15px] font-bold text-[#4d473c]">
                {latestRuntime} <span className="mx-3">/</span> {mock ? "mock mode" : "live Splunk"}
              </div>
              <div className="mt-7 inline-flex border-2 border-black bg-white px-2 py-1 text-[12px] font-black uppercase text-black">
                {formatRelativeTime(stats.latestEvent?.timestamp || stats.latestReport?.createdAt)}
              </div>
            </div>
            <div className="grid h-14 w-14 place-items-center border-[3px] border-black bg-[#0000ff] text-white shadow-[6px_6px_0_#000]">
              <Box size={28} strokeWidth={2.7} />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="talos-panel talos-fade-up bg-[#fffdf1] p-5">
          <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
            <div className="flex items-center gap-2 border-[3px] border-black bg-[#00c2c8] px-3 py-2 text-[15px] font-black uppercase tracking-[.08em] text-black shadow-[4px_4px_0_#000]">
              Runtime Error Intake <Info size={15} className="text-black" />
            </div>
            <div className="flex items-center gap-3">
              <button className="talos-brutal-control flex h-11 items-center gap-8 border-[3px] border-black bg-white px-4 text-[14px] font-black text-black shadow-[4px_4px_0_#000]">
                Group by: Service <ChevronDown size={15} />
              </button>
              <button className="talos-brutal-control grid h-11 w-12 place-items-center border-[3px] border-black bg-[#ffe100] text-black shadow-[4px_4px_0_#000]">
                <Filter size={20} />
              </button>
            </div>
          </div>
          <Legend />
          <RuntimeChart bars={stats.intakeBars} empty={!stats.hasData} />
        </section>

        <InvestigationPanel report={stats.latestReport} />
      </div>

      <IncidentsTable reports={reports} />
    </>
  );
}
