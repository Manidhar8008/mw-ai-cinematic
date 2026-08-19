import React from 'react'
import type { TimelineState } from '../timeline'

interface Props {
  state: TimelineState
}

export function MWLogo({ state }: Props) {
  if (state.logoOpacity < 0.01) return null

  const scale = 0.8 + state.logoOpacity * 0.2
  const blur = (1 - state.logoOpacity) * 10

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        opacity: state.logoOpacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: 'filter 0.1s',
      }}
    >
      <div
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 'clamp(48px, 12vw, 140px)',
          fontWeight: 700,
          color: '#F5F5F5',
          letterSpacing: '0.08em',
          lineHeight: 1,
          textShadow: '0 0 60px rgba(139, 0, 0, 0.4), 0 0 120px rgba(139, 0, 0, 0.15)',
        }}
      >
        MW<span style={{ color: '#8B0000' }}>.AI</span>
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: '"Barlow", sans-serif',
          fontSize: 'clamp(11px, 1.5vw, 16px)',
          fontWeight: 400,
          color: 'rgba(245, 245, 245, 0.5)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        Intelligence Infrastructure
      </div>

      <div
        style={{
          marginTop: 40,
          width: 40,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 0, 0, 0.6), transparent)',
        }}
      />
    </div>
  )
}
