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
    bg: "#ff2d55",
    deep: "#c0163d",
    glow: "rgba(255, 45, 85, 0.45)",
  },
  blue: {
    bg: "#3054ff",
    deep: "#2040e0",
    glow: "rgba(48, 84, 255, 0.45)",
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
      className={`pill-btn group relative flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border px-4 py-4 sm:gap-2 sm:px-6 sm:py-7 lg:py-8 transition-all
        ${disabled ? "opacity-40" : "hover:scale-[1.02]"}
        ${chosen ? "scale-[1.02]" : ""}
      `}
      style={{
        fontFamily: "var(--font-sans)",
        borderColor: chosen ? c.bg : "rgba(255,255,255,0.1)",
        background: chosen
          ? `radial-gradient(ellipse at 50% 0%, ${c.glow}, transparent 70%), rgba(10,10,15,0.7)`
          : "rgba(10,10,15,0.5)",
        backdropFilter: "blur(8px)",
        ["--glow" as string]: c.glow,
      }}
    >
      {/* Pill graphic */}
      <div className="relative flex h-8 w-16 items-center sm:h-10 sm:w-20">
        <div
          className={`h-8 w-8 rounded-full transition-all sm:h-10 sm:w-10 ${chosen ? "animate-breath" : ""}`}
          style={{ background: c.bg, boxShadow: chosen ? `0 0 30px ${c.glow}` : "none" }}
        />
        <div
          className="h-8 w-8 rounded-full border-2 sm:h-10 sm:w-10"
          style={{ background: c.deep, borderColor: "rgba(0,0,0,0.3)", marginLeft: "-8px" }}
        />
      </div>

      <span
        className="text-base font-semibold tracking-[0.15em] sm:text-lg md:text-xl"
        style={{ color: c.bg }}
      >
        {label}
      </span>

      {/* Status line */}
      <span className="h-5 text-[11px] uppercase tracking-[0.25em] text-white/40">
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
