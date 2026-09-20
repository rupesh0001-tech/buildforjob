"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Mail, CheckCircle2, AlertCircle } from '@/lib/icons';
import Link from "next/link";
import { fadeUp } from "@/lib/animation-variants";

export function HeroCta() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `/register?email=${encodeURIComponent(email)}`;
    }, 800);
  };

  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 max-w-xl mx-auto w-full">
      {/* Integrated Pill Input Form */}
      <form onSubmit={handleSubmit} className="w-full relative flex flex-col items-center">
        <div className="w-full relative flex items-center p-1.5 rounded-full bg-white dark:bg-[#12101e] border border-[#e6e1fe] dark:border-purple-900/40 shadow-xl shadow-purple-900/5 focus-within:ring-2 focus-within:ring-[#6e56cf]/40 transition-all">
          <div className="pl-4 pr-2 text-gray-400">
            <Mail size={18} />
          </div>
          <input 
            type="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email to start free..." 
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#0f172a] dark:text-white placeholder:text-gray-400 py-2.5 px-1"
          />
          <button 
            type="submit" 
            disabled={submitted}
            className="h-11 px-6 rounded-full bg-[#6e56cf] hover:bg-[#5b46b8] text-white text-sm font-semibold transition-all shadow-md shadow-purple-500/25 flex items-center gap-2 shrink-0 hover:scale-[1.02] disabled:opacity-80"
          >
            {submitted ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <CheckCircle2 size={15} /> Redirecting...
              </span>
            ) : (
              <>
                <span>Start for free</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* Validation Error Message */}
        {error && (
          <p className="mt-2 text-xs font-medium text-rose-500 flex items-center gap-1 self-start pl-4">
            <AlertCircle size={13} /> {error}
          </p>
        )}
      </form>

      {/* Alternative GitHub Import & Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#64748b] dark:text-gray-400 pt-1">
        <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f172a] dark:text-white hover:text-[#6e56cf] transition-colors">
          <Github size={15} />
          <span>Import GitHub profile</span>
        </Link>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 size={14} /> Free tier available
        </span>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 size={14} /> No credit card required
        </span>
      </div>
    </motion.div>
  );
}
