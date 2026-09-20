"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function AuthBrand() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex justify-center mb-8">
      <Link href="/" className="flex items-center gap-2 group">
        <img 
          src="/logo-black.png" 
          width={140} 
          height={40} 
          alt="BuildForJob Logo" 
          className="w-[140px] h-auto dark:hidden block object-contain" 
        />
        <img 
          src="/logo-light.png" 
          width={140} 
          height={40} 
          alt="BuildForJob Logo" 
          className="w-[140px] h-auto hidden dark:block object-contain" 
        />
      </Link>
    </div>
  );
}
