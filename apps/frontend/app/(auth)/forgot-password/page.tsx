import React from "react";
import Link from "next/link";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { ForgotPasswordForm } from "@/components/sections/forgot-password/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Build For Job",
  description: "Reset your Build For Job account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">
            Forgot Password?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
            Enter your email and we will send you instructions to reset your password.
          </p>

          <ForgotPasswordForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
