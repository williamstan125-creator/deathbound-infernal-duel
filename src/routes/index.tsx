import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Swords, Shield } from "lucide-react";
import { getFighter, type FighterId } from "@/data/characters";
import {
  createShuffledDeck,
  dealInitialHands,
  drawFromDeck,
  evaluateHand,
  MAX_HP,
  MAX_ROUNDS,
  resolveRound,
  runDealerTurn,
  type Card,
  type QaOverrideMode,
} from "@/game/blackjack";
import { soundEngine } from "@/game/audio";
import {
  ArenaStage,
  type FighterAnimState,
  type FloatingText,
  type VfxBurst,
} from "@/components/ArenaStage";
import { TopHud } from "@/components/TopHud";
import { GothicCard } from "@/components/GothicCard";
import {
  CharacterSelectScreen,
  MainMenuScreen,
  ResultsScreen,
  TutorialModal,
  type RoundRecord,
} from "@/components/Screens";

type GamePhase =
  | "MENU"
  | "CHARACTER_SELECT"
  | "DEALING"
  | "PLAYER_TURN"
  | "RESOLVING"
  | "ROUND_RESULT"
  | "RESULTS";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DEATHBOUND — Dark Fantasy Blackjack Fighter" },
      {
        name: "description",
        content:
          "Play DEATHBOUND v0.1: a dark-fantasy 2.5D fighting game powered by Blackjack combat mechanics.",
      },
      { property: "og:title", content: "DEATHBOUND — Dark Fantasy Blackjack Fighter" },
      {
        property: "og:description",
        content:
          "Play DEATHBOUND v0.1: a dark-fantasy 2.5D fighting game powered by Blackjack combat mechanics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeathboundGame,
});

