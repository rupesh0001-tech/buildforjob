"use client";

import React, { useState } from "react";
import PersonalInfo from "./forms/PersonalInfo";
import ProfessionalSummary from "./forms/ProfessionalSummary";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Project from "./forms/Project";
import Skills from "./forms/Skills";
import BackFrontBtns from "./forms/BackFrontBtns";
import ThemeSelector from "./forms/ThemeSelector";
import AccentColorSelector from "./forms/AccentColorSelector";
import { cn } from "@/lib/utils";

import { setSectionVisibility } from "@/lib/store/features/resume-slice";
import { Eye, EyeOff } from '@/lib/icons';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const ResumeForm = () => {
  const [formTab, setFormTab] = useState(1);
  const dispatch = useDispatch();
  const sectionVisibility = useSelector((state: RootState) => state.resume.sectionVisibility);

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

  const tabs = [
    {
      id: 1,
      title: "Personal Info",
      component: <PersonalInfo setFormTab={setFormTab} />,
    },
    {
      id: 2,
      title: "Professional Summary",
      component: <ProfessionalSummary setFormTab={setFormTab} />,
    },
    {
      id: 3,
      title: "Experience",
      component: <Experience setFormTab={setFormTab} />,
    },
    {
      id: 4,
      title: "Education",
      component: <Education setFormTab={setFormTab} />,
    },
    {
      id: 5,
      title: "Project",
      component: <Project setFormTab={setFormTab} />,
    },
    {
      id: 6,
      title: "Skills",
      component: <Skills />,
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
      <div className="flex justify-between items-center w-full mb-6 gap-4 flex-wrap">
        <BackFrontBtns setFormTab={setFormTab} formTab={formTab} />
        <div className="flex gap-3">
          <ThemeSelector />
          <AccentColorSelector />
        </div>
      </div>

      <div className="relative pt-6 border-t border-gray-100 dark:border-white/5">
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
