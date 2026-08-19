"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  remainingMs: number;
  totalMs: number;
  phase: "choosing" | "locked" | "revealing";
}

export default function CountdownRing({ remainingMs, totalMs, phase }: Props) {
  // Local high-resolution countdown between server polls.
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

  let stroke = "var(--color-amber)";
  if (phase === "locked") stroke = "var(--color-pill-red)";
  if (phase === "revealing") stroke = "var(--color-gold)";

  return (
    <div className="relative h-[280px] w-[280px] flex items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r={R} stroke="var(--color-faint)" strokeWidth="2" />
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
        {/* tick marks */}
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
              stroke="var(--color-faint)"
              strokeWidth="1"
              opacity={i / 40 < fraction ? 0.8 : 0.2}
            />
          );
        })}
      </svg>
      <div className="relative z-10 text-center">
        <div
          className="font-mono tabular text-6xl font-bold tracking-tight"
          style={{ color: stroke }}
        >
          {seconds}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-dim">
          {phase === "choosing" ? "choose" : phase === "locked" ? "locked" : "reveal"}
        </div>
      </div>
    </div>
  );
}
