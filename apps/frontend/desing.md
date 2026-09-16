# BuildForJob UI Design Reference

This file contains the exact implementation structure and code used for the login, register, and dashboard screens so the same design can be recreated from a single reference.

## 1) Login page

File: `app/(auth)/login/page.tsx`

```tsx
import React from "react";
import Link from "next/link";
import { AuthBackground } from "@/components/sections/general/auth-background";
import { AuthBrand } from "@/components/sections/general/auth-brand";
import { OAuthButtons } from "@/components/sections/general/oauth-buttons";
import { LoginForm } from "@/components/sections/login/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <AuthBrand />

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">Enter your details to access your dashboard.</p>

          <OAuthButtons />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
```

## 2) Register page

File: `app/(auth)/register/page.tsx`

```tsx
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
```

## 3) Dashboard overview page

File: `app/dashboard/page.tsx`

```tsx
"use client";
import React from 'react';
import { QuickActions } from "@/components/dashboard/overview/quick-actions";
import { StatsTracker } from "@/components/dashboard/overview/stats-tracker";
import { ProfileCompletionBanner } from "@/components/dashboard/overview/profile-completion-banner";
import { VersionsPreview } from "@/components/dashboard/overview/versions-preview";
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { Sparkles, RefreshCw, Layout } from '@/lib/icons';

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);

  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;
    
    const basicFields = ['firstName', 'lastName', 'phone', 'location', 'jobTitle', 'bio'];
    const filledBasicCount = basicFields.filter(f => !!(user as any)[f]).length;
    score += (filledBasicCount / basicFields.length) * 30;

    if ((user.experience?.length || 0) > 0) score += 20;
    if ((user.education?.length || 0) > 0) score += 20;
    if ((user.projects?.length || 0) > 0) score += 15;
    
    const skillCount = user.skills?.length || 0;
    if (skillCount >= 3) score += 15;
    else if (skillCount > 0) score += 5;

    return Math.min(100, Math.round(score));
  };

  const completionPercent = calculateCompletion();
  const isComplete = completionPercent >= 100;

  return (
    <div className="max-w-6xl mx-auto animation-fade-in pb-12">
      <ProfileCompletionBanner />

      <QuickActions />

      {isComplete && !user?.profileSynced && (
        <div className="mb-10 relative overflow-hidden rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm backdrop-blur-xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                   Profile 100% Completed!
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-400 max-w-2xl leading-relaxed">
                  You've completed your profile. Build your resume and cover letter in 1 click!
                </p>
              </div>
            </div>
            
            <Link
              href="/dashboard/magic-build"
              className="w-full md:w-auto px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-center shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-sm whitespace-nowrap"
            >
              1-Click Build
            </Link>
          </div>
        </div>
      )}

      <VersionsPreview />

      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider mb-4">Sync Profile and Update Everything </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isComplete && user?.profileSynced ? (
          <div className="lg:col-span-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold mb-4">
                <Sparkles size={18} className="animate-pulse" />
                <span>Profile Sync Active</span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Your Resume & Cover Letter are Synced
              </h3>
              <p className="text-sm text-gray-855 dark:text-gray-455 mb-6 leading-relaxed">
                You have made your resume and cover letter via your profile. Use the sync button below to update both documents with the latest changes from your profile.
              </p>
            </div>
            
            <div className="relative z-10 flex items-center gap-4">
              <Link
                href="/dashboard/magic-build"
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center gap-2 w-fit"
              >
                <RefreshCw size={16} />
                Sync Changes
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="p-3 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 rounded-xl mb-3">
              <Layout size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-550 dark:text-gray-450 max-w-xs">
              Complete your profile to unlock 1-click generation features.
            </p>
          </div>
        )}

        <StatsTracker />
      </div>
    </div>
  );
}
```

## 4) Dashboard layout

