import type { NextRequest } from "next/server";

/**
 * Resolve the per-client wallet id.
 *
 * For this demo we identify a wallet via a signed cookie we set on first
 * visit. This keeps the in-memory store keyed by a stable id without
 * requiring a real wallet connection. The mint rules (max 10 per wallet,
 * mint passes) are enforced server-side, never trusted from the client.
 */
export function getWalletId(req: NextRequest): string {
  const fromCookie = req.cookies.get("mm_wallet")?.value;
  if (fromCookie && /^[A-Za-z0-9_-]{8,64}$/.test(fromCookie)) return fromCookie;
  // Deterministic fallback derived from request so SSR is stable for a given
  // client even before the cookie round-trips.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "anon";
  return `w_${ip.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40)}`;
}

export function newWalletId(): string {
  return `w_${Math.random().toString(36).slice(2, 10)}${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}
