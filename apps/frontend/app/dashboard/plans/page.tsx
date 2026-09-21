"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Check, Crown, ShieldCheck, ArrowRight, 
  Calendar, CreditCard, Loader2, Zap, Clock, Infinity as InfinityIcon 
} from '@/lib/icons';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { paymentApi } from "@/apis/payment.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isPro = user?.plan === "PRO";

  useEffect(() => {
    dispatch(fetchProfile() as any);

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await paymentApi.getPaymentHistory();
        setHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [dispatch]);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planType: 'PRO_MONTHLY' | 'PRO_ANNUAL') => {
    try {
      setLoadingPlan(planType);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setLoadingPlan(null);
        return;
      }

      const orderData = await paymentApi.createOrder(planType);

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TcZCA8XhXHM8pZ',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BuildForJob',
        description: planType === 'PRO_ANNUAL' ? 'Pro Plan (1 Year Annual Subscription · ₹1,206)' : 'Pro Plan (1 Month · ₹2)',
        image: '/favicon.png',
        order_id: orderData.orderId,
        prefill: {
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
          email: user?.email || '',
        },
        theme: {
          color: '#001BB7',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planType,
            });

            if (verifyRes.success) {
              toast.success("🎉 Payment verified! Your Pro plan is now active.");
              await dispatch(fetchProfile() as any);
              const data = await paymentApi.getPaymentHistory();
              setHistory(data || []);
            } else {
              toast.error(verifyRes.message || "Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(getErrorMessage(err, "Payment verification failed."));
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
            toast.info("Payment cancelled.");
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      setLoadingPlan(null);
      toast.error(getErrorMessage(error, "Failed to initiate payment. Please try again."));
    }
  };

  const getDaysLeft = () => {
    if (!user?.planExpiresAt) return null;
    const diff = new Date(user.planExpiresAt).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysLeft();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Plans &amp; Billing
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose a plan that fits your career goals. Upgrade, extend, or review your invoices.
        </p>
      </div>

      {/* Current Subscription Status Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isPro 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}>
                {isPro ? <Crown size={16} /> : <ShieldCheck size={16} />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Current Status
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {isPro ? "Pro Plan Active" : "Free Plan (Starter)"}
                </h2>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1 ${
                isPro
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300"
              }`}>
                {isPro ? "PRO" : "FREE"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Clock size={15} className="text-blue-500" />
                <span className="font-medium">Validity:</span>
                {!isPro ? (
                  <span className="font-bold flex items-center gap-1 text-gray-900 dark:text-white">
                    Lifetime (Infinity) <InfinityIcon size={14} className="inline" />
                  </span>
                ) : user?.planExpiresAt ? (
                  <span className="font-bold text-gray-900 dark:text-white">
                    {daysLeft} days remaining ({new Date(user.planExpiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                  </span>
                ) : (
                  <span className="font-bold text-gray-900 dark:text-white">Active</span>
                )}
              </div>

              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Zap size={15} className="text-amber-500" />
                <span className="font-medium">Credits:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {(user?.tokens ?? 5.0).toFixed(1)} AI Credits remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Plan Option 1: Monthly */}
        <div className="p-7 rounded-3xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Monthly Pass
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                30 Days
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro Monthly</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Short-term boost to prepare and apply for immediate roles.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹2</span>
                <span className="text-sm text-gray-400 line-through">₹299</span>
                <span className="text-xs text-gray-500 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                🔥 1 Month access, then shifts to standard Free plan
              </p>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>50 ATS Scans for the month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Detailed keyword gap analysis &amp; PDF download</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Unlock all handcrafted resume &amp; cover letter templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Unlimited resumes &amp; cover letter drafts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Full AI suite: auto-fill, resume &amp; cover letter optimize</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSubscribe('PRO_MONTHLY')}
            disabled={!!loadingPlan}
            className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-xs hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingPlan === 'PRO_MONTHLY' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <span>Subscribe Monthly · ₹2</span>
            )}
          </button>
        </div>

        {/* Plan Option 2: Annual (Yearly) */}
        <div className="p-7 rounded-3xl bg-black dark:bg-[#0e0e14] text-white border-2 border-blue-600 shadow-xl shadow-blue-600/10 flex flex-col justify-between relative">
          <div className="absolute top-0 right-6 -translate-y-1/2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              BEST VALUE • ANNUAL (1 YEAR)
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Annual Subscription
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                365 Days
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Pro Annual</h3>
            <p className="text-xs text-gray-400 mt-1">
              Complete 12-month access. Get hired faster with maximum savings all year.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">₹1,206</span>
                <span className="text-sm text-gray-400 line-through">₹2,388</span>
                <span className="text-xs text-gray-400 font-medium">/ 1 year</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                🔥 ₹2/mo for first 6 months (₹12) + ₹199/mo for next 6 months (₹1,194)
              </p>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>1 full year of continuous Pro coverage (365 days)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>50 ATS Scans per month (600 scans total)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Unlimited resumes, cover letters, and version trees</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>All premium templates unlocked forever during subscription</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Full AI auto-fill and tailor tools with 50 monthly credits</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSubscribe('PRO_ANNUAL')}
            disabled={!!loadingPlan}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingPlan === 'PRO_ANNUAL' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <span>Subscribe Annually · ₹1,206</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <CreditCard size={16} className="text-blue-500" />
          Payment & Billing History
        </h3>

        <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          {historyLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-xs text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Loading payment records...
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 dark:text-gray-400">
              No previous transactions found. Upgrades will be recorded here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Plan</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Payment ID</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {tx.plan === 'PRO_ANNUAL' ? '6 Months Pro' : '1 Month Pro'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                        ₹{(tx.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-500">
                        {tx.razorpayPaymentId || tx.razorpayOrderId}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Check size={10} /> Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
