"use client";

import React, { useState } from "react";
import { Sparkles, Crown, ArrowRight, ShieldCheck, Infinity as InfinityIcon } from "@/lib/icons";
import { useAppSelector } from "@/store/hooks";
import { ProPlanModal } from "@/components/general/ProPlanModal";
import Link from "next/link";

export function SidebarPlans() {
  const { user } = useAppSelector((state) => state.auth);
  const [showProModal, setShowProModal] = useState(false);

  const isPro = user?.plan === "PRO";
  
  // Format validity
  const getValidityText = () => {
    if (!isPro) {
      return "Infinity (Lifetime)";
    }
    if (!user?.planExpiresAt) {
      return "Active Subscription";
    }
    const expiry = new Date(user.planExpiresAt);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return "Expiring today";
    }
    return `${diffDays} days left (${expiry.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
  };

  return (
    <div className="px-4 mb-3">
      <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Plans
          </span>
          <Link
            href="/dashboard/plans"
            className="text-[10px] font-semibold text-primary dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            Details <ArrowRight size={10} />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              isPro 
                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs" 
                : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
            }`}>
              {isPro ? <Crown size={14} /> : <ShieldCheck size={14} />}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                {isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                {!isPro ? (
                  <>
                    <span>Validity:</span>
                    <span className="inline-flex items-center font-bold text-gray-700 dark:text-gray-300">
                      Infinity <InfinityIcon size={11} className="ml-0.5 inline" />
                    </span>
                  </>
                ) : (
                  <span>{getValidityText()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowProModal(true)}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isPro
              ? "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200"
              : "bg-[#001BB7] hover:bg-[#0020d4] text-white hover:shadow-[#001BB7]/20"
          }`}
        >
          <Sparkles size={12} className={isPro ? "text-amber-500" : ""} />
          <span>{isPro ? "Extend / Manage Plan" : "Upgrade to Pro"}</span>
        </button>
      </div>

      <ProPlanModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        title={isPro ? "Manage Your Pro Plan" : "Upgrade to Pro"}
        description={
          isPro 
            ? "Your Pro subscription is active. You can extend your validity or switch to the 6-month plan." 
            : "Get 50 monthly ATS scans, detailed analysis, PDF downloads, and unlimited resumes."
        }
      />
    </div>
  );
}
