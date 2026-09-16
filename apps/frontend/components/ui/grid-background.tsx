import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  height?: string;
}

export function GridBackground({ className, height = "h-[800px]" }: GridBackgroundProps) {
  return (
    <div className={cn(`absolute inset-0 -z-10 w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`, height, className)}></div>
  );
}
