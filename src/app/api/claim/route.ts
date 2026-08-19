import type { NextRequest } from "next/server";
import { game } from "@/lib/game";
import { getWalletId } from "@/lib/wallet";
import type { ClaimResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const walletId = getWalletId(req);
  const result = game.claim(walletId);
  const snapshot = game.snapshot(walletId);
  const payload: ClaimResponse = {
    ok: result.ok,
    reason: result.reason,
    tokenId: result.tokenId,
    justEarned: result.justEarned,
    snapshot,
  };
  return Response.json(payload);
}
