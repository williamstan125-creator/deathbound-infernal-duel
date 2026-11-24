import { useEffect, useRef } from "react";
import arenaPitImg from "@/assets/arena-pit.png";
import type { FighterProfile } from "@/data/characters";

export type FighterAnimState =
  | "idle"
  | "attack"
  | "defend"
  | "hit"
  | "bust"
  | "finisher"
  | "victory"
  | "defeat";

export interface VfxBurst {
  id: number;
  type: "slash" | "impact" | "parry" | "blackjack" | "blood";
  side: "left" | "right" | "center";
  color?: string;
}

export interface FloatingText {
  id: number;
  text: string;
  side: "left" | "right" | "center";
  tone: "damage" | "critical" | "parry";
}

interface ArenaStageProps {
  player: FighterProfile;
  opponent: FighterProfile;
  playerAnim: FighterAnimState;
  opponentAnim: FighterAnimState;
  shakeLevel: "none" | "light" | "heavy";
  flashTone: "none" | "red" | "inferno";
  banner: { id: number; headline: string; subtext: string; tone: "win" | "loss" | "critical" | "push" } | null;
  floatingText: FloatingText | null;
  vfxBurst: VfxBurst | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  kind: "ember" | "spark" | "blood" | "ring";
}

function fighterTransform(anim: FighterAnimState, isPlayer: boolean): string {
  const dir = isPlayer ? 1 : -1;
  switch (anim) {
    case "attack":
      return `translateX(${dir * 72}px) translateY(-8px) scale(1.06)`;
    case "finisher":
      return `translateX(${dir * 105}px) translateY(-14px) scale(1.12)`;
    case "defend":
      return `translateX(${dir * -14}px) scale(0.98)`;
    case "hit":
      return `translateX(${dir * -36}px) rotate(${dir * -5}deg)`;
    case "bust":
      return `translateX(${dir * 42}px) rotate(${dir * 6}deg) scale(0.97)`;
    case "victory":
      return `translateY(-10px) scale(1.08)`;
    case "defeat":
      return `translateY(26px) rotate(${dir * -10}deg) scale(0.9)`;
    default:
      return "translateX(0px)";
  }
}

