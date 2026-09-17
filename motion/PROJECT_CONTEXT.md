# Motion Project Context

This file is the handoff/context note for future animation work in this repository.

## Goal

Create short tournament promo infographics in the style of the spring version of the handbook, for export as transparent-background image sequences and assembly in DaVinci Resolve.

Target output:
- `1920x1080`
- `30 fps`
- transparent background
- exported as `PNG sequence`

## Source Style

Use the spring visual language from the current handbook codebase:
- spring logo assets from `spring_assets/`
- spring leaves from `spring_assets/leaves/`
- handbook-inspired card styling from `style.css`
- title font based on `assets/fonts_spfont 2.ttf`

Important:
- do not use the old non-spring look
- do not add random unrelated design language
- preserve the dark teal + gold + cyan/green accent palette

## Technical Approach

Animations are built as HTML/CSS/JS scenes in `motion/` and rendered frame-by-frame with Puppeteer.

Main files:
- `motion/index.html`
- `motion/style.css`
- `motion/app.js`
- `motion/render-sequence.js`

Rendering pattern:
- open scene in browser
- set frame with `window.setFrame(frame)`
- take screenshot with transparent background
- output PNG files into `motion/output/<scene_name>/`

## Current Scene Names

Core scenes:
- `invited_players`
- `dates`
- `map_pool`
- `prize_pool`
- `format_dates`
- `final_cta`

Additional scenes:
- `title_card`
- `discord_cta`

Transitions:
- `transition_leaves`
- `transition_leaves_slow`
- `transition_leaves_slow_wind_alt`
- `transition_leaves_slow_swirl`

## Current Approved/Useful Output Folders

These were actively used/reviewed during the project:
- `motion/output/invited_players_v9`
- `motion/output/dates_v5`
- `motion/output/map_pool_v4`
- `motion/output/prize_pool_v4`
- `motion/output/final_cta_v3`
- `motion/output/title_card_v3`

Transition variants:
- `motion/output/transition_leaves_v6_slow`
- `motion/output/transition_leaves_v6_slow_wind_alt`
- `motion/output/transition_leaves_v6_slow_swirl`

Older renders were moved to:
- `motion/output_previous/`

## Timing Convention

For the main requested scenes, renders were extended to:
- `225 frames`
- `7.5 seconds at 30 fps`

Rule:
- do not change entry speed unless specifically requested
- extend duration by letting the composition hold with idle motion

## Design Rules Learned In This Project

### General
- compositions should be centered unless a specific asymmetrical layout is intentional
- scenes should not all use the same composition
- avoid unnecessary decorative background clutter
- decorative leaves inside cards are acceptable if subtle

### Invited Players
- names and country text should sit above the flag
- flags are large internal accents inside the lower part of the card
- flags use country assets from `countryflags/`
- keep flag motion subtle

### Dates
- current preferred version is three main centered cards
- progression should sit under the cards, not off to the side

### Map Pool
- should match the handbook layout closely
- use a `5 + 4` map grid
- cards should resemble handbook map cards
- current map pool count is 9 items

### Prize Pool
- should be closer to handbook structure
- one main panel
- payout list is the main focus
- top 3 are highlighted
- trophy image on the right should be subtle/translucent

### Final CTA
- preferred hierarchy:
  - small line: `Registration closes on`
  - large line: `April 10 · 20:00 GMT`
- panel must stay fully inside frame
- small internal leaves are acceptable if very subtle

### Leaf Transitions
- variants should differ clearly, not just slightly
- differences can come from:
  - wind direction
  - start positions
  - end positions
  - density
  - swirl/orbit behavior

## Render Commands

Generic:

```powershell
node motion/render-sequence.js <scene_name> <frame_count> motion/output/<folder_name>
```

Examples:

```powershell
node motion/render-sequence.js invited_players 225 motion/output/invited_players_v9
node motion/render-sequence.js dates 225 motion/output/dates_v5
node motion/render-sequence.js map_pool 225 motion/output/map_pool_v4
node motion/render-sequence.js prize_pool 225 motion/output/prize_pool_v4
node motion/render-sequence.js final_cta 225 motion/output/final_cta_v3
```

## How To Reference This In A New Chat

In a new conversation, point to:
- `C:\Users\APCHIHBA\Documents\Github\RLBK_ephrs\motion\PROJECT_CONTEXT.md`

Recommended instruction:
- "Use the existing motion system and follow the context in `motion/PROJECT_CONTEXT.md` before making new animations."

