"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/general/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/providers/protected-route";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilderPage = pathname === "/dashboard/resume-builder" || pathname === "/dashboard/cover-letter" || pathname === "/dashboard/portfolio";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasActiveModal, setHasActiveModal] = useState(false);

  // Close sidebar when navigating to builder pages and handle responsive screen resizes
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(!isBuilderPage);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isBuilderPage]);

  // Monitor DOM for active modals to auto-collapse the sidebar
  React.useEffect(() => {
    const checkModal = () => {
      // Find all visible active dialogs
      const dialogs = Array.from(document.querySelectorAll('[role="dialog"]')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      const hasDialog = dialogs.length > 0;
      
      // Look for active fullscreen fixed modal backdrops/overlays (not background decorators)
      const hasModalBackdrop = Array.from(document.querySelectorAll('div')).some(el => {
        const className = el.className || "";
        const style = window.getComputedStyle(el);
        
        // Modal backdrops must be fixed, inset-0, visible, and block pointer events
        const isFixedInset = className.includes('fixed') && className.includes('inset-0');
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && (el.offsetWidth > 0 || el.offsetHeight > 0);
        const isPointerInteractive = !className.includes('pointer-events-none') && style.pointerEvents !== 'none';
        
        if (!isFixedInset || !isVisible || !isPointerInteractive) return false;
        
        // Must have high modal-level z-index
        const hasHighZ = className.includes('z-50') ||
                         className.includes('z-[100]') ||
                         className.includes('z-[110]') ||
                         className.includes('z-[120]') ||
                         className.includes('z-[9999]') ||
                         className.includes('z-[45]');
                         
        return hasHighZ && (className.includes('bg-black/') || className.includes('backdrop-blur'));
      });

      setHasActiveModal(hasDialog || hasModalBackdrop);
    };

    // Initial check
    checkModal();

    const observer = new MutationObserver(() => {
      checkModal();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const shouldSidebarBeOpen = hasActiveModal ? false : isSidebarOpen;

  return (
    <div className="flex h-screen bg-white dark:bg-[#08080a] overflow-hidden selection:bg-primary/30 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#001BB7 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
      
      <Sidebar 
        isOpen={shouldSidebarBeOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isOverlay={isBuilderPage || isMobile}
      />
      
      {/* Overlay for Builders / Mobile */}
      {(isBuilderPage || isMobile) && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-md z-45" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={cn(
        "flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 transition-all duration-300",
      )}>
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8 relative transition-all duration-500 ease-in-out",
          isBuilderPage && isSidebarOpen && "blur-md pointer-events-none",
          isMobile && isSidebarOpen && "blur-xs pointer-events-none lg:blur-none lg:pointer-events-auto"
        )}>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
