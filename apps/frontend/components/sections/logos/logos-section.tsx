"use client";
import React from "react";

export function LogosSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 border-y border-black/5 dark:border-white/5">
      <p className="text-center text-sm text-gray-500 font-medium mb-8">BUILDING CAREERS AT TOP COMPANIES</p>
      <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-60 dark:opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-xl font-bold font-serif text-black dark:text-white"><div className="w-8 h-8 rounded bg-gray-300" /> Google</div>
        <div className="flex items-center gap-2 text-xl font-bold font-sans tracking-tighter text-black dark:text-white"><div className="w-8 h-8 rounded bg-blue-500" /> Meta</div>
        <div className="flex items-center gap-2 text-xl font-bold font-mono text-black dark:text-white"><div className="w-8 h-8 rounded bg-gray-800 dark:bg-black border border-gray-400 dark:border-white" /> Amazon</div>
        <div className="flex items-center gap-2 text-xl font-bold italic text-black dark:text-white"><div className="w-8 h-8 rounded bg-red-500" /> Netflix</div>
        <div className="flex items-center gap-2 text-xl font-bold text-black dark:text-white"><div className="w-8 h-8 rounded bg-slate-400 dark:bg-slate-200" /> Apple</div>
      </div>
    </div>
  );
}
