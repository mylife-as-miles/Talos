export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET() {
  return Response.json({
    ok: true,
    service: "talos-web",
    mockMode: process.env.TALOS_MOCK_MODE === "true",
    splunkMcp: process.env.SPLUNK_MCP_MODE === "enabled" ? "enabled" : "disabled"
  });
}
