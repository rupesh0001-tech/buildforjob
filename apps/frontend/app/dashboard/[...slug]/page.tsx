"use client";

import React from 'react';
import { usePathname, notFound } from 'next/navigation';
import { Sparkles, ArrowLeft } from '@/lib/icons';
import Link from 'next/link';
import { Button2 } from "@/components/general/buttons/button2";

const PLANNED_ROUTES = [
  "/dashboard/resumes/ats",
  "/dashboard/resumes/enhancer",
  "/dashboard/resumes",
  "/dashboard/resumes/versions",
  "/dashboard/cover-letter",
  "/dashboard/linkedin/enhancer",
  "/dashboard/connect/github",
  "/dashboard/connect/linkedin",
  "/dashboard/settings/profile",
];

export default function ComingSoonPage() {
  const pathname = usePathname();
  
  if (pathname && !PLANNED_ROUTES.includes(pathname)) {
    notFound();
  }
  
  const pageName = pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animation-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6 animate-bounce">
        <Sparkles size={32} />
      </div>
      
      <h1 className="text-3xl font-bold text-black dark:text-white capitalize mb-3">
        {pageName} is Under Construction
      </h1>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
        We're working hard to bring you the best {pageName} experience. 
        This feature will be available in the next update!
      </p>

      <Link href="/dashboard">
        <Button2 className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Button2>
      </Link>
    </div>
  );
}
