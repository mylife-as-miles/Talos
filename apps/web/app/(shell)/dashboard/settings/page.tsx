import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CodeBlock } from "@/components/ui";
import { SettingsContent } from "@/components/settings-content";
import { isMockMode } from "@/lib/config";

export const dynamic = "force-dynamic";

function configured(value?: string, placeholder?: string) {
  return Boolean(value && value !== placeholder);
}

export default function SettingsPage() {
  const envConfig = {
    splunkHec: configured(process.env.SPLUNK_HEC_TOKEN, "replace_with_hec_token"),
    splunkMcp: process.env.SPLUNK_MCP_MODE === "enabled" && configured(process.env.SPLUNK_MCP_SERVER_URL),
    aiProvider: configured(process.env.GEMINI_API_KEY, "replace_with_key"),
    discordWebhook: configured(process.env.DISCORD_WEBHOOK_URL, "replace_with_discord_webhook"),
    slackWebhook: configured(process.env.SLACK_WEBHOOK_URL),
    mockMode: isMockMode()
  };

  return (
    <>
      <PageHeader title="Settings" description="Runtime configuration status for local demos and Splunk-backed operation." />

      <SettingsContent envConfig={envConfig} />

      <Card className="talos-fade-up talos-stagger-6 mt-5 overflow-hidden">
        <CardHeader title="Local SDK Usage Example" />
        <div className="p-5">
          <CodeBlock
            value={`import { Talos } from "@mylife-as-miles/talos-sdk";\n\nTalos.init({\n  projectKey: "demo_project_key",\n  environment: "production",\n  release: "v1.0.0",\n  service: "checkout-service",\n  ingestUrl: "/api/ingest",\n});`}
          />
        </div>
      </Card>
    </>
  );
}
