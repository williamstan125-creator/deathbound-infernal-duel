import { Swords, Shield, Flame, RotateCcw, Users, X } from "lucide-react";
import arenaPitImg from "@/assets/arena-pit.png";
import { FIGHTERS, type FighterId, type FighterProfile } from "@/data/characters";
import type { RoundOutcomeType } from "@/game/blackjack";

export interface RoundRecord {
  round: number;
  playerTotal: number;
  dealerTotal: number;
  outcome: RoundOutcomeType;
  playerDamage: number;
  dealerDamage: number;
}

export function MainMenuScreen({
  onPlay,
  onOpenTutorial,
}: {
  onPlay: () => void;
  onOpenTutorial: () => void;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian px-4 py-12 text-center">
      <img
        src={arenaPitImg}
        alt="The Pit of the Damned"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,10,13,0.35)_0%,rgba(9,10,13,0.92)_85%)]" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="font-[var(--font-display)] text-xs font-bold uppercase tracking-[0.35em] text-inferno sm:text-sm">
          PLAYABLE DEMO V0.1 · ARENA OF THE DAMNED
        </p>
        <h1 className="mt-3 font-[var(--font-display)] text-6xl font-black tracking-[0.14em] text-bone drop-shadow-[0_6px_30px_rgba(165,29,38,0.65)] sm:text-7xl md:text-8xl">
          DEATHBOUND
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-bone/80 sm:text-lg">
          Every draw is a strike. Every stand is a guard. Outplay the dealer to break your opponent in the pit.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex items-center gap-2.5 rounded border border-inferno/70 bg-gradient-to-b from-blood to-[#781219] px-8 py-3.5 font-[var(--font-display)] text-base font-bold uppercase tracking-[0.18em] text-bone shadow-[0_0_32px_rgba(165,29,38,0.65)] transition-all hover:scale-[1.02] hover:border-inferno hover:from-[#bf222c] hover:to-blood"
          >
            <Swords className="h-5 w-5 text-inferno" />
            Enter The Pit
          </button>
          <button
            type="button"
            onClick={onOpenTutorial}
            className="inline-flex items-center gap-2 rounded border border-iron bg-charcoal/90 px-6 py-3.5 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.16em] text-bone/90 transition-colors hover:border-bone/50 hover:text-bone"
          >
            How To Fight
          </button>
        </div>
      </div>
    </main>
  );
}

