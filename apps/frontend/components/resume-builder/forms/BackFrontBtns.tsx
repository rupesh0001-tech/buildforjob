"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from '@/lib/icons';

interface BackFrontBtnsProps {
  setFormTab: (tab: number) => void;
  formTab: number;
}

const BackFrontBtns = ({ setFormTab, formTab }: BackFrontBtnsProps) => {
  const handleNext = () => setFormTab(formTab + 1);
  const handleBack = () => setFormTab(formTab - 1);

  return (
    <div className="flex gap-4 items-center ">
      {formTab !== 1 && (
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          back
        </button>
      )}
      {formTab !== 6 && (
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1 cursor-pointer text-sm text-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          next
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default BackFrontBtns;
