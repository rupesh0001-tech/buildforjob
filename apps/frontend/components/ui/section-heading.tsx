import React from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={cn("text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white tracking-tight", className)}>
      {children}
    </h2>
  );
}
