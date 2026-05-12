import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/10 bg-white/95 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
