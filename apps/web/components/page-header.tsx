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
    <div className={clsx("talos-fade-up flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between", className)}>
      <div>
        <h1 className="text-[clamp(2.25rem,5vw,4.75rem)] font-black leading-[0.88] text-black">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-[18px] font-bold leading-7 text-[#3d392f]">{description}</p> : null}
      </div>
      {actions ? <div className="talos-fade-up talos-stagger-2 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
