import React from 'react';
import { Sparkles } from '@/lib/icons';
import { Button1 } from "@/components/general/buttons/button1";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export function StatsTracker() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const isPro = user?.plan === "PRO";
  const totalTokens = isPro ? 50.0 : 5.0;
  const tokenBalance = user?.tokens ?? 5.0;
  const tokensUsed = Math.max(0, totalTokens - tokenBalance);
  
  const stats = [
    { name: "Credits Used", current: tokensUsed, total: totalTokens, color: "bg-amber-500", desc: isPro ? "Credits consumed this month" : "Credits consumed from lifetime free package" },
    { name: "Credits Remaining", current: tokenBalance, total: totalTokens, color: "bg-primary", desc: isPro ? "Refills back to 50 each month" : "Total 5.0 free scans package" },
  ];

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl">
      <div>
        <div className="flex items-center gap-2 text-primary font-semibold mb-6">
          <span className="animate-pulse"><Sparkles size={18} /></span> Pro Limits Tracker
        </div>
        
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.name}</span>
                <span className="font-bold text-black dark:text-white">{stat.current.toFixed(1)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div 
                  className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${(stat.current / stat.total) * 100}%` }} 
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-sans">{stat.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Cost Rules */}
        <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-2">
          <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Credit Usage Cost</h5>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>1 ATS Resume Scan</span>
            <span className="font-semibold text-black dark:text-white">1.0 Credit</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>1 AI Rewrite / Summary</span>
            <span className="font-semibold text-black dark:text-white">0.5 Credits</span>
          </div>
        </div>
      </div>
      
      <Button1 
        onClick={() => router.push("/#pricing")}
        className="w-full mt-8 shadow-lg shadow-black/10 dark:shadow-white/5 py-3"
      >
        Upgrade Plan
      </Button1>
    </div>
  );
}
