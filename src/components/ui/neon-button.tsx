"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const neonButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] text-white",
          "shadow-[0_0_20px_rgba(79,70,229,0.4)]",
          "hover:shadow-[0_0_30px_rgba(79,70,229,0.6),0_0_60px_rgba(34,211,238,0.3)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        secondary: [
          "bg-transparent text-[#E5E7EB]",
          "border border-[#4F46E5]/50",
          "shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]",
          "hover:border-[#4F46E5]",
          "hover:shadow-[0_0_20px_rgba(79,70,229,0.3),inset_0_0_20px_rgba(79,70,229,0.15)]",
          "hover:bg-[#4F46E5]/10",
          "active:scale-[0.98]",
        ],
        ghost: [
          "bg-transparent text-[#E5E7EB]",
          "hover:bg-[#4F46E5]/10",
          "hover:text-[#22D3EE]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-8 px-4 text-sm rounded-lg",
        md: "h-10 px-6 text-sm rounded-xl",
        lg: "h-12 px-8 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(neonButtonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
NeonButton.displayName = "NeonButton"

export { NeonButton, neonButtonVariants }
