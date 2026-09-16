"use client";

import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from '@/lib/icons';
import { motion } from 'framer-motion';

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Google",
    location: "Remote / Mountain View",
    salary: "$150k - $220k",
    type: "Full-time"
  },
  {
    id: 2,
    title: "React Developer",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$140k - $200k",
    type: "Contract"
  }
];

export function JobRecommendations() {
  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-500/30 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <Briefcase size={18} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md uppercase tracking-tighter">
                  {job.type}
                </span>
              </div>
              
              <h3 className="font-semibold text-black dark:text-white mb-1">{job.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{job.company}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={12} />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <DollarSign size={12} />
                  {job.salary}
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-sm font-semibold transition-all group/btn">
              Apply with AI Resume <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
