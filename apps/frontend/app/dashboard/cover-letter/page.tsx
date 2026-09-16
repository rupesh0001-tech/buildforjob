"use client";
import React from "react";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import CoverLetterThemeSelector from "@/components/cover-letter/CoverLetterThemeSelector";
import { Download, ArrowLeft, Save, Loader2, Sparkles } from '@/lib/icons';
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async (companyName: string, roles: string[]) => {
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
      toast.error(error || "Failed to save cover letter", { id: toastId });
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("cover-letter-preview");
    if (!element) return;

    const toastId = toast.loading("Generating high-quality PDF...");

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
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
      toast.success("Cover letter downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    }
  };

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
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
          <CoverLetterForm />
        </div>

        {/* Preview Section */}
        <div className="w-fit bg-gray-50/50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/10 h-full p-0 overflow-hidden flex flex-col">
          <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 shadow-2xl">
            <CoverLetterPreview />
          </div>
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
    </div>
  );
};

export default CoverLetterPage;
