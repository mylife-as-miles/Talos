"use client";

import {
  Archive,
  Bell,
  BookOpen,
  Boxes,
  ChevronDown,
  CircleHelp,
  Clock,
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
  { id: "home", label: "home.mdx", detail: "Crash to fix", icon: FileText, accent: "bg-[#00c2c8]", dock: true, side: "left" },
  { id: "sdk", label: "SDK install", detail: "Capture context", icon: Package, accent: "bg-[#ffe100]", dock: true, side: "left" },
  { id: "docs", label: "Docs", detail: "Ship the loop", icon: BookOpen, accent: "bg-[#ff00ff]", dock: true, side: "left" },
  { id: "splunk", label: "splunk.mdx", detail: "Logs to RCA", icon: Boxes, accent: "bg-[#f5a019]", dock: true, side: "left" },
  { id: "byok", label: "BYOK", detail: "AI provider keys", icon: KeyRound, accent: "bg-[#c7ff45]", side: "left" },
  { id: "demo", label: "demo.mov", detail: "Video flow", icon: MonitorPlay, accent: "bg-[#ff4d5a]", dock: true, side: "left" },
  { id: "why", label: "Why Talos?", detail: "Fewer blind alerts", icon: CircleHelp, accent: "bg-[#00c2c8]", side: "right" },
  { id: "changelog", label: "Changelog", detail: "MVP release", icon: Bell, accent: "bg-[#ffe100]", side: "right" },
  { id: "handbook", label: "Open source handbook", detail: "Build in public", icon: Archive, accent: "bg-[#ff00ff]", side: "right" },
  { id: "tools", label: "tools.mdx", detail: "The fix pipeline", icon: Settings, accent: "bg-[#c7ff45]", side: "right" },
  { id: "github", label: "GitHub repo", detail: "Source", icon: Github, accent: "bg-[#f5a019]", side: "right" },
  { id: "contributors", label: "Join as contributor", detail: "Community", icon: Users, accent: "bg-[#00c2c8]", side: "right" },
  { id: "trash", label: "Recycle bin", detail: "Old incident work", icon: Recycle, accent: "bg-[#b8b3a0]", side: "right" }
];

const windowMeta: Record<WindowId, { title: string; subtitle: string; w: string; x: string; y: string }> = {
  home: { title: "home.mdx", subtitle: "Talos Product OS", w: "min(940px, calc(100vw - 32px))", x: "16vw", y: "4vh" },
  sdk: { title: "SDK install", subtitle: "npm package", w: "680px", x: "8vw", y: "8vh" },
  docs: { title: "Docs", subtitle: "Install the crash-to-fix loop", w: "720px", x: "12vw", y: "7vh" },
  splunk: { title: "splunk.mdx", subtitle: "Turn Splunk logs into fix evidence", w: "760px", x: "14vw", y: "9vh" },
  why: { title: "Why Talos?", subtitle: "Stop handing developers blind alerts", w: "700px", x: "23vw", y: "7vh" },
  changelog: { title: "Changelog", subtitle: "MVP notes", w: "640px", x: "26vw", y: "10vh" },
  handbook: { title: "Open source handbook", subtitle: "How we build Talos", w: "680px", x: "16vw", y: "10vh" },
  tools: { title: "tools.mdx", subtitle: "What closes the loop", w: "760px", x: "10vw", y: "6vh" },
  byok: { title: "BYOK", subtitle: "Use your own AI and Splunk keys", w: "640px", x: "18vw", y: "9vh" },
  demo: { title: "demo.mov", subtitle: "See a checkout crash resolved", w: "740px", x: "20vw", y: "6vh" },
  github: { title: "GitHub repo", subtitle: "Clone the open source incident loop", w: "620px", x: "24vw", y: "8vh" },
  contributors: { title: "Join as contributor", subtitle: "Help shape agentic ops", w: "640px", x: "18vw", y: "8vh" },
  trash: { title: "Recycle bin", subtitle: "Deprecated operations rituals", w: "760px", x: "8vw", y: "5vh" }
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
    <main className="talos-os flex h-screen flex-col overflow-hidden bg-[#f5f1dc] text-black">
      <section className="relative flex-1 overflow-hidden px-4 pb-4 pt-3 sm:px-6">
        <div className="talos-paper-grain absolute inset-0" aria-hidden />
        <div className="talos-os-grid absolute inset-0" aria-hidden />

        <div className="relative z-10 grid h-[calc(100vh-80px)] grid-cols-[108px_1fr_108px] gap-3 max-lg:grid-cols-[96px_1fr] max-md:grid-cols-1">
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
      </section>

      <Taskbar
        openWindows={openWindows}
        minimized={minimized}
        activeWindow={activeWindow}
        onOpen={openWindow}
        onMinimize={minimizeWindow}
      />

      {toast && (
        <div className="fixed bottom-20 right-6 z-[9999] border-2 border-black bg-[#ffe100] px-4 py-2 text-sm font-black shadow-[4px_4px_0_#000] animate-bounce">
          {toast}
        </div>
      )}
    </main>
  );
}

