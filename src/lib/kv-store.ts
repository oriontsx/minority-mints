import { kv } from "@vercel/kv";
import type {
  Pill,
  Phase,
  Leader,
  RoundResult,
  WalletSnapshot,
  WinState,
} from "./types";

// ── Configuration ────────────────────────────────────────────────────────────
const ROUND_MS = 10_000;
const LOCK_AFTER_MS = 7_000;
const REVEAL_MS = 2_800;
const MAX_SUPPLY = 10_000;
const MAX_PER_WALLET = 10;
const MINT_PRICE = 0.2;

const CONTRARIAN_MAX_SHARE = 0.2;
const CONTRARIAN_MIN_TOTAL = 5;

// ── Detect if KV is configured ────────────────────────────────────────────────
const KV_CONFIGURED =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

const KEYS = {
  round: "game:round",
  roundStart: "game:roundStart",
  phase: "game:phase",
  phaseEndsAt: "game:phaseEndsAt",
  minted: "game:minted",
  lastResult: "game:lastResult",
  history: "game:history",
  choices: (round: number) => `round:${round}:choices`,
  wallet: (id: string) => `wallet:${id}`,
};

interface WalletData {
  id: string;
  mintPasses: number;
  minted: number;
  streak: number;
  lastWinRound: number;
  achievements: string[];
  claimedTokenIds: number[];
}

const EMPTY_WALLET: WalletData = {
  id: "",
  mintPasses: 0,
  minted: 0,
  streak: 0,
  lastWinRound: 0,
  achievements: [],
  claimedTokenIds: [],
};

interface GameState {
  round: number;
  roundStart: number;
  phase: Phase;
  phaseEndsAt: number;
  minted: number;
  lastResult: RoundResult | null;
  history: RoundResult[];
}

// ── In-memory fallback (single instance) ─────────────────────────────────────
const mem: {
  state: GameState;
  choices: Map<string, Map<string, Pill>>;
  wallets: Map<string, WalletData>;
} = {
  state: {
    round: 1,
    roundStart: Date.now(),
    phase: "choosing",
    phaseEndsAt: Date.now() + LOCK_AFTER_MS,
    minted: 0,
    lastResult: null,
    history: [],
  },
  choices: new Map(),
  wallets: new Map(),
};

function memGetWallet(id: string): WalletData {
  let w = mem.wallets.get(id);
  if (!w) {
    w = { ...EMPTY_WALLET, id };
    mem.wallets.set(id, w);
  }
  return w;
}

function memResolve(): GameState {
  const s = mem.state;
  let guard = 0;
  while (Date.now() >= s.phaseEndsAt && guard < 5000) {
    guard++;
    if (s.phase === "choosing") {
      s.phase = "locked";
      s.phaseEndsAt = s.roundStart + ROUND_MS;
    } else if (s.phase === "locked") {
      const choices = mem.choices.get(`r${s.round}`) ?? new Map<string, Pill>();
      let red = 0, blue = 0;
      for (const pill of choices.values()) {
        if (pill === "red") red++;
        else blue++;
      }
      let winner: Pill | "tie";
      if (red === blue) winner = "tie";
      else if (red === 0) winner = "blue";
      else if (blue === 0) winner = "red";
      else winner = red < blue ? "red" : "blue";
      const total = red + blue;
      if (winner !== "tie") {
        const winCount = winner === "red" ? red : blue;
        for (const [wid, choice] of choices) {
          const w = memGetWallet(wid);
          if (choice === winner) {
            w.mintPasses++;
            w.streak = w.lastWinRound === s.round - 1 ? w.streak + 1 : 1;
            w.lastWinRound = s.round;
            if (!w.achievements.includes(winner === "red" ? "red_winner" : "blue_winner"))
              w.achievements.push(winner === "red" ? "red_winner" : "blue_winner");
            if (total >= CONTRARIAN_MIN_TOTAL && winCount / total <= CONTRARIAN_MAX_SHARE && !w.achievements.includes("contrarian"))
              w.achievements.push("contrarian");
            if (w.streak >= 3 && !w.achievements.includes("streak"))
              w.achievements.push("streak");
          } else {
            w.streak = 0;
          }
        }
      } else {
        for (const wid of choices.keys()) memGetWallet(wid).streak = 0;
      }
      s.lastResult = { round: s.round, red, blue, winner };
      s.history = [s.lastResult, ...s.history].slice(0, 60);
    } else {
      s.round++;
      s.roundStart = s.phaseEndsAt;
      s.phase = "choosing";
      s.phaseEndsAt = s.roundStart + LOCK_AFTER_MS;
      mem.choices.clear();
    }
  }
  return s;
}

