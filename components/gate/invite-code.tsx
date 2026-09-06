'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const LENGTH = 4
const VERIFY_MS = 1400
const REJECT_HOLD_MS = 2600

type Status = 'idle' | 'verifying' | 'rejected'

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Cod de invitație',
  verifying: 'Se verifică…',
  rejected: 'Cod nerecunoscut — acces doar prin invitație directă',
}

export function InviteCode({ ready }: { ready: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [focused, setFocused] = useState(false)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const runVerification = () => {
    setStatus('verifying')
    timers.current.push(
      window.setTimeout(() => setStatus('rejected'), VERIFY_MS),
      window.setTimeout(() => {
        setStatus('idle')
        setValue('')
      }, VERIFY_MS + REJECT_HOLD_MS),
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'idle') return
    const next = event.target.value
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, LENGTH)
    setValue(next)
    if (next.length === LENGTH) runVerification()
  }

  const activeIndex = Math.min(value.length, LENGTH - 1)

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 14 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.8, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative"
        animate={status === 'rejected' ? { x: [0, -7, 7, -5, 5, -2, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={status !== 'idle'}
          maxLength={LENGTH}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Cod de invitație, patru caractere"
          aria-describedby="invite-status"
          className="absolute inset-0 z-10 cursor-text opacity-0 disabled:cursor-default"
        />

        <div aria-hidden="true" className="flex gap-2.5 md:gap-3">
          {Array.from({ length: LENGTH }, (_, i) => {
            const char = value[i]
            const isActive = focused && status === 'idle' && i === activeIndex
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={
                  ready
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.88 }
                }
                transition={{
                  duration: 0.5,
                  delay: 1.3 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'flex h-16 w-13 items-center justify-center rounded-sm border bg-foreground/[0.025] font-mono text-2xl tracking-wider transition-colors duration-300 md:h-[72px] md:w-[58px]',
                  status === 'rejected'
                    ? 'border-muted-foreground/50'
                    : isActive
                      ? 'border-foreground/55'
                      : char
                        ? 'border-foreground/30'
                        : 'border-border',
                )}
              >
                {char ? (
                  <span
                    className={
                      status === 'rejected'
                        ? 'text-muted-foreground'
                        : 'text-foreground'
                    }
                  >
                    {char}
                  </span>
                ) : isActive ? (
                  <span className="h-6 w-px animate-caret bg-foreground" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-foreground/20" />
                )}
              </motion.div>
            )
          })}
        </div>

        {status === 'verifying' && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-px bg-signal shadow-[0_0_14px_1px_var(--signal)]"
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: ['0%', '100%', '0%'], opacity: [0, 1, 1, 1, 0] }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      <p
        id="invite-status"
        aria-live="polite"
        className={cn(
          'min-h-8 max-w-xs text-center font-mono text-[10px] leading-relaxed tracking-[0.3em] uppercase transition-colors duration-300 md:min-h-9 md:text-[11px]',
          status === 'verifying' ? 'text-signal' : 'text-muted-foreground',
        )}
      >
        {STATUS_LABEL[status]}
      </p>
    </motion.div>
  )
}
