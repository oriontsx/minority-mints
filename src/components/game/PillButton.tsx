"use client";

interface Props {
  pill: "red" | "blue";
  chosen: boolean;
  disabled: boolean;
  leading: boolean;
  trailing: boolean;
  count: number | null;
  onChoose: (pill: "red" | "blue") => void;
}

const COLORS = {
  red: {
    bg: "var(--color-pill-red)",
    deep: "var(--color-pill-red-deep)",
    glow: "rgba(255, 45, 85, 0.45)",
    text: "text-glow-red",
  },
  blue: {
    bg: "var(--color-pill-blue)",
    deep: "var(--color-pill-blue-deep)",
    glow: "rgba(10, 132, 255, 0.45)",
    text: "text-glow-blue",
  },
};

export default function PillButton({
  pill,
  chosen,
  disabled,
  leading,
  trailing,
  count,
  onChoose,
}: Props) {
  const c = COLORS[pill];
  const label = pill === "red" ? "RED PILL" : "BLUE PILL";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChoose(pill)}
      className={`pill-btn group relative flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-10 sm:py-14 transition-all
        ${disabled ? "opacity-40" : "hover:scale-[1.02]"}
        ${chosen ? "scale-[1.02]" : ""}
      `}
      style={{
        borderColor: chosen ? c.bg : "var(--color-faint)",
        background: chosen
          ? `radial-gradient(ellipse at 50% 0%, ${c.glow}, transparent 70%), var(--color-ash)`
          : "var(--color-ash)",
        ["--glow" as string]: c.glow,
      }}
    >
      {/* Pill graphic */}
      <div className="relative flex h-12 w-24 items-center">
        <div
          className={`h-12 w-12 rounded-full transition-all ${chosen ? "animate-breath" : ""}`}
          style={{ background: c.bg, boxShadow: chosen ? `0 0 30px ${c.glow}` : "none" }}
        />
        <div
          className="h-12 w-12 rounded-full border-2"
          style={{ background: c.deep, borderColor: "rgba(0,0,0,0.3)", marginLeft: "-12px" }}
        />
      </div>

      <span
        className={`text-xl font-bold tracking-[0.15em] sm:text-2xl ${c.text}`}
        style={{ color: c.bg }}
      >
        {label}
      </span>

      {/* Status line */}
      <span className="h-5 text-[11px] uppercase tracking-[0.25em] text-dim">
        {chosen
          ? "your pick"
          : leading
            ? "leading"
            : trailing
              ? "trailing"
              : count !== null
                ? `${count} players`
                : ""}
      </span>
    </button>
  );
}
