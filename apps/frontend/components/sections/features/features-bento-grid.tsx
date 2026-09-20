"use client";
import React from "react";
import { motion } from "framer-motion";
import { FeaturesHeader } from "./features-header";
import { Sparkles, FileText, CheckCircle2, Code, ShieldCheck, Layers, ArrowUpRight } from "@/lib/icons";

export function FeaturesBentoGrid() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col">
      <FeaturesHeader />
      
      {/* Outer Glassmorphic Bento Container */}
      <div className="p-4 sm:p-6 md:p-8 rounded-[36px] bg-white/70 dark:bg-[#0c0915]/80 border border-purple-100/80 dark:border-purple-900/30 backdrop-blur-xl shadow-xl shadow-purple-900/5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Card 1: Resume Builder (Tall Left Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 lg:col-span-4 md:row-span-2 rounded-[28px] bg-gradient-to-br from-[#f6f2fe] via-purple-50/60 to-[#eee5fc] dark:from-[#1b152d] dark:via-[#161226] dark:to-[#221a38] border border-purple-200/80 dark:border-purple-800/40 p-7 sm:p-8 flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/15 dark:hover:shadow-purple-950/50 min-h-[420px] md:min-h-[560px] relative"
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 text-[#6e56cf] dark:bg-purple-950 dark:text-purple-300 text-xs font-semibold border border-purple-200/60 dark:border-purple-800/50">
                  <Sparkles size={13} /> Core Builder
                </span>
                <span className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-3">
                Resume Builder
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-sm">
                Build an ATS-friendly, targeted resume that stands out from the crowd with real-time AI suggestions.
              </p>
            </div>

            {/* Illustration Canvas Frame */}
            <div className="my-auto py-6 flex items-center justify-center relative z-10">
              <div className="w-full p-4 rounded-2xl bg-white/80 dark:bg-[#120e22]/90 border border-purple-100 dark:border-purple-900/40 shadow-md backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/resume-builder.png" 
                  alt="Resume Builder" 
                  className="w-full max-h-[250px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Cover Letter Builder (Top Right Wide Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 lg:col-span-8 rounded-[28px] bg-gradient-to-br from-[#fdf0f4] via-rose-50/50 to-[#f9e2e9] dark:from-[#2a1722] dark:via-[#23131c] dark:to-[#341b2b] border border-rose-200/80 dark:border-rose-900/40 p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/15 dark:hover:shadow-rose-950/50 min-h-[250px] relative"
          >
            <div className="flex-1 z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/10 text-rose-600 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold border border-rose-200/60 dark:border-rose-800/50">
                  <FileText size={13} /> Instant Tailoring
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-3">
                Cover Letter Builder
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-md">
                Generate tailored cover letters in seconds by blending your resume with specific job requirements.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-64 flex items-center justify-center z-10">
              <div className="w-full p-3 rounded-2xl bg-white/80 dark:bg-[#1f1019]/90 border border-rose-100 dark:border-rose-900/40 shadow-md backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/cover-letter.png" 
                  alt="Cover Letter Builder" 
                  className="w-full max-h-[160px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 3: ATS Checker (Middle Square Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3.5 lg:col-span-4 rounded-[28px] bg-gradient-to-br from-[#fff9e6] via-amber-50/50 to-[#fdf2d0] dark:from-[#2a2315] dark:via-[#221c11] dark:to-[#342b1a] border border-amber-200/80 dark:border-amber-900/40 p-7 sm:p-8 flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/15 dark:hover:shadow-amber-950/50 min-h-[270px] relative"
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/10 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800/50">
                  <ShieldCheck size={13} /> 98% Match Index
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
                ATS Checker
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                Scores your resume against job descriptions to highlight missing keywords and fix formatting before you apply.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center z-10">
              <div className="w-full p-2.5 rounded-2xl bg-white/80 dark:bg-[#1a150c]/90 border border-amber-100 dark:border-amber-900/40 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/ats-checker.png" 
                  alt="ATS Checker" 
                  className="w-full max-h-[140px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 4: GitHub Sync (Middle Right Square Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-3.5 lg:col-span-4 rounded-[28px] bg-gradient-to-br from-[#edfaf1] via-emerald-50/50 to-[#e1f5e8] dark:from-[#16291a] dark:via-[#112115] dark:to-[#1c3321] border border-emerald-200/80 dark:border-emerald-900/40 p-7 sm:p-8 flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-950/50 min-h-[270px] relative"
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/50">
                  <Code size={13} /> Auto Profile Sync
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
                GitHub Sync
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                One-click import of real projects, repositories & skills directly from your GitHub profile.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center z-10">
              <div className="w-full p-2.5 rounded-2xl bg-white/80 dark:bg-[#0e1b11]/90 border border-emerald-100 dark:border-emerald-900/40 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/github-sync.png" 
                  alt="GitHub Sync" 
                  className="w-full max-h-[140px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 5: Portfolio Builder (Bottom Left Wide Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-7 lg:col-span-7 rounded-[28px] bg-gradient-to-br from-[#fff2ea] via-orange-50/50 to-[#fde5d7] dark:from-[#2d1c15] dark:via-[#241610] dark:to-[#38231a] border border-orange-200/80 dark:border-orange-900/40 p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/15 dark:hover:shadow-orange-950/50 min-h-[260px] relative"
          >
            <div className="flex-1 z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/10 text-orange-700 dark:bg-orange-950 dark:text-orange-300 text-xs font-semibold border border-orange-200/60 dark:border-orange-800/50">
                  <CheckCircle2 size={13} /> Live Deployment
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-3">
                Portfolio Builder
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-md">
                Build and deploy a stunning, personalized developer portfolio in one click to showcase your work to recruiters.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-64 flex items-center justify-center z-10">
              <div className="w-full p-3 rounded-2xl bg-white/80 dark:bg-[#1d120d]/90 border border-orange-100 dark:border-orange-900/40 shadow-md backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/portfolio-builder.png" 
                  alt="Portfolio Builder" 
                  className="w-full max-h-[160px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 6: Resume & Cover Letter Version Management (Bottom Right Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-5 lg:col-span-5 rounded-[28px] bg-gradient-to-br from-[#eef6fc] via-blue-50/50 to-[#e1effa] dark:from-[#152331] dark:via-[#111c27] dark:to-[#1b2b3d] border border-blue-200/80 dark:border-blue-900/40 p-7 sm:p-8 flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/15 dark:hover:shadow-blue-950/50 min-h-[260px] relative"
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/50">
                  <Layers size={13} /> Smart Tracking
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
                Version Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                Organize, track, and manage tailored versions of your resume and cover letter for specific job applications.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center z-10">
              <div className="w-full p-2.5 rounded-2xl bg-white/80 dark:bg-[#0e1720]/90 border border-blue-100 dark:border-blue-900/40 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src="/version-management.png" 
                  alt="Resume & Cover Letter Version Management" 
                  className="w-full max-h-[140px] object-contain rounded-xl"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


