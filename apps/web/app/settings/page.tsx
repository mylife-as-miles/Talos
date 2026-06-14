import { AppShell } from "@/components/app-shell";
import { Badge, Card, CardHeader, CodeBlock } from "@/components/ui";
import { isMockMode } from "@/lib/config";

function configured(value?: string, placeholder?: string) {
  return Boolean(value && value !== placeholder);
}

export default function SettingsPage() {
  const rows = [
    ["Splunk HEC", configured(process.env.SPLUNK_HEC_TOKEN, "replace_with_hec_token") ? "configured" : "missing"],
    ["Splunk MCP", process.env.SPLUNK_MCP_MODE === "enabled" && configured(process.env.SPLUNK_MCP_SERVER_URL) ? "configured" : "missing"],
    ["AI provider", configured(process.env.GEMINI_API_KEY, "replace_with_key") ? "configured" : "missing"],
    ["Discord webhook", configured(process.env.DISCORD_WEBHOOK_URL, "replace_with_discord_webhook") ? "configured" : "missing"],
    ["Mock mode", isMockMode() ? "enabled" : "disabled"]
  ];

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-talos-muted">Runtime configuration status for local demos and Splunk-backed operation.</p>
      <Card className="mt-6">
        <CardHeader title="Configuration Status" />
        <div className="divide-y divide-talos-line">
          {rows.map(([label, status]) => (
            <div key={label} className="flex items-center justify-between px-5 py-4 text-sm">
              <span>{label}</span>
              <Badge tone={status === "configured" || status === "enabled" ? "ok" : "warn"}>{status}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-5">
        <CardHeader title="Local SDK Usage Example" />
        <div className="p-5">
          <CodeBlock value={`import { Talos } from "@talos/sdk";\n\nTalos.init({\n  projectKey: "demo_project_key",\n  environment: "production",\n  release: "v1.0.0",\n  service: "checkout-service",\n  ingestUrl: "/api/ingest",\n});`} />
        </div>
      </Card>
    </AppShell>
  );
}
