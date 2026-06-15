import type { IntakeBar } from "@/lib/dashboard-stats";

function segmentHeight(value: number, maxTotal: number) {
  if (maxTotal <= 0) return 0;
  return Math.max(0, (value / maxTotal) * 140);
}

export function RuntimeChart({ bars, empty }: { bars: IntakeBar[]; empty?: boolean }) {
  const totals = bars.map((bar) => bar.critical + bar.high + bar.medium + bar.low + bar.info);
  const maxTotal = Math.max(...totals, 1);

  return (
    <div>
      <div className="talos-scanline relative mt-2 h-[160px] border-[2px] border-black bg-[#fffdf1]">
        {[1000, 800, 600, 400, 200, 0].map((tick, index) => (
          <div key={tick} className="absolute left-0 right-0 border-t border-black/25" style={{ top: `${index * 20}%` }}>
            <span className="absolute -top-2 left-0 bg-[#fffdf1] pr-1.5 text-[9px] font-black text-[#3d392f]">{tick === 1000 ? "1K" : tick}</span>
          </div>
        ))}
        <div className="absolute bottom-0 left-10 right-1 flex h-[140px] items-end gap-[4px]">
          {bars.map((bar, index) => {
            const total = totals[index];
            const segments = [
              { key: "info", value: bar.info, className: "bg-[#b8b3a0]" },
              { key: "medium", value: bar.medium, className: "bg-[#efb53f]" },
              { key: "high", value: bar.high, className: "bg-[#f17b2d]" },
              { key: "critical", value: bar.critical, className: "bg-[#ee4b59]" },
              { key: "low", value: bar.low, className: "bg-[#00c2c8]" }
            ];
            return (
              <div key={index} className="flex w-full min-w-[6px] flex-col justify-end">
                {segments.map((segment, segmentIndex) => (
                  <div
                    key={segment.key}
                    style={{
                      height: `${segmentHeight(segment.value, maxTotal)}px`,
                      animationDelay: `${index * 8 + segmentIndex * 4}ms`
                    }}
                    className={`talos-bar-segment border-x border-black ${segment.className}`}
                  />
                ))}
                {total === 0 ? <div className="h-0.5 w-full border border-black bg-[#e5e1cf]" /> : null}
              </div>
            );
          })}
        </div>
        {empty ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f1dc]/80 backdrop-blur-[1px]">
            <p className="border-[2px] border-black bg-[#ffe100] px-3 py-1.5 text-xs font-black text-black shadow-[3px_3px_0_#000]">No intake yet - run the demo flow to populate this chart.</p>
          </div>
        ) : null}
      </div>
      <div className="ml-10 mt-1.5 grid grid-cols-6 text-[10px] font-black text-black">
        {["-24h", "-18h", "-12h", "-6h", "-3h", "now"].map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
    </div>
  );
}
