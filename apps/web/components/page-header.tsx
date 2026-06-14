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
        <h1 className="text-[34px] font-bold tracking-[-.03em] text-[#f4f7fb]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-[17px] text-[#aab5bf]">{description}</p> : null}
      </div>
      {actions ? <div className="talos-fade-up talos-stagger-2 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
