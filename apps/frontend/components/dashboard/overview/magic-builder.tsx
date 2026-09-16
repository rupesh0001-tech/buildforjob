"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateResumeState } from "@/lib/store/features/resume-slice";
import { 
  updatePersonalInfo, 
  updateBody, 
  updateMode,
  updateSignOff,
  updateSalutation
} from "@/lib/store/features/cover-letter-slice";
import { 
  Sparkles, 
  Loader2, 
  Check, 
  FileText, 
  Mail, 
  ArrowRight,
  ExternalLink,
  PartyPopper
} from '@/lib/icons';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MagicBuilder() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const steps = [
    { label: "Analyzing Profile Data", icon: <Loader2 className="animate-spin" size={16} /> },
    { label: "Generating Resume Content", icon: <FileText size={16} /> },
    { label: "Drafting Cover Letter", icon: <Mail size={16} /> },
    { label: "Finalizing Documents", icon: <Sparkles size={16} /> }
  ];

  const handleMagicBuild = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    setStep(0);

    // Simulate AI Generation / Parsing Steps
    for (let i = 0; i <= 3; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    // 1. Map Profile to Resume
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

    // 2. Map Profile to Cover Letter
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

    setIsGenerating(false);
    setShowResults(true);
    toast.success("Resume & Cover Letter generated successfully!");
  };

  return (
    <>
      <div className="mt-8 bg-linear-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              AI Magic Build
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Create Everything <br />
              <span className="text-indigo-200">in one single click.</span>
            </h2>
            <p className="text-indigo-100/80 font-medium text-lg">
              We'll use your 100% complete profile to instantly generate a professional resume and a tailored cover letter. No manual entry required.
            </p>
            
            <button
              onClick={handleMagicBuild}
              disabled={isGenerating}
              className="group relative px-8 py-5 bg-white text-indigo-600 rounded-3xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 w-full md:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
              {isGenerating ? "MAGIC IN PROGRESS..." : "1-CLICK MAGIC BUILD"}
            </button>
          </div>

          <div className="relative group perspective-1000 hidden lg:block">
            <motion.div 
              animate={{ rotateY: 5, rotateX: 5 }}
              whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }}
              className="relative w-80 h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white/20"
            >
              <div className="absolute inset-0 bg-gray-50 flex flex-col p-6 space-y-4">
                <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
                <div className="w-1/4 h-2 bg-gray-100 rounded-full" />
                <div className="space-y-2 pt-4">
                  <div className="w-full h-2 bg-gray-100 rounded-full" />
                  <div className="w-full h-2 bg-gray-100 rounded-full" />
                  <div className="w-3/4 h-2 bg-gray-100 rounded-full" />
                </div>
                <div className="pt-6 grid grid-cols-2 gap-3">
                  <div className="h-20 bg-gray-200/50 rounded-xl" />
                  <div className="h-20 bg-gray-200/50 rounded-xl" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: -40, y: 40, opacity: 0 }}
              animate={{ x: -20, y: 60, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 w-80 h-[480px] bg-indigo-500 rounded-3xl shadow-2xl -z-10 translate-x-12 translate-y-12 flex flex-col p-8 space-y-4"
            >
               <div className="w-2/3 h-4 bg-white/20 rounded-full" />
               <div className="space-y-3 pt-8">
                  <div className="w-full h-2 bg-white/10 rounded-full" />
                  <div className="w-full h-2 bg-white/10 rounded-full" />
                  <div className="w-full h-2 bg-white/10 rounded-full" />
                  <div className="w-2/3 h-2 bg-white/10 rounded-full" />
               </div>
            </motion.div>
          </div>
        </div>
        
        {/* Progress Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-indigo-600/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 bg-indigo-400/30 blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={32} className="text-yellow-300 animate-bounce" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-6">WEAVING YOUR MAGIC...</h3>
              
              <div className="w-full max-w-md space-y-4">
                {steps.map((s, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                      i === step ? "bg-white text-indigo-600 scale-105 shadow-xl" : i < step ? "opacity-50 text-white" : "opacity-30 text-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? "bg-indigo-500/10" : ""}`}>
                      {i < step ? <Check size={16} /> : s.icon}
                    </div>
                    <span className="font-bold">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#111116] rounded-[3rem] p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl border border-white/10"
              >
                <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 text-white">
                  <PartyPopper size={48} />
                </div>
                
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-black dark:text-white tracking-tight">IT&apos;S READY!</h2>
                   <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                     Your professional resume and cover letter have been crafted using your profile data. You can now view and download them.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push("/dashboard/resume-builder")}
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-indigo-500/50 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                       <div className="text-left font-black tracking-tight text-black dark:text-white text-lg">RESUME</div>
                    </div>
                    <ExternalLink size={20} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/cover-letter")}
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-indigo-500/50 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                       <div className="text-left font-black tracking-tight text-black dark:text-white text-lg">COVER LETTER</div>
                    </div>
                    <ExternalLink size={20} className="text-gray-400" />
                  </button>
                </div>

                <button 
                  onClick={() => setShowResults(false)}
                  className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl"
                >
                  DONE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
