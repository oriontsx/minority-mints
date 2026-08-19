import type { NextRequest } from "next/server";
import { getSnapshot } from "@/lib/kv-store";
import { newWalletId } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const existing = req.cookies.get("mm_wallet")?.value;
  const walletId =
    existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing) ? existing : newWalletId();

  const snapshot = await getSnapshot(walletId);
  const body = JSON.stringify({ snapshot });
  const headers = new Headers({ "content-type": "application/json" });
  if (!existing) {
    headers.append(
      "Set-Cookie",
      `mm_wallet=${walletId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
    );
  }
  return new Response(body, { headers });
}
