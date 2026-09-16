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
          // initial={{ opacity: 0, y: 10 }}
          // animate={{ opacity: 1, y: 0 }}
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