export function CharacterSelectScreen({
  selectedPlayer,
  selectedOpponent,
  onSelectPlayer,
  onSelectOpponent,
  onStartFight,
  onBack,
}: {
  selectedPlayer: FighterId;
  selectedOpponent: FighterId;
  onSelectPlayer: (id: FighterId) => void;
  onSelectOpponent: (id: FighterId) => void;
  onStartFight: () => void;
  onBack: () => void;
}) {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-obsidian px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-iron pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-inferno">
              CHOOSE YOUR CHAMPION
            </p>
            <h1 className="font-[var(--font-display)] text-2xl font-extrabold tracking-[0.12em] text-bone sm:text-4xl">
              FIGHTER SELECTION
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded border border-iron bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ash transition-colors hover:border-bone/50 hover:text-bone"
          >
            Main Menu
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {FIGHTERS.map((fighter) => {
            const isPlayer = fighter.id === selectedPlayer;
            const isOpponent = fighter.id === selectedOpponent;
            return (
              <div
                key={fighter.id}
                className={`group relative flex flex-col overflow-hidden rounded border bg-charcoal transition-all ${
                  isPlayer
                    ? "border-inferno shadow-[0_0_28px_rgba(240,100,36,0.3)]"
                    : isOpponent
                      ? "border-blood shadow-[0_0_24px_rgba(165,29,38,0.28)]"
                      : "border-iron hover:border-bone/40"
                }`}
              >
                <div className="relative h-64 overflow-hidden bg-obsidian sm:h-72">
                  <img
                    src={fighter.portraitUrl}
                    alt={fighter.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: fighter.objectPosition }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    {isPlayer && (
                      <span className="rounded bg-inferno px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-obsidian">
                        YOUR FIGHTER
                      </span>
                    )}
                    {isOpponent && (
                      <span className="rounded bg-blood px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bone">
                        OPPONENT
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-[var(--font-display)] text-lg font-bold tracking-wider text-bone">
                        {fighter.name}
                      </h2>
                      <span className="text-xs font-medium uppercase tracking-wider text-inferno">
                        {fighter.archetype}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-bone/75">
                      {fighter.description}
                    </p>
                    <p className="mt-3 text-xs text-ash">
                      Signature: <span className="font-semibold text-bone">{fighter.signatureAttack}</span>
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectPlayer(fighter.id)}
                      className={`rounded border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isPlayer
                          ? "border-inferno bg-inferno text-obsidian"
                          : "border-iron bg-obsidian/70 text-bone hover:border-inferno/70"
                      }`}
                    >
                      Play As
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectOpponent(fighter.id)}
                      className={`rounded border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isOpponent
                          ? "border-blood bg-blood text-bone"
                          : "border-iron bg-obsidian/70 text-bone/80 hover:border-blood/70"
                      }`}
                    >
                      Face As Foe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onStartFight}
            className="inline-flex items-center gap-2.5 rounded border border-inferno bg-gradient-to-b from-blood to-[#781219] px-10 py-3.5 font-[var(--font-display)] text-base font-bold uppercase tracking-[0.2em] text-bone shadow-[0_0_32px_rgba(165,29,38,0.6)] transition-transform hover:scale-[1.02]"
          >
            <Flame className="h-5 w-5 text-inferno" />
            Begin Duel
          </button>
        </div>
      </div>
    </main>
  );
}

export function TutorialModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded border border-iron bg-charcoal p-6 shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tutorial"
          className="absolute right-4 top-4 rounded border border-iron p-1 text-ash hover:text-bone"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="font-[var(--font-display)] text-2xl font-extrabold tracking-[0.14em] text-bone">
          HOW TO FIGHT
        </h2>
        <div className="mt-5 space-y-4 text-sm text-bone/85">
          <div className="flex gap-3 rounded border border-iron/70 bg-obsidian/60 p-3">
            <Swords className="mt-0.5 h-5 w-5 shrink-0 text-blood" />
            <div>
              <p className="font-[var(--font-display)] font-bold tracking-wider text-bone">
                HIT — ATTACK
              </p>
              <p className="mt-0.5 text-xs text-ash">
                Lunge forward and draw a card. Reach 21 to maximize pressure—exceed 21 and you overextend (Bust) for -20 HP.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded border border-iron/70 bg-obsidian/60 p-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-bone" />
            <div>
              <p className="font-[var(--font-display)] font-bold tracking-wider text-bone">
                STAND — DEFEND
              </p>
              <p className="mt-0.5 text-xs text-ash">
                Raise your guard and lock your total. The opponent reveals their hole card and draws until 17+.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded border border-iron/70 bg-obsidian/60 p-3">
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-inferno" />
            <div>
              <p className="font-[var(--font-display)] font-bold tracking-wider text-inferno">
                BLACKJACK &amp; VICTORY
              </p>
              <p className="mt-0.5 text-xs text-ash">
                Natural 21 triggers an infernal finisher (-35 HP). Normal wins deal -20 HP. Ties clash for 0 HP. Drop your foe to 0 HP or lead after 5 rounds.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded border border-inferno/70 bg-blood py-2.5 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.18em] text-bone hover:bg-[#bf222c]"
        >
          Enter Combat
        </button>
      </div>
    </div>
  );
}

