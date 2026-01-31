import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-widest",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#ccff00] text-black hover:bg-[#bbee00] shadow-[0_0_5px_rgba(204,255,0,0.5)]",
        secondary:
          "border-[#333] bg-[#111] text-white hover:bg-[#222]",
        destructive:
          "border-transparent bg-red-900 text-red-100 hover:bg-red-800",
        outline: "text-white border-[#ccff00]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
