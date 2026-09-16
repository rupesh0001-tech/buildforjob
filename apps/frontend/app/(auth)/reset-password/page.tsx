import React, { Suspense } from "react";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { ResetPasswordForm } from "@/components/sections/reset-password/reset-password-form";

export const metadata = {
  title: "Reset Password | Build For Job",
  description: "Set a new password for your Build For Job account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">
            Set New Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
            Please choose a secure password with at least 8 characters.
          </p>

          <Suspense
            fallback={
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
