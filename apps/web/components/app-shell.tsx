import { Activity, Bot, FileText, Gauge, Settings, Shield, Siren } from "lucide-react";
import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/incidents", label: "Incidents", icon: Siren },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/demo", label: "Demo", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-r border-talos-line bg-black/24 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-talos-bronze/40 bg-talos-bronze/10 text-talos-bronze">
            <Shield size={21} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-wide">Talos</div>
            <div className="text-xs text-talos-muted">Splunk Agentic Ops</div>
          </div>
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 rounded-lg border border-talos-line bg-talos-panel/70 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot size={16} className="text-talos-cyan" />
            Resolver Online
          </div>
          <p className="mt-2 text-xs leading-5 text-talos-muted">SDK intake, Splunk MCP investigation, and AI triage are wired for mock or live Splunk mode.</p>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
