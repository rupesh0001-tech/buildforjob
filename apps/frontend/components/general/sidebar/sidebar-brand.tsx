"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function SidebarBrand() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-16 shrink-0 items-center px-6 border-b border-black/5 dark:border-white/5">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 dark:from-white dark:to-gray-400">
          {theme === "light" ? <img src="/logo-black.png" width={140} height={140} alt="logo" /> : <img src="/logo-light.png" width={140} height={140} alt="logo" />}
        </span>
      </Link>
    </div>
  );
}
