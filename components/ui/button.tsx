import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-xs font-mono font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
        secondary:
          "bg-background text-foreground border border-border hover:bg-muted/80 hover:border-foreground/20 shadow-none",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-muted hover:border-foreground/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:bg-muted/70",
        link:
          "text-foreground underline-offset-4 hover:underline p-0 h-auto",
        tab:
          "bg-transparent text-muted-foreground hover:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground",
        glow:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        glass:
          "bg-card/80 backdrop-blur-sm text-foreground border border-border hover:bg-muted/80 hover:border-foreground/20",
      },
      size: {
        default: "h-9 px-4 py-1.5 gap-1.5",
        sm: "h-8 px-3 text-xs gap-1.5",
        lg: "h-10 px-5 text-sm font-semibold gap-2",
        icon: "h-9 w-9 p-0",
        iconSm: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
