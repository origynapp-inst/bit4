'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const SHUFFLE_INTERVAL = 48

type DecryptTextProps = {
  text: string
  start: boolean
  delay?: number
  stagger?: number
  className?: string
}

/** Deterministic placeholder so server and client render the same markup. */
function seedScramble(text: string) {
  return text
    .split('')
    .map((char, i) => (char === ' ' ? ' ' : i % 2 ? '1' : '0'))
}

function randomScramble(text: string) {
  return text
    .split('')
    .map((char) => (char === ' ' ? ' ' : Math.random() < 0.5 ? '0' : '1'))
}

export function DecryptText({
  text,
  start,
  delay = 0,
  stagger = 42,
  className,
}: DecryptTextProps) {
  const chars = useMemo(() => text.split(''), [text])
  const [scramble, setScramble] = useState(() => seedScramble(text))
  const [resolvedCount, setResolvedCount] = useState(0)

  useEffect(() => {
    if (!start) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setResolvedCount(chars.length)
      return
    }

    let frame = 0
    let lastShuffle = 0
    const startedAt = performance.now() + delay

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const nextResolved =
        elapsed < 0
          ? 0
          : Math.min(chars.length, Math.floor(elapsed / stagger) + 1)

      setResolvedCount(nextResolved)

      if (now - lastShuffle > SHUFFLE_INTERVAL) {
        setScramble(randomScramble(text))
        lastShuffle = now
      }

      if (nextResolved < chars.length) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, delay, stagger, chars.length, text])

  return (
    <span className={cn('relative inline-block', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, i) => {
          const isResolved = i < resolvedCount
          return (
            <span
              key={i}
              className={cn(
                'transition-opacity duration-200',
                isResolved ? 'opacity-100' : 'opacity-30',
              )}
            >
              {isResolved ? char : scramble[i]}
            </span>
          )
        })}
      </span>
    </span>
  )
}
