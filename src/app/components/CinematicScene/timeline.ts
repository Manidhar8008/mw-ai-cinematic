export interface TimelineState {
  progress: number
  phase: 'exit' | 'fall' | 'transform' | 'arrive'
  cameraDistance: number
  skydiverScale: number
  atmosphereOpacity: number
  digitalOpacity: number
  logoOpacity: number
  windIntensity: number
  turbulenceAmount: number
}

export function getTimelineState(progress: number): TimelineState {
  const p = Math.max(0, Math.min(1, progress))

  let phase: TimelineState['phase']
  if (p < 0.15) phase = 'exit'
  else if (p < 0.5) phase = 'fall'
  else if (p < 0.85) phase = 'transform'
  else phase = 'arrive'

  const cameraDistance = lerp(1, 25, easeInQuad(clamp(p, 0, 0.5)))
    + lerp(0, -8, easeOutQuad(clamp(p - 0.5, 0, 0.5)))

  const skydiverScale = lerp(1, 0.06, easeInQuad(clamp(p, 0, 0.5)))
    + lerp(0, 0.34, easeOutQuad(clamp(p - 0.5, 0, 0.5)))

  const atmosphereOpacity = lerp(1, 0.15, easeInOutQuad(clamp(p - 0.4, 0, 0.45)))

  const digitalOpacity = easeInOutCubic(clamp(p - 0.45, 0, 0.45))

  const logoOpacity = easeInOutCubic(clamp(p - 0.8, 0, 0.2))

  const windIntensity = lerp(0, 1, easeInQuad(clamp(p, 0.05, 0.35)))
    * lerp(1, 0.2, easeOutQuad(clamp(p - 0.5, 0, 0.4)))

  const turbulenceAmount = lerp(0, 0.6, easeInQuad(clamp(p, 0.1, 0.4)))
    * lerp(1, 0, easeInOutQuad(clamp(p - 0.5, 0, 0.4)))

  return {
    progress: p,
    phase,
    cameraDistance,
    skydiverScale,
    atmosphereOpacity,
    digitalOpacity,
    logoOpacity,
    windIntensity,
    turbulenceAmount,
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function easeInQuad(t: number): number {
  return t * t
}

function easeOutQuad(t: number): number {
  return t * (2 - t)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}
