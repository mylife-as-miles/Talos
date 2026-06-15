import { isSimulationMode } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  return Response.json({
    ok: true,
    service: "talos-web",
    simulationMode: isSimulationMode(),
    splunkMcp: process.env.SPLUNK_MCP_MODE === "enabled" ? "enabled" : "disabled"
  });
}
