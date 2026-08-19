import type { NextRequest } from "next/server";
import { claimMint, getSnapshot } from "@/lib/kv-store";
import { getWalletId } from "@/lib/wallet";
import type { ClaimResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const walletId = getWalletId(req);
  const result = await claimMint(walletId);
  const snapshot = await getSnapshot(walletId);
  const payload: ClaimResponse = {
    ok: result.ok,
    reason: result.reason,
    tokenId: result.tokenId,
    justEarned: [],
    snapshot,
  };
  return Response.json(payload);
}
