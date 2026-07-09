import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-metallic-300",
  {
    variants: {
      variant: {
        default: "border-metallic-300 bg-surface-secondary text-foreground hover:bg-surface",
        secondary: "border-border bg-surface text-foreground-muted hover:text-foreground",
        destructive: "border-destructive bg-destructive/10 text-red-400",
        outline: "border-border bg-transparent text-foreground-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
