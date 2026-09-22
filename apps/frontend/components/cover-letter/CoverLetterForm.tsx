"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { 
  updatePersonalInfo, 
  updateDate, 
  updateEmployerInfo, 
  updateSalutation, 
  updateBody, 
  updateSignOff, 
  updateMode, 
  updateManualContent 
} from "@/lib/store/features/cover-letter-slice";
import FormInput from "../resume-builder/FormInput";
import FormTextArea from "../resume-builder/FormTextArea";
import CoverLetterThemeSelector from "./CoverLetterThemeSelector";
import BackFrontBtns from "../resume-builder/forms/BackFrontBtns";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Link as LinkIcon, 
  Calendar, 
  Briefcase, 
  Building, 
  PenTool, 
  Layout, 
  Github, 
  Type, 
  FileText, 
  GripVertical, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Check 
} from '@/lib/icons';
import { Reorder, motion, AnimatePresence } from "framer-motion";

interface CoverLetterSectionMeta {
  id: number;
  key: string;
  label: string;
  subtext: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const DEFAULT_SECTIONS: CoverLetterSectionMeta[] = [
  {
    id: 1,
    key: "personal",
    label: "Personal Information",
    subtext: "Contact details, address, and profile links",
    icon: User,
  },
  {
    id: 2,
    key: "employer",
    label: "Employer Details",
    subtext: "Hiring manager, team, and company name",
    icon: Building,
  },
  {
    id: 3,
    key: "body",
    label: "Letter Content",
    subtext: "Structured body paragraphs or manual text",
    icon: FileText,
  },
  {
    id: 4,
    key: "signOff",
    label: "Sign-Off & Closing",
    subtext: "Formal closing phrase and signature",
    icon: PenTool,
  },
];

const CoverLetterForm = () => {
  const [formTab, setFormTab] = useState(1);
  const [isSectionsExpanded, setIsSectionsExpanded] = useState(false);
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([
    "personal",
    "employer",
    "body",
    "signOff",
  ]);

  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.coverLetter);

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePersonalInfo({ [e.target.name]: e.target.value }));
  };

  const handleEmployerInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateEmployerInfo({ [e.target.name]: e.target.value }));
  };

  const handleBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBody({ [e.target.name]: e.target.value }));
  };

  const sectionMetaMap = React.useMemo(() => {
    const map: Record<string, CoverLetterSectionMeta> = {};
    DEFAULT_SECTIONS.forEach((s) => {
      map[s.key] = s;
    });
    return map;
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center w-full mb-5 gap-3 flex-wrap">
        <BackFrontBtns setFormTab={setFormTab} formTab={formTab} maxTab={4} />
        <div className="flex items-center gap-2 flex-wrap">
          <CoverLetterThemeSelector />
        </div>
      </div>

      {/* Interactive Draggable Sections Navigator */}
      <div className="mb-6 bg-gray-50/80 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Layers size={15} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Cover Letter Sections
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Drag to reorder sections • Click to jump
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSectionsExpanded(!isSectionsExpanded)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
            title={isSectionsExpanded ? "Collapse section list" : "Expand section list"}
          >
            {isSectionsExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isSectionsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 overflow-hidden pt-1"
            >
              <Reorder.Group
                axis="y"
                values={sectionsOrder}
                onReorder={setSectionsOrder}
                className="space-y-1.5"
              >
                {sectionsOrder.map((sectionKey, index) => {
                  const meta = sectionMetaMap[sectionKey];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  const isActive = formTab === meta.id;

                  return (
                    <Reorder.Item
                      key={sectionKey}
                      value={sectionKey}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all select-none group cursor-pointer ${
                        isActive
                          ? "bg-primary/10 border-primary/50 text-primary font-bold shadow-xs"
                          : "bg-white dark:bg-white/5 border-gray-200/80 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                      onClick={() => setFormTab(meta.id)}
                    >
                      <div className="flex items-center gap-2.5 flex-1">
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded transition-colors"
                          title="Drag up or down to reorder"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical size={15} />
                        </div>
                        <Icon size={14} className={isActive ? "text-primary" : "text-gray-400"} />
                        <span className="text-xs font-semibold">{meta.label}</span>
                      </div>

                      <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5">
                        Step {index + 1}
                      </span>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Content Area */}
      <div className="relative pt-4 border-t border-gray-100 dark:border-white/5">
        
        {/* Section 1: Personal Info */}
        <div className={formTab === 1 ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}>
          <div className="flex flex-col mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your contact details and professional profiles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="fullName" label="Full Name" value={state.personalInfo.fullName || ""} onChange={handlePersonalInfo} icon={<User size={16}/>} placeholder="John Doe" />
            <FormInput name="address" label="Address / City" value={state.personalInfo.address || ""} onChange={handlePersonalInfo} icon={<MapPin size={16}/>} placeholder="San Francisco, CA" />
            <FormInput name="phone" label="Phone Number" value={state.personalInfo.phone || ""} onChange={handlePersonalInfo} icon={<Phone size={16}/>} placeholder="+1 (555) 000-0000" />
            <FormInput name="email" label="Email Address" value={state.personalInfo.email || ""} onChange={handlePersonalInfo} icon={<Mail size={16}/>} placeholder="john@example.com" />
            <FormInput name="linkedin" label="LinkedIn URL" value={state.personalInfo.linkedin || ""} onChange={handlePersonalInfo} icon={<LinkIcon size={16}/>} placeholder="linkedin.com/in/profile" />
            <FormInput name="github" label="GitHub URL" value={state.personalInfo.github || ""} onChange={handlePersonalInfo} icon={<Github size={16}/>} placeholder="github.com/username" />
            <div className="md:col-span-2">
              <FormInput 
                name="date" 
                label="Document Date" 
                value={state.date} 
                onChange={(e) => dispatch(updateDate(e.target.value))} 
                icon={<Calendar size={16}/>} 
                placeholder="e.g. September 22, 2026"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFormTab(2)}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-6 cursor-pointer"
          >
            Proceed to Employer Details
          </button>
        </div>

        {/* Section 2: Employer Info */}
        <div className={formTab === 2 ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}>
          <div className="flex flex-col mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Employer & Recruiter Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Information about the company and hiring team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="companyName" label="Company Name *" value={state.employerInfo.companyName || ""} onChange={handleEmployerInfo} icon={<Building size={16}/>} placeholder="e.g. Google" />
            <FormInput name="teamName" label="Team / Department" value={state.employerInfo.teamName || ""} onChange={handleEmployerInfo} icon={<Briefcase size={16}/>} placeholder="e.g. Cloud Infrastructure" />
            <FormInput name="managerName" label="Hiring Manager Name" value={state.employerInfo.managerName || ""} onChange={handleEmployerInfo} icon={<User size={16}/>} placeholder="e.g. Jane Smith (or Hiring Team)" />
            <FormInput 
              name="salutation" 
              label="Salutation / Greeting" 
              value={state.salutation} 
              onChange={(e) => dispatch(updateSalutation(e.target.value))} 
              icon={<PenTool size={16}/>} 
              placeholder="e.g. Dear Hiring Manager,"
            />
          </div>

          <button
            type="button"
            onClick={() => setFormTab(3)}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-6 cursor-pointer"
          >
            Proceed to Letter Content
          </button>
        </div>

        {/* Section 3: Letter Content */}
        <div className={formTab === 3 ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Letter Content
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose between guided structure or manual writing
              </p>
            </div>
            
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl self-start">
              <button
                type="button"
                onClick={() => dispatch(updateMode("structured"))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  state.mode === "structured" 
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Type size={13} /> Structured
              </button>
              <button
                type="button"
                onClick={() => dispatch(updateMode("manual"))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  state.mode === "manual" 
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FileText size={13} /> Manual
              </button>
            </div>
          </div>

          {state.mode === "structured" ? (
            <div className="space-y-5">
              <FormTextArea 
                name="intro" 
                label="P1: The Hook (Opening Statement)" 
                value={state.body.intro || ""} 
                onChange={handleBody} 
                placeholder="State the role you're applying for and what excites you about this opportunity..."
              />
              <FormTextArea 
                name="body1" 
                label="P2: Core Experience & Achievements" 
                value={state.body.body1 || ""} 
                onChange={handleBody} 
                placeholder="Highlight your most relevant achievements and measurable impact..."
              />
              <FormTextArea 
                name="body2" 
                label="P3: Tech Stack & Collaboration" 
                value={state.body.body2 || ""} 
                onChange={handleBody} 
                placeholder="Describe your technical skills, leadership, and cross-functional work..."
              />
              <FormTextArea 
                name="body3" 
                label="P4: Why This Company?" 
                value={state.body.body3 || ""} 
                onChange={handleBody} 
                placeholder="Explain why their mission, culture, or product aligns with your goals..."
              />
              <FormTextArea 
                name="conclusion" 
                label="P5: Call to Action & Conclusion" 
                value={state.body.conclusion || ""} 
                onChange={handleBody} 
                placeholder="Express gratitude and request a conversation or interview..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FormTextArea 
                name="manualContent" 
                label="Full Cover Letter Body" 
                value={state.manualContent} 
                onChange={(e) => dispatch(updateManualContent(e.target.value))} 
                placeholder="Write your entire cover letter body freely..."
                rows={16}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setFormTab(4)}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-6 cursor-pointer"
          >
            Proceed to Sign-Off
          </button>
        </div>

        {/* Section 4: Sign-Off */}
        <div className={formTab === 4 ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}>
          <div className="flex flex-col mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Sign-Off & Closing
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose your formal sign-off phrase
            </p>
          </div>

          <div className="space-y-4">
            <FormInput 
              name="signOff" 
              label="Sign-Off Phrase" 
              value={state.signOff} 
              onChange={(e) => dispatch(updateSignOff(e.target.value))} 
              icon={<PenTool size={16}/>} 
              placeholder="e.g. Sincerely, or Best regards,"
            />

            <div className="flex flex-wrap gap-2 pt-2">
              {["Sincerely,", "Best regards,", "Warm regards,", "Respectfully,", "Kind regards,"].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => dispatch(updateSignOff(phrase))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    state.signOff === phrase
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-primary/50 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoverLetterForm;
