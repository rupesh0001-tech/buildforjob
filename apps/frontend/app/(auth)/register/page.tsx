import React from "react";
import Link from "next/link";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { OAuthButtons } from "@/components/sections/general/oauth-buttons";
import { RegisterForm } from "@/components/sections/register/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">Start building your next-gen career profile today.</p>

          <OAuthButtons />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Or register with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <RegisterForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 mb-8">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}