"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, CheckCircle2, ArrowLeft } from "@/lib/icons";
import { Button1 } from "@/components/general/buttons/button1";
import { authApi } from "@/apis/auth.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      if (res.success) {
        setIsSubmitted(true);
        toast.success("Password reset email sent!");
      } else {
        toast.error(res.message || "Failed to send reset link");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "An unexpected error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-purple-500/5">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-black dark:text-white">Check your email</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            We&apos;ve sent a password reset link to <span className="font-semibold text-black dark:text-white">{email}</span>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
          💡 <strong>Tip:</strong> The reset link is valid for 1 hour. If you don&apos;t see the email in your inbox, please check your spam or junk folder.
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Try another email
          </button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors w-full"
          >
            <ArrowLeft size={16} /> Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
          />
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <Button1
        type="submit"
        className="w-full py-3 h-12 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Send Reset Link <ArrowRight size={16} />
          </>
        )}
      </Button1>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </form>
  );
}
