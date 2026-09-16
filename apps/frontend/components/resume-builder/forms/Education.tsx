"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setEducation, Education as EducationType } from "@/lib/store/features/resume-slice";
import FormInput from "../FormInput";
import { GraduationCap, School, Book, Calendar, Trash2, Plus, BarChart } from '@/lib/icons';
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface EducationProps {
  setFormTab: (tab: number) => void;
}

const Education = ({ setFormTab }: EducationProps) => {
  const dispatch = useDispatch();
  const { educationData } = useSelector((state: RootState) => state.resume);

  const [formData, setFormData] = useState<EducationType>({
    degree: "",
    institution: "",
    field: "",
    graduation_date: "",
    gpa: "",
    graduationType: "cgpa",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!formData.degree || !formData.institution) return;
    if (editingId) {
      const updated = educationData.map((edu, index) => {
        const eduKey = edu._id || (edu as any).id || `edu-${index}`;
        if (eduKey === editingId) {
          return { ...formData, _id: editingId };
        }
        return edu;
      });
      dispatch(setEducation(updated));
      setEditingId(null);
      toast.success("Education updated!");
    } else {
      const newEducation = { ...formData, _id: Math.random().toString(36).substr(2, 9) };
      dispatch(setEducation([...educationData, newEducation]));
      toast.success("Education added!");
    }
    setFormData({
      degree: "",
      institution: "",
      field: "",
      graduation_date: "",
      gpa: "",
      graduationType: "cgpa",
    });
  };

  const handleEdit = (key: string) => {
    const edu = educationData.find((ed, index) => {
      const eduKey = ed._id || (ed as any).id || `edu-${index}`;
      return eduKey === key;
    });
    if (edu) {
      setFormData(edu);
      setEditingId(key);
    }
  };

  const handleDelete = (key: string) => {
    if (editingId === key) {
      setEditingId(null);
      setFormData({
        degree: "",
        institution: "",
        field: "",
        graduation_date: "",
        gpa: "",
        graduationType: "cgpa",
      });
    }
    dispatch(setEducation(educationData.filter((edu, index) => {
      const eduKey = edu._id || (edu as any).id || `edu-${index}`;
      return eduKey !== key;
    })));
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="degree"
            label="Degree"
            icon={<GraduationCap size={16} />}
            value={formData.degree}
            onChange={handleChange}
            placeholder="Bachelor of Science"
          />
          <FormInput
            name="institution"
            label="Institution"
            icon={<School size={16} />}
            value={formData.institution}
            onChange={handleChange}
            placeholder="University of Example"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="field"
            label="Field of Study"
            icon={<Book size={16} />}
            value={formData.field}
            onChange={handleChange}
            placeholder="Computer Science"
          />
          <FormInput
            name="graduation_date"
            label="Graduation Date"
            type="month"
            icon={<Calendar size={16} />}
            value={formData.graduation_date}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl self-start mb-1">
          {["cgpa", "percentage"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, graduationType: type as any }))}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                formData.graduationType === type
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <FormInput
          name="gpa"
          label={formData.graduationType === "cgpa" ? "CGPA" : "Percentage (%)"}
          type="text"
          icon={<BarChart size={16} />}
          value={formData.gpa}
          onChange={handleChange}
          placeholder={formData.graduationType === "cgpa" ? "3.8 / 4.0" : "85%"}
        />

        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  degree: "",
                  institution: "",
                  field: "",
                  graduation_date: "",
                  gpa: "",
                  graduationType: "cgpa",
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
            {editingId ? "Update Education" : "Add Education"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education List</h3>
        {educationData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No education added yet.</p>
        ) : (
          educationData.map((edu, index) => {
            const eduKey = edu._id || (edu as any).id || `edu-${index}`;
            return (
              <div
                key={eduKey}
                className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex justify-between items-start group"
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{edu.degree}</p>
                  <p className="text-sm text-primary dark:text-primary/80 font-medium">{edu.institution}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Field: {edu.field} | Graduated: {edu.graduation_date}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-400">GPA: {edu.gpa}</p>}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(eduKey)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(eduKey)}
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
        onClick={() => setFormTab(5)}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-8"
      >
        Proceed to Projects
      </button>
    </div>
  );
};

export default Education;
