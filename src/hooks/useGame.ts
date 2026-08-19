"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WalletSnapshot } from "@/lib/types";

export type ToastKind = "pass" | "mint" | "lose" | "tie" | "achievement" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  body?: string;
}

let toastSeq = 1;

export function useGame() {
  const [snapshot, setSnapshot] = useState<WalletSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [choosing, setChoosing] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const prevRef = useRef<WalletSnapshot | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = toastSeq++;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) throw new Error(`state ${res.status}`);
      const data = await res.json();
      setSnapshot(data.snapshot);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "connection lost");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Polling: fast during play, slower when idle
  useEffect(() => {
    if (!snapshot) return;
    const interval = snapshot.phase === "revealing" ? 600 : 1800;
    pollRef.current = setTimeout(() => {
      fetchState();
    }, interval);
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [snapshot, fetchState]);

  // Diff previous snapshot to fire toasts
  useEffect(() => {
    if (!snapshot) return;
    const prev = prevRef.current;
    prevRef.current = snapshot;

    if (!prev) return;

    // Your result at reveal
    if (
      prev.phase !== "revealing" &&
      snapshot.phase === "revealing" &&
      snapshot.yourResult
    ) {
      if (snapshot.yourResult === "won") {
        pushToast({
          kind: "pass",
          title: "Mint pass earned",
          body: "You chose the minority. Claim your NFT.",
        });
      } else if (snapshot.yourResult === "lost") {
        pushToast({
          kind: "lose",
          title: "You chose the crowd",
          body: "Wait for the next round.",
        });
      } else if (snapshot.yourResult === "tie") {
        pushToast({ kind: "tie", title: "Perfect tie — no winner" });
      }
    }

    // Supply milestones
    const milestones = [9900, 9950, 9975, 9990, 9995, 9999, 10000];
    for (const m of milestones) {
      if (prev.minted < m && snapshot.minted >= m) {
        if (m === 10000) {
          pushToast({ kind: "info", title: "SOLD OUT", body: "The collection is complete." });
        } else {
          pushToast({ kind: "info", title: `ENDGAME — ${10000 - m} left` });
        }
      }
    }
  }, [snapshot, pushToast]);

  const choose = useCallback(
    async (pill: "red" | "blue") => {
      if (choosing) return;
      setChoosing(true);
      try {
        const res = await fetch("/api/choose", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ pill }),
        });
        const data = await res.json();
        if (data.snapshot) setSnapshot(data.snapshot);
        if (!data.ok && data.reason === "locked") {
          pushToast({ kind: "info", title: "Choices are locked", body: "Wait for the reveal." });
        }
      } catch {
        pushToast({ kind: "info", title: "Connection hiccup", body: "Try again." });
      } finally {
        setChoosing(false);
      }
    },
    [choosing, pushToast],
  );

  const claim = useCallback(async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/claim", { method: "POST" });
      const data = await res.json();
      if (data.snapshot) setSnapshot(data.snapshot);
      if (data.ok && data.tokenId) {
        pushToast({
          kind: "mint",
          title: `NFT #${data.tokenId} minted`,
          body: "Added to your wallet.",
        });
        for (const a of data.justEarned || []) {
          if (a === "last_mint") {
            pushToast({
              kind: "achievement",
              title: "🏆 THE LAST MINT",
              body: "You claimed the final NFT.",
            });
          }
        }
      } else if (data.reason === "no_pass") {
        pushToast({ kind: "info", title: "No mint pass", body: "Win a round first." });
      } else if (data.reason === "max_wallet") {
        pushToast({ kind: "info", title: "Wallet full", body: "10 / 10 minted." });
      } else if (data.reason === "sold_out") {
        pushToast({ kind: "info", title: "Sold out" });
      }
    } catch {
      pushToast({ kind: "info", title: "Mint failed", body: "Try again." });
    } finally {
      setClaiming(false);
    }
  }, [claiming, pushToast]);

  return { snapshot, loading, error, toasts, choose, claim, refresh: fetchState };
}
