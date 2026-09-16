import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 hover:shadow-lg shadow-primary/25 active:scale-[0.98]",
    secondary: "bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary hover:bg-primary/10 font-medium",
    outline: "border border-primary text-primary hover:bg-primary/5",
    ghost: "text-gray-600 dark:text-gray-300 hover:text-primary font-medium px-4 py-2"
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
