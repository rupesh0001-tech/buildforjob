"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile, fetchProfile } from "@/store/slices/authSlice";
import { 
  Github, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Shield,
  Loader2,
  Check,
  MapPin,
  Code,
  Link as LinkIcon
} from '@/lib/icons';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fetchGitHubData, extractUsername } from "@/lib/github/github-api";
import { GithubSyncModal } from "@/components/profile/GithubSyncModal";
import { ConfirmModal } from "@/components/general/ConfirmModal";

export default function GitHubConnectPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Helper to safely parse social links if they come as string
  const getSocialLinks = () => {
    if (!user?.socialLinks) return { github: "", website: "", twitter: "", linkedin: "" };
    if (typeof user.socialLinks === 'string') {
      try { return JSON.parse(user.socialLinks); } catch { return {}; }
    }
    return user.socialLinks as any;
  };

  const socialLinks = getSocialLinks();
  const isConnected = !!socialLinks?.github;
  
  // Robust check for synced items
  const hasSyncedProjects = (user?.projects || []).some((p: any) => p.isGithubSynced);
  const hasSyncedSkills = (user?.skills || []).some((s: any) => s.isGithubSynced);
  const isAlreadySynced = hasSynced || hasSyncedProjects || hasSyncedSkills;

  const handleFetch = async () => {
    const targetUrl = isConnected ? socialLinks.github : url;
    const username = extractUsername(targetUrl);
    if (!username) {
      toast.error("Please enter a valid GitHub profile URL.");
      return;
    }

    setLoading(true);
    setGithubData(null);
    try {
      const data = await fetchGitHubData(username);
      setGithubData(data);
      setShowSyncModal(true);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true);
  };

  const handleDisconnect = async () => {
    
    try {
      setLoading(true);
      const updatedData = {
        ...user,
        socialLinks: { ...socialLinks, github: "" },
        skills: (user?.skills || []).filter((s: any) => !s.isGithubSynced),
        projects: (user?.projects || []).filter((p: any) => !p.isGithubSynced)
      };
      await dispatch(updateProfile(updatedData)).unwrap();
      toast.success("Disconnected from GitHub and synced data removed.");
      setUrl("");
      setGithubData(null);
      setHasSynced(false);
    } catch (error: any) {
      toast.error(error || "Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  const onGithubDataMerged = async (mergedData: any) => {
    try {
      await dispatch(updateProfile(mergedData)).unwrap();
      setHasSynced(true);
      setShowSyncModal(false);
      toast.success("Profile synchronized and saved successfully!");
    } catch (error: any) {
      toast.error(error || "Failed to sync profile");
      throw error;
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#001BB7]" size={40} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Initializing Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      

      {isConnected ? (
        <div className="space-y-8">
          {/* Main Connection Card */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden group transition-all duration-300 hover:border-[#001BB7]/30">
            <div className="relative p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm transition-transform duration-500 hover:scale-105">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-[#001BB7] uppercase">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    @{extractUsername(socialLinks.github)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                      <Check size={14} /> Connected
                    </span>
                    {user?.location && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <MapPin size={14} className="text-[#001BB7]" /> {user.location}
                      </span>
                    )}
                    <a 
                      href={socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#001BB7] hover:underline transition-all"
                    >
                      <ExternalLink size={14} /> View GitHub Profile
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#001BB7] text-white rounded-xl font-semibold text-sm hover:bg-[#001BB7]/90 active:scale-95 transition-all shadow-lg shadow-[#001BB7]/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <RefreshCw size={18} />
                  )}
                  {loading ? "Refreshing..." : "Sync Profile"}
                </button>
                <button
                  onClick={handleDisconnectClick}
                  disabled={loading}
                  className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all border border-red-100 dark:border-red-500/20"
                  title="Disconnect GitHub"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-black/20 px-8 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400"><Shield size={12} /> Secure Link</span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> 
                  {isAlreadySynced ? "Synchronized" : "Ready to sync"}
                </span>
              </div>
              <div className="h-1.5 w-32 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: isAlreadySynced ? "100%" : "30%" }} 
                   className={`h-full transition-all duration-1000 ${isAlreadySynced ? "bg-green-500" : "bg-[#001BB7]"}`} 
                 />
              </div>
            </div>
          </div>

          {/* Synced Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <Code size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Synced Projects</h4>
              </div>
              <div>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {(user?.projects || []).filter((p: any) => p.isGithubSynced).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Repositories imported from GitHub</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                  <Check size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Technical Skills</h4>
              </div>
              <div>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {(user?.skills || []).filter((s: any) => s.isGithubSynced).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Skills extracted from your profile</p>
              </div>
            </div>

            <div className="bg-[#001BB7] p-6 rounded-2xl shadow-lg shadow-[#001BB7]/20 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 text-white">
                <RefreshCw size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-semibold text-white/80 tracking-wide uppercase text-[10px]">Sync Status</h4>
                <p className="text-2xl font-semibold text-white mt-1">Up to Date</p>
                <p className="text-[10px] text-white/60 mt-1 font-medium italic">Click refresh to pull latest changes</p>
              </div>
              <button 
                onClick={handleFetch}
                className="relative z-10 w-full mt-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 backdrop-blur-sm"
              >
                Refresh Data Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recently Synced Repositories */}
            <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recently Synced Repositories</h4>
                <span className="text-[10px] font-semibold bg-[#001BB7]/10 text-[#001BB7] px-2.5 py-1 rounded-full uppercase tracking-tight">
                  {(user?.projects || []).filter((p: any) => p.isGithubSynced).length} Total
                </span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                {(user?.projects || []).filter((p: any) => p.isGithubSynced).length > 0 ? (
                  (user?.projects || []).filter((p: any) => p.isGithubSynced).map((project: any, idx: number) => (
                    <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl group-hover:bg-[#001BB7]/10 transition-colors">
                          <Code size={18} className="text-gray-500 group-hover:text-[#001BB7]" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-md">{project.description || "No description provided."}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {project.techStack && (
                          <span className="text-[10px] font-semibold px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg">
                            {project.techStack}
                          </span>
                        )}
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-400 hover:text-[#001BB7] transition-all border border-transparent hover:border-[#001BB7]/20"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-8 py-20 text-center space-y-3">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Github size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No repositories have been synced yet.</p>
                    <button 
                      onClick={handleFetch}
                      className="text-xs font-semibold text-[#001BB7] hover:underline"
                    >
                      Sync now to import repositories
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pro Tips / Help Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield size={64} className="text-[#001BB7]" />
                </div>
                <h4 className="text-xs font-semibold text-[#001BB7] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={14} /> Optimization Tips
                </h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Pin Your Repositories</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      We prioritize pinned repositories during sync. Make sure your best work is pinned on GitHub.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Detailed READMEs</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Better project descriptions help our AI categorize your skills more accurately.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                  <button className="text-[10px] font-semibold uppercase tracking-wider text-[#001BB7] hover:underline flex items-center gap-2">
                    Learn more about Sync <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              <div className="bg-linear-to-br from-[#001BB7]/5 to-transparent p-6 rounded-2xl border border-[#001BB7]/10 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm">
                  <RefreshCw size={20} className="text-[#001BB7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Automatic Syncing</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Coming soon to Pro users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-16 text-center shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#001BB7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="max-w-md mx-auto space-y-10 relative">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-inner transition-transform duration-700 group-hover:scale-110">
                <Github className="text-gray-300 dark:text-gray-600" size={48} />
              </div>
              <div className="absolute top-0 right-1/4 w-8 h-8 rounded-full bg-[#001BB7]/10 blur-xl animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Connect your GitHub</h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Import your profile and repositories as projects to fill your details automatically.</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="github.com/username"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium"
                />
              </div>
              <button
                onClick={handleFetch}
                disabled={loading || !url}
                className="w-full py-4 bg-[#001BB7] text-white rounded-xl font-semibold text-sm hover:bg-[#001BB7]/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#001BB7]/20 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                {loading ? "Connecting..." : "Connect GitHub Profile"}
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                  <Shield size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Auto Sync</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                  <Check size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">1-Click</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {githubData && user && (
        <GithubSyncModal 
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          githubData={githubData}
          currentData={user}
          onSync={onGithubDataMerged}
          key={githubData.profile.html_url}
        />
      )}

      <ConfirmModal 
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={handleDisconnect}
        title="Disconnect GitHub"
        description="Are you sure? This will disconnect GitHub and remove all projects and skills synced from it. This action cannot be undone."
        confirmText="Disconnect"
        variant="danger"
      />
    </div>
  );
}
