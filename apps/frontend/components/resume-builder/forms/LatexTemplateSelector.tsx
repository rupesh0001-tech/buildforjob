"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTemplate } from "@/lib/store/features/resume-slice";
import { ChevronDown, Palette, Lock, Check } from '@/lib/icons';
import { ProPlanModal } from "@/components/general/ProPlanModal";

export const TEMPLATES = [
  { 
    id: "latex-jake", 
    name: "Classic ATS", 
    free: true,
    image: "/ATS/ATS_page-0001.jpg",
    description: "Single-column format optimized for ATS readability and technical roles."
  },
  { 
    id: "latex-corporate", 
    name: "Corporate Modern", 
    free: true,
    image: "/cooprate/cooprate_page-0001.jpg",
    description: "Structured corporate layout with clear section dividers and crisp headers."
  },
  { 
    id: "latex-faang", 
    name: "FAANG Compact", 
    free: false,
    image: "/FAANG/FAANG_page-0001.jpg",
    description: "High-density layout favored by engineering teams at Big Tech."
  },
  { 
    id: "latex-executive", 
    name: "Executive Blue", 
    free: false,
    image: "/executive-blue/executive blue_page-0001.jpg",
    description: "Bold header styling with polished executive typography and accents."
  },
  { 
    id: "latex-minimal", 
    name: "Clean Tech", 
    free: false,
    image: "/clean-tech/clean tech_page-0001.jpg",
    description: "Refined minimalist styling with sleek line weights and modern margins."
  },
];

export const FREE_TEMPLATES = ["latex-jake", "latex-corporate", "modern", "professional"];

export function LatexTemplateSelector() {
  const dispatch = useAppDispatch();
  const { template: activeTemplate } = useAppSelector((state) => state.resume);
  const { user } = useAppSelector((state) => state.auth);
  const isPro = user?.plan === "PRO";

  const [isOpen, setIsOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  const selectedTemplate = TEMPLATES.find((t) => t.id === activeTemplate) || TEMPLATES[0];

  const handleSelect = (tempId: string) => {
    const temp = TEMPLATES.find((t) => t.id === tempId);
    const isFree = temp ? temp.free : FREE_TEMPLATES.includes(tempId);
    if (!isPro && !isFree) {
      setShowProModal(true);
      setIsOpen(false);
      setHoveredTemplate(null);
      return;
    }
    dispatch(setTemplate(tempId));
    setIsOpen(false);
    setHoveredTemplate(null);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setHoveredTemplate(null);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
      >
        <Palette size={16} className="text-purple-500" />
        <span className="hidden sm:inline">{selectedTemplate.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setHoveredTemplate(null);
            }} 
          />
          <div 
            className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-56 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            <div className="space-y-0.5">
              {TEMPLATES.map((temp) => {
                const isFree = temp.free;
                const isLocked = !isPro && !isFree;
                const isSelected = temp.id === selectedTemplate.id;
                const isHovered = hoveredTemplate?.id === temp.id;

                return (
                  <button
                    key={temp.id}
                    type="button"
                    onMouseEnter={() => setHoveredTemplate(temp)}
                    onClick={() => handleSelect(temp.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : isHovered
                        ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
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

            {/* Hover Image Preview Popover on the Right */}
            {hoveredTemplate && (
              <div 
                className="absolute left-full top-0 ml-3 w-64 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl pointer-events-none hidden sm:block"
                style={{ isolation: 'isolate' }}
              >
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {hoveredTemplate.name}
                  </span>
                  {hoveredTemplate.free ? (
                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <Lock size={9} /> PRO
                    </span>
                  )}
                </div>

                <div className="w-full aspect-[1/1.3] bg-gray-50 dark:bg-black/40 rounded-xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-inner relative">
                  <img
                    src={hoveredTemplate.image}
                    alt={hoveredTemplate.name}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-tight">
                  {hoveredTemplate.description}
                </p>
              </div>
            )}
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
