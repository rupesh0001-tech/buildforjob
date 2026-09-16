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

  const name = mounted && user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : mounted && user?.email 
      ? user.email 
      : "Jane Doe";

  const initials = mounted && user?.firstName && user?.lastName 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() 
    : mounted && user?.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : "JD";

  const isPro = mounted && user?.plan === "PRO";
  const subtext = mounted && (user?.jobTitle || (isPro ? "Pro Plan" : "Free Plan")) || "Free Plan";
  const avatarUrl = mounted ? user?.avatarUrl : null;

  return (
    <div className="px-4 mt-auto">
      <Link href="/dashboard/settings/profile" className="flex items-center gap-3 p-2 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
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
         <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-black dark:text-white truncate">{name}</span>
            <span className="text-xs text-gray-700 truncate">{subtext}</span>
         </div>
      </Link>
    </div>
  );
}
