"use client";

interface Props {
  achievements: string[];
}

const LABELS: Record<string, { icon: string; label: string }> = {
  red_winner: { icon: "🔴", label: "Red Winner" },
  blue_winner: { icon: "🔵", label: "Blue Winner" },
  contrarian: { icon: "🧠", label: "Contrarian" },
  streak: { icon: "🔥", label: "Streak" },
  last_mint: { icon: "🏆", label: "Last Mint" },
};

const ORDER = ["red_winner", "blue_winner", "contrarian", "streak", "last_mint"];

export default function Achievements({ achievements }: Props) {
  const set = new Set(achievements);
  return (
    <div className="w-full">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
        Achievements
      </div>
      <div className="flex flex-col gap-1.5">
        {ORDER.map((key) => {
          const earned = set.has(key);
          const meta = LABELS[key];
          return (
            <div
              key={key}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all ${
                earned ? "bg-white/5" : "opacity-25"
              }`}
            >
              <span className="text-sm">{meta.icon}</span>
              <span className="flex-1 text-[11px] font-medium" style={{ fontFamily: "var(--font-sans)" }}>
                {meta.label}
              </span>
              {earned && <span className="text-[9px] uppercase tracking-wider" style={{ color: "#ffd700" }}>Earned</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
