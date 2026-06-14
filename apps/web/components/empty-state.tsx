import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { Button } from "./ui";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
  compact?: boolean;
};

export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className, compact }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "talos-empty talos-fade-up relative overflow-hidden rounded-xl border border-dashed border-[#2a3a42] bg-[linear-gradient(180deg,rgba(14,24,28,.72),rgba(8,14,18,.88))] text-center",
        compact ? "px-6 py-10" : "px-8 py-14",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,217,243,.08),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-lg place-items-center">
        <div className="talos-empty-icon grid h-16 w-16 place-items-center rounded-2xl border border-[#1c6d78]/60 bg-[#0c3b45]/80 text-[#28d7f5] shadow-[0_0_40px_rgba(34,217,243,.12)]">
          <Icon size={28} strokeWidth={1.6} />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#eef4f8]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#9aa8b3]">{description}</p>
        {action || secondaryAction ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {action ? (
              <Link href={action.href}>
                <Button className="talos-btn-glow border-[#13566a] bg-[#0b2730] text-[#42e2ff]">{action.label}</Button>
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link href={secondaryAction.href} className="text-sm text-[#8fdcf0] transition hover:text-white">
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
