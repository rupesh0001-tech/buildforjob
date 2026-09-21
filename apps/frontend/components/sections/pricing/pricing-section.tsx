"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles } from '@/lib/icons';
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paymentApi } from "@/apis/payment.api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAlreadyProPopup, setShowAlreadyProPopup] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
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

  const handleUpgrade = async (planType: 'PRO_MONTHLY' | 'PRO_ANNUAL') => {
    if (!isAuthenticated) {
      toast.info("Please log in or register to upgrade your plan.");
      router.push("/login");
      return;
    }

    if (user?.plan === 'PRO') {
      setShowAlreadyProPopup(true);
      toast.info("You're already a Pro user! 🎉");
      return;
    }

    try {
      setLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay payment gateway. Please check your network connection.");
        setLoading(false);
        return;
      }

      const orderData = await paymentApi.createOrder(planType);

      const options = {
        key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TcZCA8XhXHM8pZ',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BuildForJob',
        description: planType === 'PRO_ANNUAL' ? 'Pro Plan (6 Months Launch Offer)' : 'Pro Plan (1 Month)',
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
              toast.success("🎉 Payment successful! Your account has been upgraded to PRO.");
              router.push("/dashboard/plans");
            } else {
              toast.error(verifyRes.message || "Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to verify payment.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment window closed.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    }
  };

  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 border-t border-black/5 dark:border-white/5 mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
          Simple,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            transparent pricing.
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">Start for free. Upgrade when you need more power to land your dream job faster.</p>
        
        <div className="inline-flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            1 Month
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            Annual (1 Year) <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Special</span>
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto items-stretch">
        {/* Starter (Free) Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 shadow-sm"
        >
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Starter</h3>
            <p className="text-gray-500 text-sm mb-6 font-medium">Perfect to test the waters and start building</p>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight">₹0</span>
              <span className="text-gray-500 text-sm font-medium"> / forever (Infinity)</span>
            </div>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/dashboard");
                } else {
                  router.push("/register");
                }
              }}
              className="w-full py-3 px-6 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-all mb-8 cursor-pointer"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Free"}
            </button>
            <ul className="space-y-4 mb-8">
              {[
                "5 ATS Scans lifetime",
                "Basic analysis only",
                "Locked templates (Modern & Professional free; others preview-only)",
                "Maximum of 3 resumes & 3 cover letters",
                "Keep track of 3 versions per document",
                "5 starter credits for AI rewrites/summaries only"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="text-blue-600 shrink-0 mt-0.5" size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-3xl bg-black dark:bg-[#111116] border-2 border-blue-600 shadow-2xl shadow-blue-600/10 flex flex-col justify-between relative hover:scale-[1.01] transition-all duration-300"
        >
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">MOST POPULAR</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-gray-400 text-sm mb-6 font-medium">Everything you need to land your dream job</p>
            <div className="mb-6">
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {isAnnual ? '₹1,206' : '₹2'}
                </span>
                <span className="text-gray-400 line-through text-lg">
                  {isAnnual ? '₹2,388' : '₹299'}
                </span>
                <span className="text-gray-400 text-sm font-medium">
                  / {isAnnual ? '1 year' : '1 month'}
                </span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                {isAnnual 
                  ? "🔥 ₹2/mo for first 6 months (₹12) + ₹199/mo for next 6 months (₹1,194)" 
                  : "🔥 Special Launch Discount: ₹2 for 1 month"}
              </div>
            </div>
            <button
              onClick={() => {
                if (user?.plan === 'PRO') {
                  setShowAlreadyProPopup(true);
                  toast.info("You're already a Pro user! 🎉");
                } else {
                  handleUpgrade(isAnnual ? 'PRO_ANNUAL' : 'PRO_MONTHLY');
                }
              }}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-full font-semibold transition-all mb-8 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 ${
                user?.plan === 'PRO'
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/35"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : user?.plan === 'PRO' ? (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>You&apos;re already a Pro user</span>
                </div>
              ) : (
                isAnnual ? "Subscribe Annually · ₹1,206" : "Upgrade to Pro · ₹2"
              )}
            </button>
            <ul className="space-y-4 mb-4">
              {[
                "50 ATS Scans monthly",
                "Detailed analysis on each scan with PDF download",
                "Access to all premium resume templates",
                "Unlimited resumes & cover letters",
                "Unlimited version tracking",
                "Full AI features (auto-fill, optimization, 50 monthly credits)"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Already Pro User Popup Modal */}
      <AnimatePresence>
        {showAlreadyProPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 shadow-2xl p-7 text-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xs">
                  <Sparkles className="w-7 h-7" />
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider mb-2">
                  Active Pro Member
                </span>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  You&apos;re already a Pro user! 🎉
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Your account currently has full PRO privileges active. You already have access to all premium resume templates, unlimited documents, advanced ATS scan scores, and AI features.
                </p>

                {user?.planExpiresAt && (
                  <div className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 mb-6 flex items-center justify-between">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Subscription Validity:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Valid until {new Date(user.planExpiresAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowAlreadyProPopup(false);
                      router.push("/dashboard");
                    }}
                    className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowAlreadyProPopup(false);
                      router.push("/dashboard/plans");
                    }}
                    className="flex-1 py-3 px-5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold text-sm transition-all cursor-pointer"
                  >
                    Plans &amp; Billing
                  </button>
                </div>

                <button
                  onClick={() => setShowAlreadyProPopup(false)}
                  className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
