import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-sm border border-border bg-secondary/50 px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 transition-colors select-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
