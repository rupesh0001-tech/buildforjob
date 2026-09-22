"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ResumeForm from "@/components/resume-builder/ResumeForm";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import { ArrowLeft, Download, Save, Clock, Loader2, Sparkles, Lock, Eye, Code2, Copy, Check, FileCode } from '@/lib/icons';
import Link from "next/link";
import { OptimizeModal } from "@/components/general/OptimizeModal";
import { ProPlanModal } from "@/components/general/ProPlanModal";
import { FREE_TEMPLATES } from "@/components/resume-builder/forms/LatexTemplateSelector";
import { resumeApi } from "@/apis/resume.api";
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
  const [showProModal, setShowProModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Inline Preview / Code Mode State
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [latexSource, setLatexSource] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const isPro = user?.plan === "PRO";
  const compileSeqRef = useRef(0);
  const prevTemplateRef = useRef(resumeState.template);

  const handleOptimize = async (companyName: string, roles: string[]) => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
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
      if (error?.response?.data?.requiresPro || error?.response?.status === 403) {
        setShowProModal(true);
      }
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
      // New empty resume - do not keep old state
      dispatch(resetResumeEditor());
      const title = titleParam || "Untitled Resume";
      dispatch(setResumeTitle(title));
      setLocalTitle(title);
    }
  }, [id, titleParam, dispatch]);

  // Sync local title with store title when loaded from backend
  useEffect(() => {
    if (id && resumeState.resumeTitle && !titleParam) {
      setLocalTitle(resumeState.resumeTitle);
    }
  }, [id, resumeState.resumeTitle, titleParam]);

  useEffect(() => {
    if (magic === "true" && user && !id) {
      const resumeData = {
        personalInfoData: {
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          linkedin: user.socialLinks?.linkedin || "",
          website: user.socialLinks?.website || user.socialLinks?.github || "",
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
          liveUrl: p.liveUrl || p.demoUrl || p.link || "",
          githubUrl: p.githubUrl || p.github || "",
          description: p.description || "",
        })),
        skillData: (user.skills || []).map((s: any) => s.name || s),
      };

      dispatch(updateResumeState(resumeData as any));
      toast.success("Resume magically generated from your profile!");
    }
  }, [magic, user, dispatch, id]);

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
      sectionVisibility: resumeState.sectionVisibility,
      sectionOrder: resumeState.sectionOrder || ["summary", "education", "experience", "projects", "skills"],
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
      const errorMsg = typeof error === 'string' ? error : (error?.message || "Failed to save resume");
      toast.error(errorMsg);
      if (error?.requiresPro || (typeof error === 'string' && error.toLowerCase().includes('pro'))) {
        setShowProModal(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getResumePayload = useCallback(() => ({
    personalInfoData: resumeState.personalInfoData,
    professionalSummaryData: resumeState.professionalSummaryData,
    experienceData: resumeState.experienceData,
    educationData: resumeState.educationData,
    projectData: resumeState.projectData,
    skillData: resumeState.skillData,
    template: resumeState.template,
    accentColor: resumeState.accentColor,
    sectionVisibility: resumeState.sectionVisibility,
    sectionOrder: resumeState.sectionOrder || ["summary", "education", "experience", "projects", "skills"],
  }), [resumeState]);

  const handleCompile = useCallback(async (options: { isManual?: boolean; fetchCode?: boolean } = {}) => {
    const seq = ++compileSeqRef.current;
    try {
      setIsCompiling(true);
      setCompileError(null);
      const content = getResumePayload();
      const shouldFetchCode = options.fetchCode || previewMode === "code";

      const requests: [Promise<Blob>, Promise<string>] = [
        resumeApi.compilePreviewPdf(content, resumeState.template),
        shouldFetchCode 
          ? resumeApi.getLatexSource(content, resumeState.template).catch(() => "")
          : Promise.resolve(latexSource || "")
      ];

      const [blob, source] = await Promise.all(requests);

      // Discard stale out-of-sequence responses
      if (seq !== compileSeqRef.current) return;

      const url = URL.createObjectURL(blob);
      setPdfBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      if (source) {
        setLatexSource(source);
      }
    } catch (error: any) {
      if (seq !== compileSeqRef.current) return;
      console.error("Compilation error:", error);
      const msg = getErrorMessage(error, "Failed to compile document. Please check your fields.");
      setCompileError(msg);
      if (options.isManual) {
        toast.error(msg);
      }
    } finally {
      if (seq === compileSeqRef.current) {
        setIsCompiling(false);
      }
    }
  }, [getResumePayload, resumeState.template, previewMode, latexSource]);

  // Reactive auto-compilation with adaptive debounce (150ms on template switch, 1200ms on typing)
  useEffect(() => {
    if (!resumeState.isLoading) {
      const isTemplateChange = prevTemplateRef.current !== resumeState.template;
      prevTemplateRef.current = resumeState.template;

      const delay = isTemplateChange ? 150 : 1200;
      const timer = setTimeout(() => {
        handleCompile();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [
    handleCompile,
    resumeState.isLoading,
    resumeState.template,
    resumeState.currentResumeId,
    resumeState.personalInfoData,
    resumeState.professionalSummaryData,
    resumeState.experienceData,
    resumeState.educationData,
    resumeState.projectData,
    resumeState.skillData,
    resumeState.sectionOrder,
    resumeState.sectionVisibility,
  ]);

  const handleToggleMode = async (mode: "preview" | "code") => {
    setPreviewMode(mode);
    if (mode === "code" && !latexSource) {
      try {
        const source = await resumeApi.getLatexSource(getResumePayload(), resumeState.template);
        setLatexSource(source);
      } catch {
        // Fallback to full compile
        handleCompile({ fetchCode: true });
      }
    }
  };

  const handleCopyCode = async () => {
    let sourceToCopy = latexSource;
    if (!sourceToCopy) {
      try {
        sourceToCopy = await resumeApi.getLatexSource(getResumePayload(), resumeState.template);
        setLatexSource(sourceToCopy);
      } catch {
        toast.error("Failed to generate source code");
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(sourceToCopy);
      setCopiedCode(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleDownloadTex = async () => {
    let sourceToDownload = latexSource;
    if (!sourceToDownload) {
      try {
        sourceToDownload = await resumeApi.getLatexSource(getResumePayload(), resumeState.template);
        setLatexSource(sourceToDownload);
      } catch {
        toast.error("Failed to generate source code");
        return;
      }
    }
    const blob = new Blob([sourceToDownload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localTitle.replace(/\s+/g, '_')}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Source code (.tex) downloaded!");
  };

  const handleDownload = async () => {
    if (!isPro && !FREE_TEMPLATES.includes(resumeState.template)) {
      setShowProModal(true);
      return;
    }

    try {
      setIsDownloadingPdf(true);
      const content = getResumePayload();
      
      let blob: Blob;
      if (resumeState.currentResumeId) {
        blob = await resumeApi.exportPdf(resumeState.currentResumeId, resumeState.template, true);
      } else {
        blob = await resumeApi.compilePreviewPdf(content, resumeState.template);
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${localTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch (error: any) {
      console.warn("Server PDF compile failed, falling back to client PDF:", error);
      const element = document.getElementById("resume-preview");
      if (!element) {
        toast.error("Failed to generate PDF download");
        return;
      }
      try {
        const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${localTitle.replace(/\s+/g, '_')}.pdf`);
        toast.success("PDF downloaded!");
      } catch (fallbackErr) {
        console.error("Fallback PDF generation failed:", fallbackErr);
        toast.error("Failed to generate PDF download");
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const codeLines = latexSource ? latexSource.split("\n") : [];

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

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                setShowProModal(true);
                return;
              }
              setShowOptimizeModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold font-sans text-sm transition-all shadow-sm shadow-purple-500/20"
          >
            <Sparkles size={16} />
            Optimize
            {!isPro && (
              <span className="text-[10px] font-bold bg-amber-400 text-black px-1.5 py-0.5 rounded ml-1 flex items-center gap-0.5">
                <Lock size={9} /> PRO
              </span>
            )}
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloadingPdf}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-75"
          >
            {isDownloadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full w-full">
        {/* Form Section */}
        <div className="w-full lg:w-[420px] shrink-0 h-full overflow-y-auto custom-scrollbar">
          <ResumeForm />
        </div>

        {/* Preview / Code Section */}
        <div className="w-full lg:w-auto flex flex-col items-center">
          {/* Inline Toolbar */}
          <div className="w-full max-w-[794px] flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleToggleMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewMode === "preview"
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewMode === "code"
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Code2 size={13} />
                <span>Code</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCompile({ isManual: true })}
                disabled={isCompiling}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#001BB7] hover:bg-[#001BB7]/90 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Loader2 size={13} className={isCompiling ? "animate-spin" : "hidden"} />
                {!isCompiling && <Sparkles size={13} />}
                <span>{isCompiling ? "Compiling..." : "Compile"}</span>
              </button>

              {previewMode === "code" && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    disabled={!latexSource || isCompiling}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTex}
                    disabled={!latexSource}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:brightness-110 transition-all shadow-sm"
                  >
                    <Download size={13} />
                    <span>.tex</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Card */}
          <div 
            className="w-[794px] bg-white rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col shadow-2xl relative"
            style={{ isolation: 'isolate', transform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          >
            {previewMode === "preview" ? (
              pdfBlobUrl ? (
                <div 
                  className="w-full h-[1123px] bg-white overflow-hidden rounded-2xl relative"
                  style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
                >
                  {isCompiling && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-[#001BB7]" />
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Recompiling PDF...</p>
                    </div>
                  )}
                  <iframe
                    src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-0 block rounded-2xl"
                    style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
                    title="Resume PDF Preview"
                  />
                </div>
              ) : isCompiling ? (
                <div className="w-full h-[1123px] bg-white dark:bg-[#0f0f15] flex flex-col items-center justify-center gap-4 text-center p-8 rounded-2xl">
                  <Loader2 className="animate-spin text-[#001BB7]" size={36} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Compiling PDF...</h4>
                    <p className="text-xs text-gray-500 max-w-sm">Generating vector ATS document with high-precision formatting.</p>
                  </div>
                </div>
              ) : compileError ? (
                <div className="w-full h-[600px] bg-white dark:bg-[#0f0f15] flex flex-col items-center justify-center gap-4 text-center p-8 rounded-2xl">
                  <div className="text-red-500 font-bold text-sm">Compilation Failed</div>
                  <p className="text-xs text-gray-500 max-w-md">{compileError}</p>
                  <button
                    onClick={() => handleCompile({ isManual: true })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Retry Compile
                  </button>
                </div>
              ) : (
                <div className="w-full h-[1123px] bg-white dark:bg-[#0f0f15] flex flex-col items-center justify-center gap-4 text-center p-8 rounded-2xl">
                  <Loader2 className="animate-spin text-[#001BB7]" size={36} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Generating Resume Preview...</h4>
                    <p className="text-xs text-gray-500 max-w-sm">Compiling ATS-optimized document.</p>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full min-h-[600px] max-h-[850px] bg-[#0f0f15] flex flex-col text-xs font-mono rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#171722] border-b border-white/5 text-[11px] text-gray-400 select-none">
                  <span className="flex items-center gap-1.5 text-gray-300 font-sans">
                    <FileCode size={14} className="text-blue-400" />
                    Source Code
                  </span>
                  <span className="text-gray-500 font-sans">Read-Only</span>
                </div>
                <div className="flex-1 overflow-auto p-4 custom-scrollbar select-text">
                  {isCompiling && !latexSource ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <p className="text-xs font-sans">Generating source code...</p>
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <tbody>
                        {codeLines.map((line, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="w-10 pr-3 text-right text-gray-600 select-none align-top font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="text-gray-200 whitespace-pre font-mono text-xs leading-relaxed">
                              {line || " "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden fallback HTML preview container for client-side rendering if needed */}
      <div className="hidden">
        <div id="resume-preview">
          <ResumePreview />
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

      <ProPlanModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        title="Upgrade to Pro"
        description="Get unlimited resumes, full AI optimization, premium templates, and unlimited versions."
      />
    </div>
  );
}
