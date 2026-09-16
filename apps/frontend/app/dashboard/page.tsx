"use client";
import React from 'react';
import { QuickActions } from "@/components/dashboard/overview/quick-actions";
import { StatsTracker } from "@/components/dashboard/overview/stats-tracker";
import { ProfileCompletionBanner } from "@/components/dashboard/overview/profile-completion-banner";
import { VersionsPreview } from "@/components/dashboard/overview/versions-preview";
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { Sparkles, RefreshCw, Layout } from '@/lib/icons';

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);

  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;
    
    // Basic Info (30%) - strictly non-social fields
    const basicFields = ['firstName', 'lastName', 'phone', 'location', 'jobTitle', 'bio'];
    const filledBasicCount = basicFields.filter(f => !!(user as any)[f]).length;
    score += (filledBasicCount / basicFields.length) * 30;

    // Sections (70%) - weighted by career importance
    if ((user.experience?.length || 0) > 0) score += 20;
    if ((user.education?.length || 0) > 0) score += 20;
    if ((user.projects?.length || 0) > 0) score += 15;
    
    // Skills (15%) - requires at least 3 for full marks
    const skillCount = user.skills?.length || 0;
    if (skillCount >= 3) score += 15;
    else if (skillCount > 0) score += 5;

    return Math.min(100, Math.round(score));
  };

  const completionPercent = calculateCompletion();
  const isComplete = completionPercent >= 100;

  return (
    <div className="max-w-6xl mx-auto animation-fade-in pb-12">
      <ProfileCompletionBanner />

      <QuickActions />

      {/* 1-Click Magic Build Banner for 100% profile but not yet synced */}
      {isComplete && !user?.profileSynced && (
        <div className="mb-10 relative overflow-hidden rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm backdrop-blur-xl">
          {/* Decorative glow circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                   Profile 100% Completed!
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-400 max-w-2xl leading-relaxed">
                  You've completed your profile. Build your resume and cover letter in 1 click!
                </p>
              </div>
            </div>
            
            <Link
              href="/dashboard/magic-build"
              className="w-full md:w-auto px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-center shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-sm whitespace-nowrap"
            >
              1-Click Build
            </Link>
          </div>
        </div>
      )}

      <VersionsPreview />

      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider mb-4">Sync Profile and Update Everything </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sync Status Card next to Stats Tracker */}
        {isComplete && user?.profileSynced ? (
          <div className="lg:col-span-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
            {/* Background decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold mb-4">
                <Sparkles size={18} className="animate-pulse" />
                <span>Profile Sync Active</span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Your Resume & Cover Letter are Synced
              </h3>
              <p className="text-sm text-gray-855 dark:text-gray-455 mb-6 leading-relaxed">
                You have made your resume and cover letter via your profile. Use the sync button below to update both documents with the latest changes from your profile.
              </p>
            </div>
            
            <div className="relative z-10 flex items-center gap-4">
              <Link
                href="/dashboard/magic-build"
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center gap-2 w-fit"
              >
                <RefreshCw size={16} />
                Sync Changes
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="p-3 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 rounded-xl mb-3">
              <Layout size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-550 dark:text-gray-450 max-w-xs">



              Complete your profile to unlock 1-click generation features.
            </p>
          </div>
        )}

        <StatsTracker />
      </div>
    </div>
  );
}
