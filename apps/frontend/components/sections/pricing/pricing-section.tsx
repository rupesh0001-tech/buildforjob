"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from '@/lib/icons';
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
        description: planType === 'PRO_ANNUAL' ? 'Pro Plan (Annual)' : 'Pro Plan (Monthly)',
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
              router.push("/dashboard");
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
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
          >
            Annually <span className="text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 20%</span>
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
              <span className="text-gray-500 text-sm font-medium"> / forever</span>
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
                "5 ATS Scans monthly",
                "Basic analysis (Pay ₹20 to see 1 detailed report)",
                "Locked templates (Modern & Professional are free; others preview-only)",
                "Maximum of 3 resumes & 3 cover letters",
                "Keep track of 3 versions per document",
                "Limited AI helper features"
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
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">₹2</span>
                <span className="text-gray-400 line-through text-lg">₹{isAnnual ? '249' : '299'}</span>
                <span className="text-gray-400 text-sm font-medium">/ month</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                🔥 Special Launch Discount: ₹2 / month
              </div>
            </div>
            <button
              onClick={() => handleUpgrade(isAnnual ? 'PRO_ANNUAL' : 'PRO_MONTHLY')}
              disabled={loading}
              className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all mb-8 shadow-lg shadow-blue-600/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </button>
            <ul className="space-y-4 mb-4">
              {[
                "50 ATS Scans monthly",
                "Detailed analysis on each scan with PDF download",
                "Access to all premium resume templates",
                "Unlimited resumes & cover letters",
                "Unlimited version tracking",
                "Access to all AI writer & sync features"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="text-emerald-400 shrink-0 mt-0.5" size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
