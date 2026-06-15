"use client";

import { CheckCircle2, KeyRound, Trash2, Database, Radio, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardHeader } from "./ui";

const STORAGE = {
  provider: "talos:ai-provider",
  geminiKey: "talos:gemini-api-key",
  geminiModel: "talos:gemini-model"
};

export type BrowserByokSettings = {
  provider: "gemini";
  apiKey: string;
  model: string;
};

export type BrowserSplunkSettings = {
  hecUrl?: string;
  hecToken?: string;
  index?: string;
  mcpMode?: "enabled" | "disabled";
  mcpUrl?: string;
};

export type BrowserWebhookSettings = {
  discordWebhook?: string;
  slackWebhook?: string;
};

export function readBrowserByokSettings(): BrowserByokSettings | null {
  if (typeof window === "undefined") return null;

  const provider = window.localStorage.getItem(STORAGE.provider) || "gemini";
  const apiKey = window.localStorage.getItem(STORAGE.geminiKey) || "";
  const model = window.localStorage.getItem(STORAGE.geminiModel) || "gemini-3-flash-preview";

  if (provider !== "gemini" || !apiKey.trim()) return null;
  return { provider, apiKey: apiKey.trim(), model: model.trim() || "gemini-3-flash-preview" };
}

export function readBrowserSplunkSettings(): BrowserSplunkSettings | null {
  if (typeof window === "undefined") return null;

  const hecUrl = window.localStorage.getItem("talos:splunk-hec-url") || "";
  const hecToken = window.localStorage.getItem("talos:splunk-hec-token") || "";
  const index = window.localStorage.getItem("talos:splunk-index") || "main";
  const mcpMode = (window.localStorage.getItem("talos:splunk-mcp-mode") as BrowserSplunkSettings["mcpMode"]) || "disabled";
  const mcpUrl = window.localStorage.getItem("talos:splunk-mcp-url") || "";

  return {
    hecUrl: hecUrl.trim() || undefined,
    hecToken: hecToken.trim() || undefined,
    index: index.trim() || undefined,
    mcpMode: mcpMode || undefined,
    mcpUrl: mcpUrl.trim() || undefined
  };
}

export function readBrowserWebhookSettings(): BrowserWebhookSettings | null {
  if (typeof window === "undefined") return null;

  const discordWebhook = window.localStorage.getItem("talos:discord-webhook") || "";
  const slackWebhook = window.localStorage.getItem("talos:slack-webhook") || "";

  return {
    discordWebhook: discordWebhook.trim() || undefined,
    slackWebhook: slackWebhook.trim() || undefined
  };
}

