"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle } from '@/lib/icons';
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export function CtaSection() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative border border-gray-200 dark:border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-blue-50 to-white dark:from-purple-900/40 dark:via-blue-900/40 dark:to-black z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative z-10 py-20 px-8 md:px-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black dark:text-white">Stop applying into the void.</h2>
            <ScrollRevealParagraph 
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6"
              paragraph="Join 50,000+ job seekers who use BuildForJob to land interviews 3x faster."
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              {mounted && isAuthenticated ? (
                <Link href="/dashboard">
                  <button className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-base hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-base hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    Create Free Account
                  </button>
                </Link>
              )}
              <button className="px-6 py-3 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-black dark:text-white font-medium text-base hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                View Examples
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
             <div className="relative w-48 h-64 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-gray-300 dark:border-white/20 rounded-2xl p-4 shadow-2xl rotate-12 hover:rotate-6 transition-transform">
               <div className="h-4 w-full bg-gray-300 dark:bg-white/20 rounded mb-4" />
               <div className="space-y-2">
                 {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded" />)}
               </div>
               <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-white dark:text-black font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 -rotate-12">
                 <CheckCircle size={16} /> 95% Match
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
