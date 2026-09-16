"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  className?: string;
  large?: boolean;
  index: number;
}

export function FeatureCard({ title, desc, icon, className, large, index }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "rounded-3xl p-8 border hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 text-black dark:text-white">
          {React.cloneElement(icon as React.ReactElement<any>, { size: large ? 100 : 64 })}
      </div>
      <div className="bg-white/80 dark:bg-black/50 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-gray-200 dark:border-white/10 mb-4 z-10 shadow-sm">
        {icon}
      </div>
      <div className="z-10 mt-auto">
        <h3 className={cn("font-semibold mb-1 text-black dark:text-white", large ? "text-xl" : "text-lg")}>{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
