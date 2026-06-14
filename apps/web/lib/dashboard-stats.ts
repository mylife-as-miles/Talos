import type { TalosErrorEvent, TalosTriageReport } from "./types";

export type IntakeBar = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
};

export type DashboardStats = {
  eventCount: number;
  criticalCount: number;
  avgConfidence: number;
  latestEvent?: TalosErrorEvent;
  latestReport?: TalosTriageReport;
  intakeBars: IntakeBar[];
  hasData: boolean;
};

const EMPTY_BAR: IntakeBar = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };

function priorityToBar(priority: TalosTriageReport["priority"]): Pick<IntakeBar, "critical" | "high" | "medium" | "low"> {
  switch (priority) {
    case "critical":
      return { critical: 1, high: 0, medium: 0, low: 0 };
    case "high":
      return { critical: 0, high: 1, medium: 0, low: 0 };
    case "medium":
      return { critical: 0, high: 0, medium: 1, low: 0 };
    default:
      return { critical: 0, high: 0, medium: 0, low: 1 };
  }
}

function mergeBar(target: IntakeBar, source: Partial<IntakeBar>) {
  target.critical += source.critical ?? 0;
  target.high += source.high ?? 0;
  target.medium += source.medium ?? 0;
  target.low += source.low ?? 0;
  target.info += source.info ?? 0;
}

export function buildDashboardStats(events: TalosErrorEvent[], reports: TalosTriageReport[]): DashboardStats {
  const bucketCount = 24;
  const intakeBars = Array.from({ length: bucketCount }, () => ({ ...EMPTY_BAR }));
  const now = Date.now();

  for (const report of reports) {
    const ageHours = Math.floor((now - new Date(report.createdAt).getTime()) / (1000 * 60 * 60));
    const index = Math.min(bucketCount - 1, Math.max(0, bucketCount - 1 - ageHours));
    mergeBar(intakeBars[index], priorityToBar(report.priority));
  }

  for (const event of events) {
    const ageHours = Math.floor((now - new Date(event.timestamp).getTime()) / (1000 * 60 * 60));
    const index = Math.min(bucketCount - 1, Math.max(0, bucketCount - 1 - ageHours));
    intakeBars[index].info += 1;
  }

  const criticalCount = reports.filter((report) => report.priority === "critical").length;
  const avgConfidence = reports.length
    ? Math.round((reports.reduce((sum, report) => sum + report.confidence, 0) / reports.length) * 10) / 10
    : 0;

  return {
    eventCount: events.length,
    criticalCount,
    avgConfidence,
    latestEvent: events[0],
    latestReport: reports[0],
    intakeBars,
    hasData: events.length > 0 || reports.length > 0
  };
}

export function formatRelativeTime(iso?: string) {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function runtimeLabel(event?: TalosErrorEvent) {
  if (!event?.runtime) return "—";
  return event.runtime.framework || event.runtime.language || "runtime";
}
