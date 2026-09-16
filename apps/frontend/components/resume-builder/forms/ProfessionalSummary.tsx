"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setProfessionalSummary } from "@/lib/store/features/resume-slice";
import { fetchProfile } from "@/store/slices/authSlice";
import { generateAI } from "@/apis/ai.api";
import FormTextArea from "../FormTextArea";
import { Sparkles, Loader2 } from '@/lib/icons';
import { toast } from "sonner";

interface ProfessionalSummaryProps {
  setFormTab: (tab: number) => void;
}

const ProfessionalSummary = ({ setFormTab }: ProfessionalSummaryProps) => {
  const dispatch = useDispatch();
  const { professionalSummaryData } = useSelector((state: RootState) => state.resume);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setProfessionalSummary(e.target.value));
  };

  const handleEnhance = async () => {
    if (!professionalSummaryData || professionalSummaryData.trim().length < 10) {
      toast.error("Please write a draft of your summary first (at least 10 characters) so the AI can enhance it.");
      return;
    }

    setIsEnhancing(true);
    const toastId = toast.loading("Enhancing summary with AI...");
    try {
      const prompt = `Rewrite this professional resume summary to be more professional, results-oriented, and metric-driven. Keep it concise (2-3 sentences max). Summary: "${professionalSummaryData}"`;
      const result = await generateAI(prompt, 'summary');
      dispatch(setProfessionalSummary(result));
      toast.success("Summary enhanced successfully!", { id: toastId });
      
      // Update profile to show refreshed token count in navbar
      dispatch(fetchProfile() as any);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to enhance summary.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTab(3);
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Summarize your professional highlights in 2-3 sentences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormTextArea
          name="professionalSummary"
          label="Summary"
          value={professionalSummaryData}
          onChange={handleChange}
          placeholder="Experienced developer with a passion for building scalable web applications..."
        />

        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="w-full py-3 px-4 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary/80 border border-primary/20 dark:border-primary/30 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-all cursor-pointer disabled:opacity-50 select-none"
        >
          {isEnhancing ? (
            <Loader2 className="animate-spin animate-duration-1000" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          Enhance with AI (-0.5 Credits)
        </button>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25"
        >
          Proceed to Experience
        </button>
      </form>
    </div>
  );
};

export default ProfessionalSummary;
