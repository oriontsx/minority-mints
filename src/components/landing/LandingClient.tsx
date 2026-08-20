"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import RidgeBackground from "./RidgeBackground";

export default function LandingClient() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <RidgeBackground />

        {/* Vignette overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* ── Centered intro + connect card ──────────────────────── */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Small logo mark */}
            <div className="mb-6 flex justify-center sm:mb-8">
              <div className="flex">
                <div className="h-6 w-6 rounded-full shadow-[0_0_24px_rgba(255,45,85,0.5)]" style={{ background: "#ff2d55" }} />
                <div className="-ml-2 h-6 w-6 rounded-full shadow-[0_0_24px_rgba(48,84,255,0.5)]" style={{ background: "#3054ff" }} />
              </div>
            </div>

            {/* Short intro */}
            <h1
              className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The Minority Mints
            </h1>
            <p
              className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60 sm:mt-4 sm:text-base"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              10,000 NFTs. $0.20 each. Every 10 seconds, choose Red or Blue.
              The side with fewer people gets to mint.
            </p>

            {/* Connect Wallet card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="surface mt-8 rounded-3xl p-5 text-left sm:mt-10 sm:p-6"
            >
              <div className="mb-1 text-[11px] uppercase tracking-[0.3em] text-white/40">
                Connect to play
              </div>
              <div className="mb-5 text-sm text-white/50">
                You need a wallet to join rounds and mint.
              </div>

              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-full bg-white px-5 py-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] sm:px-6"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span className="text-sm font-semibold sm:text-base" style={{ color: "#0a0400" }}>
                  Connect Wallet
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3054ff] transition-colors group-hover:bg-[#2040e0]">
                  <ArrowRight className="h-4 w-4 text-white" />
                </span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/40">
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>No wallet? Watch a round first</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
              </div>
            </motion.div>

            {/* Watch a round link */}
            <motion.a
              href="/play"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Enter a round
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </main>
    </>
  );
}
