"use client";

interface Props {
  mintPasses: number;
  minted: number;
  maxPerWallet: number;
  price: number;
  claiming: boolean;
  onClaim: () => void;
}

export default function WalletPanel({
  mintPasses,
  minted,
  maxPerWallet,
  price,
  claiming,
  onClaim,
}: Props) {
  const canMint = mintPasses > 0 && minted < maxPerWallet;

  return (
    <div className="surface rounded-xl p-4">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-dim">
        Your wallet
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-ash-2 p-3">
          <div className="text-[10px] uppercase tracking-wider text-dim">Mint passes</div>
          <div className="mt-1 font-mono text-2xl tabular" style={{ color: "var(--color-gold)" }}>
            {mintPasses}
          </div>
        </div>
        <div className="rounded-lg bg-ash-2 p-3">
          <div className="text-[10px] uppercase tracking-wider text-dim">Minted</div>
          <div className="mt-1 font-mono text-2xl tabular">
            {minted}<span className="text-base text-dim">/{maxPerWallet}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canMint || claiming}
        onClick={onClaim}
        className="pill-btn w-full rounded-xl py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all"
        style={{
          background: canMint
            ? "linear-gradient(90deg, var(--color-gold), var(--color-amber))"
            : "var(--color-ash-2)",
          color: canMint ? "var(--color-void)" : "var(--color-dim)",
          border: `1px solid ${canMint ? "var(--color-gold)" : "var(--color-faint)"}`,
        }}
      >
        {claiming
          ? "Minting…"
          : canMint
            ? `Mint your NFT · $${price.toFixed(2)}`
            : minted >= maxPerWallet
              ? "Wallet full"
              : "No mint pass"}
      </button>

      {minted > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: minted }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--color-gold)" }}
            />
          ))}
          {Array.from({ length: maxPerWallet - minted }).map((_, i) => (
            <div key={`e${i}`} className="h-2 w-2 rounded-full bg-ash-2" />
          ))}
        </div>
      )}
    </div>
  );
}
