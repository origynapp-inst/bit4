'use client'

import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import { BitMark } from './bit-mark'

const REVEAL = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

export function SiteHeader({ ready }: { ready: boolean }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
      <a
        href="/"
        aria-label="Bit4 — pagina principală"
        className="flex items-center gap-3"
      >
        <span className="flex size-5 items-center justify-center md:size-[22px]">
          {ready && (
            <BitMark layoutId="bit4-mark" className="w-5 md:w-[22px]" />
          )}
        </span>
        <motion.span
          className="font-sans text-[13px] font-semibold tracking-[0.32em] text-foreground"
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          animate={
            ready
              ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
              : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
          }
          transition={{ ...REVEAL, delay: 0.75 }}
        >
          BIT4
        </motion.span>
      </a>

      <motion.div
        className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground md:text-[11px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ ...REVEAL, delay: 0.9 }}
      >
        <Lock className="size-3 text-foreground/50" strokeWidth={1.5} aria-hidden="true" />
        <span>Acces privat</span>
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-signal-pulse rounded-full bg-signal" />
          <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
        </span>
      </motion.div>
    </header>
  )
}
