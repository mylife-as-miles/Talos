import Link from "next/link";
import { Shield } from "lucide-react";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070d10] text-[#d7dee8] lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="sticky top-0 flex h-screen flex-col border-r border-[#1f2a30] bg-[linear-gradient(180deg,rgba(16,28,31,.98),rgba(7,13,16,.99))]">
        <div className="border-b border-[#1f2a30] px-4 py-4">
          <Link href="/dashboard" className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-white/[.03]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#1c6d78]/70 bg-[#0c3b45] text-[#28d7f5] shadow-[0_0_20px_rgba(34,217,243,.08)]">
              <Shield size={20} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold tracking-[.04em] text-[#eef4f8]">Talos</div>
              <div className="truncate text-[11px] uppercase tracking-[.12em] text-[#7f8f99]">Splunk AI Ops</div>
            </div>
          </Link>
        </div>

        <AppNav />

        <div className="mt-auto border-t border-[#1f2a30] px-4 py-4">
          <div className="rounded-lg border border-[#203037] bg-[#0b1418]/80 px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="talos-pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-[#35d494] shadow-[0_0_12px_rgba(53,212,148,.55)]" />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-[#d9e5e9]">Guardian Online</div>
                <div className="truncate text-[11px] uppercase tracking-wide text-[#39d78d]">Operational</div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center text-[11px] text-[#6f7d86]">v1.4.2</div>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
