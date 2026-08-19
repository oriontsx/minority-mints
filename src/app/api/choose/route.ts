import type { NextRequest } from "next/server";
import { choosePill } from "@/lib/kv-store";
import { getSnapshot } from "@/lib/kv-store";
import { getWalletId } from "@/lib/wallet";
import type { ChooseResponse, Pill } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let pill: string | null = null;
  try {
    const body = await req.json();
    pill = typeof body?.pill === "string" ? body.pill : null;
  } catch {
    return Response.json(
      { ok: false, reason: "invalid" } satisfies Partial<ChooseResponse>,
      { status: 400 },
    );
  }

  if (pill !== "red" && pill !== "blue") {
    return Response.json(
      { ok: false, reason: "invalid" } satisfies Partial<ChooseResponse>,
      { status: 400 },
    );
  }

  const walletId = getWalletId(req);
  const result = await choosePill(walletId, pill as Pill);
  const snapshot = await getSnapshot(walletId);
  const payload: ChooseResponse = {
    ok: result.ok,
    reason: result.reason,
    justEarned: [],
    snapshot,
  };
  return Response.json(payload);
}
