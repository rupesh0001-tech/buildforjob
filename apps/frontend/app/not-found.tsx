"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from '@/lib/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
             <span className="text-[12rem] md:text-[16rem] font-black text-black/5 dark:text-white/5 leading-none select-none">
               404
             </span>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-2xl relative">
                   <Search size={64} className="text-purple-500 animate-pulse" />
                   {/* Orbiting particles */}
                   <div className="absolute inset-0 animate-spin-slow">
                      <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-blue-500 blur-sm" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Lost in Space?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you're looking for has drifted out of reach. Let's get you back to familiar territory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:scale-[1.05] transition-transform shadow-xl w-full sm:w-auto justify-center"
            >
              <Home size={18} />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors w-full sm:w-auto justify-center border border-gray-200 dark:border-white/5"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
