"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2000,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <div className="relative inline-block align-top overflow-hidden">
      <span className={cn("opacity-0 pointer-events-none block px-1", className)}>
        {longestWord}
      </span>
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("absolute inset-x-0 top-0 text-center px-1 block", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
