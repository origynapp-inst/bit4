'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BitField } from './bit-field'
import { ContactLinks } from './contact-links'
import { DecryptText } from './decrypt-text'
import { IntroSequence } from './intro-sequence'
import { InviteCode } from './invite-code'
import { Pillars } from './pillars'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

const EASE = [0.22, 1, 0.36, 1] as const

export function AccessGate({ year }: { year: number }) {
  const [phase, setPhase] = useState<'intro' | 'ready'>('intro')
  const ready = phase === 'ready'

  const complete = useCallback(() => setPhase('ready'), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('ready')
    }
  }, [])

  return (
    <>
      <BitField />

      <AnimatePresence>
        {phase === 'intro' && (
          <IntroSequence key="intro" onComplete={complete} />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader ready={ready} />

        <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-10 text-center md:gap-14 md:py-12">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <motion.p
              className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground md:text-[11px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Chișinău · Republica Moldova
            </motion.p>

            <motion.h1
              className="max-w-5xl font-sans text-5xl font-light tracking-[-0.03em] text-balance text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ lineHeight: 0.98 }}
              initial={{ opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            >
              <DecryptText
                text="Construim în liniște."
                start={ready}
                delay={420}
                stagger={46}
              />
            </motion.h1>

            <motion.p
              className="max-w-md text-sm leading-relaxed text-pretty text-muted-foreground md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            >
              Nu suntem pentru toți. Accesul se acordă exclusiv prin invitație.
            </motion.p>
          </div>

          <InviteCode ready={ready} />

          <Pillars ready={ready} />
        </main>

        <div className="relative z-10 px-6 pb-10 md:pb-12">
          <ContactLinks ready={ready} />
        </div>

        <SiteFooter ready={ready} year={year} />
      </div>
    </>
  )
}
