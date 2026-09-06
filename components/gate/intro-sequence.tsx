'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BIT4_PATTERN, BitMark } from './bit-mark'

/** Decelerating flicker — the lock "settles" instead of stopping abruptly. */
const FLICKER_STEPS = [55, 55, 60, 65, 70, 80, 90, 105, 120, 140, 165, 195, 235, 285]
const CELL_POP_START = 150
const CELL_POP_STAGGER = 110
const FLICKER_START = 720
const HOLD_AFTER_RESOLVE = 780

const PANEL_EXIT = {
  duration: 0.95,
  ease: [0.76, 0, 0.24, 1] as const,
}

/** Four panels part like a shutter: left, up, right, down. */
const PANELS = [
  { className: 'top-0 left-0', exit: { x: '-100%' } },
  { className: 'top-0 right-0', exit: { y: '-100%' } },
  { className: 'right-0 bottom-0', exit: { x: '100%' } },
  { className: 'bottom-0 left-0', exit: { y: '100%' } },
]

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [visibleCells, setVisibleCells] = useState(0)
  const [bits, setBits] = useState<number | null>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    const timers: number[] = []

    for (let i = 0; i < 4; i++) {
      timers.push(
        window.setTimeout(
          () => setVisibleCells(i + 1),
          CELL_POP_START + i * CELL_POP_STAGGER,
        ),
      )
    }

    let t = FLICKER_START
    for (const step of FLICKER_STEPS) {
      t += step
      timers.push(
        window.setTimeout(() => setBits(Math.floor(Math.random() * 16)), t),
      )
    }

    t += 140
    timers.push(
      window.setTimeout(() => {
        setBits(BIT4_PATTERN)
        setResolved(true)
      }, t),
    )

    timers.push(
      window.setTimeout(() => onCompleteRef.current(), t + HOLD_AFTER_RESOLVE),
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  const binary = bits === null ? '····' : bits.toString(2).padStart(4, '0')
  const hex = bits === null ? '·' : bits.toString(16).toUpperCase()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 overflow-hidden"
      data-intro
    >
      {PANELS.map((panel, index) => (
        <motion.div
          key={panel.className}
          className={`absolute h-1/2 w-1/2 bg-background ${panel.className}`}
          exit={panel.exit}
          transition={{ ...PANEL_EXIT, delay: index * 0.06 }}
        />
      ))}

      {/* Seams between the four panels — hinted right before they part. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-foreground/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: resolved ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-foreground/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: resolved ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10">
        <BitMark
          layoutId="bit4-mark"
          bits={bits ?? 0}
          visibleCells={visibleCells}
          accent={resolved}
          glow={resolved}
          className="w-[88px] md:w-[104px]"
        />

        <motion.div
          className="flex flex-col items-center gap-3 font-mono text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: bits === null ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] tracking-[0.45em] tabular-nums">
            <span className={resolved ? 'text-foreground' : undefined}>
              {binary}
            </span>
            <span className="mx-3 text-foreground/25">·</span>
            <span className={resolved ? 'text-signal' : undefined}>0x{hex}</span>
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/35">
            {resolved ? 'Acces · Bit4' : 'Inițializare'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