function Taskbar({
  openWindows,
  minimized,
  activeWindow,
  onOpen,
  onMinimize
}: {
  openWindows: WindowId[];
  minimized: WindowId[];
  activeWindow: WindowId;
  onOpen: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
}) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!startMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const startMenu = document.getElementById("start-menu");
      const startBtn = document.getElementById("start-button");
      if (
        startMenu &&
        !startMenu.contains(e.target as Node) &&
        startBtn &&
        !startBtn.contains(e.target as Node)
      ) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [startMenuOpen]);

  return (
    <footer className="relative z-50 flex h-12 w-full items-center justify-between border-t-2 border-black bg-[#e5e1cf] px-3 shadow-[0_-2px_0_#000]">
      {/* Start Button & Start Menu */}
      <div className="relative">
        <button
          id="start-button"
          type="button"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`flex h-8.5 items-center gap-1.5 border-2 border-black px-3 font-black shadow-[1.5px_1.5px_0_#000] text-xs transition-transform active:translate-y-0.5 ${
            startMenuOpen ? "bg-[#ffe100]" : "bg-[#00c2c8]"
          }`}
        >
          <span className="grid h-4 w-4 place-items-center bg-black text-white rounded-xs">
            <ShieldCheck size={12} strokeWidth={3.5} />
          </span>
          Start
        </button>

        {startMenuOpen && (
          <div
            id="start-menu"
            className="absolute bottom-11 left-0 z-50 flex h-[460px] w-[320px] border-3 border-black bg-[#fffdf1] shadow-[6px_-6px_0_#000]"
          >
            {/* Start Menu Sidebar */}
            <div className="flex w-12 flex-col justify-end items-center bg-[#00c2c8] border-r-2 border-black pb-4 select-none">
              <div className="font-black text-white text-[16px] tracking-widest [writing-mode:vertical-lr] rotate-180 uppercase">
                Talos OS
              </div>
            </div>

            {/* Start Menu Options */}
            <div className="flex flex-1 flex-col overflow-hidden bg-[#fffdf1]">
              <div className="border-b-2 border-black bg-[#ffe100] p-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#555]">Programs & shortcuts</p>
                <p className="text-xs font-black">Select an application</p>
              </div>

              <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                {desktopItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onOpen(item.id);
                      setStartMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 border border-transparent hover:border-black hover:bg-[#ffe100] px-2.5 py-1.5 text-left font-black transition-all hover:translate-x-0.5"
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center border border-black ${item.accent}`}>
                      <item.icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] leading-none truncate">{item.label}</p>
                      <p className="mt-0.5 text-[8px] font-bold text-[#666] leading-none truncate">{item.detail}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Start Menu Footer */}
              <div className="border-t-2 border-black bg-[#e5e1cf] p-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpen("demo");
                    setStartMenuOpen(false);
                  }}
                  className="flex flex-1 justify-center items-center gap-1 border-2 border-black bg-[#ff4d5a] py-1 text-[10px] font-black shadow-[1px_1px_0_#000] hover:translate-x-0.5 active:translate-y-0.5"
                >
                  <MonitorPlay size={11} />
                  Simulation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") window.location.reload();
                  }}
                  className="flex flex-1 justify-center items-center gap-1 border-2 border-black bg-white py-1 text-[10px] font-black shadow-[1px_1px_0_#000] hover:translate-x-0.5 active:translate-y-0.5"
                >
                  <X size={11} />
                  Restart OS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List (Center) */}
      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto px-4 scrollbar-none">
        {openWindows.map((id) => {
          const itemMeta = desktopItems.find((item) => item.id === id);
          const Icon = itemMeta?.icon || FileText;
          const label = itemMeta?.label || id;
          const isMinimized = minimized.includes(id);
          const isActive = activeWindow === id && !isMinimized;

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (isActive) {
                  onMinimize(id);
                } else {
                  onOpen(id);
                }
              }}
              className={`flex h-8.5 max-w-[130px] shrink-0 items-center gap-2 border-2 border-black px-2.5 font-black text-[11px] shadow-[1.5px_1.5px_0_#000] transition-transform active:translate-y-0.5 ${
                isActive
                  ? "bg-[#ffe100]"
                  : "bg-white opacity-70 hover:opacity-100 hover:bg-[#e5e1cf]"
              }`}
            >
              <Icon size={12} strokeWidth={2.5} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray (Right) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onOpen("docs")}
          title="Search docs"
          className="flex h-8.5 w-8.5 items-center justify-center border-2 border-black bg-white shadow-[1.5px_1.5px_0_#000] hover:bg-[#ffe100] active:translate-y-0.5"
        >
          <Search size={13} />
        </button>
        <button
          type="button"
          onClick={() => onOpen("contributors")}
          title="Ask to contribute"
          className="flex h-8.5 w-8.5 items-center justify-center border-2 border-black bg-white shadow-[1.5px_1.5px_0_#000] hover:bg-[#ffe100] active:translate-y-0.5"
        >
          <Mail size={13} />
        </button>
        <button
          type="button"
          onClick={() => onOpen("byok")}
          title="Bring your own AI keys"
          className="flex h-8.5 items-center gap-1 border-2 border-black bg-white px-2 text-[11px] font-black shadow-[1.5px_1.5px_0_#000] hover:bg-[#ffe100] active:translate-y-0.5"
        >
          <KeyRound size={11} />
          <span className="hidden sm:inline">BYOK</span>
        </button>
        <Link
          href="/dashboard"
          className="flex h-8.5 items-center justify-center border-2 border-black bg-[#d8ff2f] px-2.5 text-[11px] font-black shadow-[1.5px_1.5px_0_#000] hover:bg-[#ffe100] active:translate-y-0.5"
        >
          Dashboard
        </Link>
        <div className="flex h-8.5 items-center gap-1.5 border-2 border-black bg-white px-2.5 text-[11px] font-black shadow-[1.5px_1.5px_0_#000]">
          <Clock size={11} />
          <span className="font-mono">{time}</span>
        </div>
      </div>
    </footer>
  );
}

function DesktopColumn({ items, onOpen, align = "left" }: { items: DesktopItem[]; onOpen: (id: WindowId) => void; align?: "left" | "right" }) {
  return (
    <div className={`relative z-10 flex flex-col gap-3 ${align === "right" ? "items-end max-md:items-start" : "items-start"} max-md:grid max-md:grid-cols-3 max-sm:grid-cols-2`}>
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
      <span className="relative grid h-12 w-12 place-items-center border-2 border-black bg-white shadow-[3px_3px_0_#000] transition-transform group-hover:-translate-y-0.5">
        <span className={`absolute -right-1.5 -top-1.5 h-4 w-4 border border-black ${item.accent}`} />
        <Icon size={24} strokeWidth={2.5} />
      </span>
      <span className="mt-1 block rounded-sm bg-[#f5f1dc]/85 px-1 text-[12px] font-black leading-tight">{item.label}</span>
      <span className="mt-0.5 block px-1 text-[10px] font-bold leading-tight text-[#555042]">{item.detail}</span>
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
          : "border-3 border-black shadow-[7px_7px_0_#000] max-h-[72vh]"
      }`}
      style={maximized ? { zIndex } : { width: meta.w, left: meta.x, top: meta.y, zIndex }}
      onMouseDown={onFocus}
    >
      <div className="flex h-10.5 items-center justify-between border-b-2 border-black bg-[#d8d3bd] px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileText size={18} strokeWidth={2.5} />
          <div className="min-w-0">
            <h2 className="truncate text-[14px] font-black leading-none">{meta.title}</h2>
            <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wide text-[#5c5748]">{meta.subtitle}</p>
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
      <div className="flex items-center gap-2 border-b-2 border-black bg-[#f8f5e6] px-3 py-1.5 text-[12px] font-black text-[#615b4e]">
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
      <div className="talos-window-body max-h-[calc(72vh-78px)] overflow-y-auto p-4 sm:p-5">{children}</div>
    </article>
  );
}

function StatusSticker() {
  return (
    <div className="talos-status-sticker absolute left-[4vw] top-[3vh] max-w-[280px] rotate-[-2deg] border-2 border-black bg-[#d8ff2f] p-3.5 shadow-[4px_4px_0_#000]">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide">
        <span className="talos-live-dot h-3.5 w-3.5 border border-black bg-[#ff00ff]" />
        Runtime loop online
      </div>
      <p className="mt-2 text-[19px] font-black leading-[0.94]">From crash alert to fix plan before the thread goes cold.</p>
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
          <span className="grid h-10 w-10 place-items-center border-2 border-black bg-[#00c2c8] shadow-[2.5px_2.5px_0_#000]">
            <ShieldCheck size={22} strokeWidth={3} />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-[#5b5547]">Talos</p>
            <p className="text-[16px] font-black">Crash-to-fix AI ops for Splunk</p>
          </div>
        </div>

        <h1 className="mt-4 max-w-[720px] text-[clamp(1.7rem,3.8vw,2.8rem)] font-black leading-[0.88]">
          Stop shipping alerts. Ship the fix plan.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] font-bold leading-6 text-[#333025]">
          Talos captures runtime failures, pulls the matching Splunk evidence, scores the blast radius, and gives developers a root cause plus the next code change to make.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => onOpen("sdk")} className="talos-primary-button h-10.5 px-4.5 text-xs">
            Install SDK
          </button>
          <Link href="/demo" className="talos-secondary-button h-10.5 px-4.5 text-xs">
            See a crash resolved
          </Link>
          <Link href="/dashboard" className="talos-secondary-button h-10.5 px-4.5 text-xs">
            Open incident dashboard
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-black text-[#625c4f]">
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
          <div className="flex items-center justify-between border-b pb-2 text-[13px] font-black uppercase">
            <span>Crash-to-fix loop</span>
            <span>Demo or live</span>
          </div>
          <ol className="mt-2.5 space-y-2 text-[13px] font-bold">
            {["SDK captures the crash with route, user, release, and breadcrumbs", "Server relay keeps Splunk HEC tokens out of the browser", "Splunk MCP brings back the logs that matter", "AI resolver returns evidence, severity, root cause, and fix steps"].map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-black bg-[#ffe100] text-[10px] font-black">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-1.5 font-black text-[15px]">
            <TerminalSquare size={16} />
            Local package
          </div>
          <code className="mt-2 block overflow-x-auto border border-black bg-black p-2 text-[13px] font-bold text-[#d8ff2f]">{command}</code>
        </div>
      </div>
    </div>
  );
}

function SdkContent() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-3">
        <h3 className="text-2xl font-black leading-none">Add crash context in minutes.</h3>
        <p className="text-sm font-bold leading-6 text-[#3d392f]">
          Drop the SDK into the app path that breaks revenue. Talos captures the error, breadcrumbs, route, release, and tags, then sends them through your server-side ingest relay.
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
      <h3 className="text-2xl font-black">Close the first incident loop</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Capture the failure", "Turn runtime errors into operational events with stack, route, release, user, and breadcrumbs."],
          ["2", "Bring Splunk evidence", "Forward events through HEC and let MCP search the logs around the incident."],
          ["3", "Hand devs the fix", "Generate severity, evidence, root cause, and concrete remediation steps."]
        ].map(([number, title, body]) => (
          <button key={title} type="button" onClick={() => onOpen(number === "1" ? "sdk" : number === "2" ? "splunk" : "demo")} className="text-left border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-1">
            <span className="grid h-7.5 w-7.5 place-items-center border-2 border-black bg-[#ff00ff] text-base font-black">{number}</span>
            <h4 className="mt-3 text-base font-black">{title}</h4>
            <p className="mt-1 text-xs font-bold leading-5 text-[#4c473c]">{body}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 border-2 border-black bg-[#d8ff2f] p-3.5 shadow-[4px_4px_0_#000]">
        <h4 className="text-base font-black">Run the demo loop locally</h4>
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
        <p className="text-xs">Talos keeps Splunk credentials server-side, validates SDK events, stores a local dashboard copy, and forwards clean payloads to HEC when mock mode is off.</p>
        <code className="mt-2.5 block border border-black bg-black p-2.5 text-[10px] font-bold text-[#d8ff2f]">POST /services/collector/event</code>
      </InfoPanel>
      <InfoPanel title="MCP investigation" color="bg-[#ff00ff]" icon={Sparkles}>
        <p className="text-xs">The resolver uses Splunk MCP first so the AI report cites nearby logs instead of guessing. REST and mock modes keep demos reliable.</p>
        <code className="mt-2.5 block border border-black bg-black p-2.5 text-[10px] font-bold text-[#d8ff2f]">SPLUNK_MCP_MODE=enabled</code>
      </InfoPanel>
      <div className="md:col-span-2 border-2 border-black bg-white p-3.5 shadow-[4px_4px_0_#000]">
        <h4 className="text-base font-black">Evidence-first query</h4>
        <p className="mt-1 text-xs font-bold text-[#514c40]">Talos narrows the search by service, route, error text, sourcetype, and the incident window so engineers see relevant proof fast.</p>
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
      <h3 className="text-2xl font-black leading-none">Observability should not hand you another mystery.</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Alerts tell you something broke. Talos packages the crash, searches Splunk for the surrounding facts, ranks urgency, and gives the engineer a report they can act on before context fades.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Crash context developers trust", "Splunk evidence instead of guesses", "Fix steps tied to code"].map((item, index) => (
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
    ["0.1.0", "SDK published", "@mylife-as-miles/talos-sdk is ready to capture runtime failures in demo apps."],
    ["MVP", "Incident OS dashboard", "Incidents, reports, simulation, and settings are wired for a crash-to-resolution product story."],
    ["Agent", "Evidence-safe resolver", "Reports work locally without live Splunk, while MCP remains the production investigation path."]
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
      <h3 className="text-2xl font-black">Build the resolver with us</h3>
      <div className="border-2 border-black bg-[#ffe100] p-3.5 shadow-[4px_4px_0_#000]">
        <p className="text-sm font-black leading-6">
          Talos is built for engineers who want incident response to end with evidence and action, not another tab. Small SDK surface, clear data contracts, MCP-first investigation, and mock mode make it easy to contribute without enterprise infrastructure.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {["Prove the crash-to-fix loop before expanding scope.", "Keep Splunk HEC ingestion server-side.", "Never invent evidence in AI reports.", "Prefer boring storage until the workflow is proven."].map((rule) => (
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
    ["sdk", "Crash collector", "Captures the details developers need before the reproduction window closes.", Code2],
    ["splunk", "Splunk relay", "Protects HEC secrets while sending structured events with sourcetype talos:error.", Boxes],
    ["demo", "Resolver agent", "Scores severity and writes strict JSON reports with evidence and fix steps.", Sparkles],
    ["contributors", "Team handoff", "Turns the report into concise Slack or Discord updates people can act on.", Mail]
  ];
  return (
    <div>
      <h3 className="text-2xl font-black">What closes the loop</h3>
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
      <h3 className="text-2xl font-black">Use your own keys.</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Talos keeps provider and Splunk credentials in environment variables. Run mock mode for the demo, then connect Gemini, OpenAI-compatible endpoints, Splunk HEC, and team notifications when you are ready.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {["AI_PROVIDER", "GEMINI_API_KEY", "SPLUNK_HEC_TOKEN", "DISCORD_WEBHOOK_URL"].map((name, index) => (
          <div key={name} className={`border-2 border-black p-3 shadow-[3px_3px_0_#000] ${index % 2 ? "bg-white" : "bg-[#d8ff2f]"}`}>
            <p className="font-black text-sm">{name}</p>
            <p className="mt-0.5 text-xs font-bold text-[#4d473d]">Configured through .env.local so secrets stay out of the repo.</p>
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
        <p className="mt-2.5 text-xs font-bold text-[#d8ff2f]">Watch Talos move from checkout crash to evidence-backed remediation plan.</p>
      </div>
      <div>
        <h3 className="text-2xl font-black">3-minute crash-to-fix flow</h3>
        <ol className="mt-3.5 space-y-2">
          {["Start with the cost of blind alerts", "Install the SDK in the app", "Trigger a checkout crash", "Let Splunk MCP gather evidence", "Open the fix-ready AI report", "Notify the team with the next action"].map((step, index) => (
            <li key={step} className="flex gap-2.5 border-2 border-black bg-white p-2 text-xs font-black shadow-[2.5px_2.5px_0_#000]">
              <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-black bg-[#ffe100] text-[10px]">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => onOpen("docs")} className="talos-primary-button mt-3.5 h-9 px-3.5 text-xs">
          See setup path
        </button>
      </div>
    </div>
  );
}

function GithubContent() {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black">Clone the incident loop</h3>
      <p className="text-sm font-bold leading-6 text-[#3d392f]">
        Talos ships as a pnpm workspace with the SDK, Next.js dashboard, ingest APIs, Splunk MCP integration notes, demo data, and docs in one place.
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
        <h3 className="text-2xl font-black leading-none">Help make incidents actionable.</h3>
        <p className="mt-2.5 text-sm font-bold leading-6 text-[#3d392f]">
          Good first areas: SDK ergonomics, Splunk query adapters, report quality, AI evals, notification templates, and docs that help teams trust the handoff.
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
          Raise my hand
        </button>
        {status === "saved" ? <p className="mt-2.5 border border-black bg-white p-2 text-xs font-black">Contributor interest captured locally for demo mode.</p> : null}
      </form>
    </div>
  );
}

function TrashContent({ removedTrash, setRemovedTrash }: { removedTrash: string[]; setRemovedTrash: (value: string[]) => void }) {
  const trash = ["Manual log digging", "Screenshots without stack traces", "Blind production alerts", "Mystery checkout failures", "Secrets in browser SDKs", "AI reports with invented evidence"];
  const visible = trash.filter((item) => !removedTrash.includes(item));
  return (
    <div>
      <div className="border-2 border-black bg-[#e5e1cf] p-3 shadow-[4px_4px_0_#000]">
        <h3 className="text-2xl font-black">Recycle bin</h3>
        <p className="mt-1.5 text-sm font-bold text-[#3f3a31]">The incident-response work Talos moves out of the critical path.</p>
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