export function ArenaStage({
  player,
  opponent,
  playerAnim,
  opponentAnim,
  shakeLevel,
  flashTone,
  banner,
  floatingText,
  vfxBurst,
}: ArenaStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Spawn combat VFX bursts onto the 2.5D particle canvas
  useEffect(() => {
    if (!vfxBurst || !canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const cx = vfxBurst.side === "left" ? w * 0.28 : vfxBurst.side === "right" ? w * 0.72 : w * 0.5;
    const cy = h * 0.54;

    if (vfxBurst.type === "blackjack") {
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        size: 24,
        alpha: 1,
        decay: 0.025,
        color: "#F06424",
        kind: "ring",
      });
      for (let i = 0; i < 42; i += 1) {
        const angle = (Math.PI * 2 * i) / 42 + Math.random() * 0.2;
        const speed = 3 + Math.random() * 8;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 2.5 + Math.random() * 4,
          alpha: 1,
          decay: 0.018 + Math.random() * 0.015,
          color: i % 2 === 0 ? "#F06424" : "#FFD580",
          kind: "spark",
        });
      }
    } else if (vfxBurst.type === "parry") {
      for (let i = 0; i < 28; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 6;
        particlesRef.current.push({
          x: w * 0.5,
          y: h * 0.5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: 2 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.03,
          color: "#E8E2D5",
          kind: "spark",
        });
      }
    } else {
      const count = vfxBurst.type === "blood" ? 30 : 20;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6.5;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 2 + Math.random() * 4,
          alpha: 0.95,
          decay: 0.022 + Math.random() * 0.018,
          color:
            vfxBurst.type === "blood"
              ? "#A51D26"
              : vfxBurst.color ?? "#F06424",
          kind: vfxBurst.type === "blood" ? "blood" : "spark",
        });
      }
    }
  }, [vfxBurst]);

  // Continuous ambient embers, ash, and combat particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(320, Math.floor(rect.width));
      canvas.height = Math.max(200, Math.floor(rect.height));
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Spawn rising brazier embers on left and right
      if (Math.random() < 0.35) {
        const leftBrazier = Math.random() < 0.5;
        particlesRef.current.push({
          x: (leftBrazier ? 0.12 : 0.88) * w + (Math.random() - 0.5) * 44,
          y: h * 0.52 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.7 - Math.random() * 1.4,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.85,
          decay: 0.008 + Math.random() * 0.007,
          color: Math.random() < 0.65 ? "#F06424" : "#FFB347",
          kind: "ember",
        });
      }

      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.alpha -= p.decay;
        if (p.alpha <= 0) continue;

        if (p.kind === "ring") {
          p.size += 11;
          ctx.save();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.kind === "blood") p.vy += 0.22;
          if (p.kind === "spark") p.vy += 0.08;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        next.push(p);
      }
      particlesRef.current = next;
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const shakeClass =
    shakeLevel === "heavy"
      ? "animate-arena-shake-heavy"
      : shakeLevel === "light"
        ? "animate-arena-shake"
        : "";

  return (
    <div
      className={`relative flex-1 overflow-hidden bg-obsidian select-none ${shakeClass}`}
      data-arena-stage="ready"
    >
      {/* Pit of the Damned 2.5D Background */}
      <img
        src={arenaPitImg}
        alt="The Pit of the Damned combat arena"
        className={`h-full w-full object-cover object-center transition-transform duration-500 ${
          playerAnim === "finisher" ? "scale-110" : "scale-100"
        }`}
      />

      {/* Atmospheric vignette & floor depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(9,10,13,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian via-obsidian/65 to-transparent" />

      {/* Impact screen flash */}
      {flashTone !== "none" && (
        <div
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ${
            flashTone === "inferno"
              ? "bg-inferno/30"
              : "bg-blood/35"
          }`}
        />
      )}

      {/* Fighters Layer */}
      <div className="absolute inset-0 z-10 mx-auto flex max-w-6xl items-end justify-between px-4 pb-6 sm:px-14 sm:pb-10">
        {/* Player Fighter (Left) */}
        <div
          className="relative flex flex-col items-center transition-transform duration-300 ease-out"
          style={{ transform: fighterTransform(playerAnim, true) }}
        >
          <div
            className={`relative h-44 w-32 overflow-hidden rounded-t-2xl border-2 sm:h-64 sm:w-48 md:h-72 md:w-52 ${
              playerAnim === "defend"
                ? "border-bone shadow-[0_0_32px_rgba(213,200,173,0.55)]"
                : playerAnim === "hit"
                  ? "border-blood shadow-[0_0_36px_rgba(165,29,38,0.85)]"
                  : "border-iron/80"
            } ${playerAnim === "idle" ? "animate-fighter-breathe" : ""}`}
            style={{
              boxShadow:
                playerAnim === "idle"
                  ? `0 20px 50px rgba(0,0,0,0.85), 0 0 28px ${player.auraColor}`
                  : undefined,
            }}
          >
            <img
              src={player.portraitUrl}
              alt={player.name}
              className={`h-full w-full object-cover transition-all duration-200 ${
                playerAnim === "hit" ? "brightness-150 saturate-150" : ""
              } ${playerAnim === "defeat" ? "grayscale brightness-50" : ""}`}
              style={{ objectPosition: player.objectPosition }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent" />
            {playerAnim === "defend" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bone/10">
                <span className="rounded border border-bone/60 bg-obsidian/80 px-2.5 py-1 font-[var(--font-display)] text-xs font-bold tracking-widest text-bone">
                  GUARD
                </span>
              </div>
            )}
          </div>
          <div className="mt-1.5 h-2.5 w-32 rounded-full bg-obsidian/80 blur-sm sm:w-44" />
        </div>

        {/* Opponent Fighter (Right) */}
        <div
          className="relative flex flex-col items-center transition-transform duration-300 ease-out"
          style={{ transform: fighterTransform(opponentAnim, false) }}
        >
          <div
            className={`relative h-44 w-32 overflow-hidden rounded-t-2xl border-2 sm:h-64 sm:w-48 md:h-72 md:w-52 ${
              opponentAnim === "hit"
                ? "border-blood shadow-[0_0_36px_rgba(165,29,38,0.85)]"
                : "border-iron/80"
            } ${opponentAnim === "idle" ? "animate-fighter-breathe" : ""}`}
            style={{
              boxShadow:
                opponentAnim === "idle"
                  ? `0 20px 50px rgba(0,0,0,0.85), 0 0 28px ${opponent.auraColor}`
                  : undefined,
            }}
          >
            <img
              src={opponent.portraitUrl}
              alt={opponent.name}
              className={`h-full w-full -scale-x-100 object-cover transition-all duration-200 ${
                opponentAnim === "hit" ? "brightness-150 saturate-150" : ""
              } ${opponentAnim === "defeat" ? "grayscale brightness-50" : ""}`}
              style={{ objectPosition: opponent.objectPosition }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent" />
          </div>
          <div className="mt-1.5 h-2.5 w-32 rounded-full bg-obsidian/80 blur-sm sm:w-44" />
        </div>
      </div>

      {/* Real-time 2.5D VFX Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />

      {/* Floating Damage / Combat Text */}
      {floatingText && (
        <div
          key={`float-${floatingText.id}`}
          className={`animate-float-damage pointer-events-none absolute top-[14%] z-30 font-[var(--font-numeric)] text-3xl font-extrabold tracking-wider sm:text-5xl ${
            floatingText.side === "left"
              ? "left-[18%]"
              : floatingText.side === "right"
                ? "right-[18%]"
                : "left-1/2 -translate-x-1/2"
          } ${
            floatingText.tone === "critical"
              ? "text-inferno drop-shadow-[0_0_18px_rgba(240,100,36,0.9)]"
              : floatingText.tone === "damage"
                ? "text-blood drop-shadow-[0_0_16px_rgba(165,29,38,0.9)]"
                : "text-bone drop-shadow-[0_0_14px_rgba(213,200,173,0.75)]"
          }`}
        >
          {floatingText.text}
        </div>
      )}

      {/* Dramatic Combat Announcement Banner */}
      {banner && (
        <div
          key={`banner-${banner.id}`}
          className="animate-banner-slam pointer-events-none absolute inset-x-0 top-1/4 z-30 flex flex-col items-center px-4 text-center"
        >
          <div
            className={`rounded border px-6 py-2.5 backdrop-blur-sm ${
              banner.tone === "critical"
                ? "border-inferno bg-obsidian/85 shadow-[0_0_40px_rgba(240,100,36,0.55)]"
                : banner.tone === "win"
                  ? "border-bone/60 bg-obsidian/85 shadow-[0_0_30px_rgba(213,200,173,0.25)]"
                  : banner.tone === "loss"
                    ? "border-blood bg-obsidian/85 shadow-[0_0_35px_rgba(165,29,38,0.55)]"
                    : "border-iron bg-obsidian/85"
            }`}
          >
            <p
              className={`font-[var(--font-display)] text-xl font-black uppercase tracking-[0.18em] sm:text-3xl ${
                banner.tone === "critical"
                  ? "text-inferno"
                  : banner.tone === "loss"
                    ? "text-blood"
                    : "text-bone"
              }`}
            >
              {banner.headline}
            </p>
            <p className="mt-1 text-xs font-medium text-bone/80 sm:text-sm">
              {banner.subtext}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}