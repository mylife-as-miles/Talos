import type { IntakeBar } from "@/lib/dashboard-stats";

const MAX_BAR = 12;

function segmentHeight(value: number, maxTotal: number) {
  if (maxTotal <= 0) return 0;
  return Math.max(0, (value / maxTotal) * 220);
}

export function RuntimeChart({ bars, empty }: { bars: IntakeBar[]; empty?: boolean }) {
  const totals = bars.map((bar) => bar.critical + bar.high + bar.medium + bar.low + bar.info);
  const maxTotal = Math.max(...totals, 1);

  return (
    <div>
      <div className="relative mt-4 h-[250px] border-b border-[#24333a]">
        {[1000, 800, 600, 400, 200, 0].map((tick, index) => (
          <div key={tick} className="absolute left-0 right-0 border-t border-[#1c2a31]" style={{ top: `${index * 20}%` }}>
            <span className="absolute -top-2 left-0 text-[12px] text-[#8d99a3]">{tick === 1000 ? "1K" : tick}</span>
          </div>
        ))}
        <div className="absolute bottom-0 left-12 right-2 flex h-[220px] items-end gap-[5px]">
          {bars.map((bar, index) => {
            const total = totals[index];
            const segments = [
              { key: "info", value: bar.info, className: "bg-[#6a737b]/70" },
              { key: "medium", value: bar.medium, className: "bg-[#efb53f]" },
              { key: "high", value: bar.high, className: "bg-[#f17b2d]" },
              { key: "critical", value: bar.critical, className: "bg-[#ee4b59]" },
              { key: "low", value: bar.low, className: "bg-[#0a8ec1]" }
            ];
            return (
              <div key={index} className="flex w-full min-w-[8px] flex-col justify-end">
                {segments.map((segment, segmentIndex) => (
                  <div
                    key={segment.key}
                    style={{
                      height: `${segmentHeight(segment.value, maxTotal)}px`,
                      animationDelay: `${index * 8 + segmentIndex * 4}ms`
                    }}
                    className={`talos-bar-segment ${segment.className}`}
                  />
                ))}
                {total === 0 ? <div className="h-1 w-full rounded-full bg-[#1a262c]/80" /> : null}
              </div>
            );
          })}
        </div>
        {empty ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070d10]/55 backdrop-blur-[1px]">
            <p className="rounded-lg border border-[#24333b] bg-[#0b1418]/90 px-4 py-2 text-sm text-[#9aa8b3]">No intake yet — run the demo flow to populate this chart.</p>
          </div>
        ) : null}
      </div>
      <div className="ml-12 mt-3 grid grid-cols-6 text-[13px] text-[#9da8b2]">
        {["-24h", "-18h", "-12h", "-6h", "-3h", "now"].map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
    </div>
  );
}
