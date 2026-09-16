"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code } from '@/lib/icons';
import { HeroBtn } from "@/components/general/buttons/hero-btn";
import { Button2 } from "@/components/general/buttons/button2";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function HeroCta() {
  return (
    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <HeroBtn text="Start Building Now" />
      <Button2 className="w-full sm:w-auto">
        <Code size={18} />
        Import Your GitHub
      </Button2>
    </motion.div>
  );
} 
