import Image from "next/image";
import Link from "next/link";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="talos-app-shell relative min-h-screen overflow-hidden bg-[#f5f1dc] text-black lg:grid lg:grid-cols-[286px_1fr]">
      <div className="talos-paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <aside className="relative z-10 m-3 flex min-h-[calc(100vh-24px)] flex-col overflow-hidden border-[4px] border-black bg-[#fffdf1] shadow-[12px_12px_0_#000] max-lg:min-h-0">
        <div className="border-b-[4px] border-black bg-[#ffe100] px-6 py-4">
          <Link href="/" className="block">
            <Image
              src="/assets/talos-logo-lockup.png"
              alt="Talos self-healing Splunk AI Ops"
              width={210}
              height={210}
              unoptimized
              priority
              className="mx-auto h-[178px] w-[178px] object-contain"
            />
          </Link>
        </div>

        <AppNav />

        <div className="mx-4 mt-auto hidden lg:block">
          <div className="relative h-[300px] overflow-hidden border-[3px] border-black bg-[#f5f1dc] shadow-[6px_6px_0_#000]">
            <Image
              src="/assets/talos-guardian.png"
              alt=""
              width={420}
              height={720}
              unoptimized
              className="absolute -left-8 bottom-0 h-[315px] w-[260px] object-contain object-bottom opacity-90"
            />
          </div>
          <div className="talos-sticker mb-6 mt-5 p-4">
            <div className="flex items-center gap-4">
              <span className="h-4 w-4 border-2 border-black bg-[#00c2c8]" />
              <div>
                <div className="text-[18px] font-black text-black">Talos Guardian</div>
                <div className="text-[13px] font-black uppercase tracking-wide text-black">Operational</div>
              </div>
            </div>
            <div className="mt-5 text-center text-[14px] font-black text-black">v1.4.2</div>
          </div>
        </div>
      </aside>
      <main className="relative z-10 min-w-0 px-5 py-6 lg:px-7 lg:py-8">{children}</main>
    </div>
  );
}
