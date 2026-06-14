import Image from "next/image";
import Link from "next/link";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070d10] text-[#d7dee8] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="relative m-2 flex min-h-[calc(100vh-16px)] flex-col overflow-hidden rounded-lg border border-[#1f2a30] bg-[linear-gradient(180deg,rgba(16,28,31,.96),rgba(7,13,16,.98))] shadow-[0_0_80px_rgba(0,0,0,.45)]">
        <div className="px-7 pt-5">
          <Link href="/dashboard" className="block">
            <Image
              src="/assets/talos-logo-lockup.png"
              alt="Talos self-healing Splunk AI Ops"
              width={210}
              height={210}
              unoptimized
              priority
              className="mx-auto h-[205px] w-[205px] object-contain"
            />
          </Link>
        </div>

        <AppNav />

        <div className="mx-4 mt-auto">
          <div className="relative h-[420px] overflow-hidden">
            <Image
              src="/assets/talos-guardian.png"
              alt=""
              width={420}
              height={720}
              unoptimized
              className="absolute -left-12 bottom-0 h-[415px] w-[320px] object-contain object-bottom opacity-75"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#071014] to-transparent" />
          </div>
          <div className="mb-8 px-8">
            <div className="flex items-center gap-4">
              <span className="h-4 w-4 rounded-full bg-[#35d494] shadow-[0_0_20px_rgba(53,212,148,.65)]" />
              <div>
                <div className="text-[18px] font-medium text-[#d9e5e9]">Talos Guardian</div>
                <div className="text-[13px] uppercase tracking-wide text-[#39d78d]">Operational</div>
              </div>
            </div>
            <div className="mt-9 text-center text-[14px] text-[#9aa7b2]">v1.4.2</div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-6 py-8">{children}</main>
    </div>
  );
}
