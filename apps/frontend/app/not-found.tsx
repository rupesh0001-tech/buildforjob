"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/sections/navbar/navbar";
import { FooterSection } from "@/components/sections/footer/footer-section";
import { ArrowLeft, Home, LayoutDashboard, BookOpen, FileQuestion } from "@/lib/icons";

export default function NotFound() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 flex flex-col items-center justify-center flex-grow">
        <div className="max-w-xl w-full bg-white/70 dark:bg-[#110e20]/80 backdrop-blur-xl border border-slate-200/80 dark:border-purple-900/40 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center">
          
          {/* Glowing 404 Icon Badge */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
              <FileQuestion size={38} />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 mb-4 uppercase tracking-widest">
            Error 404
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Page Lost in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Screening.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            The page you are looking for doesn't exist, was renamed, or has been filtered out by our ATS algorithms.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link href="/">
              <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Home size={16} />
                <span>Back to Home</span>
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-purple-950/60 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-purple-900/60 border border-slate-200/80 dark:border-purple-800/50 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                <LayoutDashboard size={16} />
                <span>Go to Dashboard</span>
              </button>
            </Link>

            <Link href="/blogs">
              <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-purple-950/60 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-purple-900/60 border border-slate-200/80 dark:border-purple-800/50 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                <BookOpen size={16} />
                <span>Read Blog</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
