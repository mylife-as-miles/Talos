import Image from "next/image";
import Link from "next/link";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="talos-app-shell relative h-screen overflow-hidden bg-[#f5f1dc] text-black lg:grid lg:grid-cols-[220px_1fr]">
      <div className="talos-paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <aside className="relative z-10 m-2 flex h-[calc(100vh-16px)] flex-col overflow-hidden border-[3px] border-black bg-[#fffdf1] shadow-[8px_8px_0_#000] max-lg:min-h-0">
        <div className="border-b-[3px] border-black bg-[#ffe100] px-4 py-2">
          <Link href="/" className="block">
            <Image
              src="/assets/talos-logo-lockup.png"
              alt="Talos self-healing Splunk AI Ops"
              width={210}
              height={210}
              unoptimized
              priority
              className="mx-auto h-[80px] w-[80px] object-contain"
            />
          </Link>
        </div>

        <AppNav />

        <div className="mx-3 mt-auto hidden lg:block">
          <div className="relative h-[120px] overflow-hidden border-[2px] border-black bg-[#f5f1dc] shadow-[4px_4px_0_#000]">
            <Image
              src="/assets/talos-guardian.png"
              alt=""
              width={420}
              height={720}
              unoptimized
              className="absolute -left-6 bottom-0 h-[130px] w-[110px] object-contain object-bottom opacity-90"
            />
          </div>
          <div className="talos-sticker mb-3 mt-3 p-2.5">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 border-2 border-black bg-[#00c2c8]" />
              <div>
                <div className="text-[13px] font-black text-black">Talos Guardian</div>
                <div className="text-[10px] font-black uppercase tracking-wide text-black">Operational</div>
              </div>
            </div>
            <div className="mt-2 text-center text-[11px] font-black text-black">v1.4.2</div>
          </div>
        </div>
      </aside>
      <main className="relative z-10 min-w-0 overflow-y-auto px-4 py-4 lg:px-5 lg:py-5">{children}</main>
    </div>
  );
}
