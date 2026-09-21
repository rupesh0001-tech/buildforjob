"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, LayoutDashboard, ChevronDown, Sparkles } from '@/lib/icons';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const isPro = user?.plan === "PRO";

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative inline-block">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 border-2 border-white dark:border-black shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user?.firstName?.[0]}{user?.lastName?.[0] || user?.email?.[0] || 'U'}</span>
          )}
        </button>
        {isPro && (
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-[#001BB7] text-white text-[8px] font-black tracking-wider rounded-full border-2 border-white dark:border-black uppercase pointer-events-none shadow-xs">
            PRO
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 shadow-2xl p-2 z-60 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2 text-left">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-black dark:text-white truncate">
                  {user?.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : (user?.email || 'User')}
                </p>
                {isPro ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 shrink-0">
                    FREE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user?.email}
              </p>
            </div>
            
            <div className="space-y-1">
              <Link 
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                <LayoutDashboard size={18} className="text-purple-500" />
                Dashboard
              </Link>
              <Link 
                href="/dashboard/plans"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Sparkles size={18} className="text-amber-500" />
                Plans & Billing
              </Link>
              <Link 
                href="/dashboard/settings/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                <User size={18} className="text-blue-500" />
                My Profile
              </Link>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
