import { isMockMode } from "../config";
import { mockSplunkContext } from "../demo-data";
import type { TalosErrorEvent } from "../types";
import { SplunkMcpClient } from "./mcp-client";
import { SplunkRestClient } from "./rest-client";

export async function getSplunkContext(
  { event }: { event: TalosErrorEvent },
  overrides?: { hecUrl?: string; hecToken?: string; index?: string; mcpMode?: string; mcpUrl?: string }
) {
  const hasCustomSplunk = Boolean(overrides?.hecUrl || overrides?.hecToken || overrides?.mcpUrl);
  if (isMockMode() && !hasCustomSplunk) {
    return mockSplunkContext(event);
  }

  const input = {
    eventId: event.eventId,
    service: event.service,
    route: event.route,
    errorMessage: event.error.message,
    timeWindow: "-15m"
  };

  const mcpMode = overrides?.mcpMode ?? process.env.SPLUNK_MCP_MODE;
  const mcpUrl = overrides?.mcpUrl ?? process.env.SPLUNK_MCP_SERVER_URL;
  const index = overrides?.index ?? process.env.SPLUNK_INDEX;

  if (mcpMode === "enabled") {
    try {
      return await new SplunkMcpClient(mcpUrl, { index }).investigateError(input);
    } catch (error) {
      console.warn("Splunk MCP failed, falling back to REST client", error);
      return new SplunkRestClient({ index }).investigateError(input);
    }
  }

  return new SplunkRestClient({ index }).investigateError(input);
}
