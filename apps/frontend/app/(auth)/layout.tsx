"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (isAuthenticated || token)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, token, isLoading, mounted, router]);

  // Prevent layout flashes during redirect
  if (mounted && !isLoading && (isAuthenticated || token)) {
    return null;
  }

  return <>{children}</>;
}
