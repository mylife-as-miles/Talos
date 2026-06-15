"use client";

import { useEffect, useState } from "react";
import { Badge, Card, CardHeader } from "./ui";
import {
  ByokSettings,
  SplunkHecSettings,
  SplunkMcpSettings,
  WebhookSettings,
  readBrowserByokSettings,
  readBrowserSplunkSettings,
  readBrowserWebhookSettings
} from "./byok-settings";

type EnvConfig = {
  splunkHec: boolean;
  splunkMcp: boolean;
  aiProvider: boolean;
  discordWebhook: boolean;
  slackWebhook: boolean;
};

export function SettingsContent({ envConfig }: { envConfig: EnvConfig }) {
  const [statuses, setStatuses] = useState({
    hec: "missing",
    mcp: "missing",
    ai: "BYOK required",
    webhook: "missing"
  });

  function updateStatuses() {
    const byok = readBrowserByokSettings();
    const splunk = readBrowserSplunkSettings();
    const webhooks = readBrowserWebhookSettings();

    // HEC
    let hecStatus = "missing";
    if (envConfig.splunkHec) {
      hecStatus = "env configured";
    } else if (splunk?.hecUrl && splunk?.hecToken) {
      hecStatus = "browser configured";
    }

    // MCP
    let mcpStatus = "missing";
    if (envConfig.splunkMcp) {
      mcpStatus = "env configured";
    } else if (splunk?.mcpMode === "enabled" && splunk?.mcpUrl) {
      mcpStatus = "browser configured";
    }

    // AI
    let aiStatus = "BYOK required";
    if (envConfig.aiProvider) {
      aiStatus = "env configured";
    } else if (byok?.apiKey) {
      aiStatus = "browser configured";
    }

    // Webhooks
    let webhookStatus = "missing";
    if (envConfig.discordWebhook || envConfig.slackWebhook) {
      webhookStatus = "env configured";
    } else if (webhooks?.discordWebhook || webhooks?.slackWebhook) {
      webhookStatus = "browser configured";
    }

    setStatuses({
      hec: hecStatus,
      mcp: mcpStatus,
      ai: aiStatus,
      webhook: webhookStatus
    });
  }

  useEffect(() => {
    updateStatuses();
    
    // Listen for custom storage events from the settings inputs
    window.addEventListener("storage", updateStatuses);
    return () => window.removeEventListener("storage", updateStatuses);
  }, []);

  const rows = [
    ["Splunk HEC", statuses.hec],
    ["Splunk MCP", statuses.mcp],
    ["AI provider", statuses.ai],
    ["Discord webhook", statuses.webhook]
  ];

  return (
    <>
      <Card className="talos-fade-up talos-stagger-2 mt-6 overflow-hidden">
        <CardHeader title="Configuration Status" />
        <div className="divide-y divide-talos-line">
          {rows.map(([label, status], index) => (
            <div
              key={label}
              className="talos-row-enter flex items-center justify-between px-5 py-4 text-sm"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span>{label}</span>
              <Badge
                tone={
                  status === "configured" ||
                  status === "env configured" ||
                  status === "browser configured" ||
                  status === "enabled"
                    ? "ok"
                    : "warn"
                }
              >
                {status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <ByokSettings envConfigured={envConfig.aiProvider} />
      <SplunkHecSettings envConfigured={envConfig.splunkHec} />
      <SplunkMcpSettings envConfigured={envConfig.splunkMcp} />
      <WebhookSettings envDiscordConfigured={envConfig.discordWebhook} envSlackConfigured={envConfig.slackWebhook} />
    </>
  );
}
