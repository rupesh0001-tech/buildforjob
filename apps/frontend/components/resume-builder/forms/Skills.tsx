"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setSkill } from "@/lib/store/features/resume-slice";
import FormInput from "../FormInput";
import { ChartLine, X, Plus, Sparkles, Loader2 } from '@/lib/icons';
import { generateAI } from "@/apis/ai.api";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";

const Skills = () => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { skillData } = useSelector((state: RootState) => state.resume);
  const [newSkill, setNewSkill] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestSkills = async () => {
    const jobTitle = user?.jobTitle || "Software Engineer";
    setIsSuggesting(true);
    const toastId = toast.loading("Suggesting skills with AI...");
    try {
      const prompt = `Based on my job title "${jobTitle}" and my current skills "${skillData.join(', ')}", suggest a list of 5 additional highly relevant technical skills. Return ONLY a comma-separated list of skills, e.g. "React, TypeScript, Node.js".`;
      const result = await generateAI(prompt, 'skills');
      const newSkills = result.split(',').map(s => s.trim()).filter(s => s.length > 0 && !skillData.includes(s));
      if (newSkills.length > 0) {
        dispatch(setSkill([...skillData, ...newSkills]));
        toast.success(`Added ${newSkills.length} suggested skills!`, { id: toastId });
      } else {
        toast.success("AI suggested skills you already have!", { id: toastId });
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to suggest skills.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skillData.includes(newSkill.trim())) {
      setNewSkill("");
      return;
    }
    dispatch(setSkill([...skillData, newSkill.trim()]));
    setNewSkill("");
  };

  const handleDelete = (skillToDelete: string) => {
    dispatch(setSkill(skillData.filter((skill) => skill !== skillToDelete)));
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add your key technical and soft skills.
        </p>
      </div>

      <div className="flex gap-3 items-end mb-8">
        <form onSubmit={handleAdd} className="flex-1 flex gap-3 items-end">
          <div className="flex-1">
            <FormInput
              name="newSkill"
              label="Skill Name"
              icon={<ChartLine size={16} />}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, TypeScript, Leadership"
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-primary text-white rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 h-11 flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </form>

        <button
          type="button"
          onClick={handleSuggestSkills}
          disabled={isSuggesting}
          className="h-11 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
        >
          {isSuggesting ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Sparkles size={14} />
          )}
          Suggest AI Skills
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Added Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skillData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added yet.</p>
        ) : (
          skillData.map((skill, index) => (
            <div
              key={index}
              className="px-4 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full flex items-center gap-2 border border-gray-200 dark:border-white/10 group animate-in zoom-in duration-200"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill}</span>
              <button
                onClick={() => handleDelete(skill)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Skills;
