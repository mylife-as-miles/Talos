import type { TalosTriageReport } from "../types";
import { readJsonArray, writeJsonArray } from "./json-store";

const FILE = "reports.json";

export async function saveReport(report: TalosTriageReport) {
  const reports = await readJsonArray<TalosTriageReport>(FILE);
  const next = [report, ...reports.filter((row) => row.incidentId !== report.incidentId)].slice(0, 100);
  await writeJsonArray(FILE, next);
  return report;
}

export async function getReport(incidentId?: string) {
  const reports = await listReports();
  return incidentId ? reports.find((report) => report.incidentId === incidentId) : reports[0];
}

export async function listReports() {
  return readJsonArray<TalosTriageReport>(FILE);
}
