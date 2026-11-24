import type { Card } from "@/game/blackjack";

interface GothicCardProps {
  card: Card;
  hidden?: boolean;
  compact?: boolean;
}

export function GothicCard({ card, hidden = false, compact = false }: GothicCardProps) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  const sizeClasses = compact
    ? "h-20 w-14 sm:h-24 sm:w-16"
    : "h-24 w-16 sm:h-28 sm:w-20";

  if (hidden) {
    return (
      <div
        className={`${sizeClasses} animate-card-deal relative flex shrink-0 items-center justify-center rounded border border-iron bg-charcoal shadow-[0_8px_24px_rgba(0,0,0,0.75)]`}
        aria-label="Hidden opponent card"
      >
        <div className="absolute inset-1 rounded-sm border border-iron/70 bg-[radial-gradient(circle_at_center,rgba(165,29,38,0.28),rgba(9,10,13,0.95))]" />
        <span className="relative font-[var(--font-display)] text-lg font-bold tracking-widest text-blood/90">
          ✦
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} animate-card-deal relative flex shrink-0 flex-col justify-between rounded border border-iron bg-[linear-gradient(160deg,#1f2229_0%,#111318_100%)] p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.8)] ring-1 ring-bone/15`}
    >
      <div className="flex items-start justify-between leading-none">
        <span
          className={`font-[var(--font-numeric)] text-lg font-extrabold tracking-tight sm:text-xl ${
            isRed ? "text-blood" : "text-bone"
          }`}
        >
          {card.rank}
        </span>
        <span className={`text-sm sm:text-base ${isRed ? "text-blood" : "text-bone/85"}`}>
          {card.suit}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <span
          className={`text-2xl sm:text-3xl ${
            isRed
              ? "text-blood drop-shadow-[0_0_8px_rgba(165,29,38,0.55)]"
              : "text-bone/90 drop-shadow-[0_0_8px_rgba(213,200,173,0.25)]"
          }`}
        >
          {card.suit}
        </span>
      </div>

      <div className="flex items-end justify-between leading-none">
        <span className={`text-xs ${isRed ? "text-blood/80" : "text-bone/60"}`}>
          {card.suit}
        </span>
        <span
          className={`font-[var(--font-numeric)] text-sm font-bold ${
            isRed ? "text-blood" : "text-bone/85"
          }`}
        >
          {card.rank}
        </span>
      </div>
    </div>
  );
}