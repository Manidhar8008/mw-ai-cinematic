import React from 'react'
import { useTimeline } from './useTimeline'
import { SkydiverCanvas } from './renderers/SkydiverCanvas'
import { AtmosphereCanvas } from './renderers/AtmosphereCanvas'
import { DigitalCanvas } from './renderers/DigitalCanvas'
import { MWLogo } from './renderers/MWLogo'
import { MediaLayer } from './MediaLayer'
import { WireframeLayer } from './WireframeLayer'
import { LiveSystem } from './LiveSystem'

export function CinematicScene() {
  const { state, scrollHeight } = useTimeline()
  const active = state.progress < 0.999

  const skipIntro = () => {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }

  return (
    <>
      <div style={{ height: scrollHeight, position: 'relative' }} aria-hidden="true" />

      <div
        aria-hidden={!active}
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: '#020208',
          opacity: active ? 1 : 0,
          visibility: active ? 'visible' : 'hidden',
          pointerEvents: active ? 'auto' : 'none',
          transition: 'opacity 500ms ease, visibility 0s linear 500ms',
          zIndex: 20,
        }}
      >
        <MediaLayer state={state} />
        <AtmosphereCanvas state={state} />
        <DigitalCanvas state={state} />
        <SkydiverCanvas state={state} />
        <WireframeLayer state={state} />
        <MWLogo state={state} />
        <LiveSystem />

        <div className="cinematic-copy" aria-hidden="true">
          <span className="eyebrow">MW.AI / INTELLIGENCE INFRASTRUCTURE</span>
          <strong>{state.progress < 0.38 ? 'YOUR BUSINESS IS EVERYWHERE.' : state.progress < 0.72 ? 'MW.AI REMEMBERS.' : 'THEN IT ACTS.'}</strong>
          <small>{state.progress < 0.38 ? 'WhatsApp · Phone · Website · Operations' : state.progress < 0.72 ? 'Memory · Context · Workflow' : 'AI · Automation · Execution'}</small>
        </div>

        {active && (
          <button className="cinematic-skip" type="button" onClick={skipIntro}>
            Skip intro <span aria-hidden="true">↘</span>
          </button>
        )}

        {state.progress > 0.02 && state.progress < 0.92 && (
          <div className="cinematic-scroll-hint">
            <div />
            <span className="cinematic-scroll-label">Scroll to enter</span>
          </div>
        )}
      </div>
    </>
  )
}
