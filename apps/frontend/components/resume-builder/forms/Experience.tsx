"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setExperience, Experience as ExperienceType } from "@/lib/store/features/resume-slice";
import FormInput from "../FormInput";
import { Briefcase, Building, Calendar, Trash2, Plus, Sparkles, Loader2 } from '@/lib/icons';
import { generateAI } from "@/apis/ai.api";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { fetchProfile } from "@/store/slices/authSlice";

interface ExperienceProps {
  setFormTab: (tab: number) => void;
}

const Experience = ({ setFormTab }: ExperienceProps) => {
  const dispatch = useDispatch();
  const { experienceData } = useSelector((state: RootState) => state.resume);

  const [formData, setFormData] = useState<ExperienceType>({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    is_current: false,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = () => {
    if (!formData.position || !formData.company) return;
    if (editingId) {
      const updated = experienceData.map((exp, index) => {
        const expKey = exp._id || (exp as any).id || `exp-${index}`;
        if (expKey === editingId) {
          return { ...formData, _id: editingId };
        }
        return exp;
      });
      dispatch(setExperience(updated));
      setEditingId(null);
      toast.success("Experience updated!");
    } else {
      const newExperience = { ...formData, _id: Math.random().toString(36).substr(2, 9) };
      dispatch(setExperience([...experienceData, newExperience]));
      toast.success("Experience added!");
    }
    setFormData({
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      is_current: false,
    });
  };

  const handleEdit = (key: string) => {
    const exp = experienceData.find((e, index) => {
      const expKey = e._id || (e as any).id || `exp-${index}`;
      return expKey === key;
    });
    if (exp) {
      setFormData(exp);
      setEditingId(key);
    }
  };

  const handleEnhance = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      toast.error("Please write a draft of your description first (at least 10 characters) so the AI can enhance it.");
      return;
    }

    setIsEnhancing(true);
    const toastId = toast.loading("Enhancing description with AI...");
    try {
      const prompt = `Rewrite this work experience description to be more professional, results-oriented, and impact-focused. Use strong action verbs and professional phrasing. Keep it concise. Description: "${formData.description}"`;
      const result = await generateAI(prompt, 'experience');
      setFormData(prev => ({ ...prev, description: result }));
      toast.success("Description enhanced successfully!", { id: toastId });
      dispatch(fetchProfile() as any);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to enhance description.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDelete = (key: string) => {
    if (editingId === key) {
      setEditingId(null);
      setFormData({
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        is_current: false,
      });
    }
    dispatch(setExperience(experienceData.filter((exp, index) => {
      const expKey = exp._id || (exp as any).id || `exp-${index}`;
      return expKey !== key;
    })));
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="position"
            label="Position"
            icon={<Briefcase size={16} />}
            value={formData.position}
            onChange={handleChange}
            placeholder="Senior Developer"
          />
          <FormInput
            name="company"
            label="Company"
            icon={<Building size={16} />}
            value={formData.company}
            onChange={handleChange}
            placeholder="Google"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="startDate"
            label="Start Date"
            type="month"
            icon={<Calendar size={16} />}
            value={formData.startDate}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-2">
            <FormInput
              name="endDate"
              label="End Date"
              type="month"
              icon={<Calendar size={16} />}
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.is_current}
            />
            <div className="mt-1">
              <FormInput
                name="is_current"
                label="I currently work here (Present)"
                type="checkbox"
                checked={formData.is_current}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <FormInput
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities and achievements..."
        />

        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="w-full py-2.5 px-4 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary/80 border border-primary/20 dark:border-primary/30 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-all cursor-pointer disabled:opacity-50 select-none text-sm"
        >
          {isEnhancing ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}
          Enhance Description with AI (-0.5 Credits)
        </button>

        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  is_current: false,
                });
              }}
              className="px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-white rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary/80 border border-primary/20 dark:border-primary/30 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          >
            <Plus size={18} />
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience List</h3>
        {experienceData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No experience added yet.</p>
        ) : (
          experienceData.map((exp, index) => {
            const expKey = exp._id || (exp as any).id || `exp-${index}`;
            return (
              <div
                key={expKey}
                className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex justify-between items-start group"
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{exp.position}</p>
                  <p className="text-sm text-primary dark:text-primary/80 font-medium">{exp.company}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {exp.startDate} - {exp.is_current ? "Present" : exp.endDate}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(expKey)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(expKey)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={() => setFormTab(4)}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-8"
      >
        Proceed to Education
      </button>
    </div>
  );
};

export default Experience;
