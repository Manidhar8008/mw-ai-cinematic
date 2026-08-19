import React, { useRef, useEffect, useCallback } from 'react'
import type { TimelineState } from '../timeline'

interface Props {
  state: TimelineState
}

interface Cloud {
  x: number
  y: number
  w: number
  h: number
  speed: number
  opacity: number
  drift: number
}

interface StormCloud {
  x: number
  y: number
  radius: number
  pulse: number
}

export function AtmosphereCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cloudsRef = useRef<Cloud[]>([])
  const stormsRef = useRef<StormCloud[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    const clouds: Cloud[] = []
    for (let i = 0; i < 30; i++) {
      clouds.push({
        x: Math.random() * 2 - 0.5,
        y: Math.random(),
        w: 0.15 + Math.random() * 0.3,
        h: 0.03 + Math.random() * 0.06,
        speed: 0.0002 + Math.random() * 0.0005,
        opacity: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.001,
      })
    }
    cloudsRef.current = clouds

    const storms: StormCloud[] = []
    for (let i = 0; i < 5; i++) {
      storms.push({
        x: 0.3 + Math.random() * 0.4,
        y: 0.15 + Math.random() * 0.25,
        radius: 80 + Math.random() * 150,
        pulse: Math.random() * Math.PI * 2,
      })
    }
    stormsRef.current = storms
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const t = state.progress
    const time = frameRef.current * 0.01

    ctx.clearRect(0, 0, w, h)

    if (state.atmosphereOpacity < 0.01) return

    ctx.globalAlpha = state.atmosphereOpacity

    const skyTop = lerpColor([10, 15, 40], [5, 5, 15], clamp01(t * 2))
    const skyMid = lerpColor([25, 40, 80], [8, 8, 20], clamp01(t * 2))
    const skyBot = lerpColor([60, 80, 120], [10, 10, 25], clamp01(t * 2))

    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, rgb(skyTop))
    grad.addColorStop(0.5, rgb(skyMid))
    grad.addColorStop(1, rgb(skyBot))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    const stormAlpha = clamp01(state.windIntensity * 1.5) * state.atmosphereOpacity
    if (stormAlpha > 0.01) {
      stormsRef.current.forEach((storm) => {
        const pulse = Math.sin(time * 0.5 + storm.pulse) * 0.3 + 0.7
        const sx = storm.x * w
        const sy = storm.y * h - state.cameraDistance * 15
        const sr = storm.radius * (1 + state.cameraDistance * 0.1)

        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
        sg.addColorStop(0, `rgba(40, 30, 60, ${stormAlpha * pulse * 0.6})`)
        sg.addColorStop(0.5, `rgba(25, 20, 40, ${stormAlpha * pulse * 0.3})`)
        sg.addColorStop(1, 'rgba(15, 10, 25, 0)')
        ctx.fillStyle = sg
        ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2)

        if (Math.random() < 0.003 * state.windIntensity) {
          const lx = sx + (Math.random() - 0.5) * sr
          const ly = sy + (Math.random() - 0.5) * sr * 0.5
          ctx.strokeStyle = `rgba(180, 170, 220, ${stormAlpha * 0.8})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(lx, ly)
          let px = lx, py = ly
          for (let s = 0; s < 6; s++) {
            px += (Math.random() - 0.5) * 30
            py += 15 + Math.random() * 20
            ctx.lineTo(px, py)
          }
          ctx.stroke()
        }
      })
    }

    cloudsRef.current.forEach((cloud) => {
      cloud.x += cloud.speed + state.windIntensity * 0.002
      cloud.y += cloud.drift
      if (cloud.x > 1.5) cloud.x = -0.5

      const cx = cloud.x * w
      const cy = cloud.y * h - state.cameraDistance * 8
      const cw = cloud.w * w * (1 + state.cameraDistance * 0.15)
      const ch = cloud.h * h

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw * 0.5)
      cg.addColorStop(0, `rgba(180, 190, 210, ${cloud.opacity * state.atmosphereOpacity})`)
      cg.addColorStop(0.6, `rgba(120, 130, 150, ${cloud.opacity * 0.4 * state.atmosphereOpacity})`)
      cg.addColorStop(1, 'rgba(80, 90, 110, 0)')
      ctx.fillStyle = cg
      ctx.beginPath()
      ctx.ellipse(cx, cy, cw * 0.5, ch * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let i = 0; i < 60; i++) {
      const wx = ((i * 137.508 + time * 200 * state.windIntensity) % w)
      const wy = ((i * 97.31 + time * 50) % h)
      const wl = 10 + state.windIntensity * 40 + Math.random() * 20
      ctx.strokeStyle = `rgba(200, 210, 230, ${0.03 * state.windIntensity})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(wx, wy)
      ctx.lineTo(wx + wl, wy - wl * 0.1)
      ctx.stroke()
    }

    frameRef.current++
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function rgb(c: [number, number, number]) {
  return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`
}