export function ByokSettings({ envConfigured }: { envConfigured: boolean }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-3-flash-preview");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readBrowserByokSettings();
    if (settings) {
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setSaved(true);
    }
  }, []);

  function save() {
    window.localStorage.setItem(STORAGE.provider, "gemini");
    window.localStorage.setItem(STORAGE.geminiKey, apiKey.trim());
    window.localStorage.setItem(STORAGE.geminiModel, model.trim() || "gemini-3-flash-preview");
    setSaved(Boolean(apiKey.trim()));
    window.dispatchEvent(new Event("storage"));
  }

  function clear() {
    window.localStorage.removeItem(STORAGE.provider);
    window.localStorage.removeItem(STORAGE.geminiKey);
    window.localStorage.removeItem(STORAGE.geminiModel);
    setApiKey("");
    setModel("gemini-3-flash-preview");
    setSaved(false);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <Card className="talos-fade-up talos-stagger-2 mt-5 overflow-hidden">
      <CardHeader
        title="BYOK AI Resolver"
        detail="Bring your own Gemini key for live AI reports. Stored only in this browser for the demo."
        action={<Badge tone={saved || envConfigured ? "ok" : "warn"}>{saved ? "Browser key saved" : envConfigured ? "Env key configured" : "Key required"}</Badge>}
      />
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Provider</span>
            <div className="border-[3px] border-black bg-[#d8ff2f] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000]">Gemini</div>
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Gemini API Key</span>
            <input
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setSaved(false);
              }}
              type="password"
              placeholder="Paste your Gemini API key"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ff00d7]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Model</span>
            <input
              value={model}
              onChange={(event) => {
                setModel(event.target.value);
                setSaved(false);
              }}
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#00c2c8]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={!apiKey.trim()}>
              <KeyRound size={16} /> Save Browser Key
            </Button>
            <Button type="button" onClick={clear} className="bg-[#ff4d5a]">
              <Trash2 size={16} /> Clear Key
            </Button>
          </div>
        </div>
        <div className="border-[3px] border-black bg-[#ffe100] p-4 text-sm font-bold leading-6 shadow-[6px_6px_0_#000]">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
            <CheckCircle2 size={14} /> Demo behavior
          </div>
          <p>
            When you run the resolver, Talos sends this key directly to the Node API route for that request only. If no browser key or env key exists, Talos uses the local analysis engine so the demo still works.
          </p>
          <p className="mt-3">
            Do not put this key in the SDK. Browser apps should send errors to Talos ingest only; server routes handle AI and Splunk calls.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function SplunkHecSettings({ envConfigured }: { envConfigured: boolean }) {
  const [hecUrl, setHecUrl] = useState("");
  const [hecToken, setHecToken] = useState("");
  const [index, setIndex] = useState("main");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readBrowserSplunkSettings();
    if (settings) {
      setHecUrl(settings.hecUrl || "");
      setHecToken(settings.hecToken || "");
      setIndex(settings.index || "main");
      setSaved(Boolean(settings.hecUrl && settings.hecToken));
    }
  }, []);

  function save() {
    window.localStorage.setItem("talos:splunk-hec-url", hecUrl.trim());
    window.localStorage.setItem("talos:splunk-hec-token", hecToken.trim());
    window.localStorage.setItem("talos:splunk-index", index.trim() || "main");
    setSaved(Boolean(hecUrl.trim() && hecToken.trim()));
    window.dispatchEvent(new Event("storage"));
  }

  function clear() {
    window.localStorage.removeItem("talos:splunk-hec-url");
    window.localStorage.removeItem("talos:splunk-hec-token");
    window.localStorage.removeItem("talos:splunk-index");
    setHecUrl("");
    setHecToken("");
    setIndex("main");
    setSaved(false);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <Card className="talos-fade-up talos-stagger-3 mt-5 overflow-hidden">
      <CardHeader
        title="Browser Splunk HEC Ingest"
        detail="Configure your Splunk HTTP Event Collector. Sends captured errors directly to your index."
        action={<Badge tone={saved || envConfigured ? "ok" : "warn"}>{saved ? "Browser HEC saved" : envConfigured ? "Env HEC configured" : "HEC missing"}</Badge>}
      />
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Splunk HEC URL</span>
            <input
              value={hecUrl}
              onChange={(event) => {
                setHecUrl(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. https://localhost:8088"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#00c2c8]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Splunk HEC Token</span>
            <input
              value={hecToken}
              onChange={(event) => {
                setHecToken(event.target.value);
                setSaved(false);
              }}
              type="password"
              placeholder="Paste HEC Token UUID"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ff00d7]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Index</span>
            <input
              value={index}
              onChange={(event) => {
                setIndex(event.target.value);
                setSaved(false);
              }}
              placeholder="main"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ffe100]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={!hecUrl.trim() || !hecToken.trim()}>
              <Database size={16} /> Save Browser HEC
            </Button>
            <Button type="button" onClick={clear} className="bg-[#ff4d5a]">
              <Trash2 size={16} /> Clear HEC
            </Button>
          </div>
        </div>
        <div className="border-[3px] border-black bg-[#f7fffb] p-4 text-sm font-bold leading-6 shadow-[6px_6px_0_#000]">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
            <Database size={14} className="text-[#00c2c8]" /> HEC Telemetry Ingestion
          </div>
          <p>
            When a crash is simulated or captured in the UI, Talos routes the error data through your client credentials.
          </p>
          <p className="mt-3">
            Ensure your Splunk instance allows traffic from this host, and HTTP Event Collector (HEC) is enabled under Settings &gt; Data Inputs.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function SplunkMcpSettings({ envConfigured }: { envConfigured: boolean }) {
  const [mcpMode, setMcpMode] = useState<"enabled" | "disabled">("disabled");
  const [mcpUrl, setMcpUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readBrowserSplunkSettings();
    if (settings) {
      setMcpMode(settings.mcpMode || "disabled");
      setMcpUrl(settings.mcpUrl || "");
      setSaved(settings.mcpMode === "enabled" && Boolean(settings.mcpUrl));
    }
  }, []);

  function save() {
    window.localStorage.setItem("talos:splunk-mcp-mode", mcpMode);
    window.localStorage.setItem("talos:splunk-mcp-url", mcpUrl.trim());
    setSaved(mcpMode === "enabled" && Boolean(mcpUrl.trim()));
    window.dispatchEvent(new Event("storage"));
  }

  function clear() {
    window.localStorage.removeItem("talos:splunk-mcp-mode");
    window.localStorage.removeItem("talos:splunk-mcp-url");
    setMcpMode("disabled");
    setMcpUrl("");
    setSaved(false);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <Card className="talos-fade-up talos-stagger-4 mt-5 overflow-hidden">
      <CardHeader
        title="Browser Splunk MCP Server"
        detail="Configure Model Context Protocol. Connects the AI resolver directly to your local Splunk MCP host."
        action={<Badge tone={saved || envConfigured ? "ok" : "warn"}>{saved ? "Browser MCP saved" : envConfigured ? "Env MCP configured" : "MCP missing"}</Badge>}
      />
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Splunk MCP Mode</span>
            <select
              value={mcpMode}
              onChange={(event) => {
                setMcpMode(event.target.value as "enabled" | "disabled");
                setSaved(false);
              }}
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-black text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#00c2c8]"
            >
              <option value="disabled">Disabled (REST fallback)</option>
              <option value="enabled">Enabled (AI search tools enabled)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Splunk MCP Server URL</span>
            <input
              value={mcpUrl}
              onChange={(event) => {
                setMcpUrl(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. http://localhost:8000"
              disabled={mcpMode === "disabled"}
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ff00d7] disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={mcpMode === "enabled" && !mcpUrl.trim()}>
              <Radio size={16} /> Save Browser MCP
            </Button>
            <Button type="button" onClick={clear} className="bg-[#ff4d5a]">
              <Trash2 size={16} /> Clear MCP
            </Button>
          </div>
        </div>
        <div className="border-[3px] border-black bg-[#fffce2] p-4 text-sm font-bold leading-6 shadow-[6px_6px_0_#000]">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
            <Radio size={14} className="text-[#d8ff2f]" /> Model Context Protocol
          </div>
          <p>
            The Splunk MCP server enables LLMs to query Splunk indexes securely.
          </p>
          <p className="mt-3">
            When the resolver runs, Talos directs query operations to this browser-configured MCP endpoint. It acts as the primary telemetry gatherer before fallback to cached telemetry.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function WebhookSettings({
  envDiscordConfigured,
  envSlackConfigured
}: {
  envDiscordConfigured: boolean;
  envSlackConfigured: boolean;
}) {
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = readBrowserWebhookSettings();
    if (settings) {
      setDiscordWebhook(settings.discordWebhook || "");
      setSlackWebhook(settings.slackWebhook || "");
      setSaved(Boolean(settings.discordWebhook || settings.slackWebhook));
    }
  }, []);

  function save() {
    window.localStorage.setItem("talos:discord-webhook", discordWebhook.trim());
    window.localStorage.setItem("talos:slack-webhook", slackWebhook.trim());
    setSaved(Boolean(discordWebhook.trim() || slackWebhook.trim()));
    window.dispatchEvent(new Event("storage"));
  }

  function clear() {
    window.localStorage.removeItem("talos:discord-webhook");
    window.localStorage.removeItem("talos:slack-webhook");
    setDiscordWebhook("");
    setSlackWebhook("");
    setSaved(false);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <Card className="talos-fade-up talos-stagger-5 mt-5 overflow-hidden">
      <CardHeader
        title="Browser Notification Channels"
        detail="Pushes triaged incident summaries and fix recommendation codes to Slack or Discord."
        action={
          <Badge tone={saved || envDiscordConfigured || envSlackConfigured ? "ok" : "warn"}>
            {saved ? "Browser webhooks saved" : (envDiscordConfigured || envSlackConfigured) ? "Env webhooks configured" : "Webhooks missing"}
          </Badge>
        }
      />
      <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Discord Webhook URL</span>
            <input
              value={discordWebhook}
              onChange={(event) => {
                setDiscordWebhook(event.target.value);
                setSaved(false);
              }}
              placeholder="Paste Discord Webhook URL"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#00c2c8]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[12px] font-black uppercase tracking-[.08em] text-black">Slack Webhook URL</span>
            <input
              value={slackWebhook}
              onChange={(event) => {
                setSlackWebhook(event.target.value);
                setSaved(false);
              }}
              placeholder="Paste Slack Webhook URL"
              className="w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_#000] outline-none focus:bg-[#fffce2] focus:ring-4 focus:ring-[#ff00d7]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={save} disabled={!discordWebhook.trim() && !slackWebhook.trim()}>
              <Send size={16} /> Save Browser Webhooks
            </Button>
            <Button type="button" onClick={clear} className="bg-[#ff4d5a]">
              <Trash2 size={16} /> Clear Webhooks
            </Button>
          </div>
        </div>
        <div className="border-[3px] border-black bg-[#fff7ea] p-4 text-sm font-bold leading-6 shadow-[6px_6px_0_#000]">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
            <Send size={14} className="text-[#f5a019]" /> Real-time Alert Routing
          </div>
          <p>
            When reports are successfully generated, notifications are dispatched to these target browser channels.
          </p>
          <p className="mt-3">
            Discord webhooks receive complete Markdown formatting including syntax-highlighted code-diff proposals.
          </p>
        </div>
      </div>
    </Card>
  );
}
