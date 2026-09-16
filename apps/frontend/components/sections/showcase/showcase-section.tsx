"use client";
import React from "react";
import { Zap, Check, ArrowRight, Sparkles, Award } from '@/lib/icons';
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";

export function ShowcaseSection() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-transparent to-gray-100 dark:to-black/50 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
           <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm tracking-widest uppercase mb-4">
             <Zap size={16} /> Intelligent Editor
           </div>
           <h2 className="text-2xl md:text-5xl font-bold mb-4 leading-tight text-black dark:text-white">Write bullet points that actually get read.</h2>
           <ScrollRevealParagraph 
             className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-6"
             paragraph="Our AI analyzes job descriptions and suggests highly specific rewrite rules for your experience. It converts passive language into active, results-driven metrics."
           />
           
           <ul className="space-y-4 mb-8">
             {[
               "Context-aware grammar corrections",
               "Action-verb suggestion engine",
               "Automatic skill highlighting",
               "Real-time preview side-by-side"
             ].map((text, i) => (
               <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                 <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full p-1"><Check size={14} /></div>
                 {text}
               </li>
             ))}
           </ul>

           <button className="flex items-center gap-2 text-black dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
             Explore the editor <ArrowRight size={16} />
           </button>
        </div>

        <div className="relative">
           <div className="absolute -inset-4 bg-linear-to-tr from-purple-500/10 to-blue-500/10 dark:from-purple-500/30 dark:to-blue-500/30 blur-2xl rounded-full opacity-50" />
           <div className="relative rounded-2xl bg-white dark:bg-[#0f0f13] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden text-sm">
             <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex gap-2">
                <div className="text-gray-500 dark:text-gray-400 pb-1 border-b-2 border-transparent">Original</div>
                <div className="text-purple-600 dark:text-purple-400 pb-1 border-b-2 border-purple-500 ml-4 font-medium flex items-center gap-2">
                  <Sparkles size={14} /> AI Rewritten
                </div>
             </div>
             <div className="p-6">
                <div className="text-gray-500 line-through mb-4">
                  - Responsible for managing database and making it faster.
                </div>
                <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl p-4 text-gray-800 dark:text-gray-200 shadow-inner">
                  <div className="flex gap-3">
                    <Award className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" size={18} />
                    <p>Optimized PostgreSQL database performance, reducing query latency by <strong>40%</strong> and supporting a 10x increase in daily active users.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
