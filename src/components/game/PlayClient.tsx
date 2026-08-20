"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useGame } from "@/hooks/useGame";
import CountdownRing from "./CountdownRing";
import PillButton from "./PillButton";
import SupplyBar from "./SupplyBar";
import HistoryFeed from "./HistoryFeed";
import Achievements from "./Achievements";
import Toasts from "./Toasts";
import RevealOverlay from "./RevealOverlay";
import Navbar from "@/components/layout/Navbar";
import RidgeBackground from "@/components/landing/RidgeBackground";

export default function PlayClient() {
  const { snapshot, loading, error, toasts, choose, claim } = useGame();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
          <RidgeBackground />
          <div className="relative z-10 text-center">
            <div className="text-sm uppercase tracking-[0.4em] text-white/40 animate-pulse" style={{ fontFamily: "var(--font-sans)" }}>
              Establishing uplink
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error && !snapshot) {
    return (
      <>
        <Navbar />
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6">
          <RidgeBackground />
          <div className="surface relative z-10 max-w-md rounded-2xl p-8 text-center">
            <div className="text-2xl font-semibold text-white">Connection lost</div>
            <p className="mt-2 text-sm text-white/60">{error}</p>
            <p className="mt-4 text-xs text-white/40">The server will retry automatically.</p>
          </div>
        </main>
      </>
    );
  }

  if (!snapshot) return null;

  const choosingDisabled =
    snapshot.phase !== "choosing" || snapshot.yourChoice !== null;
  const redLeading = snapshot.leading === "red";
  const blueLeading = snapshot.leading === "blue";
  const bothTied = snapshot.leading === "tied";

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <RidgeBackground />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* ── Game content ─────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
          {/* Back link */}
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="group absolute left-6 top-20 flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white sm:left-8"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </motion.a>

          {/* Round label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 flex items-baseline gap-3 text-[11px] uppercase tracking-[0.3em] text-white/40"
          >
            <span>Round</span>
            <span className="text-sm text-white" style={{ fontFamily: "var(--font-sans)" }}>
              #{snapshot.round}
            </span>
          </motion.div>

          {/* Game arena */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full"
          >
            <CountdownRing
              remainingMs={snapshot.remainingMs}
              totalMs={snapshot.roundMs}
              phase={snapshot.phase}
            />

            {/* Reveal overlay + pills */}
            <div className="relative mx-auto mt-2 w-full max-w-xl">
              {snapshot.phase === "revealing" && <RevealOverlay snapshot={snapshot} />}

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

              {/* Status line */}
              <div className="mt-4 text-sm text-white/40" style={{ fontFamily: "var(--font-sans)" }}>
                {snapshot.phase === "choosing" && !snapshot.yourChoice && (
                  <span>{bothTied ? "Sides are even" : "Choose your pill"}</span>
                )}
                {snapshot.phase === "choosing" && snapshot.yourChoice && (
                  <span>Locked in. Wait for the countdown.</span>
                )}
                {snapshot.phase === "locked" && (
                  <span className="uppercase tracking-[0.2em] text-[var(--color-pill-red)]">
                    🔒 Choices locked
                  </span>
                )}
                {snapshot.phase === "revealing" && <span>&nbsp;</span>}
              </div>
            </div>
          </motion.div>

          {/* ── CTA buttons ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-6 sm:flex-row"
          >
            <button
              type="button"
              disabled={snapshot.yourMintPasses < 1 || snapshot.yourMinted >= snapshot.maxPerWallet}
              onClick={claim}
              className="group flex items-center rounded-full bg-white pl-6 pr-2 py-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-40 disabled:hover:scale-100"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span className="text-lg font-medium" style={{ color: "#0a0400" }}>
                {snapshot.yourMintPasses > 0
                  ? "Mint Your NFT"
                  : snapshot.yourMinted >= snapshot.maxPerWallet
                    ? "Wallet Full"
                    : "Win to Mint"}
              </span>
              <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3054ff] transition-colors group-hover:bg-[#2040e0]">
                <ArrowRight className="h-5 w-5 text-white" />
              </span>
            </button>
          </motion.div>

          {/* ── Game info panels ──────────────────────────────────── */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface rounded-2xl p-4">
              <SupplyBar
                minted={snapshot.minted}
                max={snapshot.maxSupply}
                endgame={snapshot.endgame}
                soldOut={snapshot.soldOut}
              />
            </div>
            <div className="surface rounded-2xl p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
                Your wallet
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Passes</div>
                  <div className="mt-1 text-2xl tabular" style={{ color: "var(--color-gold)" }}>
                    {snapshot.yourMintPasses}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Minted</div>
                  <div className="mt-1 text-2xl tabular">
                    {snapshot.yourMinted}<span className="text-base text-white/40">/{snapshot.maxPerWallet}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="surface rounded-2xl p-4">
              <HistoryFeed recent={snapshot.recent} />
            </div>
            <div className="surface rounded-2xl p-4">
              <Achievements achievements={snapshot.achievements} />
            </div>
          </div>

          {/* Endgame banner */}
          {snapshot.endgame && !snapshot.soldOut && (
            <div
              className="mt-6 rounded-xl border px-6 py-2 text-center text-sm font-semibold uppercase tracking-[0.2em] animate-pulse"
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
              className="mt-6 rounded-xl border px-6 py-2 text-center text-sm font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
            >
              🏆 Collection complete · 10,000 / 10,000 minted
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
            Every 10 seconds · one choice · the smaller side wins
          </div>
        </div>

        <Toasts toasts={toasts} />
      </main>
    </>
  );
}
