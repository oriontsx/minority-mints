export type Pill = "red" | "blue";

export type Phase = "choosing" | "locked" | "revealing";

export type WinState = "won" | "lost" | "tie" | null;

export type Leader = "red" | "blue" | "tied" | null;

export interface RoundResult {
  round: number;
  red: number;
  blue: number;
  winner: Pill | "tie";
}

export interface WalletSnapshot {
  round: number;
  phase: Phase;
  remainingMs: number;
  elapsedMs: number;
  // During "choosing" counts are secret — only `leading` is exposed.
  // During "locked"/"revealing" exact counts are revealed.
  redCount: number;
  blueCount: number;
  showCounts: boolean;
  leading: Leader;
  // The just-resolved round, visible during the "revealing" phase.
  lastResult: RoundResult | null;
  yourChoice: Pill | null;
  yourResult: WinState;
  // Supply
  minted: number;
  remaining: number;
  maxSupply: number;
  endgame: boolean;
  soldOut: boolean;
  // This wallet
  walletId: string;
  yourMintPasses: number;
  yourMinted: number;
  maxPerWallet: number;
  claimedTokenIds: number[];
  achievements: string[];
  // History (most recent first)
  recent: RoundResult[];
  // Static config echoed for the client
  roundMs: number;
  lockAfterMs: number;
  price: number;
}

export interface ChooseResponse {
  ok: boolean;
  reason?: "locked" | "invalid";
  snapshot: WalletSnapshot;
  justEarned: string[];
}

export interface ClaimResponse {
  ok: boolean;
  reason?: "no_pass" | "max_wallet" | "sold_out";
  tokenId?: number;
  justEarned: string[];
  snapshot: WalletSnapshot;
}
