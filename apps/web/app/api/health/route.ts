import { isMockMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  return Response.json({
    ok: true,
    service: "talos-web",
    mockMode: isMockMode(),
    splunkMcp: process.env.SPLUNK_MCP_MODE === "enabled" ? "enabled" : "disabled"
  });
}
