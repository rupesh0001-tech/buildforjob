"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setAccentColor } from "@/lib/store/features/resume-slice";
import { ChevronDown, Pipette } from '@/lib/icons';

const colorPresets = [
  { name: "Blue", code: "#3b82f6" },
  { name: "Green", code: "#22c55e" },
  { name: "Red", code: "#ef4444" },
  { name: "Yellow", code: "#f59e0b" },
  { name: "Purple", code: "#8b5cf6" },
  { name: "Orange", code: "#f97316" },
  { name: "Teal", code: "#14b8a6" },
  { name: "Black", code: "#000000" },
];

const AccentColorSelector = () => {
  const dispatch = useDispatch();
  const { accentColor: activeColor, template: activeTemplate } = useSelector((state: RootState) => state.resume);
  const supportedTemplates = ["classic", "modern", "minimal"];
  const isColorSupported = supportedTemplates.includes(activeTemplate);

  // Sync color back to black if template doesn't support colors
  React.useEffect(() => {
    if (!isColorSupported && activeColor !== "#000000") {
      dispatch(setAccentColor("#000000"));
    }
  }, [activeTemplate, isColorSupported, activeColor, dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  // If color is not supported, we always show "Black"
  const selectedColor = isColorSupported 
    ? (colorPresets.find((c) => c.code === activeColor) || colorPresets[0])
    : colorPresets.find((c) => c.name === "Black")!;

  const handleSelect = (colorCode: string) => {
    if (!isColorSupported) return;
    dispatch(setAccentColor(colorCode));
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => isColorSupported && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-medium transition-all
          ${isColorSupported 
            ? "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10" 
            : "bg-gray-100/50 dark:bg-white/5 border-dashed border-gray-300 dark:border-white/10 text-gray-400 cursor-not-allowed opacity-80"
          }`}
      >
        <div 
          className={`w-4 h-4 rounded-full border shadow-sm transition-colors ${!isColorSupported ? "grayscale" : ""}`} 
          style={{ backgroundColor: selectedColor.code }} 
        />
        <span className="hidden sm:inline">
          {isColorSupported ? selectedColor.name : "Locked"}
        </span>
        {isColorSupported && (
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* "Not supported" tooltip */}
      {!isColorSupported && (
        <div className="absolute top-full right-0 mt-2 w-max max-w-[200px] bg-black text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-bold uppercase tracking-wider">
           This template doesn't support colors
        </div>
      )}

      {isOpen && isColorSupported && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-20 p-2 grid grid-cols-2 gap-1 animate-in fade-in zoom-in duration-200">
            {colorPresets.map((color) => (
              <li
                key={color.code}
                className={`px-3 py-2 text-xs cursor-pointer rounded-lg flex items-center gap-2 transition-colors ${
                  color.code === activeColor
                    ? "bg-gray-100 dark:bg-white/10 font-bold"
                    : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-medium"
                }`}
                onClick={() => handleSelect(color.code)}
              >
                <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: color.code }} />
                {color.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AccentColorSelector;
