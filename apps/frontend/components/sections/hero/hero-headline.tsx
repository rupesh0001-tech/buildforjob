"use client";
import { motion } from "framer-motion";
import { WordRotate } from "@/components/ui/word-rotate";
import { cn } from "@/lib/utils";

export function HeroHeadline() {
  return (
    <motion.h1 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }}
      className={cn('text-3xl', 'md:text-6xl', 'font-bold', 'tracking-tight', 'mb-6', 'leading-[1.1]', 'text-black', 'dark:text-white')}
    >
      Single platform for AI powered <br /> <WordRotate 
        className={cn('text-transparent', 'my-1', 'bg-clip-text', 'bg-gradient-to-r', 'from-blue-600', 'via-indigo-600', 'to-blue-500', 'dark:from-blue-400', 'dark:via-indigo-300', 'dark:to-blue-400')} 
        words={["Resume Builder ", "Cover Letter Builder", "Portfolio Builder", "ATS Checker"]} 
      />
      <br className={cn('hidden', 'md:block')} />
      <span className={cn('text', 'bg-clip-text', 'text-black', 'dark:text-white')}>
         faster with AI.
      </span>
    </motion.h1>
  );
}
