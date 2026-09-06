'use client'

import { motion } from 'motion/react'
import { EyeOff, Fingerprint, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const PILLARS: { icon: LucideIcon; label: string }[] = [
  { icon: Lock, label: 'Confidențial' },
  { icon: Fingerprint, label: 'Selectiv' },
  { icon: EyeOff, label: 'Discret' },
]

export function Pillars({ ready }: { ready: boolean }) {
  return (
    <ul
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-0"
      aria-label="Principii"
    >
      {PILLARS.map((pillar, index) => {
        const Icon = pillar.icon
        return (
          <motion.li
            key={pillar.label}
            className="group flex items-center gap-2.5 sm:border-l sm:border-border sm:px-6 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0 md:px-7"
            initial={{ opacity: 0, y: 8 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.6,
              delay: 1.5 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Icon
              className="size-4 text-foreground/45 transition-colors duration-300 group-hover:text-signal"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              {pillar.label}
            </span>
          </motion.li>
        )
      })}
    </ul>
  )
}
