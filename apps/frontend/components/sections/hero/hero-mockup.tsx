"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scaleUp } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

// Hero mockup interactive component preview
export function HeroMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      variants={scaleUp}
      className={cn('mt-12', 'sm:mt-16', 'relative', 'mx-auto', 'max-w-5xl', 'text-left')}
    >
      {/* Ambient background glow */}
      <div className={cn('absolute', '-inset-2', 'bg-gradient-to-r', 'from-purple-500/20', 'via-indigo-500/15', 'to-purple-600/20', 'rounded-[32px]', 'blur-2xl', 'opacity-75', '-z-10')} />

      {/* Main Glassmorphic Container */}
      <div className={cn('relative', 'rounded-xs', 'bg-white', 'dark:bg-[#0f0d1b]', 'shadow-2xl', 'shadow-purple-900/20', 'overflow-hidden', 'text-left', 'transition-all', 'duration-500', 'hover:shadow-purple-900/30')}>
        
        {/* Dashboard Image Canvas */}
        <div className={cn('relative', 'w-full', 'aspect-[16/9]', 'bg-gray-50', 'dark:bg-[#0c0a18]', 'overflow-hidden', 'group')}>
          <img 
            src="/main-dashboard.png" 
            alt="BuildForJob Dashboard Preview" 
            className={cn('w-full', 'h-[calc(100%+4px)]', '-mt-[2px]', 'object-cover', 'object-top', 'scale-[1.01]', 'origin-top', 'transition-transform', 'duration-700', 'ease-out')}
          />
          
          {/* Subtle overlay vignette */}
          <div className={cn('absolute', 'inset-0', 'pointer-events-none', 'bg-gradient-to-t', 'from-black/5', 'dark:from-black/30', 'via-transparent', 'to-transparent')} />
        </div>

      </div>
    </motion.div>
  );
}
