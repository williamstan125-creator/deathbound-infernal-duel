# Deathbound: Infernal Duel

Build the DEATHBOUND playable demo v0.1 based on the attached specification and concept artwork: a dark-fantasy casino game combining Blackjack decision mechanics with the visual presentation of a cinematic 2.5D fighting game.

Locked:
- Core Concept: "The player must feel like they are fighting, not playing a card game with fighting animations attached. The blackjack mechanics determine the outcome; the fighting presentation makes that outcome entertaining."
- Visual Identity & Color Palette:
  * Obsidian (#090A0D) for dark arena background and foundation
  * Charcoal (#17191E) for panels, cards backings, and HUD containers
  * Iron (#303238) for gothic borders, separators, and metallic details
  * Blood Red (#A51D26) for attacks, critical hits, damage notifications, and danger states
  * Inferno (#F06424) for fire effects, embers, and ultimate/blackjack flares
  * Bone (#D5C8AD) for high-contrast card values, health totals, and primary typography
  * Ash (#777777) for secondary details and dealer card labels
- Typography:
  * Gothic serif / Cinzel style for headings, victory banners, and character names
  * Bold condensed sans-serif for card numbers and HP values
  * Clean, legible modern sans-serif for UI badges and combat tooltips
  * Uppercase styling for combat announcements (VICTORY, CRITICAL HIT, BUST, CLASH)
- Character Roster (Visualized from the attached concept art):
  1. The Reaper: Agile hooded executioner wielding a massive serrated runic broadsword, shrouded in ethereal mist and spectral blue/violet energy.
  2. The Damned / The Beast: Heavy demonic berserker encased in spiky black armor with glowing red sigils, curved horns, and twin crimson flame blades.
  3. Dark Valkyrie: Armored sentinel with horned helm and glowing cold blue eyes.
- Game Screen Architecture & HUD:
  * Top HUD: Player and Opponent portraits, player HP (100 HP) and Opponent HP (100 HP) styled like an authentic fighting game (health bars that flash and animate when depleted), current Round indicator (e.g., ROUND 01 · ARENA OF THE DAMNED), and match tracker.
  * Central Combat Arena: 2.5D gothic dark-fantasy battleground with cracked obsidian stone tiles, ruined stone pillars, hanging iron chains, glowing burning braziers with rising embers, and atmospheric volumetric mist. Both fighters rendered facing each other in idle fighting stances with weapon glows and ready animations.
  * Interactive Combat Exchanges:
    - HIT: Player triggers forward dash/slash attack; draws a card; totals recalculate.
    - STAND: Player raises guard/defends; locks hand; triggers Opponent (Dealer) turn.
    - BUST (>21): Player overextends and misses; Opponent executes a brutal punish counter (-20 HP to player, screen shake and red flash).
    - BLACKJACK (Natural 21): Slow-motion cinematic critical finisher sequence (-35 HP to opponent with golden/infernal shockwave).
    - NORMAL WIN: Player's total beats opponent; clean weapon strike connects (-20 HP to opponent).
    - DEALER BUST: Opponent overextends and player counters (-20 HP to opponent).
    - PUSH (Tie): Weapons clash with sparks, no damage taken (0 HP).
    - DEALER WIN: Opponent lands attack (-20 HP to player).
  * Bottom HUD:
    - Player's hand of cards with dark gothic tarot/poker styling, card reveal animations, and prominent hand total.
    - Opponent's visible cards (one face up, hole card face down until stand).
    - Prominent action controls: HIT / ATTACK button (blood red / flame hover) and STAND / DEFEND button (iron shield styling).
    - Combat announcement log / floating combat text (e.g., "-20 HP COUNTERSTRIKE!", "PARRIED!").
- Flow & Navigation:
  * Main Menu -> Character Select (interactive fighter cards with preview and stats) -> Arena Fight -> Round-by-Round Progression -> Match End Screen (Victory / Defeat with damage statistics, round history, and rematch button).
- Audio System:
  * Integrated procedural Web Audio synth effects for weapon swings, heavy impacts, metal parries, card draws, and a brooding ambient dark fantasy drone.

Open:
- Responsive desktop and tablet layout with smooth scaling.
- WebGL / Canvas / CSS 3D rendering for dynamic 2.5D arena depth, particles (ash, sparks, embers, blood splatter effects), and camera shake impacts.
- Deterministic test / cheat panel (accessible via a discreet toggle) to force specific outcomes (Force Blackjack, Force Bust, Force Push, Force Win, Force Dealer Bust) for rapid QA testing and demonstrations.

build a real working app, not a clickable prototype; the screen and kit files show layout, content and look (a wireframe's, structure only) and are never code to copy. The screens are the moments the user designed, not the whole product. Before building, walk through each flow as its user would and design what the pictures leave out, as a product designer would for this product: the steps a flow needs to finish and how the app responds to what the user does, including the moments its users will actually run into, like waiting on something or finding nothing yet. Add nothing a user of this product would never meet, and keep an app the user wants simple, simple. Never leave a step the product's core flows need as "coming soon", unless the brief says the user chose to. Where such a step needs an outside service, build every part up to it and say in your reply what's left to connect. Fill product gaps only, never a look the design set: an added step reuses the UI kit's tokens, chrome and parts and the nearest designed screen's layout, with no new visual direction. Look at every screen's picture before writing code; design.md says which picture or sheet holds each screen. Open the UI kit's shells and parts HTML for the header, tab bar, composer and components, not only its tokens. Use each finished screen's copy exactly as design.md lists it; never invent copy for one. A wireframe under design.md's Wireframes gives structure only: build it in the design's look, as design.md says. The screens' photos are placeholders for the mockups only: replace every photo design.md lists with the user's own upload for it, else as design.md says (a photo without people re-composed with imagegen--edit_image from it as a reference, a photo of people generated from its brief and never from the photo), and ship no set photo or its URL. For a design that came with no design.md, every photo on assets.lovable.dev or images.unsplash.com is a set photo: replace it with the user's own upload for it, else a new image generated for its slot, any person in it one who doesn't exist, never from the photo or a picture showing it. Build and check each screen at the canvas it was drawn at: phone 393×764, tablet landscape 1133×744, tablet portrait 744×1133, desktop 1280×832. After building, screenshot the app at those sizes and states, compare each finished screen with its picture, and fix every visual difference you didn't choose; check a wireframe's screen against its structure, never its grey look. End your reply with "Changed from the mockups": each deliberate change and why, and "Added beyond the mockups": each step, state or interaction you built that no screen shows.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c1f1125c-dec6-46f7-9f23-50d0b58ef9b0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
