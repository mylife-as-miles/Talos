"use client";

import clsx from "clsx";
import { CheckCircle2, Circle } from "lucide-react";

type DemoProgressProps = {
  hasEvent: boolean;
  hasReport: boolean;
};

const steps = ["Crash captured", "Resolver run", "Report ready"];

export function DemoProgress({ hasEvent, hasReport }: DemoProgressProps) {
  const completed = [hasEvent, hasReport, hasReport];

  return (
    <div className="talos-fade-up talos-stagger-1 mb-5 flex flex-wrap gap-3">
      {steps.map((label, index) => {
        const done = completed[index];
        return (
          <div
            key={label}
            className={clsx(
              "talos-row-enter flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition",
              done ? "border-[#1d6e55]/60 bg-[#0a362e]/40 text-[#3df49a]" : "border-[#24343c] bg-[#0b1418]/60 text-[#8d99a3]"
            )}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            {label}
          </div>
        );
      })}
    </div>
  );
}
