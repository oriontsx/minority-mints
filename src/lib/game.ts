import type {
  Pill,
  Phase,
  Leader,
  RoundResult,
  WalletSnapshot,
  WinState,
} from "./types";

// ── Configuration ────────────────────────────────────────────────────────────
export const ROUND_MS = 10_000; // total round length
export const LOCK_AFTER_MS = 7_000; // choices lock with 3s remaining
export const REVEAL_MS = 2_800; // how long the reveal holds before the next round
export const MAX_SUPPLY = 10_000;
export const MAX_PER_WALLET = 10;
export const MINT_PRICE = 0.2;

const CONTRARIAN_MAX_SHARE = 0.2; // win with ≤20% of the round → CONTRARIAN
const CONTRARIAN_MIN_TOTAL = 5;

// ── Wallet record ───────────────────────────────────────────────────────────
interface WalletData {
  id: string;
  mintPasses: number;
  minted: number;
  streak: number;
  lastWinRound: number;
  achievements: Set<string>;
  claimedTokenIds: number[];
}

// ── Game store (in-memory, single-instance) ─────────────────────────────────
class GameStore {
  round = 1;
  roundStart = Date.now();
  phase: Phase = "choosing";
  phaseEndsAt = Date.now() + LOCK_AFTER_MS;

  choices = new Map<string, Pill>();
  lastResult: RoundResult | null = null;

  minted = 0;
  wallets = new Map<string, WalletData>();
  history: RoundResult[] = [];

  // Seed a believable early history so the first visit feels live.
  constructor() {
    const seedWinners: Array<"red" | "blue"> = [
      "red", "blue", "blue", "red", "blue", "red", "red", "blue", "red", "blue",
    ];
    for (let i = 0; i < seedWinners.length; i++) {
      const red = 120 + Math.floor(Math.random() * 160);
      const blue = 80 + Math.floor(Math.random() * 160);
      const redIsMin = red <= blue;
      const winner: "red" | "blue" = redIsMin ? "red" : "blue";
      this.history.push({
        round: 118 + i,
        red: winner === "red" ? Math.min(red, blue) : Math.max(red, blue),
        blue: winner === "blue" ? Math.min(red, blue) : Math.max(red, blue),
        winner,
      });
      void seedWinners[i];
    }
    this.history.reverse();
  }

  private getWallet(id: string): WalletData {
    let w = this.wallets.get(id);
    if (!w) {
      w = {
        id,
        mintPasses: 0,
        minted: 0,
        streak: 0,
        lastWinRound: 0,
        achievements: new Set<string>(),
        claimedTokenIds: [],
      };
      this.wallets.set(id, w);
    }
    return w;
  }

  // Advance phases based on wall-clock time. Called on every access so the
  // engine stays correct even under cold starts and idle gaps.
  resolve() {
    const now = Date.now();
    let guard = 0;
    while (now >= this.phaseEndsAt && guard < 5000) {
      guard++;
      if (this.phase === "choosing") {
        this.phase = "locked";
        this.phaseEndsAt = this.roundStart + ROUND_MS;
      } else if (this.phase === "locked") {
        this.resolveRound();
        this.phase = "revealing";
        this.phaseEndsAt = this.roundStart + ROUND_MS + REVEAL_MS;
      } else {
        // revealing → next round
        this.round += 1;
        this.roundStart = this.phaseEndsAt;
        this.phase = "choosing";
        this.phaseEndsAt = this.roundStart + LOCK_AFTER_MS;
        this.choices.clear();
      }
    }
  }

  private resolveRound() {
    let red = 0;
    let blue = 0;
    for (const pill of this.choices.values()) {
      if (pill === "red") red++;
      else blue++;
    }

    let winner: Pill | "tie";
    if (red === blue) winner = "tie";
    else if (red === 0) winner = "blue"; // zero-side rule: populated side wins
    else if (blue === 0) winner = "red";
    else winner = red < blue ? "red" : "blue";

    const total = red + blue;

    if (winner !== "tie") {
      const winCount = winner === "red" ? red : blue;
      for (const [wid, choice] of this.choices) {
        const w = this.getWallet(wid);
        if (choice === winner) {
          w.mintPasses += 1;
          w.streak = w.lastWinRound === this.round - 1 ? w.streak + 1 : 1;
          w.lastWinRound = this.round;
          this.maybeAwardAchievements(w, winner, winCount, total);
        } else {
          w.streak = 0;
        }
      }
    } else {
      for (const wid of this.choices.keys()) {
        this.getWallet(wid).streak = 0;
      }
    }

    const result: RoundResult = { round: this.round, red, blue, winner };
    this.history.unshift(result);
    if (this.history.length > 60) this.history.pop();
    this.lastResult = result;
  }

