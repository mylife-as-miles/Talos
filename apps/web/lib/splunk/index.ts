import { mockSplunkContext } from "../demo-data";
import type { TalosErrorEvent } from "../types";
import { SplunkMcpClient } from "./mcp-client";
import { SplunkRestClient } from "./rest-client";

export async function getSplunkContext({ event }: { event: TalosErrorEvent }) {
  if (process.env.TALOS_MOCK_MODE === "true") {
    return mockSplunkContext(event);
  }

  const input = {
    eventId: event.eventId,
    service: event.service,
    route: event.route,
    errorMessage: event.error.message,
    timeWindow: "-15m"
  };

  if (process.env.SPLUNK_MCP_MODE === "enabled") {
    try {
      return await new SplunkMcpClient().investigateError(input);
    } catch {
      return new SplunkRestClient().investigateError(input);
    }
  }

  return new SplunkRestClient().investigateError(input);
}
