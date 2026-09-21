"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTemplate } from "@/lib/store/features/resume-slice";
import { ChevronDown, Palette, Lock, Check } from '@/lib/icons';
import { ProPlanModal } from "@/components/general/ProPlanModal";

export const TEMPLATES = [
  { id: "latex-jake", name: "Classic ATS", free: true },
  { id: "latex-corporate", name: "Corporate Modern", free: true },
  { id: "latex-faang", name: "FAANG Compact", free: false },
  { id: "latex-executive", name: "Executive Blue", free: false },
  { id: "latex-minimal", name: "Clean Tech", free: false },
];

export const FREE_TEMPLATES = ["latex-jake", "latex-corporate", "modern", "professional"];

export function LatexTemplateSelector() {
  const dispatch = useAppDispatch();
  const { template: activeTemplate } = useAppSelector((state) => state.resume);
  const { user } = useAppSelector((state) => state.auth);
  const isPro = user?.plan === "PRO";

  const [isOpen, setIsOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const selectedTemplate = TEMPLATES.find((t) => t.id === activeTemplate) || TEMPLATES[0];

  const handleSelect = (tempId: string) => {
    const temp = TEMPLATES.find((t) => t.id === tempId);
    const isFree = temp ? temp.free : FREE_TEMPLATES.includes(tempId);
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
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
            <div className="space-y-0.5">
              {TEMPLATES.map((temp) => {
                const isFree = temp.free;
                const isLocked = !isPro && !isFree;
                const isSelected = temp.id === selectedTemplate.id;

                return (
                  <button
                    key={temp.id}
                    type="button"
                    onClick={() => handleSelect(temp.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {temp.name}
                      {isSelected && <Check size={13} className="text-primary" />}
                    </span>
                    {isLocked && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <Lock size={9} /> PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <ProPlanModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        title="Upgrade to Pro"
        description="Unlock all premium resume templates, AI optimizations, and unlimited downloads."
      />
    </div>
  );
}

export default LatexTemplateSelector;
