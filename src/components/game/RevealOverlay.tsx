"use client";

import type { WalletSnapshot } from "@/lib/types";

interface Props {
  snapshot: WalletSnapshot;
}

export default function RevealOverlay({ snapshot }: Props) {
  if (snapshot.phase !== "revealing" || !snapshot.lastResult) return null;
  const r = snapshot.lastResult;

  const youWon = snapshot.yourResult === "won";
  const tie = r.winner === "tie";

  let headline = "NO WINNER";
  let sub = "The round balanced perfectly.";
  let color = "var(--color-dim)";
  if (!tie) {
    headline = `${r.winner === "red" ? "🔴 RED" : "🔵 BLUE"} WINS`;
    sub = `The minority of ${r.winner === "red" ? r.red : r.blue} mints.`;
    color = r.winner === "red" ? "var(--color-pill-red)" : "var(--color-pill-blue)";
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center">
      <div
        className="animate-flash-win text-center"
        style={{ color }}
      >
        <div className="text-5xl font-bold tracking-[0.1em] sm:text-7xl" style={{ textShadow: `0 0 40px ${color}` }}>
          {headline}
        </div>
        <div className="mt-3 text-sm uppercase tracking-[0.25em] text-ink/70">
          {sub}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-8 font-mono text-2xl tabular animate-rise">
        <div className="text-center">
          <div style={{ color: r.winner === "red" ? "var(--color-pill-red)" : "var(--color-dim)" }}>{r.red}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim">Red</div>
        </div>
        <div className="text-faint">—</div>
        <div className="text-center">
          <div style={{ color: r.winner === "blue" ? "var(--color-pill-blue)" : "var(--color-dim)" }}>{r.blue}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim">Blue</div>
        </div>
      </div>

      {youWon && (
        <div className="mt-6 animate-pop rounded-full border border-gold px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-gold)" }}>
          You chose the minority
        </div>
      )}
    </div>
  );
}
