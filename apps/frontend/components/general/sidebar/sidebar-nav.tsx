"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from '@/lib/icons';
import React from "react";

interface SidebarNavProps {
  navigation: {
    title: string;
  items: { name: string; href: string; icon: LucideIcon; isComingSoon?: boolean }[];
  }[];
  onClose?: () => void;
}

export function SidebarNav({ navigation, onClose }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#") {
      e.preventDefault();
      return;
    }

    const routesThatCloseSidebar = [
      "/dashboard/resume-builder",
      "/dashboard/cover-letter",
      "/dashboard/portfolio"
    ];

    if (routesThatCloseSidebar.includes(href)) {
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <nav className="flex-1 space-y-8 px-4 py-6 overflow-y-auto scrollbar-hide">
      {navigation.map((group) => (
        <div key={group.title}>
          <h3 className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-2">
            {group.title}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const isSoon = item.isComingSoon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={cn(
                    "flex items-center justify-between px-2 py-2 text-sm font-medium rounded-lg transition-all group",
                    isActive
                      ? "bg-primary/10 text-primary dark:text-primary/90"
                      : isSoon
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-70"
                        : "text-gray-800 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-primary dark:text-primary/90" : isSoon ? "text-gray-300 dark:text-gray-700" : "text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                      )}
                    />
                    {item.name}
                  </div>
                  {isSoon && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md uppercase tracking-tighter">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
