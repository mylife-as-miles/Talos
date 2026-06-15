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
        "talos-empty talos-fade-up relative overflow-hidden border-[3px] border-dashed border-black bg-[#fffdf1] text-center shadow-[5px_5px_0_#000]",
        compact ? "px-6 py-10" : "px-8 py-14",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,255,47,.4),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-lg place-items-center">
        <div className="talos-empty-icon grid h-16 w-16 place-items-center border-[3px] border-black bg-[#00c2c8] text-black shadow-[5px_5px_0_#000]">
          <Icon size={28} strokeWidth={2.8} />
        </div>
        <h3 className="mt-5 text-lg font-black text-black">{title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-[#4d473c]">{description}</p>
        {action || secondaryAction ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {action ? (
              <Link href={action.href}>
                <Button className="talos-btn-glow">{action.label}</Button>
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link href={secondaryAction.href} className="text-sm font-black text-black underline decoration-2 underline-offset-4 transition hover:bg-[#ffe100]">
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
