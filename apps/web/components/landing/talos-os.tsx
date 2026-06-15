"use client";

import {
  Archive,
  Bell,
  BookOpen,
  Boxes,
  ChevronDown,
  CircleHelp,
  Code2,
  ExternalLink,
  FileCode2,
  FileText,
  FolderGit2,
  Github,
  KeyRound,
  Mail,
  Maximize2,
  Minimize2,
  MonitorPlay,
  Package,
  Play,
  Recycle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WindowId =
  | "home"
  | "sdk"
  | "docs"
  | "splunk"
  | "why"
  | "changelog"
  | "handbook"
  | "tools"
  | "byok"
  | "demo"
  | "github"
  | "contributors"
  | "trash";

type DesktopItem = {
  id: WindowId;
  label: string;
  detail: string;
  icon: typeof FileText;
  accent: string;
  dock?: boolean;
  side?: "left" | "right";
};

const desktopItems: DesktopItem[] = [
  { id: "home", label: "home.mdx", detail: "Start here", icon: FileText, accent: "bg-[#00c2c8]", dock: true, side: "left" },
  { id: "sdk", label: "SDK install", detail: "npm package", icon: Package, accent: "bg-[#ffe100]", dock: true, side: "left" },
  { id: "docs", label: "Docs", detail: "How to use Talos", icon: BookOpen, accent: "bg-[#ff00ff]", dock: true, side: "left" },
  { id: "splunk", label: "splunk.mdx", detail: "HEC + MCP", icon: Boxes, accent: "bg-[#f5a019]", dock: true, side: "left" },
  { id: "byok", label: "BYOK", detail: "AI provider keys", icon: KeyRound, accent: "bg-[#c7ff45]", side: "left" },
  { id: "demo", label: "demo.mov", detail: "Video flow", icon: MonitorPlay, accent: "bg-[#ff4d5a]", dock: true, side: "left" },
  { id: "why", label: "Why Talos?", detail: "Crash to fix", icon: CircleHelp, accent: "bg-[#00c2c8]", side: "right" },
  { id: "changelog", label: "Changelog", detail: "MVP release", icon: Bell, accent: "bg-[#ffe100]", side: "right" },
  { id: "handbook", label: "Open source handbook", detail: "Build in public", icon: Archive, accent: "bg-[#ff00ff]", side: "right" },
  { id: "tools", label: "tools.mdx", detail: "SDK, agent, notify", icon: Settings, accent: "bg-[#c7ff45]", side: "right" },
  { id: "github", label: "GitHub repo", detail: "Source", icon: Github, accent: "bg-[#f5a019]", side: "right" },
  { id: "contributors", label: "Join as contributor", detail: "Community", icon: Users, accent: "bg-[#00c2c8]", side: "right" },
  { id: "trash", label: "Recycle bin", detail: "Old ops habits", icon: Recycle, accent: "bg-[#b8b3a0]", side: "right" }
];

const windowMeta: Record<WindowId, { title: string; subtitle: string; w: string; x: string; y: string }> = {
  home: { title: "home.mdx", subtitle: "Talos Product OS", w: "min(880px, calc(100vw - 32px))", x: "18vw", y: "4vh" },
  sdk: { title: "SDK install", subtitle: "npm package", w: "640px", x: "8vw", y: "9vh" },
  docs: { title: "Docs", subtitle: "Install and run Talos", w: "680px", x: "13vw", y: "8vh" },
  splunk: { title: "splunk.mdx", subtitle: "HEC ingestion and MCP investigation", w: "720px", x: "15vw", y: "10vh" },
  why: { title: "Why Talos?", subtitle: "Developer operations, self-healed", w: "660px", x: "25vw", y: "8vh" },
  changelog: { title: "Changelog", subtitle: "MVP notes", w: "600px", x: "28vw", y: "11vh" },
  handbook: { title: "Open source handbook", subtitle: "How we build Talos", w: "640px", x: "18vw", y: "12vh" },
  tools: { title: "tools.mdx", subtitle: "Talos system pieces", w: "720px", x: "11vw", y: "7vh" },
  byok: { title: "BYOK", subtitle: "Bring your own AI key", w: "600px", x: "20vw", y: "10vh" },
  demo: { title: "demo.mov", subtitle: "Devpost walkthrough", w: "700px", x: "22vw", y: "7vh" },
  github: { title: "GitHub repo", subtitle: "Open source Talos", w: "580px", x: "26vw", y: "9vh" },
  contributors: { title: "Join as contributor", subtitle: "Help shape agentic ops", w: "600px", x: "20vw", y: "9vh" },
  trash: { title: "Recycle bin", subtitle: "Deprecated operations rituals", w: "720px", x: "8vw", y: "6vh" }
};

const command = `npm install @mylife-as-miles/talos-sdk`;

const sdkExample = `import { Talos } from "@mylife-as-miles/talos-sdk";

Talos.init({
  projectKey: "demo_project_key",
  service: "checkout-service",
  environment: "production",
  release: "v1.0.0",
  ingestUrl: "https://your-app.com/api/ingest"
});

Talos.captureException(error, {
  route: "/api/checkout",
  userId: "demo-user-123",
  tags: { feature: "checkout", region: "prod" }
});`;

function openExternal(url: string) {
  if (typeof window !== "undefined") window.open(url, "_blank", "noreferrer");
}

export function TalosOsLanding() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["home"]);
  const [activeWindow, setActiveWindow] = useState<WindowId>("home");
  const [minimized, setMinimized] = useState<WindowId[]>([]);
  const [maximized, setMaximized] = useState<WindowId[]>([]);
  const [contributorStatus, setContributorStatus] = useState("idle");
  const [removedTrash, setRemovedTrash] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dockItems = useMemo(() => desktopItems.filter((item) => item.dock), []);

  function openWindow(id: WindowId) {
    setOpenWindows((current) => (current.includes(id) ? current : [...current, id]));
    setMinimized((current) => current.filter((item) => item !== id));
    setActiveWindow(id);
  }

  function closeWindow(id: WindowId) {
    setOpenWindows((current) => current.filter((item) => item !== id));
    setMinimized((current) => current.filter((item) => item !== id));
    setMaximized((current) => current.filter((item) => item !== id));
    if (activeWindow === id) {
      const remaining = openWindows.filter((w) => w !== id && !minimized.includes(w));
      if (remaining.length > 0) {
        setActiveWindow(remaining[remaining.length - 1]);
      } else {
        setActiveWindow("home");
      }
    }
  }

  function minimizeWindow(id: WindowId) {
    setMinimized((current) => (current.includes(id) ? current : [...current, id]));
    if (activeWindow === id) {
      const remaining = openWindows.filter((w) => w !== id && !minimized.includes(w));
      if (remaining.length > 0) {
        setActiveWindow(remaining[remaining.length - 1]);
      } else {
        setActiveWindow("home");
      }
    }
  }

  function toggleMaximize(id: WindowId) {
    setMaximized((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <main className="talos-os h-screen overflow-hidden bg-[#f5f1dc] text-black">
      <TopBar onOpen={openWindow} />

      <section className="relative h-[calc(100vh-44px)] overflow-hidden px-4 pb-16 pt-3 sm:px-6">
        <div className="talos-paper-grain absolute inset-0" aria-hidden />
        <div className="talos-os-grid absolute inset-0" aria-hidden />

        <div className="relative z-10 grid h-[calc(100vh-115px)] grid-cols-[96px_1fr_96px] gap-2 max-lg:grid-cols-[80px_1fr] max-md:grid-cols-1">
          <DesktopColumn items={desktopItems.filter((item) => item.side === "left")} onOpen={openWindow} />

          <div className="relative hidden lg:block">
            <Image
              src="/assets/talos-os-island.png"
              alt="Illustration of the Talos developer operations island"
              width={1400}
              height={768}
              priority
              unoptimized
              className="talos-os-island pointer-events-none absolute right-[-5vw] top-[2vh] w-[64vw] max-w-[1180px] object-contain"
            />
            <StatusSticker />
          </div>

          <DesktopColumn items={desktopItems.filter((item) => item.side === "right")} onOpen={openWindow} align="right" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20">
          {openWindows
            .filter((id) => !minimized.includes(id))
            .map((id, index) => (
              <OsWindow
                key={id}
                id={id}
                zIndex={activeWindow === id ? 60 : 40 + index}
                active={activeWindow === id}
                maximized={maximized.includes(id)}
                onFocus={() => setActiveWindow(id)}
                onClose={() => closeWindow(id)}
                onMinimize={() => minimizeWindow(id)}
                onMaximize={() => toggleMaximize(id)}
                onAction={(msg) => setToast(msg)}
              >
                {renderWindowContent(id, {
                  onOpen: openWindow,
                  contributorStatus,
                  setContributorStatus,
                  removedTrash,
                  setRemovedTrash
                })}
              </OsWindow>
            ))}
        </div>

        <Dock items={dockItems} openWindows={openWindows} minimized={minimized} activeWindow={activeWindow} onOpen={openWindow} />
      </section>

      {toast && (
        <div className="fixed bottom-20 right-6 z-[9999] border-2 border-black bg-[#ffe100] px-4 py-2 text-sm font-black shadow-[4px_4px_0_#000] animate-bounce">
          {toast}
        </div>
      )}
    </main>
  );
}

function TopBar({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <header className="relative z-40 flex h-[44px] items-center justify-between border-b-2 border-black bg-[#e5e1cf] px-4 shadow-[0_2px_0_#000]">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => onOpen("home")} className="group flex items-center gap-2 font-black">
          <span className="grid h-7 w-7 place-items-center border-2 border-black bg-[#00c2c8] shadow-[2px_2px_0_#000] transition-transform group-hover:-translate-y-0.5">
            <ShieldCheck size={16} strokeWidth={3} />
          </span>
          <span className="hidden text-[15px] sm:inline">Talos OS</span>
        </button>
        <nav className="hidden items-center gap-1 text-xs font-black lg:flex">
          {[
            ["Product OS", "home"],
            ["SDK", "sdk"],
            ["Docs", "docs"],
            ["Community", "contributors"],
            ["Company", "handbook"],
            ["More", "tools"]
          ].map(([label, id]) => (
            <button key={label} type="button" onClick={() => onOpen(id as WindowId)} className="talos-menu-item">
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="talos-primary-button h-7.5 px-3 text-xs">
          Dashboard
        </Link>
        <button type="button" onClick={() => onOpen("docs")} aria-label="Search docs" className="talos-top-icon">
          <Search size={16} />
        </button>
        <button type="button" onClick={() => onOpen("contributors")} aria-label="Ask to contribute" className="talos-top-icon">
          <Mail size={16} />
        </button>
        <button type="button" onClick={() => onOpen("byok")} className="hidden h-7.5 items-center gap-1 border-2 border-black bg-white px-2 text-[11px] font-black shadow-[1.5px_1.5px_0_#000] sm:flex">
          <KeyRound size={13} />
          BYOK
        </button>
      </div>
    </header>
  );
}

function DesktopColumn({ items, onOpen, align = "left" }: { items: DesktopItem[]; onOpen: (id: WindowId) => void; align?: "left" | "right" }) {
  return (
    <div className={`relative z-10 flex flex-col gap-2 ${align === "right" ? "items-end max-md:items-start" : "items-start"} max-md:grid max-md:grid-cols-3 max-sm:grid-cols-2`}>
      {items.map((item) => (
        <DesktopIcon key={item.id} item={item} onOpen={() => onOpen(item.id)} align={align} />
      ))}
    </div>
  );
}

function DesktopIcon({ item, onOpen, align }: { item: DesktopItem; onOpen: () => void; align: "left" | "right" }) {
  const Icon = item.icon;
  return (
    <button type="button" onClick={onOpen} className={`talos-desktop-icon group ${align === "right" ? "text-right" : "text-left"}`}>
      <span className="relative grid h-10 w-10 place-items-center border-2 border-black bg-white shadow-[3px_3px_0_#000] transition-transform group-hover:-translate-y-0.5">
        <span className={`absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border border-black ${item.accent}`} />
        <Icon size={20} strokeWidth={2.5} />
      </span>
      <span className="mt-1 block rounded-sm bg-[#f5f1dc]/85 px-1 text-[11px] font-black leading-tight">{item.label}</span>
      <span className="mt-0.5 block px-1 text-[9px] font-bold leading-tight text-[#555042]">{item.detail}</span>
    </button>
  );
}

function OsWindow({
  id,
  active,
  zIndex,
  maximized,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onAction
}: {
  id: WindowId;
  active: boolean;
  zIndex: number;
  maximized: boolean;
  children: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onAction: (msg: string) => void;
}) {
  const meta = windowMeta[id];
  return (
    <article
      className={`talos-window pointer-events-auto absolute overflow-hidden bg-[#fffdf1] ${
        active ? "talos-window-active" : ""
      } ${
        maximized
          ? "inset-0 shadow-none border-0"
          : "border-2 border-black shadow-[5px_5px_0_#000] max-h-[72vh]"
      }`}
      style={maximized ? { zIndex } : { width: meta.w, left: meta.x, top: meta.y, zIndex }}
      onMouseDown={onFocus}
    >
      <div className="flex h-9 items-center justify-between border-b-2 border-black bg-[#d8d3bd] px-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileText size={16} strokeWidth={2.5} />
          <div className="min-w-0">
            <h2 className="truncate text-[13px] font-black leading-none">{meta.title}</h2>
            <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wide text-[#5c5748]">{meta.subtitle}</p>
          </div>
          <ChevronDown size={13} strokeWidth={3} />
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onMinimize} aria-label={`Minimize ${meta.title}`} className="talos-window-control">
            <Minimize2 size={13} />
          </button>
          <button type="button" onClick={onMaximize} aria-label={`Maximize ${meta.title}`} className="talos-window-control">
            {maximized ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="8" y="4" width="12" height="12" rx="1.5" />
                <rect x="4" y="8" width="12" height="12" rx="1.5" fill="#fffdf1" />
              </svg>
            ) : (
              <Maximize2 size={13} />
            )}
          </button>
          <button type="button" onClick={onClose} aria-label={`Close ${meta.title}`} className="talos-window-control bg-[#ff4d5a]">
            <X size={13} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b-2 border-black bg-[#f8f5e6] px-3 py-1 text-[11px] font-black text-[#615b4e]">
        <button type="button" onClick={() => onAction("Nothing to undo")} className="talos-toolbar-button">
          Undo
        </button>
        <button type="button" onClick={() => onAction("Zoom set to 100% (Optimized)")} className="talos-toolbar-button">
          Zoom
        </button>
        <span className="h-5 border-l-2 border-[#b9b29d]" />
        <button type="button" onClick={() => onAction("Font weight set to Bold")} className="talos-toolbar-button w-6 font-black">
          B
        </button>
        <button type="button" onClick={() => onAction("Font style set to Italic")} className="talos-toolbar-button w-6 italic">
          I
        </button>
        <button type="button" onClick={() => onAction("Font decoration set to Underline")} className="talos-toolbar-button w-6 underline">
          U
        </button>
        <span className="ml-auto hidden items-center gap-2.5 sm:flex">
          <button type="button" onClick={() => onAction("Search indexing active")} aria-label="Search inside file" className="grid h-5 w-5 place-items-center border border-black bg-[#fffdf1] hover:bg-[#ffe100]">
            <Search size={10} />
          </button>
          <button type="button" onClick={() => onAction("Window settings loaded")} aria-label="Settings" className="grid h-5 w-5 place-items-center border border-black bg-[#fffdf1] hover:bg-[#ffe100]">
            <Settings size={10} />
          </button>
          <button type="button" onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            onAction("Link copied to clipboard!");
          }} className="talos-primary-button h-6 px-2.5 text-[10px]">
            Share
          </button>
        </span>
      </div>
      <div className="talos-window-body max-h-[calc(72vh-68px)] overflow-y-auto p-4 sm:p-5">{children}</div>
    </article>
  );
}

function Dock({
  items,
  openWindows,
  minimized,
  activeWindow,
  onOpen
}: {
  items: DesktopItem[];
  openWindows: WindowId[];
  minimized: WindowId[];
  activeWindow: WindowId;
  onOpen: (id: WindowId) => void;
}) {
  return (
    <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-end gap-1.5 border-2 border-black bg-[#fffdf1] px-2 py-1.5 shadow-[3.5px_3.5px_0_#000]">
      {items.map((item) => {
        const Icon = item.icon;
        const open = openWindows.includes(item.id);
        const isMinimized = minimized.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item.id)}
            title={item.label}
            className={`talos-dock-icon ${activeWindow === item.id && !isMinimized ? "talos-dock-icon-active" : ""}`}
          >
            <span className={`absolute -right-1 -top-1 h-3 w-3 border border-black ${item.accent}`} />
            <Icon size={18} strokeWidth={2.6} />
            {open ? <span className="absolute -bottom-1 h-1 w-5 border border-black bg-[#00c2c8]" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function StatusSticker() {
  return (
    <div className="talos-status-sticker absolute left-[4vw] top-[3vh] max-w-[250px] rotate-[-2deg] border-2 border-black bg-[#d8ff2f] p-2.5 shadow-[4px_4px_0_#000]">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide">
        <span className="talos-live-dot h-3 w-3 border border-black bg-[#ff00ff]" />
        Runtime loop online
      </div>
      <p className="mt-1.5 text-[17px] font-black leading-[0.94]">SDK crash in. Splunk context out. Fix report ready.</p>
    </div>
  );
}

function renderWindowContent(
  id: WindowId,
  state: {
    onOpen: (id: WindowId) => void;
    contributorStatus: string;
    setContributorStatus: (value: string) => void;
    removedTrash: string[];
    setRemovedTrash: (value: string[]) => void;
  }
) {
  switch (id) {
    case "home":
      return <HomeContent onOpen={state.onOpen} />;
    case "sdk":
      return <SdkContent />;
    case "docs":
      return <DocsContent onOpen={state.onOpen} />;
    case "splunk":
      return <SplunkContent />;
    case "why":
      return <WhyContent />;
    case "changelog":
      return <ChangelogContent />;
    case "handbook":
      return <HandbookContent />;
    case "tools":
      return <ToolsContent onOpen={state.onOpen} />;
    case "byok":
      return <ByokContent />;
    case "demo":
      return <DemoContent onOpen={state.onOpen} />;
    case "github":
      return <GithubContent />;
    case "contributors":
      return <ContributorsContent status={state.contributorStatus} setStatus={state.setContributorStatus} />;
    case "trash":
      return <TrashContent removedTrash={state.removedTrash} setRemovedTrash={state.setRemovedTrash} />;
    default:
      return null;
  }
}

function HomeContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center border-2 border-black bg-[#00c2c8] shadow-[2.5px_2.5px_0_#000]">
            <ShieldCheck size={20} strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#5b5547]">Talos</p>
            <p className="text-[15px] font-black">Self-healing Splunk AI Ops</p>
          </div>
        </div>

        <h1 className="mt-4 max-w-[720px] text-[clamp(1.5rem,3.5vw,2.5rem)] font-black leading-[0.88]">
          Crash captured. Root cause found. Fix shipped.
        </h1>
        <p className="mt-3 max-w-xl text-[14px] font-bold leading-6 text-[#333025]">
          Talos gives developers an npm SDK, a Splunk HEC ingest relay, a headless MCP resolver, and fix-ready AI triage reports in one open Product OS.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => onOpen("sdk")} className="talos-primary-button h-9.5 px-4 text-xs">
            Install SDK
          </button>
          <Link href="/demo" className="talos-secondary-button h-9.5 px-4 text-xs">
            Run simulation
          </Link>
          <Link href="/dashboard" className="talos-secondary-button h-9.5 px-4 text-xs">
            Open dashboard
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-black text-[#625c4f]">
          <button type="button" onClick={() => onOpen("splunk")} className="underline decoration-2 underline-offset-4">
            Splunk MCP
          </button>
          <span>/</span>
          <button type="button" onClick={() => onOpen("byok")} className="underline decoration-2 underline-offset-4">
            BYOK
          </button>
          <span>/</span>
          <button type="button" onClick={() => onOpen("contributors")} className="underline decoration-2 underline-offset-4">
            Join as contributor
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-2 border-black bg-[#00c2c8] p-3 shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between border-b pb-2 text-xs font-black uppercase">
            <span>Resolver loop</span>
            <span>Mock or live</span>
          </div>
          <ol className="mt-2.5 space-y-2 text-xs font-bold">
            {["SDK captures runtime crash", "Next.js ingest stores event and forwards HEC", "Splunk MCP returns related logs", "AI resolver creates fix-ready report"].map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-black bg-[#ffe100] text-[10px] font-black">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-1.5 font-black text-sm">
            <TerminalSquare size={16} />
            Local package
          </div>
          <code className="mt-2 block overflow-x-auto border border-black bg-black p-2 text-xs font-bold text-[#d8ff2f]">{command}</code>
        </div>
      </div>
    </div>
  );
}

function SdkContent() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-3">
        <h3 className="text-2xl font-black leading-none">Install the collector.</h3>
        <p className="text-sm font-bold leading-6 text-[#3d392f]">
          Published as a scoped npm package. The browser SDK sends to Talos ingest, never directly to Splunk HEC.
        </p>
        <div className="border-2 border-black bg-[#ffe100] p-3 shadow-[3px_3px_0_#000]">
          <p className="text-[10px] font-black uppercase">npm</p>
          <code className="mt-1 block overflow-x-auto text-base font-black">{command}</code>
        </div>
        <button type="button" className="talos-secondary-button h-9 px-3.5 text-xs" onClick={() => navigator.clipboard?.writeText(command)}>
          Copy install command
        </button>
      </div>
      <pre className="max-h-[280px] overflow-auto border-2 border-black bg-black p-3 text-xs font-bold leading-5 text-[#d8ff2f] shadow-[4px_4px_0_#000]">
        {sdkExample}
      </pre>
    </div>
  );
}

function DocsContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div>
      <h3 className="text-2xl font-black">How to use Talos</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Install SDK", "Capture errors as AI-readable operational events."],
          ["2", "Configure Splunk", "Forward events through HEC and investigate through MCP."],
          ["3", "Run resolver", "Generate priority, evidence, root cause, and patch suggestions."]
        ].map(([number, title, body]) => (
          <button key={title} type="button" onClick={() => onOpen(number === "1" ? "sdk" : number === "2" ? "splunk" : "demo")} className="text-left border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-1">
            <span className="grid h-7.5 w-7.5 place-items-center border-2 border-black bg-[#ff00ff] text-base font-black">{number}</span>
            <h4 className="mt-3 text-base font-black">{title}</h4>
            <p className="mt-1 text-xs font-bold leading-5 text-[#4c473c]">{body}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 border-2 border-black bg-[#d8ff2f] p-3.5 shadow-[4px_4px_0_#000]">
        <h4 className="text-base font-black">Local run path</h4>
        <code className="mt-2 block overflow-x-auto border border-black bg-black p-2.5 text-xs font-bold text-[#d8ff2f]">
          corepack pnpm install{"\n"}corepack pnpm --filter @talos/web dev
        </code>
      </div>
    </div>
  );
}

function SplunkContent() {
  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      <InfoPanel title="HEC intake" color="bg-[#00c2c8]" icon={Boxes}>
        <p className="text-xs">Talos ingest validates SDK events, stores them locally for the MVP dashboard, then forwards structured payloads to Splunk HEC when mock mode is off.</p>
        <code className="mt-2.5 block border border-black bg-black p-2.5 text-[10px] font-bold text-[#d8ff2f]">POST /services/collector/event</code>
      </InfoPanel>
      <InfoPanel title="MCP investigation" color="bg-[#ff00ff]" icon={Sparkles}>
        <p className="text-xs">The headless resolver treats Splunk MCP as the primary investigation path, with REST fallback and mock context for local demos.</p>
        <code className="mt-2.5 block border border-black bg-black p-2.5 text-[10px] font-bold text-[#d8ff2f]">SPLUNK_MCP_MODE=enabled</code>
      </InfoPanel>
      <div className="md:col-span-2 border-2 border-black bg-white p-3.5 shadow-[4px_4px_0_#000]">
        <h4 className="text-base font-black">Query Talos uses</h4>
        <p className="mt-1 text-xs font-bold text-[#514c40]">The resolver scopes by service, route, error message, sourcetype, and recent time window.</p>
        <code className="mt-2.5 block overflow-x-auto border border-black bg-black p-3 text-[10px] font-bold text-[#d8ff2f]">
          index=main sourcetype=talos:error service=checkout-service route=/api/checkout "Cannot read properties"
        </code>
      </div>
    </div>
  );
}

function WhyContent() {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black leading-none">Observability should not stop at a red chart.</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Talos turns runtime failures into structured Splunk events, then asks an AI resolver to investigate logs, score impact, and produce a concise triage report engineers can act on.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {["SDK-native crash context", "Splunk-first operations data", "Fix-ready report output"].map((item, index) => (
          <div key={item} className="border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000]">
            <span className={`grid h-7.5 w-7.5 place-items-center border-2 border-black text-sm font-black ${index === 0 ? "bg-[#00c2c8]" : index === 1 ? "bg-[#ffe100]" : "bg-[#ff00ff]"}`}>
              {index + 1}
            </span>
            <p className="mt-2.5 text-sm font-black">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangelogContent() {
  const changes = [
    ["0.1.0", "SDK published", "@mylife-as-miles/talos-sdk is available for demo installs."],
    ["MVP", "Neo-brutalist dashboard", "Incident, report, demo, and settings views are styled for hackathon storytelling."],
    ["Agent", "Mock-safe resolver", "Reports work locally without a live Splunk instance, while MCP remains the documented primary path."]
  ];
  return (
    <div>
      <h3 className="text-2xl font-black">Changelog</h3>
      <div className="mt-3.5 space-y-2.5">
        {changes.map(([tag, title, body]) => (
          <div key={title} className="grid gap-3.5 border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000] sm:grid-cols-[80px_1fr]">
            <span className="h-fit border-2 border-black bg-[#d8ff2f] px-2.5 py-1.5 text-center text-xs font-black">{tag}</span>
            <div>
              <h4 className="text-base font-black">{title}</h4>
              <p className="mt-0.5 text-xs font-bold leading-5 text-[#4b463b]">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HandbookContent() {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black">Open source handbook</h3>
      <div className="border-2 border-black bg-[#ffe100] p-3.5 shadow-[4px_4px_0_#000]">
        <p className="text-sm font-black leading-6">
          Talos is built like a practical devtool: small SDK surface, clear data contracts, MCP-first investigation, and mock mode so contributors can run it without enterprise infrastructure.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {["Make the demo real before making it large.", "Keep Splunk HEC ingestion server-side.", "Never invent evidence in AI reports.", "Prefer boring storage until the workflow is proven."].map((rule) => (
          <div key={rule} className="border-2 border-black bg-white p-3 text-sm font-black shadow-[3px_3px_0_#000]">
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const tools: Array<[WindowId, string, string, typeof Code2]> = [
    ["sdk", "SDK collector", "Captures exceptions, breadcrumbs, users, tags, and runtime context.", Code2],
    ["splunk", "HEC relay", "Validates events and forwards to Splunk with sourcetype talos:error.", Boxes],
    ["demo", "Resolver agent", "Scores anomalies and generates strict JSON triage reports.", Sparkles],
    ["contributors", "Triage output", "Posts concise incident summaries to Discord or Slack.", Mail]
  ];
  return (
    <div>
      <h3 className="text-2xl font-black">Talos tools</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map(([id, title, body, Icon], index) => (
          <button key={title} type="button" onClick={() => onOpen(id)} className="group text-left border-2 border-black bg-white p-3.5 shadow-[3.5px_3.5px_0_#000] transition-transform hover:-translate-y-1">
            <span className={`grid h-9 w-9 place-items-center border-2 border-black ${index % 2 ? "bg-[#ff00ff]" : "bg-[#00c2c8]"}`}>
              <Icon size={18} strokeWidth={2.7} />
            </span>
            <h4 className="mt-3 text-base font-black">{title}</h4>
            <p className="mt-1 text-xs font-bold leading-5 text-[#4d473c]">{body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ByokContent() {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black">Bring your own key.</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Talos keeps provider credentials in environment variables. The MVP is OpenAI-compatible and can run in mock mode while you wire Gemini, OpenAI, or another compatible endpoint.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {["AI_PROVIDER", "GEMINI_API_KEY", "SPLUNK_HEC_TOKEN", "DISCORD_WEBHOOK_URL"].map((name, index) => (
          <div key={name} className={`border-2 border-black p-3 shadow-[3px_3px_0_#000] ${index % 2 ? "bg-white" : "bg-[#d8ff2f]"}`}>
            <p className="font-black text-sm">{name}</p>
            <p className="mt-0.5 text-xs font-bold text-[#4d473d]">Configured through .env.local. No secrets committed.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoContent({ onOpen }: { onOpen: (id: WindowId) => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <div className="border-2 border-black bg-black p-3 text-white shadow-[4px_4px_0_#000]">
        <div className="grid aspect-video place-items-center border border-[#d8ff2f] bg-[linear-gradient(135deg,#00c2c8,#ff00ff_55%,#ffe100)] text-center text-black">
          <div>
            <Play className="mx-auto mb-2 h-10 w-10 fill-black" strokeWidth={3} />
            <p className="text-2xl font-black">demo.mov</p>
            <p className="mt-1 text-[10px] font-black uppercase">YouTube URL pending</p>
          </div>
        </div>
        <p className="mt-2.5 text-xs font-bold text-[#d8ff2f]">This slot is ready for the Devpost video link when you send it.</p>
      </div>
      <div>
        <h3 className="text-2xl font-black">3-minute Devpost flow</h3>
        <ol className="mt-3.5 space-y-2">
          {["Problem: crashes need context", "Show SDK install", "Trigger checkout crash", "Run resolver", "Open AI report", "Send Discord notification"].map((step, index) => (
            <li key={step} className="flex gap-2.5 border-2 border-black bg-white p-2 text-xs font-black shadow-[2.5px_2.5px_0_#000]">
              <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-black bg-[#ffe100] text-[10px]">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => onOpen("docs")} className="talos-primary-button mt-3.5 h-9 px-3.5 text-xs">
          Open setup docs
        </button>
      </div>
    </div>
  );
}

function GithubContent() {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black">Open source repo</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Talos is organized as a pnpm workspace: SDK package, Next.js web app, Splunk MCP infrastructure, docs, and references.
      </p>
      <div className="border-2 border-black bg-white p-3.5 shadow-[4px_4px_0_#000]">
        <div className="flex items-center gap-2.5 text-lg font-black">
          <FolderGit2 size={20} />
          C:\Users\MILES\Documents\Talos
        </div>
        <button type="button" onClick={() => openExternal("https://github.com/mylife-as-miles/talos")} className="talos-primary-button mt-3.5 h-9 px-3.5 text-xs">
          Open GitHub
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

function ContributorsContent({ status, setStatus }: { status: string; setStatus: (value: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h3 className="text-2xl font-black leading-none">Join Talos as a contributor.</h3>
        <p className="mt-2.5 text-sm font-bold leading-6 text-[#3d392f]">
          Good first areas: SDK ergonomics, Splunk query adapters, incident UX, AI evals, notification templates, and docs.
        </p>
      </div>
      <form
        className="border-2 border-black bg-[#d8ff2f] p-3.5 shadow-[4px_4px_0_#000]"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus("saved");
        }}
      >
        <label className="block text-xs font-black uppercase">Contributor handle</label>
        <input className="mt-1.5 h-9 w-full border-2 border-black bg-white px-2.5 text-xs font-bold outline-none focus:shadow-[3px_3px_0_#000]" placeholder="@your-handle" />
        <label className="mt-2.5 block text-xs font-black uppercase">Area of interest</label>
        <select className="mt-1.5 h-9 w-full border-2 border-black bg-white px-2.5 text-xs font-bold outline-none focus:shadow-[3px_3px_0_#000]">
          <option>SDK</option>
          <option>Splunk MCP</option>
          <option>AI resolver</option>
          <option>Frontend polish</option>
        </select>
        <button type="submit" className="talos-primary-button mt-3.5 h-9 px-3.5 text-xs">
          Ask to join
        </button>
        {status === "saved" ? <p className="mt-2.5 border border-black bg-white p-2 text-xs font-black">Contributor request captured locally for demo mode.</p> : null}
      </form>
    </div>
  );
}

function TrashContent({ removedTrash, setRemovedTrash }: { removedTrash: string[]; setRemovedTrash: (value: string[]) => void }) {
  const trash = ["Manual log digging", "Screenshots without stack traces", "Untriaged production alerts", "Mystery checkout failures", "Secrets in browser SDKs", "AI reports with invented evidence"];
  const visible = trash.filter((item) => !removedTrash.includes(item));
  return (
    <div>
      <div className="border-2 border-black bg-[#e5e1cf] p-3 shadow-[4px_4px_0_#000]">
        <h3 className="text-2xl font-black">Recycle bin</h3>
        <p className="mt-1.5 text-sm font-bold text-[#3f3a31]">Things Talos is trying to remove from incident response.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {visible.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRemovedTrash([...removedTrash, item])}
            className="min-h-24 border-2 border-black bg-white p-2.5 text-center text-xs font-black shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-1"
          >
            <Recycle className="mx-auto mb-2" size={20} />
            {item}
          </button>
        ))}
        {visible.length === 0 ? <p className="col-span-full border-2 border-black bg-[#d8ff2f] p-3.5 text-lg font-black shadow-[3px_3px_0_#000]">Trash emptied. Resolver online.</p> : null}
      </div>
    </div>
  );
}

function InfoPanel({ title, color, icon: Icon, children }: { title: string; color: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <div className={`border-2 border-black p-3.5 font-bold leading-6 shadow-[3.5px_3.5px_0_#000] ${color}`}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center border-2 border-black bg-white">
          <Icon size={16} strokeWidth={2.7} />
        </span>
        <h4 className="text-base font-black">{title}</h4>
      </div>
      {children}
    </div>
  );
}
