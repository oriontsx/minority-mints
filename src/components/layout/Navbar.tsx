"use client";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-4 py-3 sm:px-6 sm:py-4">
      {/* Left: Pills logo */}
      <a href="/" className="flex shrink-0 items-center gap-2">
        <div className="flex">
          <div className="h-4 w-4 rounded-full" style={{ background: "#ff2d55" }} />
          <div className="-ml-1.5 h-4 w-4 rounded-full" style={{ background: "#3054ff" }} />
        </div>
        <span className="text-sm font-bold tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-sans)" }}>
          PILLS
        </span>
      </a>
      {/* Center: Nav links (desktop only) */}
      <div className="hidden items-center gap-6 lg:flex xl:gap-8" style={{ fontFamily: "var(--font-sans)" }}>
        <a href="/play#how-it-works" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          How It Works
        </a>
        <a href="/play#history" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          History
        </a>
        <a href="/play#achievements" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          Achievements
        </a>
        <a href="/play#supply" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          10,000 Supply
        </a>
      </div>
      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <a
          href="/play"
          className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:block lg:hidden"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Connect Wallet
        </a>
        <a
          href="/play"
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] sm:px-5 sm:py-2.5 sm:text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Enter
        </a>
      </div>
    </nav>
  );
}
