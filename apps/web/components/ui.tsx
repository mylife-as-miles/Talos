import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("border-[3px] border-talos-line bg-talos-panel shadow-[7px_7px_0_#000]", className)}>{children}</section>;
}

export function CardHeader({ title, action, detail }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-[3px] border-talos-line bg-[#e5e1cf] px-5 py-4">
      <div>
        <h2 className="text-sm font-black uppercase tracking-wide text-talos-text">{title}</h2>
        {detail ? <p className="mt-1 text-xs text-talos-muted">{detail}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "warn" | "critical" | "cyan" }) {
  const tones = {
    neutral: "border-talos-line bg-white text-talos-text",
    ok: "border-talos-line bg-[#d8ff2f] text-talos-text",
    warn: "border-talos-line bg-[#ffe100] text-talos-text",
    critical: "border-talos-line bg-[#ff4d5a] text-talos-text",
    cyan: "border-talos-line bg-[#00c2c8] text-talos-text"
  };
  return <span className={clsx("inline-flex items-center border-2 px-2 py-1 text-[11px] font-black uppercase", tones[tone])}>{children}</span>;
}

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-none border-[3px] border-talos-line bg-[#f5a019] px-4 text-sm font-black text-talos-text shadow-[4px_4px_0_#000] transition-[transform,box-shadow,background-color,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#ffe100] hover:shadow-[6px_6px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CodeBlock({ value }: { value: string }) {
  return <pre className="border-[3px] border-talos-line bg-black p-4 text-xs font-bold leading-6 text-[#d8ff2f] shadow-[5px_5px_0_#000]">{value}</pre>;
}
