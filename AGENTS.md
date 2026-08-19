# AGENTS.md — MW.AI Cinematic Landing

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at localhost:5173
npm run build      # production build to dist/
```

No lint, test, or format scripts. `npm run build` is the only verification step.

## Architecture

Single-page cinematic scroll experience. No routing, no backend.

- `src/app/App.tsx` — renders `<CinematicScene />`
- `src/app/components/CinematicScene/` — the entire UI
  - `timeline.ts` — pure math: `getTimelineState(progress)` → `TimelineState`. No React.
  - `useTimeline.ts` — hook that maps `scrollY` to 0–1 progress
  - `renderers/AtmosphereCanvas.tsx` — sky, clouds, storms, wind
  - `renderers/SkydiverCanvas.tsx` — falling figure with trails
  - `renderers/DigitalCanvas.tsx` — hex grid, particles, rings
  - `renderers/MWLogo.tsx` — final brand reveal

## Stack

- React 18, TypeScript, Vite 5, Tailwind CSS 4
- All rendering via 2D Canvas — no animation libraries
- Brand color: `#8B0000`. Fonts: Barlow, Barlow Condensed, JetBrains Mono.

## Key facts

- Total scroll height: 12,000px. Progress 0–1 controls everything.
- Canvas elements are `position: fixed` overlaying a tall scrollable div.
- Scrollbar is hidden. Canvas auto-resizes on window resize.
- `@` alias maps to `src/` (`vite.config.ts`).
- `tw-animate-css` was removed — do not re-add.
- `figmaAssetResolver` Vite plugin was removed — do not re-add.

## When modifying renderers

All renderers receive `{ state: TimelineState }`. Read values from `state` — do not compute your own scroll logic. The timeline math in `timeline.ts` is the single source of truth for all animation parameters.
