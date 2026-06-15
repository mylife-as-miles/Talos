import Link from "next/link";
import { ChevronRight, Siren } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatRelativeTime } from "@/lib/dashboard-stats";
import type { TalosTriageReport } from "@/lib/types";

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "green" | "purple" | "red" | "amber" | "blue" }) {
  const tones = {
    green: "bg-[#d8ff2f]",
    purple: "bg-[#ff00ff]",
    red: "bg-[#ff4d5a]",
    amber: "bg-[#ffe100]",
    blue: "bg-[#00c2c8]"
  };
  return <span className={`inline-flex h-8 items-center border-2 border-black px-3 text-[12px] font-black uppercase text-black shadow-[3px_3px_0_#000] ${tones[tone]}`}>{children}</span>;
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
    <section className="talos-panel talos-fade-up talos-stagger-5 mt-2 overflow-hidden">
      <div className="flex items-center justify-between border-b-[4px] border-black bg-black px-5 py-4 text-white">
        <div className="text-[15px] font-black uppercase tracking-[.08em]">Active Incidents</div>
        {reports.length ? (
          <Link href="/incidents" className="talos-brutal-control h-10 border-[3px] border-black bg-[#ffe100] px-5 text-[14px] font-black leading-9 text-black shadow-[4px_4px_0_#fff]">
            View Full Incidents
          </Link>
        ) : null}
      </div>
      {reports.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-[14px]">
            <thead className="border-b-[3px] border-black bg-[#ffe100] text-[12px] uppercase text-black">
              <tr>
                {["ID", "Service", "Error", "Priority", "Status", "Created", "Confidence", ""].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-black">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 8).map((report, index) => (
                <tr
                  key={report.incidentId}
                  className="talos-brutal-row talos-row-enter border-b-2 border-black bg-white text-black transition hover:bg-[#d8ff2f]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <td className="px-5 py-3 font-black">
                    <Link href={`/incidents/${report.incidentId}`} className="underline decoration-2 underline-offset-4">
                      {report.incidentId}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="block font-black text-black">{report.affectedService}</span>
                    <span className="text-[12px] font-bold text-[#4d473c]">{report.affectedRoute || "-"}</span>
                  </td>
                  <td className="max-w-[350px] truncate px-5 py-3 font-bold text-[#3d392f]">{report.trigger}</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={priorityTone(report.priority)}>{report.priority}</StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={statusTone(report.status)}>{report.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 font-bold text-[#4d473c]">{formatRelativeTime(report.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <span className="font-black">{report.confidence}%</span>
                      <span className="h-3 w-28 overflow-hidden border-2 border-black bg-white">
                        <span className="talos-bar-segment block h-full bg-[#00c2c8]" style={{ width: `${report.confidence}%`, transformOrigin: "left" }} />
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/incidents/${report.incidentId}`} className="grid h-8 w-8 place-items-center border-2 border-black bg-[#00c2c8] shadow-[3px_3px_0_#000]">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 pb-5 pt-5">
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
