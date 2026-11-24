import { Volume2, VolumeX, Wrench, HelpCircle } from "lucide-react";
import type { FighterProfile } from "@/data/characters";
import { MAX_HP, MAX_ROUNDS } from "@/game/blackjack";

interface TopHudProps {
  player: FighterProfile;
  opponent: FighterProfile;
  playerHp: number;
  opponentHp: number;
  round: number;
  playerWins: number;
  opponentWins: number;
  muted: boolean;
  qaOpen: boolean;
  onToggleMute: () => void;
  onToggleQa: () => void;
  onOpenTutorial: () => void;
}

export function TopHud({
  player,
  opponent,
  playerHp,
  opponentHp,
  round,
  playerWins,
  opponentWins,
  muted,
  qaOpen,
  onToggleMute,
  onToggleQa,
  onOpenTutorial,
}: TopHudProps) {
  const playerPct = Math.max(0, Math.min(100, (playerHp / MAX_HP) * 100));
  const opponentPct = Math.max(0, Math.min(100, (opponentHp / MAX_HP) * 100));

  return (
    <header className="relative z-30 border-b border-iron/80 bg-obsidian/92 px-3 py-2.5 backdrop-blur-md sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-5">
        {/* Player Bar */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-inferno/80 bg-charcoal shadow-[0_0_16px_rgba(240,100,36,0.35)] sm:h-14 sm:w-14">
            <img
              src={player.portraitUrl}
              alt={player.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: player.objectPosition }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-[var(--font-display)] text-xs font-bold tracking-wider text-bone sm:text-sm">
                {player.name}
              </span>
              <span className="shrink-0 font-[var(--font-numeric)] text-sm font-extrabold tracking-wide text-bone sm:text-base">
                {playerHp} / {MAX_HP}
              </span>
            </div>
            <div className="relative mt-1 h-3.5 w-full overflow-hidden rounded-sm border border-iron bg-charcoal sm:h-4">
              <div
                className="absolute inset-y-0 left-0 bg-inferno/45 transition-all duration-700"
                style={{ width: `${playerPct}%` }}
              />
              <div
                className="relative h-full bg-gradient-to-r from-blood via-blood to-inferno transition-all duration-300"
                style={{ width: `${playerPct}%` }}
              />
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full border ${
                    idx < playerWins
                      ? "border-inferno bg-inferno shadow-[0_0_8px_rgba(240,100,36,0.8)]"
                      : "border-iron bg-charcoal"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Round Crest & Utility Controls */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded border border-iron bg-charcoal/95 px-2.5 py-1 shadow-[0_0_20px_rgba(0,0,0,0.65)] sm:px-4">
            <p className="font-[var(--font-display)] text-[10px] font-bold tracking-[0.2em] text-inferno sm:text-xs">
              ROUND 0{Math.min(round, MAX_ROUNDS)}
            </p>
            <p className="hidden text-[10px] uppercase tracking-[0.16em] text-ash sm:block">
              ARENA OF THE DAMNED
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? "Unmute audio" : "Mute audio"}
              className="rounded border border-iron/70 bg-charcoal/80 p-1 text-ash transition-colors hover:border-bone/50 hover:text-bone"
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={onOpenTutorial}
              aria-label="How to fight"
              className="rounded border border-iron/70 bg-charcoal/80 p-1 text-ash transition-colors hover:border-bone/50 hover:text-bone"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleQa}
              aria-label="Toggle QA deterministic test panel"
              className={`rounded border p-1 transition-colors ${
                qaOpen
                  ? "border-inferno bg-inferno/20 text-inferno"
                  : "border-iron/70 bg-charcoal/80 text-ash hover:border-bone/50 hover:text-bone"
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Opponent Bar */}
        <div className="flex min-w-0 flex-row-reverse items-center gap-2.5 sm:gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-blood/85 bg-charcoal shadow-[0_0_16px_rgba(165,29,38,0.4)] sm:h-14 sm:w-14">
            <img
              src={opponent.portraitUrl}
              alt={opponent.name}
              className="h-full w-full -scale-x-100 object-cover"
              style={{ objectPosition: opponent.objectPosition }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-row-reverse items-baseline justify-between gap-2">
              <span className="truncate font-[var(--font-display)] text-xs font-bold tracking-wider text-bone sm:text-sm">
                {opponent.name}
              </span>
              <span className="shrink-0 font-[var(--font-numeric)] text-sm font-extrabold tracking-wide text-bone sm:text-base">
                {opponentHp} / {MAX_HP}
              </span>
            </div>
            <div className="relative mt-1 h-3.5 w-full overflow-hidden rounded-sm border border-iron bg-charcoal sm:h-4">
              <div
                className="absolute inset-y-0 right-0 bg-inferno/45 transition-all duration-700"
                style={{ width: `${opponentPct}%` }}
              />
              <div
                className="relative ml-auto h-full bg-gradient-to-l from-blood via-blood to-inferno transition-all duration-300"
                style={{ width: `${opponentPct}%` }}
              />
            </div>
            <div className="mt-1 flex flex-row-reverse items-center gap-1.5">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full border ${
                    idx < opponentWins
                      ? "border-blood bg-blood shadow-[0_0_8px_rgba(165,29,38,0.85)]"
                      : "border-iron bg-charcoal"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}