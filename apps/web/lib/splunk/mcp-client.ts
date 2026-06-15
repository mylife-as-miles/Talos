import type { SplunkInvestigationContext, SplunkInvestigator } from "./types";

export class SplunkMcpClient implements SplunkInvestigator {
  constructor(
    private readonly serverUrl = process.env.SPLUNK_MCP_SERVER_URL || "http://localhost:8000",
    private readonly options?: { index?: string }
  ) {}

  async investigateError(input: Parameters<SplunkInvestigator["investigateError"]>[0]): Promise<SplunkInvestigationContext> {
    const index = this.options?.index || process.env.SPLUNK_INDEX || "main";
    const queryUsed = `search index=${index} service=${input.service} ${input.route ? `route=${input.route}` : ""} "${input.errorMessage}" earliest=${input.timeWindow}`;
    const response = await fetch(`${this.serverUrl.replace(/\/$/, "")}/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryUsed, eventId: input.eventId })
    });

    if (!response.ok) {
      throw new Error(`Splunk MCP unavailable: ${response.status}`);
    }

    const json = (await response.json()) as Partial<SplunkInvestigationContext>;
    return {
      mode: "mcp",
      queryUsed,
      events: json.events ?? [],
      timeline: json.timeline ?? [],
      stats: json.stats ?? {
        totalEvents: json.events?.length ?? 0,
        matchingErrors: json.events?.length ?? 0,
        affectedRoutes: input.route ? [input.route] : [],
        affectedServices: [input.service]
      }
    };
  }
}
