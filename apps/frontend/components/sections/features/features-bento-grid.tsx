"use client";
import React from "react";
import { Target, Mail, Code, Users, Sparkles, Notebook, Option, LayoutDashboard, Computer } from '@/lib/icons';
import { FeatureCard } from "./feature-card";
import { FeaturesHeader } from "./features-header";

export function FeaturesBentoGrid() {
  const features = [
    {
      title : "Resume Builder", 
      desc : "Build a resume that stands out from the crowd.",
      icon : <LayoutDashboard className="text-gray-700 dark:text-gray-200" />,
       className: "md:col-span-2 md:row-span-2 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-500/20",
      
      large : true,
      
    },
    
    {
      title: "AI Cover Letters",
      desc: "Generates tailored cover letters in seconds by blending your resume with specific job requirements.",
      icon: <Mail className="text-emerald-500 dark:text-emerald-400" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    },
    {
      title: "GitHub Portfolio Sync",
      desc: "One-click generation of stunning personal websites pulling live real projects from Github.",
      icon: <Code className="text-gray-700 dark:text-gray-200" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    },
    {
      title: "LinkedIn Enhancer",
      desc: "Optimizes your headline, about section, and bullet points to rank higher in recruiter searches.",
      icon: <Users className="text-blue-600 dark:text-blue-500" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 md:col-span-2"
    },
    {
      title: "Bullet Point Rewriter",
      desc: "Turns weak responsibilities into strong, metric-driven achievements.",
      icon: <Sparkles className="text-purple-500 dark:text-purple-400" />,
      className: "bg-linear-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-purple-200 dark:border-purple-500/20"
    },
    {
      title : "Github Profile Readme",
      desc : "Get the Best Github Profile Readme for your Github Profile.",
      icon : <Code className="text-gray-700 dark:text-gray-200" />,
      className : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    },
    {
      title: "ATS-Optimized Resumes",
      desc: "Scores your resume against job descriptions to highlight missing keywords and fix formatting before you apply.",
      icon: <Target className="text-blue-500 dark:text-blue-400" />,
      className : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10",
     
      
    },
    
    {
      title : "Portfolio Builder",
      desc : "Build a portfolio that stands out from the crowd.",
      icon : <Computer className="text-gray-700 dark:text-gray-200" />,
      className : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col">
      <FeaturesHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {features.map((opt, i) => (
          <FeatureCard key={i} index={i} {...opt} />
        ))}
      </div>
    </section>
  );
}
