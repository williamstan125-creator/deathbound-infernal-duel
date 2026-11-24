export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
}

export interface HandEvaluation {
  total: number;
  isSoft: boolean;
  isBlackjack: boolean;
  isBust: boolean;
}

export type RoundOutcomeType =
  | "PLAYER_BLACKJACK"
  | "PLAYER_WIN"
  | "DEALER_BUST"
  | "PLAYER_BUST"
  | "DEALER_WIN"
  | "PUSH";

export interface RoundResolution {
  outcome: RoundOutcomeType;
  playerDamage: number;
  dealerDamage: number;
  headline: string;
  subtext: string;
}

export type QaOverrideMode =
  | "NONE"
  | "FORCE_BLACKJACK"
  | "FORCE_BUST"
  | "FORCE_PUSH"
  | "FORCE_WIN"
  | "FORCE_DEALER_BUST";

export const MAX_HP = 100;
export const MAX_ROUNDS = 5;
export const DAMAGE_NORMAL = 20;
export const DAMAGE_BLACKJACK = 35;

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let cardSeq = 0;

export function makeCard(rank: Rank, suit: Suit): Card {
  cardSeq += 1;
  return { id: `${rank}${suit}-${cardSeq}`, rank, suit };
}

export function createShuffledDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(makeCard(rank, suit));
    }
  }
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = deck[i]!;
    const b = deck[j]!;
    deck[i] = b;
    deck[j] = a;
  }
  return deck;
}

export function cardNumericValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      total += 11;
    } else {
      total += cardNumericValue(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return {
    total,
    isSoft: aces > 0,
    isBlackjack: cards.length === 2 && total === 21,
    isBust: total > 21,
  };
}

export function drawFromDeck(deck: Card[]): { card: Card; nextDeck: Card[] } {
  const source = deck.length > 0 ? deck : createShuffledDeck();
  const [card, ...rest] = source;
  return { card: card!, nextDeck: rest };
}

export function runDealerTurn(
  deck: Card[],
  dealerCards: Card[],
  override: QaOverrideMode = "NONE",
): { cards: Card[]; nextDeck: Card[] } {
  const cards = [...dealerCards];
  let nextDeck = [...deck];

  if (override === "FORCE_DEALER_BUST") {
    while (evaluateHand(cards).total <= 21) {
      const needed = Math.max(10, 22 - evaluateHand(cards).total);
      const rank: Rank = needed >= 10 ? "K" : (String(needed) as Rank);
      cards.push(makeCard(rank, "♠"));
    }
    return { cards, nextDeck };
  }

  // Standard dealer rules: draw until 17 or higher, stand on soft 17
  while (evaluateHand(cards).total < 17) {
    const drawn = drawFromDeck(nextDeck);
    cards.push(drawn.card);
    nextDeck = drawn.nextDeck;
  }
  return { cards, nextDeck };
}

export function resolveRound(playerCards: Card[], dealerCards: Card[]): RoundResolution {
  const p = evaluateHand(playerCards);
  const d = evaluateHand(dealerCards);

  if (p.isBust) {
    return {
      outcome: "PLAYER_BUST",
      playerDamage: DAMAGE_NORMAL,
      dealerDamage: 0,
      headline: "BUST — PUNISHED!",
      subtext: `Overextended at ${p.total}. Opponent lands a brutal counter.`,
    };
  }

  if (p.isBlackjack && !d.isBlackjack) {
    return {
      outcome: "PLAYER_BLACKJACK",
      playerDamage: 0,
      dealerDamage: DAMAGE_BLACKJACK,
      headline: "CRITICAL HIT · BLACKJACK!",
      subtext: "Natural 21 unleashed! Infernal finisher connects.",
    };
  }

  if (d.isBust) {
    return {
      outcome: "DEALER_BUST",
      playerDamage: 0,
      dealerDamage: DAMAGE_NORMAL,
      headline: "COUNTERSTRIKE!",
      subtext: `Opponent overextended at ${d.total}. Clean counter lands.`,
    };
  }

  if (p.total > d.total) {
    return {
      outcome: "PLAYER_WIN",
      playerDamage: 0,
      dealerDamage: DAMAGE_NORMAL,
      headline: "STRIKE LANDS!",
      subtext: `${p.total} overpowers ${d.total}. Heavy weapon blow connects.`,
    };
  }

  if (p.total < d.total || (d.isBlackjack && !p.isBlackjack)) {
    return {
      outcome: "DEALER_WIN",
      playerDamage: DAMAGE_NORMAL,
      dealerDamage: 0,
      headline: "ENEMY STRIKE!",
      subtext: `Opponent's ${d.total} breaks through your ${p.total}.`,
    };
  }

  return {
    outcome: "PUSH",
    playerDamage: 0,
    dealerDamage: 0,
    headline: "CLASH · PARRIED!",
    subtext: `Steel meets steel at ${p.total}. No blood spilled.`,
  };
}

export function dealInitialHands(
  deck: Card[],
  override: QaOverrideMode,
): { playerCards: Card[]; dealerCards: Card[]; nextDeck: Card[] } {
  if (override === "FORCE_BLACKJACK") {
    return {
      playerCards: [makeCard("A", "♠"), makeCard("K", "♥")],
      dealerCards: [makeCard("9", "♣"), makeCard("8", "♦")],
      nextDeck: deck,
    };
  }
  if (override === "FORCE_BUST") {
    return {
      playerCards: [makeCard("10", "♠"), makeCard("6", "♦")],
      dealerCards: [makeCard("10", "♣"), makeCard("8", "♥")],
      nextDeck: [makeCard("9", "♠"), ...deck],
    };
  }
  if (override === "FORCE_PUSH") {
    return {
      playerCards: [makeCard("10", "♠"), makeCard("8", "♥")],
      dealerCards: [makeCard("K", "♣"), makeCard("8", "♦")],
      nextDeck: deck,
    };
  }
  if (override === "FORCE_WIN") {
    return {
      playerCards: [makeCard("10", "♠"), makeCard("10", "♥")],
      dealerCards: [makeCard("10", "♣"), makeCard("7", "♦")],
      nextDeck: deck,
    };
  }
  if (override === "FORCE_DEALER_BUST") {
    return {
      playerCards: [makeCard("10", "♠"), makeCard("8", "♦")],
      dealerCards: [makeCard("9", "♣"), makeCard("6", "♥")],
      nextDeck: [makeCard("K", "♠"), ...deck],
    };
  }

  let nextDeck = deck.length < 15 ? createShuffledDeck() : [...deck];
  const p1 = drawFromDeck(nextDeck);
  nextDeck = p1.nextDeck;
  const d1 = drawFromDeck(nextDeck);
  nextDeck = d1.nextDeck;
  const p2 = drawFromDeck(nextDeck);
  nextDeck = p2.nextDeck;
  const d2 = drawFromDeck(nextDeck);
  nextDeck = d2.nextDeck;

  return {
    playerCards: [p1.card, p2.card],
    dealerCards: [d1.card, d2.card],
    nextDeck,
  };
}