// ── KV-backed helpers ────────────────────────────────────────────────────────
async function kvGetState(): Promise<GameState> {
  const [round, roundStart, phase, phaseEndsAt, minted, lastResult, history] =
    await Promise.all([
      kv.get<number>(KEYS.round),
      kv.get<number>(KEYS.roundStart),
      kv.get<Phase>(KEYS.phase),
      kv.get<number>(KEYS.phaseEndsAt),
      kv.get<number>(KEYS.minted),
      kv.get<RoundResult>(KEYS.lastResult),
      kv.get<RoundResult[]>(KEYS.history),
    ]);
  return {
    round: round ?? 1,
    roundStart: roundStart ?? Date.now(),
    phase: (phase ?? "choosing") as Phase,
    phaseEndsAt: phaseEndsAt ?? Date.now() + LOCK_AFTER_MS,
    minted: minted ?? 0,
    lastResult: lastResult ?? null,
    history: history ?? [],
  };
}

async function kvGetWallet(id: string): Promise<WalletData> {
  const w = await kv.get<WalletData>(KEYS.wallet(id));
  return w ?? { ...EMPTY_WALLET, id };
}

async function kvResolve(): Promise<GameState> {
  let s = await kvGetState();

  // Seed if uninitialized
  if ((await kv.get(KEYS.round)) === null) {
    const now = Date.now();
    await Promise.all([
      kv.set(KEYS.round, 1),
      kv.set(KEYS.roundStart, now),
      kv.set(KEYS.phase, "choosing"),
      kv.set(KEYS.phaseEndsAt, now + LOCK_AFTER_MS),
      kv.set(KEYS.minted, 0),
      kv.set(KEYS.history, []),
    ]);
    s = {
      round: 1, roundStart: now, phase: "choosing",
      phaseEndsAt: now + LOCK_AFTER_MS, minted: 0, lastResult: null, history: [],
    };
  }

  let guard = 0;
  while (Date.now() >= s.phaseEndsAt && guard < 5000) {
    guard++;
    if (s.phase === "choosing") {
      s.phase = "locked";
      s.phaseEndsAt = s.roundStart + ROUND_MS;
      await kv.set(KEYS.phase, "locked");
      await kv.set(KEYS.phaseEndsAt, s.phaseEndsAt);
    } else if (s.phase === "locked") {
      // Resolve the round
      const choicesMap = await kv.hgetall<Record<string, string>>(KEYS.choices(s.round));
      const choices = choicesMap ?? {};
      let red = 0, blue = 0;
      for (const pill of Object.values(choices)) {
        if (pill === "red") red++; else blue++;
      }
      let winner: Pill | "tie";
      if (red === blue) winner = "tie";
      else if (red === 0) winner = "blue";
      else if (blue === 0) winner = "red";
      else winner = red < blue ? "red" : "blue";
      const total = red + blue;

      if (winner !== "tie") {
        const winCount = winner === "red" ? red : blue;
        for (const [wid, choice] of Object.entries(choices)) {
          const w = await kvGetWallet(wid);
          if (choice === winner) {
            w.mintPasses++;
            w.streak = w.lastWinRound === s.round - 1 ? w.streak + 1 : 1;
            w.lastWinRound = s.round;
            const ach = winner === "red" ? "red_winner" : "blue_winner";
            if (!w.achievements.includes(ach)) w.achievements.push(ach);
            if (total >= CONTRARIAN_MIN_TOTAL && winCount / total <= CONTRARIAN_MAX_SHARE && !w.achievements.includes("contrarian"))
              w.achievements.push("contrarian");
            if (w.streak >= 3 && !w.achievements.includes("streak"))
              w.achievements.push("streak");
          } else {
            w.streak = 0;
          }
          await kv.set(KEYS.wallet(wid), w);
        }
      } else {
        for (const wid of Object.keys(choices)) {
          const w = await kvGetWallet(wid);
          w.streak = 0;
          await kv.set(KEYS.wallet(wid), w);
        }
      }

      const result: RoundResult = { round: s.round, red, blue, winner };
      s.lastResult = result;
      s.phase = "revealing";
      s.phaseEndsAt = s.roundStart + ROUND_MS + REVEAL_MS;
      const newHist = [result, ...s.history].slice(0, 60);
      s.history = newHist;
      await kv.set(KEYS.phase, "revealing");
      await kv.set(KEYS.phaseEndsAt, s.phaseEndsAt);
      await kv.set(KEYS.lastResult, result);
      await kv.set(KEYS.history, newHist);
    } else {
      // revealing → next round
      await kv.del(KEYS.choices(s.round));
      s.round++;
      s.roundStart = s.phaseEndsAt;
      s.phase = "choosing";
      s.phaseEndsAt = s.roundStart + LOCK_AFTER_MS;
      await kv.set(KEYS.round, s.round);
      await kv.set(KEYS.roundStart, s.roundStart);
      await kv.set(KEYS.phase, "choosing");
      await kv.set(KEYS.phaseEndsAt, s.phaseEndsAt);
    }
  }
  return s;
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function choosePill(
  wid: string,
  pill: Pill,
): Promise<{ ok: boolean; reason?: "locked" | "invalid" }> {
  if (!KV_CONFIGURED) {
    const s = memResolve();
    if (s.phase !== "choosing") return { ok: false, reason: "locked" };
    let choices = mem.choices.get(`r${s.round}`);
    if (!choices) { choices = new Map(); mem.choices.set(`r${s.round}`, choices); }
    choices.set(wid, pill);
    return { ok: true };
  }

  const s = await kvResolve();
  if (s.phase !== "choosing") return { ok: false, reason: "locked" };
  await kv.hset(KEYS.choices(s.round), { [wid]: pill });
  return { ok: true };
}

export async function claimMint(
  wid: string,
): Promise<{
  ok: boolean;
  reason?: "no_pass" | "max_wallet" | "sold_out";
  tokenId?: number;
}> {
  if (!KV_CONFIGURED) {
    memResolve();
    const w = memGetWallet(wid);
    if (w.mintPasses < 1) return { ok: false, reason: "no_pass" };
    if (w.minted >= MAX_PER_WALLET) return { ok: false, reason: "max_wallet" };
    if (mem.state.minted >= MAX_SUPPLY) return { ok: false, reason: "sold_out" };
    mem.state.minted++;
    const tokenId = mem.state.minted;
    w.mintPasses--;
    w.minted++;
    w.claimedTokenIds.push(tokenId);
    if (tokenId >= MAX_SUPPLY && !w.achievements.includes("last_mint"))
      w.achievements.push("last_mint");
    return { ok: true, tokenId };
  }

  await kvResolve();
  const w = await kvGetWallet(wid);
  if (w.mintPasses < 1) return { ok: false, reason: "no_pass" };
  if (w.minted >= MAX_PER_WALLET) return { ok: false, reason: "max_wallet" };
  const currentMinted = (await kv.get<number>(KEYS.minted)) ?? 0;
  if (currentMinted >= MAX_SUPPLY) return { ok: false, reason: "sold_out" };

  const tokenId = await kv.incr(KEYS.minted);
  if (tokenId > MAX_SUPPLY) {
    await kv.decr(KEYS.minted);
    return { ok: false, reason: "sold_out" };
  }

  w.mintPasses--;
  w.minted++;
  w.claimedTokenIds.push(tokenId);
  if (tokenId >= MAX_SUPPLY && !w.achievements.includes("last_mint"))
    w.achievements.push("last_mint");
  await kv.set(KEYS.wallet(wid), w);
  return { ok: true, tokenId };
}

export async function getSnapshot(wid: string): Promise<WalletSnapshot> {
  let s: GameState;
  let w: WalletData;
  let yourChoice: Pill | null;
  let choices: Record<string, string>;

  if (!KV_CONFIGURED) {
    s = memResolve();
    w = memGetWallet(wid);
    const roundChoices = mem.choices.get(`r${s.round}`) ?? new Map<string, Pill>();
    yourChoice = roundChoices.get(wid) ?? null;
    choices = {};
    for (const [k, v] of roundChoices) choices[k] = v;
  } else {
    s = await kvResolve();
    w = await kvGetWallet(wid);
    const choicesMap = await kv.hgetall<Record<string, string>>(KEYS.choices(s.round));
    choices = choicesMap ?? {};
    yourChoice = (choices[wid] as Pill) ?? null;
  }

  let redCount = 0, blueCount = 0;
  for (const pill of Object.values(choices)) {
    if (pill === "red") redCount++; else blueCount++;
  }

  const showCounts = s.phase !== "choosing";
  let leading: Leader = null;
  if (redCount === 0 && blueCount === 0) leading = null;
  else if (redCount === blueCount) leading = "tied";
  else leading = redCount > blueCount ? "red" : "blue";

  let yourResult: WinState = null;
  if (s.phase === "revealing" && s.lastResult) {
    if (s.lastResult.winner === "tie") yourResult = "tie";
    else if (yourChoice === s.lastResult.winner) yourResult = "won";
    else yourResult = "lost";
  }

  const now = Date.now();
  return {
    round: s.round,
    phase: s.phase,
    remainingMs: Math.max(0, s.phaseEndsAt - now),
    elapsedMs: now - s.roundStart,
    redCount: showCounts ? redCount : 0,
    blueCount: showCounts ? blueCount : 0,
    showCounts,
    leading,
    lastResult: s.lastResult,
    yourChoice,
    yourResult,
    minted: s.minted,
    remaining: MAX_SUPPLY - s.minted,
    maxSupply: MAX_SUPPLY,
    endgame: s.minted >= MAX_SUPPLY - 100,
    soldOut: s.minted >= MAX_SUPPLY,
    walletId: wid,
    yourMintPasses: w.mintPasses,
    yourMinted: w.minted,
    maxPerWallet: MAX_PER_WALLET,
    claimedTokenIds: w.claimedTokenIds,
    achievements: w.achievements,
    recent: s.history.slice(0, 12),
    roundMs: ROUND_MS,
    lockAfterMs: LOCK_AFTER_MS,
    price: MINT_PRICE,
  };
}
