# Pills — The Minority Mints

> 10,000 NFTs. $0.20 each. 10-second rounds. The minority mints.

A live, interactive mint where the crowd determines who gets to mint. Instead of racing to click a mint button, every participant must make a decision every 10 seconds:

> **RED PILL** or **BLUE PILL?**

The side with fewer people at the end of each round wins. Winners earn a mint pass to claim 1 NFT for $0.20.

## How it works

1. Every 10 seconds, a new round begins.
2. Each wallet chooses one pill per round (Red or Blue).
3. At 3 seconds remaining, **choices lock** and exact counts are revealed.
4. The **minority side** wins. Winners receive a mint pass.
5. Use a mint pass to claim an NFT ($0.20 each, max 10 per wallet).
6. Ties produce no winner. If one side is empty, the populated side wins.

## Rules

| Detail | Value |
|---|---|
| Supply | 10,000 NFTs |
| Mint Price | $0.20 |
| Max Per Wallet | 10 NFTs (enforced server-side) |
| Round Duration | 10 seconds |
| Choice | Red Pill / Blue Pill |
| Winning Side | Fewer participants |
| Tie | No winner |
| Endgame | Final 100 NFTs |

## Architecture

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS v4** with a custom design system
- **In-memory game engine** (`src/lib/game.ts`) — authoritative round state, phase transitions, win logic, supply, and per-wallet enforcement
- **Route handlers**: `/api/state`, `/api/choose`, `/api/claim`
- **Polling-based live updates** with client-side high-resolution countdown

### Game engine

The engine is a singleton that advances through three phases based on wall-clock time: `choosing` → `locked` → `revealing`. During choosing, exact counts are hidden (only "leading/trailing" is exposed) to prevent crowd-piling. The engine enforces:

- One choice per wallet per round
- Mint passes only for the winning (minority) side
- Max 10 NFTs per wallet
- Tie and zero-side rules
- Achievement tracking (Red Winner, Blue Winner, Contrarian, Streak, The Last Mint)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Design

The interface is built to feel like a live broadcast rather than a mint page: a dark stage with a drifting grid, a shrinking countdown ring as the centerpiece, two large pill buttons, and a sidebar tracking supply, your wallet, round history, and achievements.

---

*Don't follow the crowd. The minority mints.*
