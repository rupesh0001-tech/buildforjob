"use client";

import React, { useMemo } from "react";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { 
  LayoutDashboard, FileCheck, FilePlus, Wand2, 
  Files, History, Mail, Edit, MonitorUp, Globe, 
  TrendingUp, Link as LinkIcon, Briefcase, User, Sparkles
} from '@/lib/icons';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isOverlay?: boolean;
}

export function Sidebar({ isOpen, onClose, isOverlay }: SidebarProps) {
  const { user } = useAppSelector((state) => state.auth);

  const navigation = useMemo(() => {
    const isPro = user?.plan === "PRO";
    
    let planBadgeText = "Free • ∞";
    if (isPro) {
      if (user?.planExpiresAt) {
        const expiry = new Date(user.planExpiresAt);
        const diffDays = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        planBadgeText = diffDays > 0 ? `PRO • ${diffDays}d` : "PRO";
      } else {
        planBadgeText = "PRO";
      }
    }

    const planBadge = isPro ? (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider shrink-0">
        {planBadgeText}
      </span>
    ) : (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 tracking-wider shrink-0">
        {planBadgeText}
      </span>
    );

    return [
      {
        title: "Dashboard",
        items: [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        ]
      },
      {
        title: "Resumes",
        items: [
          { name: "ATS Checker", href: "/dashboard/resumes/ats", icon: FileCheck },
          { name: "Resume Builder", href: "/dashboard/resume-builder", icon: FilePlus },
          { name: "My Resumes", href: "/dashboard/resumes", icon: Files },
        ]
      },
      {
        title: "Portfolio",
        items: [
          { name: "My Portfolio", href: "/dashboard/portfolio/myportfolio", icon: Globe },
          { name: "Portfolio Builder", href: "/dashboard/portfolio", icon: FilePlus },
        ]
      },
      {
        title: "Versions",
        items: [
          { name: "All Versions", href: "/dashboard/resumes/versions", icon: History },
        ]
      },
      {
        title: "Cover Letters",
        items: [
          { name: "My Cover Letters", href: "/dashboard/cover-letter/all", icon: Mail },
          { name: "Cover Letter Builder", href: "/dashboard/cover-letter", icon: Edit },
        ]
      },
      {
        title: "Connect Profiles",
        items: [
          { name: "Connect GitHub", href: "/dashboard/connect/github", icon: LinkIcon },
        ]
      },
      {
        title: "Settings",
        items: [
          { name: "Profile", href: "/dashboard/settings/profile", icon: User },
        ]
      },
      {
        title: "Coming Soon",
        items: [
          { name: "LinkedIn Enhancer", href: "#", icon: TrendingUp, isComingSoon: true },
          { name: "LinkedIn Connector", href: "#", icon: Briefcase, isComingSoon: true },
        ]
      },
      {
        title: "Plans",
        items: [
          { 
            name: "Plans", 
            href: "/dashboard/plans", 
            icon: Sparkles,
            badge: planBadge
          },
        ]
      }
    ];
  }, [user]);

  return (
    <div className={cn(
      "flex h-full flex-col bg-white dark:bg-[#08080a] pb-4 shrink-0 transition-all duration-300 ease-in-out border-r border-black/5 dark:border-white/5 shadow-2xl",
      isOverlay ? "fixed top-0 left-0 z-50" : "relative z-30",
      isOpen 
        ? "w-64 opacity-100 translate-x-0" 
        : "w-0 opacity-0 -translate-x-full overflow-hidden border-none pointer-events-none"
    )}>
      {isOpen && (
        <>
          <SidebarBrand />
          <SidebarNav navigation={navigation} onClose={onClose} />
          <SidebarUser />
        </>
      )}
    </div>
  );
}
