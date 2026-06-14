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
    <nav className="mt-2 grid gap-2 px-2">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`talos-nav-link flex h-[62px] items-center gap-4 rounded-md border-l-4 px-7 text-[17px] transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99] ${
              active
                ? "border-[#22d9f3] bg-[#10262f] text-[#d8fbff] shadow-[inset_0_0_28px_rgba(34,217,243,.08)]"
                : "border-transparent text-[#c7d0db] hover:bg-white/[.035] hover:text-white"
            }`}
          >
            <item.icon size={23} strokeWidth={1.7} className="text-current" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
