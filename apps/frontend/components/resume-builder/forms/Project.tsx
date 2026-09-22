"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setProject, Project as ProjectType } from "@/lib/store/features/resume-slice";
import FormInput from "../FormInput";
import FormTextArea from "../FormTextArea";
import { FileSignature, Trash2, Plus, Code, Sparkles, Loader2, Globe, Link as LinkIcon, ExternalLink, Edit } from '@/lib/icons';
import { generateAI } from "@/apis/ai.api";
import { toast } from "sonner";
import { deductTokens } from "@/store/slices/authSlice";

interface ProjectProps {
  setFormTab: (tab: number) => void;
}

const Project = ({ setFormTab }: ProjectProps) => {
  const dispatch = useDispatch();
  const { projectData } = useSelector((state: RootState) => state.resume);

  const [formData, setFormData] = useState<ProjectType>({
    name: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!formData.name) return;
    if (editingId) {
      const updated = projectData.map((proj, index) => {
        const pKey = proj._id || (proj as any).id || `p-${index}`;
        if (pKey === editingId) {
          return { ...formData, _id: editingId };
        }
        return proj;
      });
      dispatch(setProject(updated));
      setEditingId(null);
      toast.success("Project updated!");
    } else {
      const newProject = { ...formData, _id: Math.random().toString(36).substr(2, 9) };
      dispatch(setProject([...projectData, newProject]));
      toast.success("Project added!");
    }
    setFormData({
      name: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
      description: "",
    });
  };

  const handleEdit = (key: string) => {
    const proj = projectData.find((p, index) => {
      const pKey = p._id || (p as any).id || `p-${index}`;
      return pKey === key;
    });
    if (proj) {
      setFormData({
        name: proj.name || "",
        techStack: proj.techStack || "",
        liveUrl: proj.liveUrl || proj.link || "",
        githubUrl: proj.githubUrl || "",
        description: proj.description || "",
      });
      setEditingId(key);
    }
  };

  const handleEnhance = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      toast.error("Please write a draft of your description first (at least 10 characters) so the AI can enhance it.");
      return;
    }

    setIsEnhancing(true);
    const toastId = toast.loading("Enhancing project description with AI...");
    try {
      const prompt = `Rewrite this project description to highlight key achievements, technical challenges solved, and technologies used. Keep it concise and professional. Description: "${formData.description}"`;
      const result = await generateAI(prompt, 'project');
      setFormData(prev => ({ ...prev, description: result }));
      toast.success("Description enhanced successfully!", { id: toastId });
      dispatch(deductTokens(0.5));
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
        name: "",
        techStack: "",
        liveUrl: "",
        githubUrl: "",
        description: "",
      });
    }
    dispatch(setProject(projectData.filter((p, index) => {
      const pKey = p._id || (p as any).id || `p-${index}`;
      return pKey !== key;
    })));
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Project Name"
          icon={<FileSignature size={16} />}
          value={formData.name}
          onChange={handleChange as any}
          placeholder="E-commerce Platform"
        />

        <FormInput
          name="techStack"
          label="Tech Stack"
          icon={<Code size={16} />}
          value={formData.techStack}
          onChange={handleChange as any}
          placeholder="React, Node.js, PostgreSQL"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            name="liveUrl"
            label="Live Demo URL (Optional)"
            icon={<Globe size={16} />}
            value={formData.liveUrl || ""}
            onChange={handleChange as any}
            placeholder="https://myproject.com"
          />

          <FormInput
            name="githubUrl"
            label="GitHub URL (Optional)"
            icon={<LinkIcon size={16} />}
            value={formData.githubUrl || ""}
            onChange={handleChange as any}
            placeholder="https://github.com/user/repo"
          />
        </div>

        <FormTextArea
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange as any}
          placeholder="Key features, technologies used, and your role..."
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

        <div className="flex gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  techStack: "",
                  liveUrl: "",
                  githubUrl: "",
                  description: "",
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
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project List</h3>
        {projectData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">No projects added yet.</p>
        ) : (
          projectData.map((p, index) => {
            const pKey = p._id || (p as any).id || `p-${index}`;
            return (
              <div
                key={pKey}
                className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex justify-between items-start group"
              >
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">{p.name}</p>
                  {p.techStack && (
                    <p className="text-sm text-primary dark:text-primary/80 font-medium">{p.techStack}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md"
                      >
                        <Globe size={11} />
                        Live Demo
                        <ExternalLink size={9} />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md"
                      >
                        <LinkIcon size={11} />
                        GitHub
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{p.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(pKey)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pKey)}
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
        onClick={() => setFormTab(6)}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-8"
      >
        Proceed to Skills
      </button>
    </div>
  );
};

export default Project;

