"use client";
import React from "react";
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";
import { cn } from "@/lib/utils";

export function FeaturesHeader() {
  return (
    <div className={cn('mb-16', 'text-center', 'flex', 'flex-col', 'items-center')}>
      <h2 className={cn('text-3xl', 'md:text-5xl', 'font-bold', 'mb-6', 'text-black', 'dark:text-white', 'tracking-tight')}>
        The <span className={cn('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-blue-600', 'via-indigo-600', 'to-blue-500', 'dark:from-blue-400', 'dark:via-indigo-300', 'dark:to-blue-400')}>ultimate toolkit</span> for your job hunt.
      </h2>
      <ScrollRevealParagraph 
        className={cn('text-gray-600', 'dark:text-gray-400', 'text-lg', 'max-w-2xl', 'mx-auto', 'text-center')}
        paragraph="We replaced multiple scattered tools with one powerful platform. Everything you need to land interviews, organized in one place."
      />
    </div>
  );
}
