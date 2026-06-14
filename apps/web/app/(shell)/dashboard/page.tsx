import {
  Box,
  Brain,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronsUp,
  Crosshair,
  FlaskConical,
  Filter,
  Info,
  Link2,
  MoreVertical,
  RefreshCw,
  ShieldAlert
} from "lucide-react";

const bars = [
  110, 280, 430, 360, 250, 220, 300, 240, 210, 150, 180, 310, 400, 270, 540, 350,
  210, 185, 260, 420, 310, 170, 230, 440, 260, 210, 315, 500, 620, 710, 840, 690,
  520, 740, 630, 720, 610, 380, 470, 600, 510
];

const incidents = [
  ["INC-52789", "checkout-service", "Node.js", "TypeError: Cannot read property 'id' of undefined", "CRITICAL", "INVESTIGATING", "12:58:41", "2 min ago", "342", "94%", "node"],
  ["INC-52788", "payment-service", "Python", "psycopg2.OperationalError: timeout expired", "HIGH", "OPEN", "12:41:07", "4 min ago", "156", "89%", "python"],
  ["INC-52787", "auth-service", "Go", "context deadline exceeded", "HIGH", "OPEN", "12:35:22", "7 min ago", "98", "87%", "go"],
  ["INC-52786", "inventory-service", "Java", "java.net.SocketTimeoutException: Read timed out", "MEDIUM", "ACKNOWLEDGED", "12:22:11", "18 min ago", "64", "76%", "java"],
  ["INC-52785", "email-service", "Node.js", "Error: getaddrinfo ENOTFOUND smtp.provider.com", "LOW", "OPEN", "11:58:03", "42 min ago", "27", "65%", "node"]
];

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
  icon
}: {
  label: string;
  value: string;
  delta?: string;
  tone: "cyan" | "red";
  icon: React.ReactNode;
}) {
  return (
    <section className="talos-panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] uppercase tracking-[.09em] text-[#a8b3bd]">{label}</div>
          <div className={`mt-2 text-[38px] font-semibold leading-none ${tone === "cyan" ? "text-[#31d8f5]" : "text-[#ff5b62]"}`}>{value}</div>
        </div>
        <div className={`grid h-14 w-14 place-items-center rounded-2xl border ${tone === "cyan" ? "border-[#1c6d78] bg-[#0c3b45] text-[#28d7f5]" : "border-[#6b3035] bg-[#482128] text-[#ff656b]"}`}>
          {icon}
        </div>
      </div>
      {delta ? <MetricSparkline tone={tone} /> : <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#233039]"><div className="h-full w-[87%] rounded-full bg-[#3bd8e7]" /></div>}
      <div className={`mt-3 flex items-center gap-2 text-[13px] ${tone === "cyan" ? "text-[#37e9f9]" : "text-[#ff6169]"}`}>
        <ChevronsUp size={15} /> {delta || "6.7pp"} <span className="text-[#9ea8b2]">vs yesterday</span>
      </div>
    </section>
  );
}

function RuntimeChart() {
  const max = 900;
  return (
    <div>
      <div className="relative mt-4 h-[250px] border-b border-[#24333a]">
        {[1000, 800, 600, 400, 200, 0].map((tick, index) => (
          <div key={tick} className="absolute left-0 right-0 border-t border-[#1c2a31]" style={{ top: `${index * 20}%` }}>
            <span className="absolute -top-2 left-0 text-[12px] text-[#8d99a3]">{tick === 1000 ? "1K" : tick}</span>
          </div>
        ))}
        <div className="absolute bottom-0 left-12 right-2 flex h-[220px] items-end gap-[5px]">
          {bars.map((bar, index) => {
            const critical = Math.max(8, bar * 0.08);
            const high = Math.max(10, bar * 0.13);
            const medium = Math.max(8, bar * 0.12);
            const low = Math.max(22, bar * 0.45);
            const info = Math.max(18, bar * 0.22);
            return (
              <div key={index} className="flex w-full min-w-[8px] flex-col justify-end">
                <div style={{ height: `${(info / max) * 220}px` }} className="bg-[#6a737b]/70" />
                <div style={{ height: `${(medium / max) * 220}px` }} className="bg-[#efb53f]" />
                <div style={{ height: `${(high / max) * 220}px` }} className="bg-[#f17b2d]" />
                <div style={{ height: `${(critical / max) * 220}px` }} className="bg-[#ee4b59]" />
                <div style={{ height: `${(low / max) * 220}px` }} className="bg-[#0a8ec1]" />
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 right-5 top-3 border-l border-dashed border-[#a7b0b7]/70">
          <span className="absolute -left-4 -top-5 text-[12px] text-[#b7c2ca]">NOW</span>
        </div>
      </div>
      <div className="ml-12 mt-3 grid grid-cols-6 text-[13px] text-[#9da8b2]">
        {["18:00", "21:00", "00:00", "03:00", "06:00", "09:00"].map((time) => <span key={time}>{time}</span>)}
      </div>
      <div className="relative mx-4 mt-6 h-[74px]">
        <div className="absolute left-0 right-0 top-4 h-px bg-gradient-to-r from-[#ef4d55] via-[#e8a82e] to-[#19a9c5]" />
        {[
          ["17:42", "Auth Service", "Deploy", "red", "18%"],
          ["22:31", "DB Failover", "Completed", "red", "38%"],
          ["03:16", "Payment Gateway", "Deploy", "amber", "52%"],
          ["08:47", "Cache Cluster", "Scale Up", "cyan", "71%"],
          ["12:58", "Feature Flag", "Update", "cyan", "88%"]
        ].map(([time, title, detail, tone, left]) => (
          <div key={time} className="absolute top-0 w-28 -translate-x-1/2 text-center" style={{ left }}>
            <div className={`mx-auto grid h-7 w-7 place-items-center rounded-full border-2 ${tone === "red" ? "border-[#e94650] text-[#e94650]" : tone === "amber" ? "border-[#e5a72d] text-[#e5a72d]" : "border-[#21bed6] text-[#21bed6]"} bg-[#101a1f]`}>
              <Info size={15} />
            </div>
            <div className="mt-2 text-[12px] text-[#a4aeb7]">{time}</div>
            <div className="mt-1 text-[13px] text-[#c4cbd2]">{title}</div>
            <div className="text-[13px] text-[#c4cbd2]">{detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function InvestigationPanel() {
  return (
    <section className="talos-panel rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">Splunk MCP Investigation <Info size={15} className="text-[#81909a]" /></div>
        <ChevronDown size={17} className="rotate-180 text-[#c3ccd3]" />
      </div>
      <div className="mt-5 flex flex-wrap gap-4">
        <StatusBadge tone="green"><Link2 size={17} className="mr-2" /> MCP Connected</StatusBadge>
        <StatusBadge tone="cyan"><Crosshair size={17} className="mr-2" /> HEC Ready</StatusBadge>
        <StatusBadge tone="purple"><FlaskConical size={17} className="mr-2" /> Mock Mode</StatusBadge>
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-[15px] text-[#dce4ea]">Active Investigation</div>
          <div className="mt-3 text-[14px] text-[#aeb9c1]">checkout-service / TypeError: Cannot read property 'id' of undefined</div>
          <div className="mt-2 text-[14px] text-[#87939e]">Started 2 min ago <span className="mx-2">•</span> Confidence <span className="text-[#3beaa5]">94%</span></div>
        </div>
        <div className="text-[14px] text-[#9da8b2]">INV-2025-05-21-1258</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#223038]"><div className="h-full w-[91%] rounded-full bg-[#35d8e8]" /></div>
      <div className="mt-6 text-[15px] text-[#dce4ea]">Investigation Steps</div>
      <div className="mt-3 rounded-lg border border-[#24333b] bg-[#0b1418]">
        {[
          ["Querying Splunk via MCP", "Searching prod logs, traces, metrics...", "12s", "spin"],
          ["Correlating Events", "Found 12 correlated events", "8s", "done"],
          ["Root Cause Analysis", "Evaluating failure patterns...", "15s", "done"],
          ["Remediation Recommendation", "Generating fix and validation steps...", "", "pending"]
        ].map(([title, detail, time, state]) => (
          <div key={title} className="grid grid-cols-[34px_1fr_auto] gap-3 border-b border-[#1d2b32] px-4 py-3 last:border-b-0">
            <div className={`mt-1 grid h-5 w-5 place-items-center rounded-full border ${state === "pending" ? "border-[#66737c] text-[#66737c]" : "border-[#28d786] text-[#28d786]"}`}>
              {state === "spin" ? <RefreshCw size={13} className="text-[#27d6e8]" /> : state === "pending" ? null : <ChevronDown size={13} />}
            </div>
            <div><div className="text-[15px] text-[#dce5eb]">{title}</div><div className="text-[13px] text-[#8d99a3]">{detail}</div></div>
            <div className="text-[13px] text-[#b7c0c7]">{time}</div>
          </div>
        ))}
      </div>
      <button className="mt-2 flex h-10 w-72 items-center justify-center gap-3 rounded-md border border-[#13566a] bg-[#0b2730] text-[14px] text-[#42e2ff]">View Full Investigation <ChevronRight size={17} /></button>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div><h1 className="text-[34px] font-bold tracking-[-.03em] text-[#f4f7fb]">Talos Guardian Status</h1><p className="mt-2 text-[17px] text-[#aab5bf]">Real-time overview of your runtime ecosystem</p></div>
        <div className="flex items-center gap-3">
          <button className="flex h-11 items-center gap-3 rounded-md border border-[#23333b] bg-[#0c151a] px-4 text-[15px] text-[#d6dee6]"><CalendarDays size={17} /> Last 24 hours <ChevronDown size={16} /></button>
          <button className="flex h-11 items-center gap-3 rounded-md border border-[#23333b] bg-[#0c151a] px-4 text-[15px] text-[#d6dee6]"><RefreshCw size={17} /> Auto-refresh <span className="h-2 w-2 rounded-full bg-[#2bd17f]" /></button>
        </div>
      </div>
      <div className="mt-7 grid gap-3 xl:grid-cols-4">
        <MetricCard label="Captured Errors" value="8,847" delta="18.6%" tone="cyan" icon={<Crosshair size={28} />} />
        <MetricCard label="Critical Incidents" value="23" delta="27.8%" tone="red" icon={<ShieldAlert size={27} />} />
        <MetricCard label="Diagnosis Confidence" value="92.4%" tone="cyan" icon={<Brain size={28} />} />
        <section className="talos-panel rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div><div className="text-[13px] uppercase tracking-[.09em] text-[#a8b3bd]">Latest Service</div><div className="mt-5 text-[24px] font-semibold text-white">checkout-service</div><div className="mt-4 text-[15px] text-[#9faab4]">nodejs <span className="mx-4">•</span> v2.14.1 <span className="mx-4">•</span> prod</div><div className="mt-7 text-[14px] text-[#a2acb5]">2 min ago</div></div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#1c6d78] bg-[#0c3b45] text-[#28d7f5]"><Box size={28} /></div>
          </div>
        </section>
      </div>
      <div className="mt-3 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="talos-panel rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">Runtime Error Intake <Info size={15} className="text-[#81909a]" /></div>
            <div className="flex items-center gap-3"><button className="flex h-10 items-center gap-12 rounded-md border border-[#24343c] px-4 text-[14px] text-[#d6dee6]">Group by: Service <ChevronDown size={15} /></button><button className="grid h-10 w-12 place-items-center rounded-md border border-[#24343c] text-[#c7d1d8]"><Filter size={20} /></button></div>
          </div>
          <div className="mt-5 flex items-center gap-6 text-[14px] text-[#c1cad2]">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#ef4d55]" />Critical</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#f17b2d]" />High</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#efb53f]" />Medium</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#0a8ec1]" />Low</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#5d6870]" />Info</span>
          </div>
          <RuntimeChart />
        </section>
        <InvestigationPanel />
      </div>
      <section className="talos-panel mt-2 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">Active Incidents <Info size={15} className="text-[#81909a]" /></div>
          <div className="flex gap-3"><button className="flex h-9 items-center gap-12 rounded-md border border-[#26363d] px-4 text-[14px] text-[#d6dee6]">All Services <ChevronDown size={15} /></button><button className="flex h-9 items-center gap-12 rounded-md border border-[#26363d] px-4 text-[14px] text-[#d6dee6]">All Status <ChevronDown size={15} /></button><button className="h-9 rounded-md border border-[#15556a] px-5 text-[14px] text-[#36e1ff]">View Full Incidents</button></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-[14px]">
            <thead className="border-y border-[#1f2d34] text-[13px] uppercase text-[#a8b3bd]"><tr>{["ID ↕", "Service", "Error", "Priority", "Status", "First Seen", "Last Seen", "Count", "Diagnosis Confidence", ""].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody>{incidents.map(([id, service, runtime, error, priority, status, firstSeen, lastSeen, count, confidence, icon]) => (
              <tr key={id} className="border-b border-[#1c2930] text-[#cbd4dc]">
                <td className="px-5 py-3 font-medium">{id}</td>
                <td className="px-5 py-3"><div className="flex items-center gap-3"><span className={`grid h-5 w-5 place-items-center rounded text-[10px] ${icon === "python" ? "bg-[#15395d] text-[#ffd544]" : icon === "go" ? "bg-[#083b48] text-[#42e6ff]" : icon === "java" ? "bg-[#3e2413] text-[#ff9a42]" : "bg-[#103b25] text-[#47e276]"}`}>{icon === "python" ? "Py" : icon === "go" ? "Go" : icon === "java" ? "J" : "N"}</span><span><span className="block text-[#e0e7ec]">{service}</span><span className="text-[12px] text-[#8d99a3]">{runtime}</span></span></div></td>
                <td className="max-w-[350px] truncate px-5 py-3">{error}</td>
                <td className="px-5 py-3"><StatusBadge tone={priority === "CRITICAL" ? "red" : priority === "HIGH" ? "amber" : priority === "MEDIUM" ? "amber" : "blue"}>{priority}</StatusBadge></td>
                <td className="px-5 py-3"><StatusBadge tone={status === "INVESTIGATING" ? "blue" : status === "ACKNOWLEDGED" ? "purple" : "amber"}>{status}</StatusBadge></td>
                <td className="px-5 py-3 text-[#aeb8c0]">{firstSeen}</td><td className="px-5 py-3 text-[#aeb8c0]">{lastSeen}</td><td className="px-5 py-3">{count}</td>
                <td className="px-5 py-3"><div className="flex items-center gap-4"><span>{confidence}</span><span className="h-1.5 w-28 overflow-hidden rounded-full bg-[#223038]"><span className="block h-full rounded-full bg-[#35d8e8]" style={{ width: confidence }} /></span></div></td>
                <td className="px-5 py-3 text-[#7e8a93]"><MoreVertical size={18} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
