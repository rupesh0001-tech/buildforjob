import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "emerald" | "blue";
  className?: string;
}

export function Badge({ children, variant = "purple", className }: BadgeProps) {
  const variants = {
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
  };
  
  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium tracking-wide", variants[variant], className)}>
      {children}
    </div>
  );
}
