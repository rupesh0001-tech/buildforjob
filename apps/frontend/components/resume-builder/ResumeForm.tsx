"use client";

import React, { useState } from "react";
import PersonalInfo from "./forms/PersonalInfo";
import ProfessionalSummary from "./forms/ProfessionalSummary";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Project from "./forms/Project";
import Skills from "./forms/Skills";
import BackFrontBtns from "./forms/BackFrontBtns";
import { LatexTemplateSelector } from "./forms/LatexTemplateSelector";
import AccentColorSelector from "./forms/AccentColorSelector";
import { cn } from "@/lib/utils";
import { setSectionVisibility, setSectionOrder } from "@/lib/store/features/resume-slice";
import { 
  Eye, 
  EyeOff, 
  GripVertical, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code2, 
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles
} from '@/lib/icons';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Reorder, motion, AnimatePresence } from "framer-motion";

interface SectionMeta {
  id: number;
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const SECTION_METAS: Record<string, SectionMeta> = {
  summary: {
    id: 2,
    key: "summary",
    label: "Summary",
    icon: FileText,
    description: "Professional overview and career highlights",
  },
  experience: {
    id: 3,
    key: "experience",
    label: "Experience",
    icon: Briefcase,
    description: "Work history, achievements, and roles",
  },
  education: {
    id: 4,
    key: "education",
    label: "Education",
    icon: GraduationCap,
    description: "Degrees, institutions, and dates",
  },
  projects: {
    id: 5,
    key: "projects",
    label: "Projects",
    icon: FolderGit2,
    description: "Key projects, live links, and tech stack",
  },
  skills: {
    id: 6,
    key: "skills",
    label: "Skills",
    icon: Code2,
    description: "Technical skills, tools, and languages",
  },
};

const ResumeForm = () => {
  const [formTab, setFormTab] = useState(1);
  const [isSectionsExpanded, setIsSectionsExpanded] = useState(false);
  const dispatch = useDispatch();

  const sectionVisibility = useSelector((state: RootState) => 
    state.resume.sectionVisibility || {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
    }
  );

  const sectionOrder = useSelector((state: RootState) => 
    state.resume.sectionOrder || ["summary", "education", "experience", "projects", "skills"]
  );

  const getSectionKey = (id: number) => {
    switch(id) {
      case 2: return "summary";
      case 3: return "experience";
      case 4: return "education";
      case 5: return "projects";
      case 6: return "skills";
      default: return null;
    }
  };

  const handleReorder = (newOrder: string[]) => {
    dispatch(setSectionOrder(newOrder));
  };

  const tabs = [
    {
      id: 1,
      key: "personal",
      title: "Personal Info",
      component: <PersonalInfo setFormTab={setFormTab} />,
    },
    {
      id: 2,
      key: "summary",
      title: "Professional Summary",
      component: <ProfessionalSummary setFormTab={setFormTab} />,
    },
    {
      id: 3,
      key: "experience",
      title: "Experience",
      component: <Experience setFormTab={setFormTab} />,
    },
    {
      id: 4,
      key: "education",
      title: "Education",
      component: <Education setFormTab={setFormTab} />,
    },
    {
      id: 5,
      key: "projects",
      title: "Projects",
      component: <Project setFormTab={setFormTab} />,
    },
    {
      id: 6,
      key: "skills",
      title: "Skills",
      component: <Skills />,
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center w-full mb-5 gap-3 flex-wrap">
        <BackFrontBtns setFormTab={setFormTab} formTab={formTab} />
        <div className="flex items-center gap-2 flex-wrap">
          <LatexTemplateSelector />
          <AccentColorSelector />
        </div>
      </div>

      {/* Interactive Draggable Sections Navigator */}
      <div className="mb-6 bg-gray-50/80 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Layers size={15} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Resume Sections
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Drag to reorder sections • Click to jump
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSectionsExpanded(!isSectionsExpanded)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
            title={isSectionsExpanded ? "Collapse section list" : "Expand section list"}
          >
            {isSectionsExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isSectionsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 overflow-hidden pt-1"
            >
              {/* Pinned Personal Info Section */}
              <div
                onClick={() => setFormTab(1)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  formTab === 1
                    ? "bg-primary/10 border-primary/50 text-primary font-bold shadow-xs"
                    : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <User size={14} className={formTab === 1 ? "text-primary" : "text-gray-400"} />
                  </div>
                  <span className="text-xs font-semibold">Personal Info</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10">
                  Header
                </span>
              </div>

              {/* Draggable Body Sections */}
              <Reorder.Group
                axis="y"
                values={sectionOrder}
                onReorder={handleReorder}
                className="space-y-1.5"
              >
                {sectionOrder.map((sectionKey, index) => {
                  const meta = SECTION_METAS[sectionKey];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  const isVisible = (sectionVisibility as any)[sectionKey] ?? true;
                  const isActive = formTab === meta.id;

                  return (
                    <Reorder.Item
                      key={sectionKey}
                      value={sectionKey}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all select-none group cursor-pointer ${
                        isActive
                          ? "bg-primary/10 border-primary/50 text-primary font-bold shadow-xs"
                          : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                      } ${!isVisible ? "opacity-50" : ""}`}
                      onClick={() => setFormTab(meta.id)}
                    >
                      <div className="flex items-center gap-2.5 flex-1">
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded transition-colors"
                          title="Drag up or down to reorder"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical size={15} />
                        </div>
                        <Icon size={14} className={isActive ? "text-primary" : "text-gray-400"} />
                        <span className="text-xs font-semibold">{meta.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 hidden sm:inline">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(setSectionVisibility({ [sectionKey]: !isVisible }))}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isVisible 
                              ? "text-emerald-500 hover:bg-emerald-500/10" 
                              : "text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                          }`}
                          title={isVisible ? "Visible on resume (Click to skip)" : "Hidden from resume (Click to include)"}
                        >
                          {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Content Area */}
      <div className="relative pt-4 border-t border-gray-100 dark:border-white/5">
        {tabs.map((tab) => {
          const sectionKey = getSectionKey(tab.id);
          const isVisible = sectionKey ? (sectionVisibility as any)[sectionKey] : true;

          return (
            <div
              key={tab.id}
              className={`${formTab === tab.id ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight capitalize">
                    {tab.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isVisible ? "Enter your details for this section" : "This section is hidden from your resume"}
                  </p>
                </div>
                
                {sectionKey && (
                  <button
                    onClick={() => dispatch(setSectionVisibility({ [sectionKey]: !isVisible }))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isVisible 
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                      : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                    }`}
                  >
                    {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {isVisible ? "Visible" : "Skipped"}
                  </button>
                )}
              </div>
              
              <div className={cn(!isVisible && "opacity-40 pointer-events-none grayscale select-none")}>
                {tab.component}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeForm;
