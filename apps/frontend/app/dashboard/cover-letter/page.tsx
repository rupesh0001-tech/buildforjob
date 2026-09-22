"use client";
import React, { useState, useEffect, useCallback } from "react";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import { 
  Download, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Sparkles, 
  Lock, 
  Eye, 
  Code2, 
  Copy, 
  Check, 
  FileCode 
} from '@/lib/icons';
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ProPlanModal } from "@/components/general/ProPlanModal";
import { 
  updatePersonalInfo, 
  updateBody, 
  updateMode,
  updateSignOff,
  updateSalutation,
  fetchCoverLetterById,
  saveCoverLetter,
  updateTitle,
  resetCoverLetterEditor,
  updateEmployerInfo,
  updateCoverLetterState
} from "@/lib/store/features/cover-letter-slice";
import { FREE_COVER_LETTER_TEMPLATES } from "@/components/cover-letter/CoverLetterThemeSelector";
import { coverLetterApi } from "@/apis/cover-letter.api";
import { OptimizeModal } from "@/components/general/OptimizeModal";
import axiosInstance from "@/apis/axiosInstance";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const CoverLetterPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { 
    currentId, 
    title, 
    isLoading,
    personalInfo,
    employerInfo,
    date,
    salutation,
    mode,
    body,
    manualContent,
    signOff,
    template
  } = useAppSelector((state) => state.coverLetter);
  
  const magic = searchParams.get("magic");
  const editId = searchParams.get("id");
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

  const handleOptimize = async (companyName: string, roles: string[]) => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    try {
      setIsOptimizing(true);
      const content = {
        personalInfo,
        employerInfo,
        date,
        salutation,
        mode,
        body,
        manualContent,
        signOff
      };

      const response = await axiosInstance.post("/ai/optimize-cover-letter", {
        coverLetterId: currentId || undefined,
        content,
        companyName,
        roles
      });

      if (response.data.success) {
        const optimizedContent = response.data.data.content;
        dispatch(updateCoverLetterState(optimizedContent));
        toast.success(`Cover letter optimized successfully for ${companyName}!`);
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

  useEffect(() => {
    if (editId) {
      dispatch(fetchCoverLetterById(editId));
    } else {
      dispatch(resetCoverLetterEditor());
      
      const newTitle = searchParams.get("title");
      const companyName = searchParams.get("company");
      
      if (newTitle) dispatch(updateTitle(newTitle));
      if (companyName) dispatch(updateEmployerInfo({ companyName }));
    }
  }, [editId, dispatch, searchParams]);

  useEffect(() => {
    if (magic === "true" && user && !editId) {
      dispatch(updateMode("structured"));
      dispatch(updatePersonalInfo({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "",
        address: user.location || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
      }));
      
      const intro = `I am writing to express my enthusiastic interest in joining your team. As a ${user.jobTitle || "professional"} with a strong background in ${user.skills?.[0]?.name || "relevant skills"}, I am confident that my experience aligns well with the goals of your organization.`;
      
      const body1 = user.experience?.[0] 
        ? `In my most recent role as a ${user.experience[0].position} at ${user.experience[0].company}, I was responsible for ${user.experience[0].description?.substring(0, 150)}... This experience allowed me to hone my skills and deliver impactful solutions.`
        : `Throughout my career and academic journey, I have developed a deep understanding of ${user.skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "core industry principles"}. I take pride in my ability to solve complex problems and contribute to team success.`;
  
      const body2 = user.projects?.[0]
        ? `Through key projects like ${user.projects[0].name}, where I used ${user.projects[0].techStack}, I have demonstrated my technical proficiency and ability to manage end-to-end deliverables effectively.`
        : `I am highly motivated to bring my expertise and dedication to your company. I value continuous learning and strive to stay updated with the latest industry trends and best practices.`;
  
      const body3 = "I am particularly drawn to your organization's reputation for innovation and excellence. I am eager to contribute to your ongoing success and am excited about the possibility of bringing my unique perspective to your team.";
  
      const conclusion = "Thank you for considering my application. I look forward to the possibility of discussing how my background and skills can benefit your team in more detail during an interview.";
  
      dispatch(updateBody({ intro, body1, body2, body3, conclusion }));
      dispatch(updateSignOff("Sincerely,"));
      dispatch(updateSalutation("Dear Hiring Manager,"));
      
      toast.success("Cover letter magically generated from your profile!");
    }
  }, [magic, user, dispatch, editId]);

  const getCoverLetterPayload = useCallback(() => ({
    personalInfo,
    employerInfo,
    date,
    salutation,
    mode,
    body,
    manualContent,
    signOff,
    template
  }), [personalInfo, employerInfo, date, salutation, mode, body, manualContent, signOff, template]);

  const handleCompile = useCallback(async () => {
    try {
      setIsCompiling(true);
      setCompileError(null);
      const content = getCoverLetterPayload();

      const [blob, source] = await Promise.all([
        coverLetterApi.compilePreviewPdf(content, template),
        coverLetterApi.getLatexSource(content, template).catch(() => ""),
      ]);

      const url = URL.createObjectURL(blob);
      setPdfBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setLatexSource(source);
    } catch (error: any) {
      console.error("Compilation error:", error);
      const msg = getErrorMessage(error, "Failed to compile cover letter. Please check your fields.");
      setCompileError(msg);
      toast.error(msg);
    } finally {
      setIsCompiling(false);
    }
  }, [getCoverLetterPayload, template]);

  // Initial and reactive auto-compilation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        handleCompile();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [
    handleCompile,
    isLoading,
    template,
    personalInfo?.fullName,
    personalInfo?.email,
    employerInfo?.companyName,
    body?.intro,
    body?.body1,
    body?.conclusion,
    manualContent,
    mode
  ]);

  const handleToggleMode = (m: "preview" | "code") => {
    setPreviewMode(m);
    if (!latexSource) {
      handleCompile();
    }
  };

  const handleCopyCode = async () => {
    if (!latexSource) return;
    try {
      await navigator.clipboard.writeText(latexSource);
      setCopiedCode(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleDownloadTex = () => {
    if (!latexSource) return;
    const blob = new Blob([latexSource], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Source code (.tex) downloaded!");
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving cover letter...");
    try {
      const data = {
        title,
        company: employerInfo.companyName,
        template,
        content: {
          personalInfo,
          employerInfo,
          date,
          salutation,
          mode,
          body,
          manualContent,
          signOff
        }
      };
      
      await dispatch(saveCoverLetter({ id: currentId || undefined, data })).unwrap();
      toast.success("Cover letter saved successfully!", { id: toastId });
    } catch (error: any) {
      const errorMsg = typeof error === 'string' ? error : (error?.message || "Failed to save cover letter");
      toast.error(errorMsg, { id: toastId });
      if (error?.requiresPro || (typeof error === 'string' && error.toLowerCase().includes('pro'))) {
        setShowProModal(true);
      }
    }
  };

  const handleDownload = async () => {
    const isFree = FREE_COVER_LETTER_TEMPLATES.includes(template);
    if (!isPro && !isFree) {
      setShowProModal(true);
      return;
    }

    try {
      setIsDownloadingPdf(true);
      const content = getCoverLetterPayload();
      const blob = await coverLetterApi.compilePreviewPdf(content, template);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Cover letter PDF downloaded successfully!");
    } catch (error) {
      console.warn("Server PDF compilation failed, falling back to client-side renderer:", error);
      const element = document.getElementById("cover-letter-preview");
      if (!element) {
        toast.error("Failed to generate PDF download");
        return;
      }

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
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
        toast.success("Cover letter downloaded successfully!");
      } catch (fallbackErr) {
        console.error("Error generating fallback PDF:", fallbackErr);
        toast.error("Failed to generate PDF. Please try again.");
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const codeLines = latexSource ? latexSource.split("\n") : [];

  if (isLoading && editId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#001BB7]" size={40} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading Cover Letter Builder...</p>
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
            href="/dashboard/cover-letter/all"
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => dispatch(updateTitle(e.target.value))}
              className="bg-transparent border-none outline-none font-semibold text-lg font-sans dark:text-white w-full focus:ring-0 p-0"
              placeholder="Enter title..."
            />
            <p className="text-[10px] text-gray-500 font-semibold font-sans uppercase tracking-widest">
              {currentId ? "Syncing to Cloud" : "New Cover Letter Project"}
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
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold font-sans text-sm transition-all shadow-sm shadow-purple-500/20"
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
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloadingPdf}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-75"
          >
            {isDownloadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full w-full">
        {/* Form Section */}
        <div className="w-full lg:w-[420px] shrink-0 h-full overflow-y-auto custom-scrollbar">
          <CoverLetterForm />
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
                onClick={handleCompile}
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
                    title="Cover Letter PDF Preview"
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
                    onClick={handleCompile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Retry Compile
                  </button>
                </div>
              ) : (
                <div className="w-full h-[1123px] bg-white dark:bg-[#0f0f15] flex flex-col items-center justify-center gap-4 text-center p-8 rounded-2xl">
                  <Loader2 className="animate-spin text-[#001BB7]" size={36} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Generating Cover Letter Preview...</h4>
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
        <div id="cover-letter-preview">
          <CoverLetterPreview />
        </div>
      </div>

      <OptimizeModal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
        onOptimize={handleOptimize}
        isOptimizing={isOptimizing}
        title="Optimize Cover Letter"
        description="Rewrite intro, bodies, and call-to-action tailored to match the target company's culture and keywords."
      />

      <ProPlanModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        title="Upgrade to Pro"
        description="Get unlimited cover letters, full AI optimization, premium templates, and priority exports."
      />
    </div>
  );
};

export default CoverLetterPage;
