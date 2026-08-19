import React from 'react'
import { useTimeline } from './useTimeline'
import { SkydiverCanvas } from './renderers/SkydiverCanvas'
import { AtmosphereCanvas } from './renderers/AtmosphereCanvas'
import { DigitalCanvas } from './renderers/DigitalCanvas'
import { MWLogo } from './renderers/MWLogo'

export function CinematicScene() {
  const { state, scrollHeight } = useTimeline()

  return (
    <>
      <div style={{ height: scrollHeight, position: 'relative' }} />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <AtmosphereCanvas state={state} />
        <DigitalCanvas state={state} />
        <SkydiverCanvas state={state} />
        <MWLogo state={state} />

        {state.progress > 0.02 && state.progress < 0.92 && (
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              opacity: Math.min(1, (0.92 - state.progress) * 8) * Math.min(1, state.progress * 12),
              transition: 'opacity 0.3s',
            }}
          >
            <div
              style={{
                width: 1,
                height: 40,
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))',
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
