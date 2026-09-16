"use client";
import React, { useState } from "react";
import { ArrowRight, Loader2 } from '@/lib/icons';
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchGitHubData, extractUsername } from "@/lib/github/github-api";
import { GithubSyncModal } from "@/components/profile/GithubSyncModal";

export function OnboardingGithubForm() {
  const [githubUrl, setGithubUrl] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleModalClose = () => {
    setShowSyncModal(false);
    router.push("/dashboard");
  };

  const handleGithubFetch = async () => {
    const username = extractUsername(githubUrl);
    if (!username) {
      toast.error("Please enter a valid GitHub profile URL.");
      return;
    }

    setFetchingGithub(true);
    setGithubData(null);
    try {
      const data = await fetchGitHubData(username);
      setGithubData(data);
      setShowSyncModal(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch GitHub profile. Make sure the username is correct.");
    } finally {
      setFetchingGithub(false);
    }
  };

  const onGithubDataMerged = async (mergedData: any) => {
    try {
      await dispatch(updateProfile(mergedData)).unwrap();
      toast.success("GitHub data synced successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error || "Failed to sync GitHub data");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center font-sans">Connect GitHub</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6 leading-relaxed font-sans">
        Let&apos;s customize your profile. Connect your GitHub profile to instantly import your projects, technologies, and repositories.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1 font-sans">
            GitHub Profile URL
          </label>
          <input 
            type="url"
            placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-semibold"
          />
        </div>

        <Button1 
          onClick={handleGithubFetch}
          className="w-full py-3 h-12 flex items-center justify-center gap-2"
          disabled={fetchingGithub || !githubUrl}
        >
          {fetchingGithub ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>Connect & Sync <ArrowRight size={16} /></>
          )}
        </Button1>

        <button 
          type="button"
          onClick={handleSkip}
          className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white hover:underline transition-all cursor-pointer text-center block"
        >
          Skip this process
        </button>
      </div>

      {githubData && user && (
        <GithubSyncModal 
          isOpen={showSyncModal}
          onClose={handleModalClose}
          githubData={githubData}
          currentData={user}
          onSync={onGithubDataMerged}
          key={githubData.profile.html_url}
        />
      )}
    </div>
  );
}
