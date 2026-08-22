import type { TimelineState } from './timeline'

interface Props { state: TimelineState }

export function MediaLayer({ state }: Props) {
  return (
    <div className="media-layer" aria-hidden="true" style={{ opacity: Math.min(1, state.atmosphereOpacity + 0.15) }}>
      <video className="media-video" autoPlay muted loop playsInline preload="metadata" poster="/media/mw-ai-poster.svg">
        <source src="/media/mw-ai-intro.webm" type="video/webm" />
        <source src="/media/mw-ai-intro.mp4" type="video/mp4" />
      </video>
      <div className="media-fallback" />
      <div className="media-vignette" />
    </div>
  )
}
