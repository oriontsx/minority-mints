"use client";

import type { RoundResult } from "@/lib/types";

interface Props {
  recent: RoundResult[];
}

export default function HistoryFeed({ recent }: Props) {
  return (
    <div className="w-full">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
        Recent rounds
      </div>
      <div className="flex flex-col gap-1.5">
        {recent.length === 0 && (
          <div className="py-4 text-center text-xs text-white/30">No rounds yet</div>
        )}
        {recent.slice(0, 6).map((r) => (
          <div
            key={r.round}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span className="text-white/40">#{r.round}</span>
            <div className="flex items-center gap-3 tabular">
              <span style={{ color: r.winner === "red" ? "#ff2d55" : "rgba(255,255,255,0.3)" }}>
                R {r.red}
              </span>
              <span className="text-white/20">vs</span>
              <span style={{ color: r.winner === "blue" ? "#3054ff" : "rgba(255,255,255,0.3)" }}>
                B {r.blue}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider" style={{
              color: r.winner === "tie" ? "rgba(255,255,255,0.3)" : "#ffd700",
            }}>
              {r.winner === "tie" ? "tie" : `${r.winner} win`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
