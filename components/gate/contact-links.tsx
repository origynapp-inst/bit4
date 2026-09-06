'use client'

import { motion } from 'motion/react'
import { Mail, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Contact = {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

const CONTACTS: Contact[] = [
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@bit4company.com',
    href: 'mailto:info@bit4company.com',
  },
  {
    icon: MapPin,
    label: 'Locație',
    value: 'Chișinău, Moldova',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

export function ContactLinks({ ready }: { ready: boolean }) {
  return (
    <section
      aria-labelledby="contact-heading"
      className="flex flex-col items-center gap-6 md:gap-7"
    >
      <motion.h2
        id="contact-heading"
        className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.7 }}
      >
        Nu ai o invitație? Contactează-ne
      </motion.h2>

      <ul className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10 md:gap-14">
        {CONTACTS.map((contact, index) => {
          const Icon = contact.icon
          const inner = (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-foreground/[0.03] text-foreground/70 transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                  {contact.label}
                </span>
                <span className="relative text-sm text-foreground md:text-[15px]">
                  {contact.value}
                  {contact.href && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  )}
                </span>
              </span>
            </>
          )

          return (
            <motion.li
              key={contact.label}
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.7, delay: 1.8 + index * 0.1, ease: EASE }}
            >
              {contact.href ? (
                <a
                  href={contact.href}
                  className="group flex items-center gap-3.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  {inner}
                </a>
              ) : (
                <div className="group flex items-center gap-3.5">{inner}</div>
              )}
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
