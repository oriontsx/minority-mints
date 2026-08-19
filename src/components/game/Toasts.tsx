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
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const s = STYLES[t.kind];
        return (
          <div
            key={t.id}
            className="surface flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl animate-rise min-w-[240px] max-w-[320px]"
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
