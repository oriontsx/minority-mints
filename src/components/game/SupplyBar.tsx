"use client";

interface Props {
  minted: number;
  max: number;
  endgame: boolean;
  soldOut: boolean;
}

export default function SupplyBar({ minted, max, endgame, soldOut }: Props) {
  const pct = (minted / max) * 100;
  const remaining = max - minted;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em] text-dim">
        <span>Minted</span>
        <span className="font-mono tabular text-ink">
          {minted.toLocaleString()} <span className="text-dim">/ {max.toLocaleString()}</span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-ash-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: soldOut
              ? "var(--color-gold)"
              : endgame
                ? "linear-gradient(90deg, var(--color-pill-red), var(--color-amber))"
                : "linear-gradient(90deg, var(--color-pill-blue), var(--color-pill-red))",
          }}
        />
      </div>
      <div className="mt-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em]">
        <span className="text-dim">Remaining</span>
        <span
          className="font-mono tabular"
          style={{ color: endgame ? "var(--color-amber)" : "var(--color-ink)" }}
        >
          {remaining.toLocaleString()}
          {soldOut && " · COMPLETE"}
        </span>
      </div>
    </div>
  );
}
