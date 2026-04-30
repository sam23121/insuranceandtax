import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-navy text-white',
        secondary: 'border-transparent bg-brand-cream text-brand-navy',
        upcoming: 'border-transparent bg-sky-100 text-sky-800',
        completed: 'border-transparent bg-emerald-100 text-emerald-800',
        cancelled: 'border-transparent bg-rose-100 text-rose-800',
        outline: 'text-ink border-brand-navy/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
