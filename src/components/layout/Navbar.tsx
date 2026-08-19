"use client";

import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-transparent px-6 py-4">
      {/* Left: Sunburst logo */}
      <a href="/" className="flex items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 12 + Math.cos(angle) * 4;
            const y1 = 12 + Math.sin(angle) * 4;
            const x2 = 12 + Math.cos(angle) * 11;
            const y2 = 12 + Math.sin(angle) * 11;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </a>
      {/* Center: Nav links */}
      <div className="hidden items-center gap-8 md:flex" style={{ fontFamily: "var(--font-sans)" }}>
        <a href="#" className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white">
          Products <ChevronDown className="h-4 w-4" />
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          Customer Stories
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          Resources
        </a>
        <a href="#" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
          Pricing
        </a>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <a href="#" className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:block">
          Book A Demo
        </a>
        <a
          href="#"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
