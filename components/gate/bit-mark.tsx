'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** 4 in binary — the single lit cell is the whole identity. */
export const BIT4_PATTERN = 0b0100

type BitMarkProps = {
  bits?: number
  visibleCells?: number
  accent?: boolean
  glow?: boolean
  layoutId?: string
  className?: string
}

export function BitMark({
  bits = BIT4_PATTERN,
  visibleCells = 4,
  accent = true,
  glow = false,
  layoutId,
  className,
}: BitMarkProps) {
  return (
    <motion.div
      layoutId={layoutId}
      aria-hidden="true"
      className={cn('grid aspect-square grid-cols-2', className)}
      style={{ gap: '11%' }}
      transition={{ layout: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
    >
      {Array.from({ length: 4 }, (_, index) => {
        const isOn = ((bits >> (3 - index)) & 1) === 1
        const isVisible = index < visibleCells
        return (
          <span
            key={index}
            className={cn(
              'block rounded-[6%] transition-[background-color,box-shadow,opacity,transform] duration-150 ease-out',
              isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
              isOn
                ? accent
                  ? 'bg-signal'
                  : 'bg-foreground'
                : 'bg-foreground/[0.14]',
              isOn && accent && glow && 'shadow-[0_0_28px_2px_var(--signal)]',
            )}
          />
        )
      })}
    </motion.div>
  )
}
