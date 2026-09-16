"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from '@/lib/icons';
import { usePathname } from "next/navigation";

const ApiLoadingContext = createContext<{ isLoading: boolean }>({ isLoading: false });

export const useApiLoading = () => useContext(ApiLoadingContext);

export function ApiLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const showFullscreenLoader = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/verify-email");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleLoadingEvent = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      const active = customEvent.detail;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (active) {
        // Show after 200ms delay to avoid flashing for super-fast API calls
        timeoutId = setTimeout(() => {
          setIsLoading(true);
        }, 200);
      } else {
        setIsLoading(false);
      }
    };

    window.addEventListener("global-api-loading", handleLoadingEvent);
    return () => {
      window.removeEventListener("global-api-loading", handleLoadingEvent);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ApiLoadingContext.Provider value={{ isLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && showFullscreenLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md"
          >
            <div className="bg-white/95 dark:bg-[#0c0c0e]/95 border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center space-y-6 relative overflow-hidden">
              {/* Outer decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#001BB7]/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Animated Icon Container */}
              <div className="relative">
                {/* Outer glowing pulsing circle */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-4 rounded-full bg-[#001BB7] blur-md"
                />
                
                {/* Inner rotating/pulsing ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-16 rounded-full border-2 border-t-[#001BB7] border-r-transparent border-b-[#001BB7]/30 border-l-transparent"
                />
                
                {/* Center loading spinner */}
                <div className="absolute inset-0 flex items-center justify-center text-[#001BB7]">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Loading...</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please hold on while we process your request. This will only take a moment.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ApiLoadingContext.Provider>
  );
}

export function DashboardApiLoader() {
  const { isLoading } = useApiLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[40] flex flex-col items-center justify-center bg-white/70 dark:bg-[#08080a]/70 backdrop-blur-xs"
        >
          <div className="p-6 rounded-2xl flex flex-col items-center space-y-4 text-center">
            {/* Sleek rotating ring */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-10 h-10 rounded-full border-2 border-t-[#001BB7] border-r-transparent border-b-[#001BB7]/20 border-l-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center text-[#001BB7]">
                <Loader2 className="animate-spin" size={16} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest animate-pulse">
              Loading...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
