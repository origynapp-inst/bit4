'use client'

import { useEffect, useRef } from 'react'

const SPACING = 28
const POINTER_RADIUS = 170
const BASE_ALPHA = 0.085
const PULSE_CELLS_PER_MS = 0.028
/** A dot flips from a round "0" into a square "1" past this energy. */
const FLIP_THRESHOLD = 0.42

type Pulse = {
  row: number
  col: number
  length: number
  elapsed: number
  gold: boolean
  lit: number
}

export function BitField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const rootStyle = getComputedStyle(document.documentElement)
    const dotRgb =
      rootStyle.getPropertyValue('--canvas-dot').trim() || '236 234 229'
    const signalRgb =
      rootStyle.getPropertyValue('--canvas-signal').trim() || '228 196 122'
    const [dr, dg, db] = dotRgb.split(/\s+/).map(Number)
    const [sr, sg, sb] = signalRgb.split(/\s+/).map(Number)

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let offsetX = 0
    let offsetY = 0
    let energy = new Float32Array(0)
    let gold = new Float32Array(0)

    const pointer = { x: -9999, y: -9999, active: false }
    let pulses: Pulse[] = []
    let nextPulseIn = 600
    let last = performance.now()
    let frame = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / SPACING) + 1
      rows = Math.ceil(height / SPACING) + 1
      offsetX = (width - (cols - 1) * SPACING) / 2
      offsetY = (height - (rows - 1) * SPACING) / 2
      energy = new Float32Array(cols * rows)
      gold = new Float32Array(cols * rows)
      pulses = []
    }

    const spawnPulse = () => {
      pulses.push({
        row: Math.floor(Math.random() * rows),
        col: Math.floor(Math.random() * Math.max(1, cols - 12)),
        length: 8 + Math.floor(Math.random() * 12),
        elapsed: 0,
        gold: Math.random() < 0.22,
        lit: -1,
      })
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${BASE_ALPHA})`
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * SPACING
          const y = offsetY + r * SPACING
          ctx.beginPath()
          ctx.arc(x, y, 1.1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now

      nextPulseIn -= dt
      if (nextPulseIn <= 0) {
        spawnPulse()
        nextPulseIn = 700 + Math.random() * 1400
      }

      for (const pulse of pulses) {
        pulse.elapsed += dt
        const head = Math.floor(pulse.elapsed * PULSE_CELLS_PER_MS)
        while (pulse.lit < head && pulse.lit < pulse.length) {
          pulse.lit++
          const c = pulse.col + pulse.lit
          if (c < cols) {
            const i = pulse.row * cols + c
            energy[i] = Math.max(energy[i], 0.95)
            if (pulse.gold) gold[i] = 1
          }
        }
      }
      pulses = pulses.filter((p) => p.lit < p.length)

      const decay = Math.pow(0.9, dt / 16.67)
      const goldDecay = Math.pow(0.94, dt / 16.67)
      const radiusSq = POINTER_RADIUS * POINTER_RADIUS

      ctx.clearRect(0, 0, width, height)

      for (let r = 0; r < rows; r++) {
        const y = offsetY + r * SPACING
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = offsetX + c * SPACING

          let e = energy[i] * decay
          if (pointer.active) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            const distSq = dx * dx + dy * dy
            if (distSq < radiusSq) {
              const falloff = 1 - Math.sqrt(distSq) / POINTER_RADIUS
              e = Math.max(e, falloff * falloff)
            }
          }
          energy[i] = e
          const g = (gold[i] *= goldDecay)

          const alpha = BASE_ALPHA + e * 0.6
          const cr = dr + (sr - dr) * g
          const cg = dg + (sg - dg) * g
          const cb = db + (sb - db) * g
          ctx.fillStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha})`

          if (e > FLIP_THRESHOLD) {
            const side = 2.2 + e * 2.6
            ctx.fillRect(x - side / 2, y - side / 2, side, side)
          } else {
            ctx.beginPath()
            ctx.arc(x, y, 1.1 + e * 1.2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      frame = requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      drawStatic()
      return () => window.removeEventListener('resize', resize)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
