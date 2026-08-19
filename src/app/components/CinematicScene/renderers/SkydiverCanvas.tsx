import React, { useRef, useEffect, useCallback } from 'react'
import type { TimelineState } from '../timeline'

interface Props {
  state: TimelineState
}

export function SkydiverCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2
    timeRef.current += 0.02

    ctx.clearRect(0, 0, w, h)

    if (state.skydiverScale < 0.01) return

    const t = timeRef.current
    const scale = state.skydiverScale
    const baseSize = Math.min(w, h) * 0.18 * scale
    const bodyW = baseSize * 0.4
    const bodyH = baseSize * 0.9

    const jitterX = Math.sin(t * 3.7) * state.turbulenceAmount * baseSize * 0.15
    const jitterY = Math.cos(t * 2.9) * state.turbulenceAmount * baseSize * 0.1

    const fallOffset = state.progress < 0.5
      ? state.progress * baseSize * 0.3
      : (1 - state.progress) * baseSize * 0.3

    const sx = cx + jitterX
    const sy = cy + jitterY + fallOffset

    ctx.save()
    ctx.translate(sx, sy)

    const tilt = Math.sin(t * 2.1) * state.turbulenceAmount * 0.2
    ctx.rotate(tilt)

    const limbFlap = Math.sin(t * 4) * state.windIntensity * 0.3

    ctx.fillStyle = 'rgba(15, 15, 20, 0.95)'
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.6)'
    ctx.lineWidth = Math.max(1, baseSize * 0.02)

    ctx.beginPath()
    ctx.ellipse(0, -bodyH * 0.5, bodyW * 0.35, bodyW * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(0, -bodyH * 0.15, bodyW * 0.5, bodyH * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.5, -bodyH * 0.3)
    ctx.lineTo(-bodyW * 1.8, -bodyH * 0.1 + limbFlap * baseSize * 0.2)
    ctx.lineTo(-bodyW * 2.2, -bodyH * 0.35 + limbFlap * baseSize * 0.3)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(bodyW * 0.5, -bodyH * 0.3)
    ctx.lineTo(bodyW * 1.8, -bodyH * 0.1 - limbFlap * baseSize * 0.2)
    ctx.lineTo(bodyW * 2.2, -bodyH * 0.35 - limbFlap * baseSize * 0.3)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.2, bodyH * 0.2)
    ctx.lineTo(-bodyW * 0.6, bodyH * 0.9 + Math.sin(t * 3) * baseSize * 0.05)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(bodyW * 0.2, bodyH * 0.2)
    ctx.lineTo(bodyW * 0.6, bodyH * 0.9 - Math.sin(t * 3) * baseSize * 0.05)
    ctx.stroke()

    const trailLen = baseSize * (1 + state.windIntensity * 3)
    const trailGrad = ctx.createLinearGradient(0, bodyH * 0.3, 0, bodyH * 0.3 + trailLen)
    trailGrad.addColorStop(0, 'rgba(139, 0, 0, 0.5)')
    trailGrad.addColorStop(0.3, 'rgba(139, 0, 0, 0.2)')
    trailGrad.addColorStop(1, 'rgba(139, 0, 0, 0)')
    ctx.fillStyle = trailGrad
    ctx.beginPath()
    ctx.moveTo(-bodyW * 0.3, bodyH * 0.3)
    ctx.lineTo(bodyW * 0.3, bodyH * 0.3)
    ctx.lineTo(bodyW * 0.1, bodyH * 0.3 + trailLen)
    ctx.lineTo(-bodyW * 0.1, bodyH * 0.3 + trailLen)
    ctx.closePath()
    ctx.fill()

    if (scale > 0.3) {
      const glowR = baseSize * 0.8
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR)
      glow.addColorStop(0, 'rgba(139, 0, 0, 0.08)')
      glow.addColorStop(1, 'rgba(139, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, glowR, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      draw()
      requestAnimationFrame(loop)
    }
    loop()
    return () => { running = false }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 20 }}
    />
  )
}
