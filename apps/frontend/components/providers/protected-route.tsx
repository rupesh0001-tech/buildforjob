"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProfile, logoutUser } from "@/store/slices/authSlice";
import { Loader2 } from '@/lib/icons';
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, token, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = React.useState(false);
  const [profileFetched, setProfileFetched] = React.useState(!!user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setProfileFetched(true);
    }
  }, [user]);

  useEffect(() => {
    if (mounted) {
      if (!isLoading && !isAuthenticated && !token) {
        router.push("/login");
      } else if ((token || isAuthenticated) && !user && !profileFetched && !isLoading) {
        dispatch(fetchProfile())
          .unwrap()
          .then(() => {
            setProfileFetched(true);
          })
          .catch(() => {
            setProfileFetched(true);
            dispatch(logoutUser());
          });
      }
    }
  }, [isAuthenticated, isLoading, token, router, mounted, dispatch, profileFetched, user]);

  // Don't render anything that depends on client-only state during SSR
  if (!mounted) {
    return null;
  }

  if (!profileFetched && (isAuthenticated || token) && !user) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="animate-spin text-[#001BB7]" size={36} />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 animate-pulse">Syncing profile details...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
}
