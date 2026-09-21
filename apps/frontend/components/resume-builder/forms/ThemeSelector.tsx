"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setTemplate } from "@/lib/store/features/resume-slice";
import { ChevronDown, Palette, Lock } from '@/lib/icons';
import { useAppSelector } from "@/store/hooks";
import { ProPlanModal } from "@/components/general/ProPlanModal";

const templates = [
  { name: "Classic", id: "classic" },
  { name: "Modern", id: "modern" },
  { name: "Minimal", id: "minimal" },
  { name: "Professional", id: "professional" },
  { name: "Impact", id: "impact" },
  { name: "Swiss Single", id: "swiss-single" },
  { name: "Swiss Two-Column", id: "swiss-two-column" },
  { name: "Modern Premium", id: "modern-premium" },
  { name: "Modern Two-Column", id: "modern-two-column-premium" },
];

export const FREE_RESUME_TEMPLATES = ["modern", "professional"];

const ThemeSelector = () => {
  const dispatch = useDispatch();
  const { template: activeTemplate } = useSelector((state: RootState) => state.resume);
  const { user } = useAppSelector((state) => state.auth);
  const isPro = user?.plan === "PRO";

  const [isOpen, setIsOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === activeTemplate) || templates[0];

  const handleSelect = (tempId: string) => {
    const isFree = FREE_RESUME_TEMPLATES.includes(tempId);
    if (!isPro && !isFree) {
      setShowProModal(true);
      setIsOpen(false);
      return;
    }
    dispatch(setTemplate(tempId));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
      >
        <Palette size={16} className="text-purple-500" />
        <span className="hidden sm:inline">{selectedTemplate.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <ul className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden animate-in fade-in zoom-in duration-200">
            {templates.map((temp) => {
              const isFree = FREE_RESUME_TEMPLATES.includes(temp.id);
              const isLocked = !isPro && !isFree;

              return (
                <li
                  key={temp.id}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                    temp.id === activeTemplate
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                  onClick={() => handleSelect(temp.id)}
                >
                  <span className="truncate">{temp.name}</span>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded ml-2 shrink-0">
                      <Lock size={10} /> PRO
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <ProPlanModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        title="Unlock Premium Templates"
        description="Upgrade to Pro to access all handcrafted, modern ATS-optimized resume templates."
      />
    </div>
  );
};

export default ThemeSelector;
