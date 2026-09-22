"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { 
  setSectionOrder, 
  moveSection, 
  setSectionVisibility 
} from "@/lib/store/features/resume-slice";
import { 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  X, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code2, 
  FileText, 
  Sparkles,
  Check
} from "@/lib/icons";
import { toast } from "sonner";

interface SectionMeta {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const ALL_SECTIONS: Record<string, SectionMeta> = {
  summary: {
    key: "summary",
    label: "Professional Summary",
    description: "Overview of your background and career goals",
    icon: FileText,
  },
  experience: {
    key: "experience",
    label: "Work Experience",
    description: "Past roles, achievements, and responsibilities",
    icon: Briefcase,
  },
  education: {
    key: "education",
    label: "Education",
    description: "Degrees, institutions, and graduation dates",
    icon: GraduationCap,
  },
  projects: {
    key: "projects",
    label: "Projects & Portfolios",
    description: "Key projects, live links, and GitHub repos",
    icon: FolderGit2,
  },
  skills: {
    key: "skills",
    label: "Technical Skills",
    description: "Languages, frameworks, databases, and tools",
    icon: Code2,
  },
};

const PRESETS = [
  {
    name: "Experience First",
    order: ["experience", "skills", "projects", "education", "summary"],
    tag: "For 2+ Yrs Exp",
  },
  {
    name: "Skills & Projects First",
    order: ["skills", "projects", "experience", "education", "summary"],
    tag: "Tech / Devs",
  },
  {
    name: "Standard Academic",
    order: ["summary", "education", "experience", "projects", "skills"],
    tag: "New Grads",
  },
];

export function SectionOrderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  
  const sectionOrder = useSelector((state: RootState) => 
    state.resume.sectionOrder || ["summary", "education", "experience", "projects", "skills"]
  );
  const sectionVisibility = useSelector((state: RootState) => 
    state.resume.sectionVisibility || {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
    }
  );

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch(moveSection({ fromIndex: index, toIndex: index - 1 }));
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sectionOrder.length - 1) {
      dispatch(moveSection({ fromIndex: index, toIndex: index + 1 }));
    }
  };

  const handleToggleVisibility = (key: string) => {
    const current = (sectionVisibility as any)[key] ?? true;
    dispatch(setSectionVisibility({ [key]: !current }));
  };

  const handleApplyPreset = (presetOrder: string[]) => {
    dispatch(setSectionOrder(presetOrder));
    toast.success("Section order preset applied!");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary/50 text-gray-700 dark:text-gray-200 hover:text-primary rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        title="Reorder and customize resume sections"
      >
        <ArrowUpDown size={14} className="text-primary" />
        <span className="hidden sm:inline">Sections</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#0f0f15] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ArrowUpDown size={18} className="text-primary" />
                  Customize Resume Sections
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Change the order of sections appearing on your compiled document.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Presets</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESETS.map((preset) => {
                    const isCurrent = JSON.stringify(sectionOrder) === JSON.stringify(preset.order);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset.order)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isCurrent
                            ? "bg-primary/10 border-primary text-primary dark:text-white font-medium"
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{preset.name}</span>
                          {isCurrent && <Check size={12} className="text-primary" />}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">{preset.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sections Reordering List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Current Section Order ({sectionOrder.length})
                </span>
                
                <div className="space-y-2">
                  {sectionOrder.map((sectionKey, index) => {
                    const meta = ALL_SECTIONS[sectionKey] || {
                      key: sectionKey,
                      label: sectionKey,
                      description: "",
                      icon: FileText,
                    };
                    const IconComponent = meta.icon;
                    const isVisible = (sectionVisibility as any)[sectionKey] ?? true;

                    return (
                      <div
                        key={sectionKey}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isVisible
                            ? "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xs"
                            : "bg-gray-50/60 dark:bg-white/[0.02] border-dashed border-gray-300 dark:border-white/10 opacity-60"
                        }`}
                      >
                        {/* Section Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                            {index + 1}
                          </span>
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <IconComponent size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {meta.label}
                              </p>
                              {!isVisible && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-500 uppercase">
                                  Skipped
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">
                              {meta.description}
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(sectionKey)}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isVisible
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                            }`}
                            title={isVisible ? "Visible on resume" : "Hidden from resume"}
                          >
                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>

                          <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              title="Move Up"
                            >
                              <ChevronUp size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === sectionOrder.length - 1}
                              className="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              title="Move Down"
                            >
                              <ChevronDown size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  toast.success("Section settings updated!");
                }}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
