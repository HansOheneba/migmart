import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
          variant === "primary" &&
            "bg-(--green-700) text-white hover:bg-(--green-800)",
          variant === "secondary" &&
            "bg-white text-(--ink-900) ring-1 ring-black/10 hover:bg-(--sand-100)",
          variant === "ghost" && "text-(--ink-700) hover:bg-black/5",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
