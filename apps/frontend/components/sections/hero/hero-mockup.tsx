"use client";
import { motion } from "framer-motion";
import { Lock } from '@/lib/icons';

export function HeroMockup() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mt-20 relative mx-auto max-w-5xl perspective-1000"
    >
      <div className="relative rounded-2xl border-[0.5px] border-black/5 dark:border-white/5 bg-white dark:bg-[#0c0c0e] shadow-2xl overflow-hidden flex transform-gpu rotate-x-12 scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out group">
        <div className="w-full relative overflow-hidden group">
          <img 
            src="/dashboard-dark.png" 
            alt="Dashboard Light" 
            className="w-full h-auto dark:hidden block transform group-hover:scale-[1.02] transition-transform duration-700" 
          />
          <img 
            src="/dashboard-light.png" 
            alt="Dashboard Dark" 
            className="w-full h-auto hidden dark:block transform group-hover:scale-[1.02] transition-transform duration-700" 
          />
        </div>
      </div>
    </motion.div>
  );
}