export function ResultsScreen({
  victory,
  player,
  opponent,
  playerHp,
  opponentHp,
  history,
  onRematch,
  onChangeFighter,
}: {
  victory: boolean;
  player: FighterProfile;
  opponent: FighterProfile;
  playerHp: number;
  opponentHp: number;
  history: RoundRecord[];
  onRematch: () => void;
  onChangeFighter: () => void;
}) {
  const totalDealt = history.reduce((sum, r) => sum + r.dealerDamage, 0);
  const totalTaken = history.reduce((sum, r) => sum + r.playerDamage, 0);
  const winner = victory ? player : opponent;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-obsidian px-4 py-10">
      <div className="w-full max-w-3xl rounded border border-iron bg-charcoal/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.9)] sm:p-8">
        <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
          <div className="mx-auto h-56 w-44 overflow-hidden rounded border-2 border-inferno/70 bg-obsidian">
            <img
              src={winner.portraitUrl}
              alt={winner.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: winner.objectPosition }}
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ash">
              MATCH COMPLETE · {history.length} ROUNDS
            </p>
            <h1
              className={`mt-1 font-[var(--font-display)] text-5xl font-black uppercase tracking-[0.14em] ${
                victory ? "text-inferno" : "text-blood"
              }`}
            >
              {victory ? "VICTORY" : "DEFEATED"}
            </h1>
            <p className="mt-2 text-sm text-bone/85">
              {victory
                ? `${player.name} claims the Pit of the Damned over ${opponent.name}.`
                : `${opponent.name} overwhelms ${player.name} in the Pit of the Damned.`}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded border border-iron bg-obsidian/70 p-2.5">
                <p className="text-[11px] uppercase tracking-wider text-ash">Final HP</p>
                <p className="font-[var(--font-numeric)] text-xl font-extrabold text-bone">
                  {playerHp} vs {opponentHp}
                </p>
              </div>
              <div className="rounded border border-iron bg-obsidian/70 p-2.5">
                <p className="text-[11px] uppercase tracking-wider text-ash">Damage Dealt</p>
                <p className="font-[var(--font-numeric)] text-xl font-extrabold text-inferno">
                  {totalDealt} HP
                </p>
              </div>
              <div className="rounded border border-iron bg-obsidian/70 p-2.5">
                <p className="text-[11px] uppercase tracking-wider text-ash">Damage Taken</p>
                <p className="font-[var(--font-numeric)] text-xl font-extrabold text-blood">
                  {totalTaken} HP
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-iron pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ash">
            ROUND HISTORY
          </p>
          <div className="mt-2.5 space-y-1.5">
            {history.map((r) => (
              <div
                key={r.round}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-iron/60 bg-obsidian/60 px-3 py-1.5 text-xs"
              >
                <span className="font-[var(--font-display)] font-bold text-bone">
                  ROUND 0{r.round}
                </span>
                <span className="font-[var(--font-numeric)] text-sm text-bone/85">
                  {r.playerTotal} vs {r.dealerTotal}
                </span>
                <span
                  className={`font-bold uppercase tracking-wider ${
                    r.dealerDamage > 0
                      ? "text-inferno"
                      : r.playerDamage > 0
                        ? "text-blood"
                        : "text-ash"
                  }`}
                >
                  {r.outcome.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onChangeFighter}
            className="inline-flex items-center gap-2 rounded border border-iron bg-obsidian px-5 py-2.5 font-[var(--font-display)] text-xs font-bold uppercase tracking-[0.16em] text-bone hover:border-bone/50"
          >
            <Users className="h-4 w-4" />
            Change Fighter
          </button>
          <button
            type="button"
            onClick={onRematch}
            className="inline-flex items-center gap-2 rounded border border-inferno bg-blood px-6 py-2.5 font-[var(--font-display)] text-xs font-bold uppercase tracking-[0.16em] text-bone hover:bg-[#bf222c]"
          >
            <RotateCcw className="h-4 w-4" />
            Rematch
          </button>
        </div>
      </div>
    </main>
  );
}