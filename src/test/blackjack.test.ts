import { describe, expect, it } from "vitest";
import {
  DAMAGE_BLACKJACK,
  DAMAGE_NORMAL,
  evaluateHand,
  makeCard,
  resolveRound,
  runDealerTurn,
} from "@/game/blackjack";

describe("DEATHBOUND Blackjack & Combat Rules", () => {
  it("deals 35 HP damage on Natural Blackjack (2-card 21)", () => {
    const res = resolveRound(
      [makeCard("A", "♠"), makeCard("K", "♥")],
      [makeCard("10", "♣"), makeCard("9", "♦")],
    );
    expect(res.outcome).toBe("PLAYER_BLACKJACK");
    expect(res.dealerDamage).toBe(DAMAGE_BLACKJACK);
    expect(res.playerDamage).toBe(0);
  });

  it("distinguishes 3-card 21 from Natural Blackjack (deals 20 HP)", () => {
    const res = resolveRound(
      [makeCard("7", "♠"), makeCard("7", "♥"), makeCard("7", "♦")],
      [makeCard("10", "♣"), makeCard("8", "♦")],
    );
    expect(res.outcome).toBe("PLAYER_WIN");
    expect(res.dealerDamage).toBe(DAMAGE_NORMAL);
  });

  it("punishes player bust with 20 HP damage to player", () => {
    const res = resolveRound(
      [makeCard("10", "♠"), makeCard("8", "♥"), makeCard("6", "♦")],
      [makeCard("10", "♣"), makeCard("7", "♦")],
    );
    expect(res.outcome).toBe("PLAYER_BUST");
    expect(res.playerDamage).toBe(DAMAGE_NORMAL);
    expect(res.dealerDamage).toBe(0);
  });

  it("awards 20 HP counterstrike on dealer bust", () => {
    const res = resolveRound(
      [makeCard("10", "♠"), makeCard("8", "♥")],
      [makeCard("10", "♣"), makeCard("6", "♦"), makeCard("9", "♠")],
    );
    expect(res.outcome).toBe("DEALER_BUST");
    expect(res.dealerDamage).toBe(DAMAGE_NORMAL);
  });

  it("deals 0 HP on a push (tie)", () => {
    const res = resolveRound(
      [makeCard("10", "♠"), makeCard("8", "♥")],
      [makeCard("K", "♣"), makeCard("8", "♦")],
    );
    expect(res.outcome).toBe("PUSH");
    expect(res.playerDamage).toBe(0);
    expect(res.dealerDamage).toBe(0);
  });

  it("makes dealer stand on soft 17", () => {
    const initial = [makeCard("A", "♠"), makeCard("6", "♥")];
    const result = runDealerTurn([makeCard("10", "♣")], initial);
    expect(result.cards).toHaveLength(2);
    expect(evaluateHand(result.cards).total).toBe(17);
  });
});