import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-mono font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-muted text-foreground",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive",
        outline:
          "border-border text-foreground bg-transparent",
        news:
          "border-transparent bg-surface-dark text-on-dark px-2 py-0.5",
        success:
          "border-success/30 bg-success/10 text-success",
        warning:
          "border-warning/30 bg-warning/10 text-warning",
        info:
          "border-accent/30 bg-accent/10 text-accent",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
  isBracketed?: boolean;
}

function Badge({ className, variant, dotColor, isBracketed = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {isBracketed ? `[${children}]` : children}
    </div>
  );
}

export { Badge, badgeVariants };
