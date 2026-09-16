"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Bell, Coins } from '@/lib/icons';
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserDropdown } from "@/components/general/user-dropdown";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardHeader({ isSidebarOpen, setIsSidebarOpen }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPro = user?.plan === "PRO";
  const totalTokens = isPro ? 50.0 : 5.0;
  const tokenBalance = user?.tokens ?? 5.0;
  const tokensUsed = Math.max(0, totalTokens - tokenBalance);

  if (!mounted) {
    return (
      <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/90 dark:bg-black/40 backdrop-blur-md z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200 cursor-pointer active:scale-95 border border-transparent hover:border-black/5 dark:hover:border-white/10"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
           {isSidebarOpen ? "Dashboard Overview" : 
           "Build for Job"}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Token Balance Tracker in Navbar */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:border-[#001BB7]/40 dark:hover:border-white/20 transition-all cursor-pointer select-none">
            <Coins className="text-amber-500 dark:text-amber-400 shrink-0" size={16} />
            <span>{tokenBalance.toFixed(1)} Credits</span>
          </div>
          
          {/* Hover limits panel popup */}
          <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[99]">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>Tokens Used</span>
                <span className="text-black dark:text-white font-bold">{tokensUsed.toFixed(1)}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#001BB7] to-purple-500 rounded-full" 
                  style={{ width: `${(tokensUsed / totalTokens) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>Remaining</span>
                <span className="text-[#001BB7] font-bold">{tokenBalance.toFixed(1)} Credits</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>1 ATS Scan</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">-1.0 Credit</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Rewrite / Summary</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">-0.5 Credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserDropdown />
      </div>
    </header>
  );
}
