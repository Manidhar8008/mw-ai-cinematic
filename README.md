# MW.AI — Cinematic Landing Experience

A scroll-driven cinematic experience built with React and HTML5 Canvas. The entire UI is a single fullscreen scene that responds to scroll position as a timeline, progressing through four distinct phases.

## Architecture

### Timeline System

The experience is driven by a pure math module (`timeline.ts`) that maps a normalized scroll progress (0–1) to a `TimelineState` object. Each canvas renderer reads from this state to determine what to draw and how to animate.

```
scroll position → useTimeline hook → getTimelineState(progress) → TimelineState
                                                                 ↓
                                              ┌─────────────────────────────┐
                                              │  AtmosphereCanvas           │
                                              │  SkydiverCanvas             │
                                              │  DigitalCanvas              │
                                              │  MWLogo                     │
                                              └─────────────────────────────┘
```

### Four Phases

| Progress | Phase | What happens |
|----------|-------|--------------|
| 0–0.15 | Exit | Skydiver exits the aircraft, camera close behind |
| 0.15–0.50 | Fall | Camera pulls back, skydiver shrinks into the environment |
| 0.50–0.85 | Transform | Atmosphere dissolves into digital/abstract aesthetic |
| 0.85–1.0 | Arrive | MW.AI logo emerges with glow |

### TimelineState

Computed by `getTimelineState(progress)`:

- `cameraDistance` — how far the virtual camera is from the subject
- `skydiverScale` — visual size of the skydiver figure
- `atmosphereOpacity` — clouds, storms, wind visibility
- `digitalOpacity` — hex grid, particles, data lines visibility
- `logoOpacity` — final brand reveal
- `windIntensity` — cloud speed, storm lightning frequency
- `turbulenceAmount` — skydiver jitter, limb flapping

### Renderers

All rendering is done via 2D Canvas contexts inside `<canvas>` elements:

- **AtmosphereCanvas** — Gradient sky, 30 drifting clouds, 5 pulsing storm formations with lightning, 60 wind streaks. Fades out during the transform phase.
- **SkydiverCanvas** — Stylized stick-figure skydiver with head, torso, arms, legs. Turbulence causes jitter and limb flapping. Red trail extends below the figure. Scales from full-screen to tiny.
- **DigitalCanvas** — Radial grid with flowing data dots, 5 concentric dashed rings, 120 floating particles, hexagonal grid overlay. Fades in during the transform phase.
- **MWLogo** — DOM-based. "MW" in white, ".AI" in `#8B0000`. Appears with blur-to-sharp and scale animation.

### Scroll Mechanism

The page is a tall `<div>` (12,000px) that provides scrollable area. A fixed fullscreen `<div>` overlays it with the canvas layers. `useTimeline` reads `window.scrollY` and normalizes it to 0–1 progress.

- Scrollbar is hidden via CSS (`scrollbar-width: none` on body)
- Canvas elements auto-resize on window resize
- All animation runs via `requestAnimationFrame`

### Responsive

- Canvas elements use `window.innerWidth` / `window.innerHeight`
- Typography uses `clamp()` for fluid scaling
- Skydiver and effects scale proportionally to viewport

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `dist/` — static files deployable to any host.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- HTML5 Canvas (no animation libraries)
