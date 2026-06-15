"use client";

import { BarChart3, Gauge, Settings, Siren } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/incidents", label: "Incidents", icon: Siren },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-2 space-y-1.5 px-2">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`talos-brutal-control flex h-[36px] items-center gap-3 border-[2px] px-3 text-[12px] font-black shadow-[3px_3px_0_#000] transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#000] ${
              active
                ? "border-black bg-[#0000ff] text-white"
                : "border-black bg-white text-black hover:bg-[#ffe100]"
            }`}
          >
            <item.icon size={16} strokeWidth={2.7} className="shrink-0 text-current" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
