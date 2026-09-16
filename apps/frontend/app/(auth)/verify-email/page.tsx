import React, { Suspense } from "react";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { VerifyEmailForm } from "@/components/sections/verify-email/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
