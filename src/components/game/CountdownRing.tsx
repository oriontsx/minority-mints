"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  remainingMs: number;
  totalMs: number;
  phase: "choosing" | "locked" | "revealing";
}

export default function CountdownRing({ remainingMs, totalMs, phase }: Props) {
  const [local, setLocal] = useState(remainingMs);
  const lastServerRef = useRef(remainingMs);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    lastServerRef.current = remainingMs;
    lastTickRef.current = Date.now();
    setLocal(remainingMs);
  }, [remainingMs]);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      setLocal((prev) => Math.max(0, prev - dt));
    }, 50);
    return () => clearInterval(id);
  }, []);

  const displayMs = local;
  const seconds = (displayMs / 1000).toFixed(1);
  const fraction = Math.max(0, Math.min(1, displayMs / totalMs));

  const R = 120;
  const C = 2 * Math.PI * R;
  const dash = C * fraction;

  let stroke = "#ffb020";
  if (phase === "locked") stroke = "#ff2d55";
  if (phase === "revealing") stroke = "#ffd700";

  return (
    <div className="relative flex items-center justify-center" style={{ width: "min(280px, 72vw)", height: "min(280px, 72vw)" }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 280 280" fill="none">
        <circle cx="140" cy="140" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle
          cx="140"
          cy="140"
          r={R}
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          style={{ transition: "stroke-dasharray 0.1s linear, stroke 0.3s" }}
        />
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 40) * Math.PI * 2;
          const x1 = 140 + Math.cos(a) * 134;
          const y1 = 140 + Math.sin(a) * 134;
          const x2 = 140 + Math.cos(a) * 138;
          const y2 = 140 + Math.sin(a) * 138;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              opacity={i / 40 < fraction ? 0.8 : 0.2}
            />
          );
        })}
      </svg>
      <div className="relative z-10 text-center">
        <div
          className="font-bold tabular tracking-tight"
          style={{ color: stroke, fontFamily: "var(--font-sans)", fontSize: "clamp(2.5rem, 9vw, 3.75rem)" }}
        >
          {seconds}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
          {phase === "choosing" ? "choose" : phase === "locked" ? "locked" : "reveal"}
        </div>
      </div>
    </div>
  );
}