File: `app/dashboard/layout.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/general/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/providers/protected-route";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilderPage = pathname === "/dashboard/resume-builder" || pathname === "/dashboard/cover-letter" || pathname === "/dashboard/portfolio";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasActiveModal, setHasActiveModal] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(!isBuilderPage);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isBuilderPage]);

  React.useEffect(() => {
    const checkModal = () => {
      const dialogs = Array.from(document.querySelectorAll('[role="dialog"]')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      const hasDialog = dialogs.length > 0;
      
      const hasModalBackdrop = Array.from(document.querySelectorAll('div')).some(el => {
        const className = el.className || "";
        const style = window.getComputedStyle(el);
        
        const isFixedInset = className.includes('fixed') && className.includes('inset-0');
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && (el.offsetWidth > 0 || el.offsetHeight > 0);
        const isPointerInteractive = !className.includes('pointer-events-none') && style.pointerEvents !== 'none';
        
        if (!isFixedInset || !isVisible || !isPointerInteractive) return false;
        
        const hasHighZ = className.includes('z-50') ||
                         className.includes('z-[100]') ||
                         className.includes('z-[110]') ||
                         className.includes('z-[120]') ||
                         className.includes('z-[9999]') ||
                         className.includes('z-[45]');
                         
        return hasHighZ && (className.includes('bg-black/') || className.includes('backdrop-blur'));
      });

      setHasActiveModal(hasDialog || hasModalBackdrop);
    };

    checkModal();

    const observer = new MutationObserver(() => {
      checkModal();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const shouldSidebarBeOpen = hasActiveModal ? false : isSidebarOpen;

  return (
    <div className="flex h-screen bg-white dark:bg-[#08080a] overflow-hidden selection:bg-primary/30 transition-colors duration-300">
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#001BB7 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
      
      <Sidebar 
        isOpen={shouldSidebarBeOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isOverlay={isBuilderPage || isMobile}
      />
      
      {(isBuilderPage || isMobile) && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-md z-45" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={cn(
        "flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 transition-all duration-300",
      )}>
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8 relative transition-all duration-500 ease-in-out",
          isBuilderPage && isSidebarOpen && "blur-md pointer-events-none",
          isMobile && isSidebarOpen && "blur-xs pointer-events-none lg:blur-none lg:pointer-events-auto"
        )}>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
```

## 5) Shared auth visuals

### Auth background

File: `components/sections/general/auth-background.tsx`

```tsx
import React from "react";

export function AuthBackground() {
  return (
    <>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}
```

### Auth brand

File: `components/sections/general/auth-brand.tsx`

```tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function AuthBrand() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex justify-center mb-8">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 dark:from-white dark:to-gray-400">
          {theme === "light" ? <img src="/logo-black.png" width={140} height={140} alt="logo" /> : <img src="/logo-light.png" width={140} height={140} alt="logo" />}
        </span>
      </Link>
    </div>
  );
}
```

### OAuth buttons

File: `components/sections/general/oauth-buttons.tsx`

```tsx
"use client";
import React from "react";
import { Code } from '@/lib/icons';
import { AuthButton } from "@/components/general/buttons/auth-button";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export function OAuthButtons() {
  const handleOAuth = (provider: "google" | "github") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <AuthButton 
        disabled
        icon={<Code size={18} />} 
        text="GitHub (Soon)" 
      />
      <AuthButton 
        onClick={() => handleOAuth("google")}
        icon={<GoogleIcon />} 
        text="Google" 
      />
    </div>
  );
}
```

## 6) Login form

File: `components/sections/login/login-form.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { ArrowRight, Loader2, Eye, EyeOff } from '@/lib/icons';
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        const errorMessage = resultAction.payload as string || "Login failed";
        toast.error(errorMessage);
        if (errorMessage.toLowerCase().includes("verify your email")) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input 
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <a href="#" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors">Forgot Password?</a>
        </div>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button1 
        type="submit" 
        className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Sign In <ArrowRight size={16} /></>
        )}
      </Button1>
    </form>
  );
}
```

