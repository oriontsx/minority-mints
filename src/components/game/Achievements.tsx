"use client";

interface Props {
  achievements: string[];
}

const LABELS: Record<string, { icon: string; label: string; desc: string }> = {
  red_winner: { icon: "🔴", label: "Red Winner", desc: "Won a round on Red" },
  blue_winner: { icon: "🔵", label: "Blue Winner", desc: "Won a round on Blue" },
  contrarian: { icon: "🧠", label: "Contrarian", desc: "Won against a large majority" },
  streak: { icon: "🔥", label: "Streak", desc: "Won 3+ rounds in a row" },
  last_mint: { icon: "🏆", label: "The Last Mint", desc: "Claimed the final NFT" },
};

const ORDER = ["red_winner", "blue_winner", "contrarian", "streak", "last_mint"];

export default function Achievements({ achievements }: Props) {
  const set = new Set(achievements);
  return (
    <div className="surface rounded-xl p-4">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-dim">
        Achievements
      </div>
      <div className="flex flex-col gap-2">
        {ORDER.map((key) => {
          const earned = set.has(key);
          const meta = LABELS[key];
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                earned ? "bg-ash-2" : "opacity-30"
              }`}
            >
              <span className="text-lg">{meta.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-semibold">{meta.label}</div>
                <div className="text-[10px] text-dim">{meta.desc}</div>
              </div>
              {earned && <span className="text-[10px] uppercase tracking-wider text-gold">Earned</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