function DeathboundGame() {
  const [phase, setPhase] = useState<GamePhase>("MENU");
  const [playerId, setPlayerId] = useState<FighterId>("reaper");
  const [opponentId, setOpponentId] = useState<FighterId>("damned");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const [qaOverride, setQaOverride] = useState<QaOverrideMode>("NONE");

  // Match & Round state
  const [deck, setDeck] = useState<Card[]>(() => createShuffledDeck());
  const [round, setRound] = useState(1);
  const [playerHp, setPlayerHp] = useState(MAX_HP);
  const [opponentHp, setOpponentHp] = useState(MAX_HP);
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [holeRevealed, setHoleRevealed] = useState(false);
  const [history, setHistory] = useState<RoundRecord[]>([]);
  const [combatLog, setCombatLog] = useState("Prepare for combat.");

  // Presentation state
  const [playerAnim, setPlayerAnim] = useState<FighterAnimState>("idle");
  const [opponentAnim, setOpponentAnim] = useState<FighterAnimState>("idle");
  const [shakeLevel, setShakeLevel] = useState<"none" | "light" | "heavy">("none");
  const [flashTone, setFlashTone] = useState<"none" | "red" | "inferno">("none");
  const [banner, setBanner] = useState<{
    id: number;
    headline: string;
    subtext: string;
    tone: "win" | "loss" | "critical" | "push";
  } | null>(null);
  const [floatingText, setFloatingText] = useState<FloatingText | null>(null);
  const [vfxBurst, setVfxBurst] = useState<VfxBurst | null>(null);

  const timersRef = useRef<number[]>([]);
  const eventSeqRef = useRef(1);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const player = getFighter(playerId);
  const opponent = getFighter(opponentId);

  const finishRound = useCallback(
    (
      finalPlayerCards: Card[],
      finalDealerCards: Card[],
      currentRound: number,
      curPlayerHp: number,
      curOpponentHp: number,
    ) => {
      const res = resolveRound(finalPlayerCards, finalDealerCards);
      const nextPlayerHp = Math.max(0, curPlayerHp - res.playerDamage);
      const nextOpponentHp = Math.max(0, curOpponentHp - res.dealerDamage);
      const seq = (eventSeqRef.current += 1);

      setHoleRevealed(true);
      setPlayerHp(nextPlayerHp);
      setOpponentHp(nextOpponentHp);
      setCombatLog(`${res.headline} — ${res.subtext}`);

      if (res.dealerDamage > 0) setPlayerWins((w) => w + 1);
      if (res.playerDamage > 0) setOpponentWins((w) => w + 1);

      const pEval = evaluateHand(finalPlayerCards);
      const dEval = evaluateHand(finalDealerCards);
      setHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          playerTotal: pEval.total,
          dealerTotal: dEval.total,
          outcome: res.outcome,
          playerDamage: res.playerDamage,
          dealerDamage: res.dealerDamage,
        },
      ]);

      if (res.outcome === "PLAYER_BLACKJACK") {
        soundEngine.playBlackjack();
        setPlayerAnim("finisher");
        setOpponentAnim("hit");
        setShakeLevel("heavy");
        setFlashTone("inferno");
        setVfxBurst({ id: seq, type: "blackjack", side: "right" });
        setFloatingText({ id: seq, text: "-35 HP CRITICAL!", side: "right", tone: "critical" });
        setBanner({ id: seq, headline: res.headline, subtext: res.subtext, tone: "critical" });
      } else if (res.outcome === "PLAYER_WIN" || res.outcome === "DEALER_BUST") {
        soundEngine.playImpact(false);
        setPlayerAnim("attack");
        setOpponentAnim("hit");
        setShakeLevel("light");
        setFlashTone("red");
        setVfxBurst({ id: seq, type: "blood", side: "right" });
        setFloatingText({ id: seq, text: "-20 HP", side: "right", tone: "damage" });
        setBanner({ id: seq, headline: res.headline, subtext: res.subtext, tone: "win" });
      } else if (res.outcome === "PLAYER_BUST" || res.outcome === "DEALER_WIN") {
        soundEngine.playImpact(true);
        setPlayerAnim("hit");
        setOpponentAnim("attack");
        setShakeLevel("light");
        setFlashTone("red");
        setVfxBurst({ id: seq, type: "blood", side: "left" });
        setFloatingText({ id: seq, text: "-20 HP", side: "left", tone: "damage" });
        setBanner({ id: seq, headline: res.headline, subtext: res.subtext, tone: "loss" });
      } else {
        soundEngine.playParry();
        setPlayerAnim("defend");
        setOpponentAnim("defend");
        setVfxBurst({ id: seq, type: "parry", side: "center" });
        setFloatingText({ id: seq, text: "PARRIED!", side: "center", tone: "parry" });
        setBanner({ id: seq, headline: res.headline, subtext: res.subtext, tone: "push" });
      }

      schedule(() => {
        setShakeLevel("none");
        setFlashTone("none");
        const matchOver = nextPlayerHp <= 0 || nextOpponentHp <= 0 || currentRound >= MAX_ROUNDS;
        if (matchOver) {
          const won = nextOpponentHp <= 0 || (nextPlayerHp > 0 && nextPlayerHp >= nextOpponentHp);
          setPlayerAnim(won ? "victory" : "defeat");
          setOpponentAnim(won ? "defeat" : "victory");
          soundEngine.playMatchEnd(won);
          schedule(() => setPhase("RESULTS"), 900);
        } else {
          setPlayerAnim("idle");
          setOpponentAnim("idle");
          setPhase("ROUND_RESULT");
        }
      }, 750);
    },
    [schedule],
  );

  const startRound = useCallback(
    (
      roundNum: number,
      currentDeck: Card[],
      curPlayerHp: number,
      curOpponentHp: number,
      override: QaOverrideMode,
    ) => {
      clearTimers();
      setPhase("DEALING");
      setHoleRevealed(false);
      setPlayerAnim("idle");
      setOpponentAnim("idle");
      setBanner(null);
      setFloatingText(null);

      const dealt = dealInitialHands(currentDeck, override);
      setDeck(dealt.nextDeck);
      setPlayerCards(dealt.playerCards);
      setDealerCards(dealt.dealerCards);
      soundEngine.playCardDraw();
      setCombatLog(`Round 0${roundNum} begins. Choose your strike.`);
      if (override !== "NONE") setQaOverride("NONE");

      const pEval = evaluateHand(dealt.playerCards);
      if (pEval.isBlackjack) {
        schedule(() => {
          finishRound(dealt.playerCards, dealt.dealerCards, roundNum, curPlayerHp, curOpponentHp);
        }, 550);
      } else {
        schedule(() => setPhase("PLAYER_TURN"), 320);
      }
    },
    [clearTimers, finishRound, schedule],
  );

  const startNewMatch = useCallback(() => {
    soundEngine.startAmbience();
    const freshDeck = createShuffledDeck();
    setRound(1);
    setPlayerHp(MAX_HP);
    setOpponentHp(MAX_HP);
    setPlayerWins(0);
    setOpponentWins(0);
    setHistory([]);
    startRound(1, freshDeck, MAX_HP, MAX_HP, qaOverride);
  }, [qaOverride, startRound]);

  const handleHit = () => {
    if (phase !== "PLAYER_TURN") return;
    setPhase("RESOLVING");
    soundEngine.playSwing();
    soundEngine.playCardDraw();

    const seq = (eventSeqRef.current += 1);
    setPlayerAnim("attack");
    setVfxBurst({ id: seq, type: "slash", side: "right", color: player.trailHex });

    const drawn = drawFromDeck(deck);
    const nextPlayerCards = [...playerCards, drawn.card];
    setDeck(drawn.nextDeck);
    setPlayerCards(nextPlayerCards);

    const pEval = evaluateHand(nextPlayerCards);
    if (pEval.isBust) {
      setCombatLog(`Drew ${drawn.card.rank}${drawn.card.suit} (${pEval.total}) — Overextended!`);
      schedule(() => {
        setPlayerAnim("bust");
        finishRound(nextPlayerCards, dealerCards, round, playerHp, opponentHp);
      }, 380);
    } else {
      setCombatLog(`Strike connects! Drew ${drawn.card.rank}${drawn.card.suit} · Hand total ${pEval.total}.`);
      schedule(() => {
        setPlayerAnim("idle");
        setPhase("PLAYER_TURN");
      }, 360);
    }
  };

  const handleStand = () => {
    if (phase !== "PLAYER_TURN") return;
    setPhase("RESOLVING");
    soundEngine.playParry();
    setPlayerAnim("defend");
    setHoleRevealed(true);
    setCombatLog("Guard raised. Opponent reveals their hand...");

    schedule(() => {
      const dealerResult = runDealerTurn(deck, dealerCards, qaOverride);
      setDeck(dealerResult.nextDeck);
      setDealerCards(dealerResult.cards);
      if (qaOverride !== "NONE") setQaOverride("NONE");
      soundEngine.playCardDraw();

      schedule(() => {
        finishRound(playerCards, dealerResult.cards, round, playerHp, opponentHp);
      }, 420);
    }, 450);
  };

  const handleNextRound = () => {
    if (phase !== "ROUND_RESULT") return;
    const nextRound = round + 1;
    setRound(nextRound);
    startRound(nextRound, deck, playerHp, opponentHp, qaOverride);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  if (phase === "MENU") {
    return (
      <>
        <MainMenuScreen
          onPlay={() => {
            soundEngine.startAmbience();
            setPhase("CHARACTER_SELECT");
          }}
          onOpenTutorial={() => setTutorialOpen(true)}
        />
        {tutorialOpen && <TutorialModal onClose={() => setTutorialOpen(false)} />}
      </>
    );
  }

  if (phase === "CHARACTER_SELECT") {
    return (
      <CharacterSelectScreen
        selectedPlayer={playerId}
        selectedOpponent={opponentId}
        onSelectPlayer={setPlayerId}
        onSelectOpponent={setOpponentId}
        onStartFight={startNewMatch}
        onBack={() => setPhase("MENU")}
      />
    );
  }

  if (phase === "RESULTS") {
    const victory = opponentHp <= 0 || (playerHp > 0 && playerHp >= opponentHp);
    return (
      <ResultsScreen
        victory={victory}
        player={player}
        opponent={opponent}
        playerHp={playerHp}
        opponentHp={opponentHp}
        history={history}
        onRematch={startNewMatch}
        onChangeFighter={() => setPhase("CHARACTER_SELECT")}
      />
    );
  }

  const playerEval = evaluateHand(playerCards);
  const visibleDealerCards = holeRevealed ? dealerCards : dealerCards.slice(0, 1);
  const visibleDealerEval = evaluateHand(visibleDealerCards);
  const canAct = phase === "PLAYER_TURN";

  return (
    <div className="flex h-screen min-h-[640px] flex-col overflow-hidden bg-obsidian text-bone">
      <TopHud
        player={player}
        opponent={opponent}
        playerHp={playerHp}
        opponentHp={opponentHp}
        round={round}
        playerWins={playerWins}
        opponentWins={opponentWins}
        muted={muted}
        qaOpen={qaOpen}
        onToggleMute={toggleMute}
        onToggleQa={() => setQaOpen((o) => !o)}
        onOpenTutorial={() => setTutorialOpen(true)}
      />

      {/* Discreet Deterministic QA Test Panel */}
      {qaOpen && (
        <div className="z-30 flex flex-wrap items-center justify-center gap-2 border-b border-inferno/40 bg-charcoal/95 px-3 py-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-inferno">QA Override:</span>
          {(
            [
              ["NONE", "Random"],
              ["FORCE_BLACKJACK", "Force Blackjack"],
              ["FORCE_BUST", "Force Bust (on Hit)"],
              ["FORCE_PUSH", "Force Push (on Stand)"],
              ["FORCE_WIN", "Force Win (on Stand)"],
              ["FORCE_DEALER_BUST", "Force Dealer Bust"],
            ] as [QaOverrideMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setQaOverride(mode);
                startRound(round, deck, playerHp, opponentHp, mode);
              }}
              className={`rounded border px-2.5 py-1 font-semibold transition-colors ${
                qaOverride === mode
                  ? "border-inferno bg-inferno text-obsidian"
                  : "border-iron bg-obsidian text-bone/85 hover:border-inferno/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 2.5D Combat Arena (~65-70% vertical space) */}
      <ArenaStage
        player={player}
        opponent={opponent}
        playerAnim={playerAnim}
        opponentAnim={opponentAnim}
        shakeLevel={shakeLevel}
        flashTone={flashTone}
        banner={banner}
        floatingText={floatingText}
        vfxBurst={vfxBurst}
      />

      {/* Bottom Combat HUD */}
      <section className="relative z-30 border-t border-iron bg-charcoal/96 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-3.5">
        <div className="mx-auto grid max-w-6xl items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          {/* Player Hand */}
          <div className="flex items-center justify-between gap-3 md:justify-start">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {playerCards.map((card) => (
                <GothicCard key={card.id} card={card} />
              ))}
            </div>
            <div className="shrink-0 text-right md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">
                YOUR HAND
              </p>
              <p
                className={`font-[var(--font-numeric)] text-4xl font-extrabold leading-none ${
                  playerEval.isBust
                    ? "text-blood"
                    : playerEval.total === 21
                      ? "text-inferno"
                      : "text-bone"
                }`}
              >
                {playerEval.total}
              </p>
            </div>
          </div>

          {/* Action Controls & Combat Log */}
          <div className="flex flex-col items-center gap-2">
            <p className="max-w-xs truncate text-center text-xs font-medium text-bone/80">
              {combatLog}
            </p>
            {phase === "ROUND_RESULT" ? (
              <button
                type="button"
                onClick={handleNextRound}
                className="w-full min-w-[220px] rounded border border-inferno bg-gradient-to-b from-blood to-[#781219] px-6 py-3 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.18em] text-bone shadow-[0_0_24px_rgba(240,100,36,0.45)] transition-transform hover:scale-[1.02]"
              >
                Next Round (0{round + 1})
              </button>
            ) : (
              <div className="grid w-full grid-cols-2 gap-2.5 sm:w-auto">
                <button
                  type="button"
                  disabled={!canAct}
                  onClick={handleHit}
                  className="inline-flex items-center justify-center gap-2 rounded border border-inferno/80 bg-gradient-to-b from-blood to-[#751219] px-5 py-3 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.14em] text-bone shadow-[0_0_20px_rgba(165,29,38,0.5)] transition-all hover:border-inferno hover:from-[#bf222c] hover:to-blood disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Swords className="h-4 w-4 text-inferno" />
                  Hit / Attack
                </button>
                <button
                  type="button"
                  disabled={!canAct}
                  onClick={handleStand}
                  className="inline-flex items-center justify-center gap-2 rounded border border-iron bg-gradient-to-b from-[#2b2e36] to-obsidian px-5 py-3 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.14em] text-bone transition-all hover:border-bone/60 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Shield className="h-4 w-4 text-bone/80" />
                  Stand / Defend
                </button>
              </div>
            )}
          </div>

          {/* Opponent Hand */}
          <div className="flex flex-row-reverse items-center justify-between gap-3 md:justify-start">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {dealerCards.map((card, idx) => (
                <GothicCard
                  key={card.id}
                  card={card}
                  hidden={!holeRevealed && idx === 1}
                  compact
                />
              ))}
            </div>
            <div className="shrink-0 text-left md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">
                {holeRevealed ? "OPPONENT" : "VISIBLE"}
              </p>
              <p className="font-[var(--font-numeric)] text-3xl font-extrabold leading-none text-bone/90">
                {visibleDealerEval.total}
                {!holeRevealed && <span className="text-base text-ash"> + ?</span>}
              </p>
            </div>
          </div>
        </div>
      </section>

      {tutorialOpen && <TutorialModal onClose={() => setTutorialOpen(false)} />}
    </div>
  );
}
