"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function SidebarUser() {
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = mounted && user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : mounted && user?.email
      ? user.email
      : "User";

  const initials = mounted && user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : mounted && user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : "U";

  const isPro = mounted && user?.plan === "PRO";
  const subtext = isPro ? "Pro Plan" : "Free Plan";
  const avatarUrl = mounted ? user?.avatarUrl : null;

  return (
    <div className="px-4 mt-auto">
      <Link href="/dashboard/settings/profile" className="flex items-center gap-3 p-2 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
         <div className="relative shrink-0">
           {avatarUrl ? (
             <img 
               src={avatarUrl} 
               alt={name} 
               className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform"
             />
           ) : (
             <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs group-hover:scale-105 transition-transform">
               {initials}
             </div>
           )}
           {isPro && (
             <span className="absolute -bottom-1 -right-1 px-1 py-[0.5px] bg-blue-600 text-white text-[7px] font-extrabold tracking-wider rounded-full border border-white dark:border-neutral-900 uppercase pointer-events-none">
               PRO
             </span>
           )}
         </div>
         <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-black dark:text-white truncate">{name}</span>
              {isPro && (
                <span className="text-[8px] font-bold px-1.5 py-[0.5px] rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide shrink-0">
                  PRO
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtext}</span>
         </div>
      </Link>
    </div>
  );
}
