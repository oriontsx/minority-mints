"use client";

import type { RoundResult } from "@/lib/types";

interface Props {
  recent: RoundResult[];
}

export default function HistoryFeed({ recent }: Props) {
  return (
    <div className="surface rounded-xl p-4">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-dim">
        Recent rounds
      </div>
      <div className="flex flex-col gap-1.5">
        {recent.length === 0 && (
          <div className="py-4 text-center text-xs text-dim">No rounds yet</div>
        )}
        {recent.map((r) => (
          <div
            key={r.round}
            className="flex items-center justify-between rounded-lg bg-ash-2 px-3 py-2 text-xs"
          >
            <span className="font-mono text-dim">#{r.round}</span>
            <div className="flex items-center gap-3 font-mono tabular">
              <span style={{ color: r.winner === "red" ? "var(--color-pill-red)" : "var(--color-dim)" }}>
                R {r.red}
              </span>
              <span className="text-faint">vs</span>
              <span style={{ color: r.winner === "blue" ? "var(--color-pill-blue)" : "var(--color-dim)" }}>
                B {r.blue}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider" style={{
              color: r.winner === "tie" ? "var(--color-dim)" : "var(--color-gold)",
            }}>
              {r.winner === "tie" ? "tie" : `${r.winner} win`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
