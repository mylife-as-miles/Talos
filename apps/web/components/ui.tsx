import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("rounded-lg border border-talos-line bg-talos-panel/88 shadow-panel", className)}>{children}</section>;
}

export function CardHeader({ title, action, detail }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-talos-line px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-talos-text">{title}</h2>
        {detail ? <p className="mt-1 text-xs text-talos-muted">{detail}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "warn" | "critical" | "cyan" }) {
  const tones = {
    neutral: "border-talos-line bg-talos-panel2 text-talos-muted",
    ok: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    warn: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    critical: "border-rose-400/35 bg-rose-500/15 text-rose-200",
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
  };
  return <span className={clsx("inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium", tones[tone])}>{children}</span>;
}

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-talos-line bg-talos-panel2 px-3 text-sm font-medium text-talos-text transition-[transform,border-color,background-color,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-talos-cyan/60 hover:bg-cyan-300/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CodeBlock({ value }: { value: string }) {
  return <pre className="rounded-lg border border-talos-line bg-black/35 p-4 text-xs leading-6 text-slate-200">{value}</pre>;
}
