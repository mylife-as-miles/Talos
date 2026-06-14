import Link from "next/link";
import { ChevronRight, Siren } from "lucide-react";

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "green" | "cyan" | "purple" | "red" | "amber" | "blue" }) {
  const tones = {
    green: "border-[#1d6e55] bg-[#0a362e] text-[#3df49a]",
    cyan: "border-[#185871] bg-[#0b2a37] text-[#35dffc]",
    purple: "border-[#5e3b8d] bg-[#241b3d] text-[#bb91ff]",
    red: "border-[#6d2f35] bg-[#391a20] text-[#ff6d73]",
    amber: "border-[#724b15] bg-[#342713] text-[#ffb331]",
    blue: "border-[#154966] bg-[#0a2739] text-[#26baff]"
  };
  return <span className={`inline-flex h-9 items-center rounded-md border px-4 text-[13px] font-semibold uppercase ${tones[tone]}`}>{children}</span>;
}

function priorityTone(priority: TalosTriageReport["priority"]) {
  if (priority === "critical") return "red";
  if (priority === "high") return "amber";
  if (priority === "medium") return "amber";
  return "blue";
}

function statusTone(status: TalosTriageReport["status"]) {
  if (status === "triaged") return "blue";
  if (status === "resolved") return "green";
  return "amber";
}

export function IncidentsTable({ reports }: { reports: TalosTriageReport[] }) {
  return (
    <section className="talos-panel talos-fade-up talos-stagger-5 mt-2 rounded-lg">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-[15px] uppercase tracking-[.08em] text-[#c5ced6]">Active Incidents</div>
        {reports.length ? (
          <Link href="/incidents" className="talos-btn-glow h-9 rounded-md border border-[#15556a] px-5 text-[14px] leading-9 text-[#36e1ff]">
            View Full Incidents
          </Link>
        ) : null}
      </div>
      {reports.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-[14px]">
            <thead className="border-y border-[#1f2d34] text-[13px] uppercase text-[#a8b3bd]">
              <tr>
                {["ID", "Service", "Error", "Priority", "Status", "Created", "Confidence", ""].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 8).map((report, index) => (
                <tr
                  key={report.incidentId}
                  className="talos-row-enter border-b border-[#1c2930] text-[#cbd4dc] transition hover:bg-white/[.02]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <td className="px-5 py-3 font-medium">
                    <Link href={`/incidents/${report.incidentId}`} className="text-[#36e1ff] hover:underline">
                      {report.incidentId}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="block text-[#e0e7ec]">{report.affectedService}</span>
                    <span className="text-[12px] text-[#8d99a3]">{report.affectedRoute || "—"}</span>
                  </td>
                  <td className="max-w-[350px] truncate px-5 py-3">{report.trigger}</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={priorityTone(report.priority)}>{report.priority}</StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={statusTone(report.status)}>{report.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-[#aeb8c0]">{formatRelativeTime(report.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <span>{report.confidence}%</span>
                      <span className="h-1.5 w-28 overflow-hidden rounded-full bg-[#223038]">
                        <span className="talos-bar-segment block h-full rounded-full bg-[#35d8e8]" style={{ width: `${report.confidence}%`, transformOrigin: "left" }} />
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#7e8a93]">
                    <Link href={`/incidents/${report.incidentId}`}>
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 pb-5">
          <EmptyState
            compact
            icon={Siren}
            title="No incidents yet"
            description="Run the guided demo flow to capture a crash, investigate with Splunk MCP, and generate your first AI triage report."
            action={{ label: "Start Demo Flow", href: "/demo" }}
            secondaryAction={{ label: "View settings", href: "/settings" }}
          />
        </div>
      )}
    </section>
  );
}
