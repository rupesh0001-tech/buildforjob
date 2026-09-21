"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Loader2, ArrowRight } from '@/lib/icons';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { paymentApi } from "@/apis/payment.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureHighlight?: string;
  onSuccess?: () => void;
}

export function ProPlanModal({
  isOpen,
  onClose,
  title = "Unlock Pro Features",
  description = "Get full access to all premium features, unlimited creation, and intelligent AI tools.",
  featureHighlight,
  onSuccess,
}: ProPlanModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const isPro = user?.plan === "PRO";

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

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const planType = isAnnual ? 'PRO_ANNUAL' : 'PRO_MONTHLY';
      const orderData = await paymentApi.createOrder(planType);

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TcZCA8XhXHM8pZ',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BuildForJob',
        description: isAnnual ? 'Pro Plan (6 Months Special Launch)' : 'Pro Plan (1 Month Subscription)',
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
              toast.success("🎉 Welcome to Pro! Your account has been upgraded successfully.");
              await dispatch(fetchProfile() as any);
              onClose();
              if (onSuccess) {
                onSuccess();
              }
            } else {
              toast.error(verifyRes.message || "Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(getErrorMessage(err, "Payment verification failed."));
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      setLoading(false);
      toast.error(getErrorMessage(error, "Failed to initiate payment. Please try again."));
    }
  };

  const proFeatures = [
    "50 ATS Scans monthly (vs 5 lifetime on Free)",
    "Detailed analysis on each scan with PDF download",
    "Access to all premium resume templates",
    "Unlimited resumes & cover letters (vs 3 on Free)",
    "Unlimited version tracking (vs 3 on Free)",
    "Access to all AI writer, sync & optimizer features",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white dark:bg-[#0c0c10] border border-gray-200 dark:border-white/10 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative"
          >
            {/* Header Banner Background */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-[#001BB7]/15 via-purple-600/10 to-transparent pointer-events-none" />

            <div className="p-7 relative z-10 space-y-6">
              {/* Top Row: Badge and Close Button */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001BB7]/10 dark:bg-blue-500/10 border border-[#001BB7]/20 text-[#001BB7] dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} />
                  {isPro ? "Active Subscriber" : "Pro Feature"}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isPro ? "You're Already on the Pro Plan! 🎉" : title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {isPro 
                    ? user?.planExpiresAt 
                      ? `Your Pro subscription is active until ${new Date(user.planExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. You can extend your access below.`
                      : "You currently enjoy unlimited access to all Pro templates, tools, and 50 monthly ATS scans."
                    : description}
                </p>
                {featureHighlight && !isPro && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-2">
                    <Sparkles size={14} className="shrink-0" />
                    <span>{featureHighlight}</span>
                  </div>
                )}
              </div>

              {/* Pricing Card */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹2</span>
                    <span className="text-sm text-gray-400 line-through">₹{isAnnual ? '199/mo' : '299'}</span>
                    <span className="text-xs font-medium text-gray-500">/ {isAnnual ? '6 months' : '1 month'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    {isAnnual ? "🔥 ₹2 for 6 months, then ₹199/month" : "🔥 ₹2 for 1 month access"}
                  </p>
                </div>
                <div className="inline-flex p-1 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAnnual(false)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      !isAnnual ? "bg-[#001BB7] text-white shadow-xs" : "text-gray-500 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnnual(true)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isAnnual ? "bg-[#001BB7] text-white shadow-xs" : "text-gray-500 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    6 Months
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">What&apos;s included in Pro:</p>
                <div className="space-y-2">
                  {proFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-4 bg-[#001BB7] hover:bg-[#0020d4] text-white rounded-2xl font-semibold text-sm shadow-xl shadow-[#001BB7]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>{isPro ? "Extend Pro Subscription (₹2)" : "Upgrade to Pro Now (₹2)"}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center font-medium">
                  Instant activation • Safe & encrypted payment via Razorpay
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
