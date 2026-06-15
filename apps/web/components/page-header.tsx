import clsx from "clsx";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  className
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("talos-fade-up flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between", className)}>
      <div>
        <h1 className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-black leading-[0.9] text-black">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[12px] font-bold leading-5 text-[#3d392f]">{description}</p> : null}
      </div>
      {actions ? <div className="talos-fade-up talos-stagger-2 flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
