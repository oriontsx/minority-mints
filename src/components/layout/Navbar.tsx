"use client";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-6 py-4">
      {/* Left: Pills logo */}
      <a href="/" className="flex items-center gap-2.5">
        <div className="flex">
          <div className="h-4 w-4 rounded-full" style={{ background: "#ff2d55" }} />
          <div className="-ml-1.5 h-4 w-4 rounded-full" style={{ background: "#3054ff" }} />
        </div>
        <span className="text-sm font-bold tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-sans)" }}>
          PILLS
        </span>
      </a>
      {/* Center: Nav links */}
      <div className="hidden items-center gap-8 md:flex" style={{ fontFamily: "var(--font-sans)" }}>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          How It Works
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          History
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          Achievements
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          10,000 Supply
        </a>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <a href="#" className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:block" style={{ fontFamily: "var(--font-sans)" }}>
          Connect Wallet
        </a>
        <a
          href="#"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Enter
        </a>
      </div>
    </nav>
  );
}
