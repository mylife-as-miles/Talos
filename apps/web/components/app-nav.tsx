"use client";

import { BarChart3, CirclePlay, Gauge, Settings, Siren } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/incidents", label: "Incidents", icon: Siren },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/demo", label: "Demo", icon: CirclePlay },
  { href: "/settings", label: "Settings", icon: Settings }
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`flex h-11 items-center gap-3 rounded-md border-l-2 px-3 text-[14px] transition-[background-color,color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99] ${
              active
                ? "border-[#22d9f3] bg-[#10262f] text-[#d8fbff]"
                : "border-transparent text-[#b5c0cb] hover:bg-white/[.035] hover:text-white"
            }`}
          >
            <item.icon size={18} strokeWidth={1.7} className="shrink-0 text-current" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
