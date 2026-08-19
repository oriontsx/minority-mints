"use client";

import { useGame } from "@/hooks/useGame";
import CountdownRing from "./CountdownRing";
import PillButton from "./PillButton";
import SupplyBar from "./SupplyBar";
import HistoryFeed from "./HistoryFeed";
import Achievements from "./Achievements";
import WalletPanel from "./WalletPanel";
import Toasts from "./Toasts";
import RevealOverlay from "./RevealOverlay";

export default function GameClient() {
  const { snapshot, loading, error, toasts, choose, claim } = useGame();

  if (loading) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-sm uppercase tracking-[0.4em] text-dim animate-pulse">
            Establishing uplink
          </div>
        </div>
      </main>
    );
  }

  if (error && !snapshot) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="surface max-w-md rounded-xl p-8 text-center">
          <div className="text-2xl font-bold">Connection lost</div>
          <p className="mt-2 text-sm text-dim">{error}</p>
          <p className="mt-4 text-xs text-dim">The server will retry automatically.</p>
        </div>
      </main>
    );
  }

  if (!snapshot) return null;

  const choosingDisabled =
    snapshot.phase !== "choosing" || snapshot.yourChoice !== null;
  const redLeading = snapshot.leading === "red";
  const blueLeading = snapshot.leading === "blue";
  const bothTied = snapshot.leading === "tied";

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-faint pb-4">
        <div className="flex items-center gap-2">
          <div className="flex">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-pill-red)" }} />
            <div className="h-3 w-3 rounded-full -ml-1" style={{ background: "var(--color-pill-blue)" }} />
          </div>
          <span className="text-sm font-bold tracking-[0.2em]">MINORITY MINTS</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-dim">
          <span className="hidden sm:inline">{snapshot.price === 0.2 ? "$0.20" : `$${snapshot.price}`} · 10 max</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--color-pill-red)" }} />
            LIVE
          </span>
        </div>
      </header>

      {/* ── Endgame banner ─────────────────────────────────────── */}
      {snapshot.endgame && !snapshot.soldOut && (
        <div
          className="mt-4 flex items-center justify-center gap-3 rounded-xl border py-2 text-center text-sm font-semibold uppercase tracking-[0.2em] animate-pulse"
          style={{
            borderColor: "var(--color-amber)",
            color: "var(--color-amber)",
            background: "rgba(255, 176, 32, 0.06)",
          }}
        >
          ⚠ Endgame · {snapshot.remaining.toLocaleString()} remaining
        </div>
      )}
      {snapshot.soldOut && (
        <div
          className="mt-4 flex items-center justify-center gap-3 rounded-xl border py-2 text-center text-sm font-bold uppercase tracking-[0.2em]"
          style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
        >
          🏆 Collection complete · 10,000 / 10,000 minted
        </div>
      )}

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="grid flex-1 grid-cols-1 gap-6 py-6 lg:grid-cols-[1fr_320px]">
        {/* Center stage */}
        <section className="relative flex flex-col items-center justify-center">
          {/* Round + timer */}
          <div className="mb-2 flex items-baseline gap-3 text-[11px] uppercase tracking-[0.3em] text-dim">
            <span>Round</span>
            <span className="font-mono text-sm text-ink">#{snapshot.round}</span>
          </div>

          <CountdownRing
            remainingMs={snapshot.remainingMs}
            totalMs={snapshot.roundMs}
            phase={snapshot.phase}
          />

          {/* Reveal overlay sits over the pill area */}
          <div className="relative mt-2 w-full max-w-xl">
            {snapshot.phase === "revealing" && (
              <RevealOverlay snapshot={snapshot} />
            )}

            {/* Pills */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <PillButton
                pill="red"
                chosen={snapshot.yourChoice === "red"}
                disabled={choosingDisabled}
                leading={redLeading}
                trailing={blueLeading}
                count={snapshot.showCounts ? snapshot.redCount : null}
                onChoose={choose}
              />
              <PillButton
                pill="blue"
                chosen={snapshot.yourChoice === "blue"}
                disabled={choosingDisabled}
                leading={blueLeading}
                trailing={redLeading}
                count={snapshot.showCounts ? snapshot.blueCount : null}
                onChoose={choose}
              />
            </div>

            {/* Status line under pills */}
            <div className="mt-4 text-center text-sm text-dim">
              {snapshot.phase === "choosing" && !snapshot.yourChoice && (
                <span>
                  {bothTied ? "Sides are even" : "Choose your pill"}
                </span>
              )}
              {snapshot.phase === "choosing" && snapshot.yourChoice && (
                <span>Locked in. Wait for the countdown.</span>
              )}
              {snapshot.phase === "locked" && (
                <span className="uppercase tracking-[0.2em]" style={{ color: "var(--color-pill-red)" }}>
                  🔒 Choices locked
                </span>
              )}
              {snapshot.phase === "revealing" && <span>&nbsp;</span>}
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-8 text-center text-xs uppercase tracking-[0.4em] text-dim">
            The minority mints
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <SupplyBar
            minted={snapshot.minted}
            max={snapshot.maxSupply}
            endgame={snapshot.endgame}
            soldOut={snapshot.soldOut}
          />
          <WalletPanel
            mintPasses={snapshot.yourMintPasses}
            minted={snapshot.yourMinted}
            maxPerWallet={snapshot.maxPerWallet}
            price={snapshot.price}
            claiming={false}
            onClaim={claim}
          />
          <HistoryFeed recent={snapshot.recent} />
          <Achievements achievements={snapshot.achievements} />
        </aside>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-faint pt-4 text-center text-[10px] uppercase tracking-[0.3em] text-dim">
        Every 10 seconds · one choice · the smaller side wins
      </footer>

      <Toasts toasts={toasts} />
    </main>
  );
}
