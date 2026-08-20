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
  let color = "rgba(255,255,255,0.5)";
  if (!tie) {
    headline = `${r.winner === "red" ? "🔴 RED" : "🔵 BLUE"} WINS`;
    sub = `The minority of ${r.winner === "red" ? r.red : r.blue} mints.`;
    color = r.winner === "red" ? "#ff2d55" : "#3054ff";
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
      <div className="animate-flash-win text-center" style={{ color }}>
        <div
          className="text-3xl font-bold tracking-[0.1em] sm:text-5xl md:text-7xl"
          style={{ textShadow: `0 0 40px ${color}`, fontFamily: "var(--font-sans)" }}
        >
          {headline}
        </div>
        <div className="mt-3 text-xs uppercase tracking-[0.25em] text-white/70 sm:text-sm">
          {sub}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-6 text-xl tabular animate-rise sm:gap-8 sm:text-2xl">
        <div className="text-center">
          <div style={{ color: r.winner === "red" ? "#ff2d55" : "rgba(255,255,255,0.3)" }}>{r.red}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Red</div>
        </div>
        <div className="text-white/20">—</div>
        <div className="text-center">
          <div style={{ color: r.winner === "blue" ? "#3054ff" : "rgba(255,255,255,0.3)" }}>{r.blue}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Blue</div>
        </div>
      </div>
      {youWon && (
        <div
          className="mt-6 animate-pop rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm"
          style={{ color: "#ffd700", borderColor: "#ffd700" }}
        >
          You chose the minority
        </div>
      )}
    </div>
  );
}
