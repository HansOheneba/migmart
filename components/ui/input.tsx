import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-(--ink-900) outline-none ring-(--green-700) transition placeholder:text-(--ink-400) focus:ring-2",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
