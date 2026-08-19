import React, { useRef, useEffect, useCallback } from 'react'
import type { TimelineState } from '../timeline'

interface Props {
  state: TimelineState
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: number
}

interface GridLine {
  x1: number
  y1: number
  x2: number
  y2: number
  progress: number
}

export function DigitalCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const gridRef = useRef<GridLine[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const particles: Particle[] = []
    for (let i = 0; i < 120; i++) {
      particles.push(createParticle(Math.random()))
    }
    particlesRef.current = particles

    const lines: GridLine[] = []
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 0.5
      lines.push({
        x1: 0.5 + Math.cos(angle) * dist,
        y1: 0.5 + Math.sin(angle) * dist,
        x2: 0.5 + Math.cos(angle) * (dist + 0.1 + Math.random() * 0.3),
        y2: 0.5 + Math.sin(angle) * (dist + 0.1 + Math.random() * 0.3),
        progress: Math.random(),
      })
    }
    gridRef.current = lines
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    timeRef.current += 0.015
    const t = timeRef.current

    ctx.clearRect(0, 0, w, h)

    if (state.digitalOpacity < 0.01) return

    ctx.globalAlpha = state.digitalOpacity

    const bgG = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
    bgG.addColorStop(0, 'rgba(15, 5, 25, 0.9)')
    bgG.addColorStop(1, 'rgba(5, 2, 10, 0.95)')
    ctx.fillStyle = bgG
    ctx.fillRect(0, 0, w, h)

    gridRef.current.forEach((line, i) => {
      const reveal = clamp01((state.digitalOpacity - line.progress * 0.3) * 2)
      if (reveal < 0.01) return

      const lx1 = line.x1 * w
      const ly1 = line.y1 * h
      const lx2 = line.x2 * w
      const ly2 = line.y2 * h

      const flowOffset = (t * 0.5 + line.progress) % 1

      ctx.strokeStyle = `rgba(139, 0, 0, ${0.15 * reveal})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(lx1, ly1)
      ctx.lineTo(lx2, ly2)
      ctx.stroke()

      const dotX = lx1 + (lx2 - lx1) * flowOffset
      const dotY = ly1 + (ly2 - ly1) * flowOffset
      ctx.fillStyle = `rgba(200, 50, 50, ${0.6 * reveal})`
      ctx.beginPath()
      ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let r = 0; r < 5; r++) {
      const radius = 50 + r * 60
      const ringAlpha = clamp01((state.digitalOpacity - r * 0.1) * 1.5) * 0.12
      if (ringAlpha < 0.01) continue

      ctx.strokeStyle = `rgba(139, 0, 0, ${ringAlpha})`
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 8])
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }

    particlesRef.current.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.008

      if (p.life <= 0) {
        Object.assign(p, createParticle(0))
        p.x = Math.random()
        p.y = Math.random()
      }

      const px = p.x * w
      const py = p.y * h
      const alpha = clamp01(p.life / p.maxLife) * state.digitalOpacity

      ctx.fillStyle = `hsla(${p.hue}, 70%, 50%, ${alpha * 0.7})`
      ctx.beginPath()
      ctx.arc(px, py, p.size * (1 + state.digitalOpacity), 0, Math.PI * 2)
      ctx.fill()
    })

    const hexSize = 30
    const hexCols = Math.ceil(w / (hexSize * 1.7)) + 1
    const hexRows = Math.ceil(h / (hexSize * 1.5)) + 1
    const hexAlpha = clamp01(state.digitalOpacity - 0.3) * 0.06

    if (hexAlpha > 0.005) {
      ctx.strokeStyle = `rgba(139, 0, 0, ${hexAlpha})`
      ctx.lineWidth = 0.3
      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          const hx = col * hexSize * 1.7 + (row % 2) * hexSize * 0.85
          const hy = row * hexSize * 1.5
          const dist = Math.hypot(hx - w / 2, hy - h / 2) / (w * 0.5)
          const hxA = hexAlpha * clamp01(1 - dist * 1.5)
          if (hxA < 0.003) continue

          ctx.globalAlpha = hxA
          drawHexagon(ctx, hx, hy, hexSize * 0.4)
        }
      }
      ctx.globalAlpha = 1
    }
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10 }}
    />
  )
}

function createParticle(seed: number): Particle {
  return {
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.001,
    vy: (Math.random() - 0.5) * 0.001,
    size: 1 + Math.random() * 2,
    life: 0.5 + Math.random() * 0.5,
    maxLife: 0.5 + Math.random() * 0.5,
    hue: 350 + Math.random() * 20,
  }
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const px = x + r * Math.cos(angle)
    const py = y + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
}

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }
