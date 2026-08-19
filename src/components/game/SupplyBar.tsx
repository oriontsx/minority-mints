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
      <div className="mb-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em] text-white/40">
        <span>Minted</span>
        <span className="tabular text-white">
          {minted.toLocaleString()} <span className="text-white/40">/ {max.toLocaleString()}</span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: soldOut
              ? "#ffd700"
              : endgame
                ? "linear-gradient(90deg, #ff2d55, #ffb020)"
                : "linear-gradient(90deg, #3054ff, #ff2d55)",
          }}
        />
      </div>
      <div className="mt-2 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em]">
        <span className="text-white/40">Remaining</span>
        <span className="tabular" style={{ color: endgame ? "#ffb020" : "#ffffff" }}>
          {remaining.toLocaleString()}
          {soldOut && " · COMPLETE"}
        </span>
      </div>
    </div>
  );
}
