"use client";
import React, { useState, useEffect, useCallback } from "react";
import ResumeForm from "@/components/resume-builder/ResumeForm";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import { ArrowLeft, Download, Save, Clock, Loader2, Sparkles } from '@/lib/icons';
import Link from "next/link";
import { OptimizeModal } from "@/components/general/OptimizeModal";
import axiosInstance from "@/apis/axiosInstance";
import { getErrorMessage } from "@/lib/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  updateResumeState, 
  saveResume, 
  createResumeVersion, 
  fetchResumeById, 
  resetResumeEditor,
  setResumeTitle,
  setCurrentResumeId
} from "@/lib/store/features/resume-slice";
import { toast } from "sonner";

export default function ResumeBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const resumeState = useAppSelector((state) => state.resume);
  
  const id = searchParams.get("id");
  const titleParam = searchParams.get("title");
  const companyParam = searchParams.get("company");
  const magic = searchParams.get("magic");

  const [isSaving, setIsSaving] = useState(false);
  const [localTitle, setLocalTitle] = useState(titleParam || resumeState.resumeTitle || "Untitled Resume");
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async (companyName: string, roles: string[]) => {
    try {
      setIsOptimizing(true);
      const content = {
        personalInfoData: resumeState.personalInfoData,
        professionalSummaryData: resumeState.professionalSummaryData,
        experienceData: resumeState.experienceData,
        educationData: resumeState.educationData,
        projectData: resumeState.projectData,
        skillData: resumeState.skillData,
        template: resumeState.template,
        accentColor: resumeState.accentColor,
        sectionVisibility: resumeState.sectionVisibility
      };

      const response = await axiosInstance.post("/ai/optimize-resume", {
        resumeId: resumeState.currentResumeId || undefined,
        content,
        companyName,
        roles
      });

      if (response.data.success) {
        const optimizedContent = response.data.data.content;
        dispatch(updateResumeState(optimizedContent));
        toast.success(`Resume optimized successfully for ${companyName}!`);
        setShowOptimizeModal(false);
      }
    } catch (error: any) {
      console.error("Optimization failed:", error);
      const msg = getErrorMessage(error, "Optimization failed. Upgrade to PRO to use optimization features.");
      toast.error(msg);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Load existing resume or handle new one
  useEffect(() => {
    if (id) {
      if (id !== resumeState.currentResumeId) {
        dispatch(fetchResumeById(id));
      }
    } else {
      dispatch(resetResumeEditor());
      if (titleParam) {
        dispatch(setResumeTitle(titleParam));
        setLocalTitle(titleParam);
      }
    }
  }, [id, titleParam, dispatch, resumeState.currentResumeId]);

  // Sync local title with store title when loaded
  useEffect(() => {
    if (resumeState.resumeTitle && !titleParam) {
      setLocalTitle(resumeState.resumeTitle);
    }
  }, [resumeState.resumeTitle, titleParam]);

  useEffect(() => {
    if (magic === "true" && user) {
      const resumeData = {
        personalInfoData: {
          full_name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || "",
          location: user.location || "",
          linkedin: user.socialLinks?.linkedin || "",
          website: user.socialLinks?.website || "",
          profession: user.jobTitle || "",
          image: user.avatarUrl || "",
        },
        professionalSummaryData: user.bio || `Ambitious ${user.jobTitle || "professional"} with a background in ${user.skills?.[0]?.name || "technology"}. Proven track record of delivering high-quality results.`,
        experienceData: (user.experience || []).map((exp: any) => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate || "",
          description: exp.description || "",
          is_current: exp.isCurrent,
        })),
        educationData: (user.education || []).map((edu: any) => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          graduation_date: edu.graduationDate,
          gpa: edu.gpa || "",
          graduationType: (edu.graduationType as any) || "cgpa",
        })),
        projectData: (user.projects || []).map((p: any) => ({
          name: p.name,
          techStack: p.techStack || "",
          description: p.description || "",
        })),
        skillData: (user.skills || []).map((s: any) => s.name),
      };

      dispatch(updateResumeState(resumeData as any));
      toast.success("Resume magically generated from your profile!");
    }
  }, [magic, user, dispatch]);

  const handleSave = async (isDraft: boolean, isVersion: boolean = false) => {
    setIsSaving(true);
    
    const content = {
      personalInfoData: resumeState.personalInfoData,
      professionalSummaryData: resumeState.professionalSummaryData,
      experienceData: resumeState.experienceData,
      educationData: resumeState.educationData,
      projectData: resumeState.projectData,
      skillData: resumeState.skillData,
      template: resumeState.template,
      accentColor: resumeState.accentColor,
      sectionVisibility: resumeState.sectionVisibility
    };

    try {
      if (isVersion && resumeState.currentResumeId) {
        await dispatch(createResumeVersion({
          id: resumeState.currentResumeId,
          data: {
            company: companyParam || "General",
            role: resumeState.personalInfoData.profession || "Resume Version",
            content
          }
        })).unwrap();
        toast.success("Resume version saved!");
      } else {
        const result = await dispatch(saveResume({
          id: resumeState.currentResumeId || undefined,
          data: {
            title: localTitle,
            content,
            isDraft,
            template: resumeState.template,
            company: companyParam || undefined
          }
        })).unwrap();
        
        if (!resumeState.currentResumeId) {
          router.replace(`/dashboard/resume-builder?id=${result.id}`);
        }
        toast.success("Resume saved successfully!");
      }
    } catch (error: any) {
      toast.error(error || "Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (pdf.internal.pageSize.getHeight());

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Capture all anchor tags in the preview DOM and overlay PDF links
      const containerRect = element.getBoundingClientRect();
      const scaleX = pdfWidth / containerRect.width;
      const scaleY = pdfHeight / containerRect.height;
      
      const links = element.getElementsByTagName("a");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.getAttribute("href");
        if (href) {
          const rect = link.getBoundingClientRect();
          const x = (rect.left - containerRect.left) * scaleX;
          const y = (rect.top - containerRect.top) * scaleY;
          const w = rect.width * scaleX;
          const h = rect.height * scaleY;
          pdf.link(x, y, w, h, { url: href });
        }
      }

      pdf.save(`${localTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (resumeState.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#001BB7]" size={40} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading Resume Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-black/40 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link 
            href="/dashboard/resumes"
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <input 
              type="text" 
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-lg font-sans dark:text-white w-full focus:ring-0 p-0"
              placeholder="Resume Title"
            />
            <p className="text-[10px] text-gray-500 font-semibold font-sans uppercase tracking-widest">
              {resumeState.currentResumeId ? "Syncing to Cloud" : "New Resume Project"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowOptimizeModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold font-sans text-sm transition-all shadow-sm shadow-purple-500/20"
          >
            <Sparkles size={16} />
            Optimize
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full w-full">
        {/* Form Section */}
        <div className="w-full lg:w-[420px] shrink-0 h-full overflow-y-auto custom-scrollbar">
          <ResumeForm />
        </div>

        {/* Preview Section */}
        <div className="w-fit bg-gray-50/50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/10 h-full p-0 overflow-hidden flex flex-col">
          <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 shadow-2xl">
             <ResumePreview />
          </div>
        </div>
      </div>

      <OptimizeModal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
        onOptimize={handleOptimize}
        isOptimizing={isOptimizing}
        title="Optimize Resume for Company"
        description="Rewrite summaries, projects, and work experience tailored to match the target company's culture and keywords."
      />
    </div>
  );
}
