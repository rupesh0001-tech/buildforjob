"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button2({ children, onClick, className, ...props }: ButtonProps) {
  return (
    <Button variant="secondary" onClick={onClick} className={cn("cursor-pointer", className)} {...props}>
      {children}
    </Button>
  );
}
