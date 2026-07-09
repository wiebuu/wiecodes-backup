import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none border border-border bg-surface px-3 py-2 text-sm text-foreground ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-foreground-muted/50",
          "focus-visible:outline-none focus-visible:border-metallic-300 focus-visible:ring-0 focus-visible:bg-surface-secondary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "appearance-none -webkit-appearance-none -moz-appearance-none",
          "autofill:bg-transparent autofill:shadow-none",
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
