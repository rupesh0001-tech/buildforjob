"use client";
import { ArrowRight } from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroBtnProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export function HeroBtn({ text = "Start Building Now", onClick, className }: HeroBtnProps) {
  return (
    <Button 
      variant="primary" 
      className={cn("w-full sm:w-auto overflow-hidden group cursor-pointer", className)} 
      onClick={onClick}
    >
      {text}
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}
