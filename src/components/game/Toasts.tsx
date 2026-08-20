"use client";

import type { Toast } from "@/hooks/useGame";

interface Props {
  toasts: Toast[];
}

const STYLES: Record<Toast["kind"], { border: string; icon: string }> = {
  pass: { border: "var(--color-gold)", icon: "🎟️" },
  mint: { border: "var(--color-gold)", icon: "✨" },
  lose: { border: "var(--color-dim)", icon: "❌" },
  tie: { border: "var(--color-dim)", icon: "🤝" },
  achievement: { border: "var(--color-gold)", icon: "🏆" },
  info: { border: "var(--color-faint)", icon: "•" },
};

export default function Toasts({ toasts }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => {
        const s = STYLES[t.kind];
        return (
          <div
            key={t.id}
            className="surface flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl animate-rise w-[calc(100vw-2rem)] max-w-[320px] sm:w-auto sm:min-w-[240px]"
            style={{ borderColor: s.border }}
          >
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              {t.body && <div className="mt-0.5 text-xs text-dim">{t.body}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