  private maybeAwardAchievements(
    w: WalletData,
    winner: Pill,
    winCount: number,
    total: number,
  ) {
    w.achievements.add(winner === "red" ? "red_winner" : "blue_winner");
    if (
      total >= CONTRARIAN_MIN_TOTAL &&
      winCount / total <= CONTRARIAN_MAX_SHARE
    ) {
      w.achievements.add("contrarian");
    }
    if (w.streak >= 3) w.achievements.add("streak");
  }

  choose(wid: string, pill: Pill): {
    ok: boolean;
    reason?: "locked" | "invalid";
    justEarned: string[];
  } {
    this.resolve();
    if (this.phase !== "choosing") {
      return { ok: false, reason: "locked", justEarned: [] };
    }
    this.choices.set(wid, pill);
    return { ok: true, justEarned: [] };
  }

  claim(wid: string): {
    ok: boolean;
    reason?: "no_pass" | "max_wallet" | "sold_out";
    tokenId?: number;
    justEarned: string[];
  } {
    this.resolve();
    const w = this.getWallet(wid);
    if (w.mintPasses < 1) return { ok: false, reason: "no_pass", justEarned: [] };
    if (w.minted >= MAX_PER_WALLET)
      return { ok: false, reason: "max_wallet", justEarned: [] };
    if (this.minted >= MAX_SUPPLY)
      return { ok: false, reason: "sold_out", justEarned: [] };

    w.mintPasses -= 1;
    w.minted += 1;
    this.minted += 1;
    const tokenId = this.minted;
    w.claimedTokenIds.push(tokenId);

    const justEarned: string[] = [];
    if (this.minted >= MAX_SUPPLY) {
      w.achievements.add("last_mint");
      justEarned.push("last_mint");
    }
    return { ok: true, tokenId, justEarned };
  }

  snapshot(wid: string): WalletSnapshot {
    this.resolve();
    const w = this.getWallet(wid);
    const yourChoice = this.choices.get(wid) ?? null;

    let redCount = 0;
    let blueCount = 0;
    for (const pill of this.choices.values()) {
      if (pill === "red") redCount++;
      else blueCount++;
    }

    const showCounts = this.phase !== "choosing";

    let leading: Leader = null;
    if (redCount === 0 && blueCount === 0) leading = null;
    else if (redCount === blueCount) leading = "tied";
    else leading = redCount > blueCount ? "red" : "blue";

    let yourResult: WinState = null;
    if (this.phase === "revealing" && this.lastResult) {
      if (this.lastResult.winner === "tie") yourResult = "tie";
      else if (yourChoice === this.lastResult.winner) yourResult = "won";
      else yourResult = "lost";
    }

    const now = Date.now();
    const remainingMs = Math.max(0, this.phaseEndsAt - now);
    const elapsedMs = now - this.roundStart;

    return {
      round: this.round,
      phase: this.phase,
      remainingMs,
      elapsedMs,
      redCount: showCounts ? redCount : 0,
      blueCount: showCounts ? blueCount : 0,
      showCounts,
      leading,
      lastResult: this.lastResult,
      yourChoice,
      yourResult,
      minted: this.minted,
      remaining: MAX_SUPPLY - this.minted,
      maxSupply: MAX_SUPPLY,
      endgame: this.minted >= MAX_SUPPLY - 100,
      soldOut: this.minted >= MAX_SUPPLY,
      walletId: wid,
      yourMintPasses: w.mintPasses,
      yourMinted: w.minted,
      maxPerWallet: MAX_PER_WALLET,
      claimedTokenIds: w.claimedTokenIds,
      achievements: [...w.achievements],
      recent: this.history.slice(0, 12),
      roundMs: ROUND_MS,
      lockAfterMs: LOCK_AFTER_MS,
      price: MINT_PRICE,
    };
  }
}

// ── Singleton (survives HMR in dev) ──────────────────────────────────────────
const globalForGame = globalThis as unknown as { __gameStore?: GameStore };

export const game: GameStore =
  globalForGame.__gameStore ?? new GameStore();

if (process.env.NODE_ENV !== "production") {
  globalForGame.__gameStore = game;
}
