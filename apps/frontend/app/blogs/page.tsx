"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar/navbar";
import { FooterSection } from "@/components/sections/footer/footer-section";
import { BookOpen, Sparkles, ArrowLeft, Mail } from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { Button1 } from "@/components/general/buttons/button1";

export default function BlogsComingSoon() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        theme={theme}
        setTheme={setTheme}
      />
      
      <main className="relative z-10 pt-32 pb-16 px-6 flex flex-col items-center justify-center flex-grow">
        <div className="max-w-xl w-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center">
          
          {/* Animated/Glowing Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <BookOpen size={28} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-4">
            <Sparkles size={12} className="animate-spin-slow" />
            <span>Coming Soon</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-4">
            BuildForJob <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600">Blog</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            We are crafting ultimate career guides, resume-building secrets, and ATS optimization advice to help you secure interviews fast.
          </p>

          {/* Subscription Form */}
          {subscribed ? (
            <div className="w-full p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
              🎉 Thank you! We'll notify you as soon as the blog goes live.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-2 mb-6">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm outline-hidden focus:border-purple-500 transition-colors text-black dark:text-white"
                />
              </div>
              <Button1 type="submit" className="py-3 px-6 h-auto whitespace-nowrap rounded-2xl">
                Notify Me
              </Button1>
            </form>
          )}

          <Link href="/">
            <Button variant="ghost" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
