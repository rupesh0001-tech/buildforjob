"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { updateTemplate } from "@/lib/store/features/cover-letter-slice";
import { ChevronDown, Palette, Lock } from '@/lib/icons';
import { useAppSelector } from "@/store/hooks";
import { ProPlanModal } from "@/components/general/ProPlanModal";

const templates = [
  { name: "Executive Column", id: "latex-executive" },
  { name: "ModernCV Casual", id: "latex-moderncv" },
  { name: "Classic Minimal", id: "latex-classic" },
  { name: "Tech Accent", id: "latex-tech" },
];

export const FREE_COVER_LETTER_TEMPLATES = ["latex-executive", "latex-classic"];

const CoverLetterThemeSelector = () => {
  const dispatch = useDispatch();
  const { template: activeTemplate } = useSelector((state: RootState) => state.coverLetter);
  const { user } = useAppSelector((state) => state.auth);
  const isPro = user?.plan === "PRO";

  const [isOpen, setIsOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === activeTemplate) || templates[0];

  const handleSelect = (tempId: string) => {
    const isFree = FREE_COVER_LETTER_TEMPLATES.includes(tempId);
    if (!isPro && !isFree) {
      setShowProModal(true);
      setIsOpen(false);
      return;
    }
    dispatch(updateTemplate(tempId));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm"
      >
        <Palette size={16} className="text-primary" />
        <span>{selectedTemplate.name} Template</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <ul className="absolute left-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
            {templates.map((temp) => {
              const isFree = FREE_COVER_LETTER_TEMPLATES.includes(temp.id);
              const isLocked = !isPro && !isFree;

              return (
                <li
                  key={temp.id}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between group ${
                    temp.id === activeTemplate
                      ? "bg-primary text-white font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                  onClick={() => handleSelect(temp.id)}
                >
                  <span>{temp.name}</span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                      <Lock size={10} /> PRO
                    </span>
                  ) : (
                    temp.id === activeTemplate && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
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
        title="Unlock Premium Cover Letter Templates"
        description="Upgrade to Pro to unlock all professional cover letter layouts and AI tailoring."
      />
    </div>
  );
};

export default CoverLetterThemeSelector;
