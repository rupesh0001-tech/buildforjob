"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, X, Check, ArrowRight, Save, Info, RefreshCw, 
  AlertTriangle, User as UserIcon, Code 
} from '@/lib/icons';

import type { User } from '@/types/auth';

interface GithubProject {
  name: string;
  description?: string | null;
  tech?: string | null;
  stars?: number;
  url?: string;
  github_url?: string;
  updated_at?: string;
}

interface GithubData {
  profile: {
    name: string | null;
    bio: string | null;
    avatar: string;
    location: string | null;
    html_url: string;
    company: string | null;
    blog: string | null;
  };
  skills: string[];
  projects: GithubProject[];
}

interface GithubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubData: GithubData;
  currentData: Partial<User>;
  onSync: (mergedData: Partial<User>) => Promise<void> | void;
}

export function GithubSyncModal({ isOpen, onClose, githubData, currentData, onSync }: GithubSyncModalProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, 'current' | 'github'>>({
    name: 'github',
    bio: 'github',
    location: 'github',
    website: 'github'
  });

  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    githubData?.projects ? githubData.projects.map((p) => p.name) : []
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    Array.from(new Set(githubData?.skills || []))
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleMerge = async () => {
    const nameParts = (githubData.profile.name || "").split(" ");
    const githubFirstName = nameParts[0] || "";
    const githubLastName = nameParts.slice(1).join(" ") || "";

    const mergedData = { ...currentData };

    // 1. Personal Info & Connection Merge
    mergedData.socialLinks = { 
      ...(mergedData.socialLinks || {}), 
      github: githubData.profile.html_url 
    };

    // Store GitHub avatar
    mergedData.avatarUrl = githubData.profile.avatar;

    if (selectedFields.name === 'github') {
      mergedData.firstName = githubFirstName;
      mergedData.lastName = githubLastName;
    }
    if (selectedFields.bio === 'github') mergedData.bio = githubData.profile.bio || undefined;
    if (selectedFields.location === 'github') mergedData.location = githubData.profile.location || undefined;
    if (selectedFields.website === 'github' && mergedData.socialLinks) {
      mergedData.socialLinks.website = githubData.profile.blog || undefined;
    }

    // 2. Projects Merge (Replace Synced ones)
    const newProjects = githubData.projects
      .filter((p) => selectedProjects.includes(p.name))
      .map(p => ({
        name: p.name,
        description: p.description || "",
        techStack: p.tech || "",
        url: p.github_url || p.url || "",
        isGithubSynced: true
      }));
    
    // Remove existing synced projects first to avoid duplicates/stale data
    const nonSyncedProjects = (mergedData.projects || []).filter((p) => !p.isGithubSynced);
    mergedData.projects = [...nonSyncedProjects, ...newProjects];

    // 3. Skills Merge (Replace Synced ones - uniqueness already handled in selection)
    // Filter out existing synced skills
    const nonSyncedSkills = (mergedData.skills || []).filter((s) => !s.isGithubSynced);
    
    const newSkills = selectedSkills.map(s => ({ 
      name: s,
      isGithubSynced: true
    }));

    mergedData.skills = [...nonSyncedSkills, ...newSkills];

    try {
      setIsSyncing(true);
      await onSync(mergedData);
      onClose();
    } catch (error) {
      console.error("Failed to sync GitHub profile:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const nameParts = (githubData.profile.name || "").split(" ");
  const githubFirstName = nameParts[0] || "";
  const githubLastName = nameParts.slice(1).join(" ") || "";

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-[#08080a] w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
        >
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-[#08080a]/95 backdrop-blur-md"
              >
                <div className="flex flex-col items-center max-w-sm text-center px-6 space-y-6">
                  {/* Animated Icon Container */}
                  <div className="relative">
                    {/* Outer glowing pulsing circle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.3, 0.15],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -inset-4 rounded-full bg-[#001BB7] blur-md"
                    />
                    
                    {/* Inner rotating/pulsing ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-20 h-20 rounded-full border-2 border-t-[#001BB7] border-r-transparent border-b-[#001BB7]/30 border-l-transparent"
                    />
                    
                    {/* Center github icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-[#001BB7]">
                      <motion.div
                        animate={{
                          scale: [0.9, 1.1, 0.9],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Github size={36} />
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Syncing GitHub Changes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We are saving the selected repositories, skills, and profile updates to your profile. This will take just a moment.
                    </p>
                  </div>

                  {/* Progress indicators / stages */}
                  <div className="w-full space-y-2">
                    <div className="h-1 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#001BB7]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 4,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      <span>Processing Data</span>
                      <span>Uploading Profile</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#001BB7]/10 flex items-center justify-center text-[#001BB7]">
                <Github size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sync GitHub Profile</h3>
                <p className="text-sm text-gray-500">Review and merge your GitHub data into your profile</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isSyncing} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            
            {/* 1. Personal Info Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Personal Info Conflicts</h4>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'name', label: 'Display Name', current: `${currentData.firstName} ${currentData.lastName}`, github: `${githubFirstName} ${githubLastName}` },
                  { id: 'bio', label: 'Bio / Summary', current: currentData.bio, github: githubData.profile.bio || undefined },
                  { id: 'location', label: 'Location', current: currentData.location, github: githubData.profile.location || undefined },
                  { id: 'website', label: 'Website / Portfolio', current: currentData.socialLinks?.website, github: githubData.profile.blog || undefined }
                ].map(field => (
                  <div key={field.id} className="space-y-3">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1">{field.label}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Current Option */}
                      <button 
                        onClick={() => setSelectedFields(prev => ({ ...prev, [field.id]: 'current' }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative group ${
                          selectedFields[field.id] === 'current' 
                          ? 'border-[#001BB7] bg-[#001BB7]/5' 
                          : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#001BB7]/30'
                        }`}
                      >
                        <span className="text-[10px] font-semibold text-gray-400 uppercase flex mb-2 tracking-wider">Current Profile</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{field.current || "Not set"}</p>
                        {selectedFields[field.id] === 'current' && (
                          <div className="absolute top-3 right-3 text-[#001BB7]">
                            <div className="p-1 bg-[#001BB7] rounded-full text-white">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          </div>
                        )}
                      </button>

                      {/* GitHub Option */}
                      <button 
                        onClick={() => setSelectedFields(prev => ({ ...prev, [field.id]: 'github' }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative group ${
                          selectedFields[field.id] === 'github' 
                          ? 'border-[#001BB7] bg-[#001BB7]/5' 
                          : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#001BB7]/30'
                        }`}
                      >
                        <span className="text-[10px] font-semibold text-[#001BB7] uppercase flex items-center gap-1.5 mb-2 tracking-wider">
                          <Github size={12} /> GitHub Source
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{field.github || "Not set"}</p>
                        {selectedFields[field.id] === 'github' && (
                          <div className="absolute top-3 right-3 text-[#001BB7]">
                            <div className="p-1 bg-[#001BB7] rounded-full text-white">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Projects Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Repositories to Import ({githubData.projects.length})</h4>
                <button 
                  onClick={() => setSelectedProjects(selectedProjects.length === githubData.projects.length ? [] : githubData.projects.map((p) => p.name))}
                  className="text-xs font-semibold text-[#001BB7] hover:underline"
                >
                  {selectedProjects.length === githubData.projects.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {githubData.projects.map((proj) => (
                  <button
                    key={proj.name}
                    onClick={() => {
                      if (selectedProjects.includes(proj.name)) {
                        setSelectedProjects(selectedProjects.filter(name => name !== proj.name));
                      } else {
                        setSelectedProjects([...selectedProjects, proj.name]);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all text-left group flex items-start gap-4 ${
                      selectedProjects.includes(proj.name)
                      ? 'bg-[#001BB7]/5 border-[#001BB7]'
                      : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-[#001BB7]/30'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      selectedProjects.includes(proj.name) ? 'bg-[#001BB7] border-[#001BB7] text-white' : 'border-gray-300 dark:border-white/20'
                    }`}>
                      {selectedProjects.includes(proj.name) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#001BB7] transition-colors">{proj.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{proj.description || "No description provided."}</p>
                      {proj.tech && (
                        <div className="pt-2">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                            {proj.tech}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Skills Section */}
            <section className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Extract Technical Skills</h4>
              <div className="flex flex-wrap gap-2.5">
                {[...new Set(githubData.skills)].map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (selectedSkills.includes(skill)) {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      } else {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      selectedSkills.includes(skill)
                      ? 'bg-[#001BB7] border-[#001BB7] text-white'
                      : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500'
                    }`}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <Check size={12} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 font-semibold">
              <Info size={14} />
              <span>Data will be merged with your existing profile.</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                disabled={isSyncing}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleMerge}
                disabled={isSyncing}
                className="px-6 py-2.5 bg-[#001BB7] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#001BB7]/95 transition-all shadow-lg shadow-[#001BB7]/20 disabled:opacity-50"
              >
                Sync with Profile <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
