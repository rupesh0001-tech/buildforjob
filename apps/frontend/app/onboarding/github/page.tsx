import React from "react";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { OnboardingGithubForm } from "@/components/sections/onboarding/onboarding-github-form";

export default function OnboardingGithubPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
        <AuthBackground />

        <div className="w-full max-w-md relative z-10">
          <AuthBrand />

          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <OnboardingGithubForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