## 7) Register form

File: `components/sections/register/register-form.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { ArrowRight, Loader2, Eye, EyeOff } from '@/lib/icons';
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const resultAction = await dispatch(register({ email, password, firstName, lastName }));
      if (register.fulfilled.match(resultAction)) {
        toast.success("Registration successful! Please verify your email.");
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(resultAction.payload as string || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
        <input 
          type="text"
          placeholder="Jane "
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
        <input 
          type="text"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input 
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button1 
        type="submit" 
        className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Create Account <ArrowRight size={16} /></>
        )}
      </Button1>
    </form>
  );
}
```

## 8) Dashboard header and summary cards

### Dashboard header

File: `components/dashboard/dashboard-header.tsx`

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Bell, Coins } from '@/lib/icons';
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserDropdown } from "@/components/general/user-dropdown";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardHeader({ isSidebarOpen, setIsSidebarOpen }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPro = user?.plan === "PRO";
  const totalTokens = isPro ? 50.0 : 5.0;
  const tokenBalance = user?.tokens ?? 5.0;
  const tokensUsed = Math.max(0, totalTokens - tokenBalance);

  if (!mounted) {
    return (
      <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/90 dark:bg-black/40 backdrop-blur-md z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200 cursor-pointer active:scale-95 border border-transparent hover:border-black/5 dark:hover:border-white/10"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
           {isSidebarOpen ? "Dashboard Overview" : 
           "Build for Job"}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:border-[#001BB7]/40 dark:hover:border-white/20 transition-all cursor-pointer select-none">
            <Coins className="text-amber-500 dark:text-amber-400 shrink-0" size={16} />
            <span>{tokenBalance.toFixed(1)} Credits</span>
          </div>
          
          <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[99]">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>Tokens Used</span>
                <span className="text-black dark:text-white font-bold">{tokensUsed.toFixed(1)}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#001BB7] to-purple-500 rounded-full" 
                  style={{ width: `${(tokensUsed / totalTokens) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>Remaining</span>
                <span className="text-[#001BB7] font-bold">{tokenBalance.toFixed(1)} Credits</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>1 ATS Scan</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">-1.0 Credit</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Rewrite / Summary</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">-0.5 Credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UserDropdown />
      </div>
    </header>
  );
}
```

### Quick actions

File: `components/dashboard/overview/quick-actions.tsx`

```tsx
import { FilePlus, Edit, Search, Github } from '@/lib/icons';
import Link from 'next/link';

const actions = [
  {
    title: "Create Resume",
    desc: "Build a new targeted ATS-friendly resume from scratch.",
    icon: <FilePlus size={20} />,
    color: "primary",
    href: "/dashboard/resume-builder"
  },
  {
    title: "Write Cover Letter",
    desc: "Generate a custom AI cover letter for your next job.",
    icon: <Edit size={20} />,
    color: "blue",
    href: "/dashboard/cover-letter"
  },
  {
    title: "ATS Checker",
    desc: "Check your resume score and get improvement tips.",
    icon: <Search size={20} />,
    color: "emerald",
    href: "/dashboard/resumes/ats"
  },
  {
    title: "Fetch GitHub",
    desc: "Import projects and skills directly from your GitHub.",
    icon: <Github size={20} />,
    color: "orange",
    href: "/dashboard/connect/github"
  }
];

export function QuickActions() {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link 
            key={action.title}
            href={action.href}
            className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 hover:border-primary/50 dark:hover:border-primary/50 transition-all group shadow-sm backdrop-blur-xl"
          >
            <div className={`p-3 rounded-xl transition-all group-hover:scale-110
              ${action.color === 'primary' ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' : ''}
              ${action.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
              ${action.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
              ${action.color === 'orange' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : ''}
              mb-4`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-black dark:text-white mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-left line-clamp-2">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Profile completion banner

File: `components/dashboard/overview/profile-completion-banner.tsx`

```tsx
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, X } from '@/lib/icons';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export function ProfileCompletionBanner() {
  const { user } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = React.useState(true);

  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;
    
    const basicFields = ['firstName', 'lastName', 'phone', 'location', 'jobTitle', 'bio'];
    const filledBasicCount = basicFields.filter(f => !!(user as any)[f]).length;
    score += (filledBasicCount / basicFields.length) * 30;

    if ((user.experience?.length || 0) > 0) score += 20;
    if ((user.education?.length || 0) > 0) score += 20;
    if ((user.projects?.length || 0) > 0) score += 15;
    
    const skillCount = user.skills?.length || 0;
    if (skillCount >= 3) score += 15;
    else if (skillCount > 0) score += 5;

    return Math.min(100, Math.round(score));
  };

  const completionPercent = calculateCompletion();
  const isComplete = completionPercent >= 100;

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {isVisible && user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`mb-8 relative overflow-hidden rounded-2xl border px-6 py-6 pr-16 backdrop-blur-sm ${
            isComplete 
            ? "bg-linear-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-green-500/40 shadow-lg shadow-green-500/10" 
            : "bg-linear-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-purple-200 dark:border-purple-500/20"
          }`}
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-20"
            title="Close"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isComplete ? "bg-green-500/20 text-green-500" : "bg-purple-500/20 text-purple-500"
              }`}>
                {isComplete ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {isComplete ? "Profile Unlocked & Ready!" : "Complete your profile"}
                </h3>
                <p className="text-sm  text-gray-600 dark:text-gray-400">
                  {isComplete 
                    ? "Your profile is 100% complete. You can now use the Magic Builder to generate documents in one go." 
                    : `You've completed ${completionPercent}% of your profile. A complete profile helps you build better resumes.`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10 w-full md:w-auto">
              {!isComplete && (
                <div className="flex-1 md:w-52">
                  <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercent}%` }}
                      className="h-full bg-linear-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-semibold text-gray-500 "> Progress </span>
                    <span className="text-[10px] font-semibold text-purple-500">{completionPercent}%</span>
                  </div>
                </div>
              )}
              
              <Link 
                href={isComplete ? "/dashboard/resume-builder?magic=true" : "/dashboard/settings/profile"}
                className={`flex items-center gap-2 px-6 py-3 transition-all rounded-xl text-sm font-semibold shadow-sm whitespace-nowrap ${
                  isComplete 
                  ? "bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02] active:scale-95 shadow-green-500/20" 
                  : "bg-white dark:bg-white/10 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500"
                }`}
              >
                {isComplete ? (
                  <> Build Resume & cover letter </>
                ) : (
                  <>Finish Profile <ArrowRight size={16} /></>
                )}
              </Link>
            </div>
          </div>

          {isComplete ? (
            <>
              <div className="absolute top-0 right-0 -transtion-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 transtion-y-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 -transtion-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 transtion-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-none" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Stats tracker

File: `components/dashboard/overview/stats-tracker.tsx`

```tsx
import React from 'react';
import { Sparkles } from '@/lib/icons';
import { Button1 } from "@/components/general/buttons/button1";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export function StatsTracker() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const isPro = user?.plan === "PRO";
  const totalTokens = isPro ? 50.0 : 5.0;
  const tokenBalance = user?.tokens ?? 5.0;
  const tokensUsed = Math.max(0, totalTokens - tokenBalance);
  
  const stats = [
    { name: "Credits Used", current: tokensUsed, total: totalTokens, color: "bg-amber-500", desc: isPro ? "Credits consumed this month" : "Credits consumed from lifetime free package" },
    { name: "Credits Remaining", current: tokenBalance, total: totalTokens, color: "bg-primary", desc: isPro ? "Refills back to 50 each month" : "Total 5.0 free scans package" },
  ];

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl">
      <div>
        <div className="flex items-center gap-2 text-primary font-semibold mb-6">
          <span className="animate-pulse"><Sparkles size={18} /></span> Pro Limits Tracker
        </div>
        
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.name}</span>
                <span className="font-bold text-black dark:text-white">{stat.current.toFixed(1)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div 
                  className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${(stat.current / stat.total) * 100}%` }} 
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-sans">{stat.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 space-y-2">
          <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Credit Usage Cost</h5>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>1 ATS Resume Scan</span>
            <span className="font-semibold text-black dark:text-white">1.0 Credit</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>1 AI Rewrite / Summary</span>
            <span className="font-semibold text-black dark:text-white">0.5 Credits</span>
          </div>
        </div>
      </div>
      
      <Button1 
        onClick={() => router.push("/#pricing")}
        className="w-full mt-8 shadow-lg shadow-black/10 dark:shadow-white/5 py-3"
      >
        Upgrade Plan
      </Button1>
    </div>
  );
}
```

### Recent versions

File: `components/dashboard/overview/versions-preview.tsx`

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { History, ArrowRight, Clock } from '@/lib/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getVersions } from '@/apis/versions.api';

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface Version {
  id: string;
  versionName: string;
  companyName: string;
  resumeId: string | null;
  resume: {
    title: string;
  } | null;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  createdAt: string;
}

export function VersionsPreview() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const data = await getVersions();
        setVersions(data);
      } catch (error) {
        console.error("Failed to fetch versions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVersions();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider">Recent Versions</h2>
          <div className="h-4 w-16 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-lg mb-4" />
              <div className="h-5 bg-gray-200 dark:bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider">Recent Versions</h2>
        </div>
        <div
          className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-white/50 dark:bg-black/20 text-center backdrop-blur-xl"
        >
          <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-4 ">
            <History size={28} />
          </div>
          <h3 className="font-semibold text-black dark:text-white mb-2">No Versions Created Yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            Create tailored versions of your resume and cover letter for specific job applications.
          </p>
          <Link 
            href="/dashboard/resumes/versions"
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Create First Version
          </Link>
        </div>
      </div>
    );
  }

  const displayVersions = versions.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider">Recent Versions</h2>
        <Link 
          href="/dashboard/resumes/versions" 
          className="text-sm font-semibold text-primary dark:text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayVersions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 hover:border-primary/30 transition-all group backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/5 dark:bg-primary/20 rounded-lg text-primary">
                <History size={18} />
              </div>
            </div>
            
            <h3 className="font-semibold text-black dark:text-white mb-1 truncate" title={version.versionName}>
              {version.versionName}
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
              For: {version.companyName}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <Clock size={12} />
              {formatRelativeTime(version.createdAt)}
            </div>
            
            <div className="flex items-center gap-2">
              {version.resumeId && version.resume ? (
                <Link 
                  href={`/dashboard/resume-builder?id=${version.resumeId}`}
                  className="text-[11px] font-semibold text-primary dark:text-primary hover:brightness-125 transition-colors"
                >
                  Edit Resume
                </Link>
              ) : version.resumeUrl ? (
                <a 
                  href={version.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-primary dark:text-primary hover:brightness-125 transition-colors"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-[11px] text-gray-500 italic">No resume</span>
              )}

              {version.coverLetterUrl && (
                <>
                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
                  <a 
                    href={version.coverLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Cover Letter
                  </a>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

## 9) Final notes

This is the exact visual style and layout pattern used for the app:

- light/dark neutral background with purple-blue glow accents
- centered auth cards using `rounded-3xl`, `shadow-2xl`, and `backdrop-blur-xl`
- dashboard shell with left sidebar + sticky top header
- glassmorphism cards with white/black transparent backgrounds
- strong purple primary buttons and subtle border styling
- compact information cards, CTA banners, and tracking widgets

Use these files together as the direct implementation blueprint for matching the same page design.
