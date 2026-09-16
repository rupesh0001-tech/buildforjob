"use client";
import React, { useState, useEffect } from "react";
import { Briefcase, Globe, Code, Users, Camera } from '@/lib/icons';
import { useTheme } from "next-themes";

export function FooterSection() {
  const { theme } = useTheme();
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-10 mb-20 relative z-10">
        <div className="col-span-2 md:col-span-2">
           <div className="flex items-center gap-2 mb-6">
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 dark:from-white dark:to-gray-400">
              {theme === "light" ? <img src="./logo-black.png" width={140} height={140} alt="logo" /> : <img src="./logo-light.png" width={140} height={140} alt="logo" />}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            The AI platform built to reverse-engineer Applicant Tracking Systems and help you land interviews instantly.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Globe size={20} /></a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Code size={20} /></a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Users size={20} /></a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Camera size={20} /></a>
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-semibold text-black dark:text-white mb-4">Product</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-purple-500 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Templates</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Changelog</a></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h4 className="font-semibold text-black dark:text-white mb-4">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-purple-500 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Resume Guide</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Interview Prep</a></li>
            <li><a href="#" className="hover:text-purple-500 transition-colors">Help Center</a></li>
          </ul>
        </div>

        <div className="col-span-2">
          <h4 className="font-semibold text-black dark:text-white mb-4">Stay updated</h4>
          <p className="text-sm text-gray-500 mb-4">Join our newsletter for job hunting tips and template drops.</p>
          <div className="flex bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1 rounded-full shadow-xs">
            <input 
               type="email" 
               placeholder="your@email.com" 
               className="bg-transparent border-none outline-hidden px-4 text-sm w-full text-black dark:text-white"
            />
            <button className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-sm text-gray-500">
        <p>© 2026 BuildForJob Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      <div className="mt-20 flex justify-center w-full select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
         <h1 className="text-[12vw] font-black tracking-tighter leading-none m-0 p-0 text-black dark:text-white uppercase">BuildForJob</h1>
      </div>
    </footer>
  );
}
