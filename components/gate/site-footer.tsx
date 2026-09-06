'use client'

import { motion } from 'motion/react'

export function SiteFooter({ ready, year }: { ready: boolean; year: number }) {
  return (
    <footer className="relative z-10 px-6 pb-6 md:px-10 md:pb-8">
      <motion.div
        aria-hidden="true"
        className="h-px w-full origin-left bg-border"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="flex flex-col gap-2 pt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:text-[11px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 2.2 }}
      >
        <p>© {year} Bit4 · Toate drepturile rezervate</p>
        <p className="tabular-nums">
          47.0105° N <span className="mx-2 text-foreground/25">·</span> 28.8638° E
        </p>
      </motion.div>
    </footer>
  )
}
