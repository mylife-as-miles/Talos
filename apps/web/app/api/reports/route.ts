import { listReports } from "@/lib/store/reports";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  return Response.json({ ok: true, reports: await listReports() });
}
