import type { SplunkInvestigationContext, SplunkInvestigator } from "./types";

export class SplunkRestClient implements SplunkInvestigator {
  constructor(private readonly options?: { index?: string }) {}

  async investigateError(input: Parameters<SplunkInvestigator["investigateError"]>[0]): Promise<SplunkInvestigationContext> {
    const baseUrl = process.env.SPLUNK_BASE_URL;
    const token = process.env.SPLUNK_TOKEN;
    const index = this.options?.index || process.env.SPLUNK_INDEX || "main";
    const queryUsed = `search index=${index} service=${input.service} ${input.route ? `route=${input.route}` : ""} "${input.errorMessage}" earliest=${input.timeWindow}`;

    if (!baseUrl || !token || token === "replace_with_token") {
      throw new Error("Splunk REST fallback is not configured.");
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/services/search/jobs/export`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ search: queryUsed, output_mode: "json" })
    });

    if (!response.ok) {
      throw new Error(`Splunk REST search failed with ${response.status}`);
    }

    const text = await response.text();
    const events = text
      .split("\n")
      .filter(Boolean)
      .slice(0, 20)
      .map((line) => {
        const row = JSON.parse(line) as { result?: Record<string, unknown> };
        return {
          timestamp: String(row.result?._time || new Date().toISOString()),
          service: String(row.result?.service || input.service),
          route: String(row.result?.route || input.route || ""),
          message: String(row.result?._raw || input.errorMessage),
          raw: row.result
        };
      });

    return {
      mode: "rest",
      queryUsed,
      events,
      timeline: events.map((event) => ({ timestamp: event.timestamp, message: event.message, source: "splunk" })),
      stats: {
        totalEvents: events.length,
        matchingErrors: events.length,
        affectedRoutes: [...new Set(events.map((event) => event.route).filter(Boolean))],
        affectedServices: [...new Set(events.map((event) => event.service))]
      }
    };
  }
}
