"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import api from "@/apis/axiosInstance";
import { 
  TEMPLATES, 
  PortfolioData, 
  PortfolioSettings, 
  TemplateDefinition,
  Project,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  CodingProfile,
  CustomSection
} from "@/lib/portfolio-defaults";
import TemplateRenderer from "@/components/portfolio/TemplateRenderer";
import { 
  Globe, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Edit3, 
  Settings, 
  Plus, 
  Trash2, 
  Upload, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Layers, 
  FileText, 
  Info,
  ChevronRight,
  ChevronDown,
  Palette,
  Code,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Save,
  Play,
  Loader2,
  X,
  FileUp,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function PortfolioPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const autofillParam = searchParams.get("autofill");

  const isProfileCompleted = () => {
    if (!user) return false;
    let score = 0;
    
    // Basic fields
    const basicFields = ['firstName', 'lastName', 'phone', 'location', 'jobTitle', 'bio'];
    const filledBasicCount = basicFields.filter(f => !!(user as any)[f]).length;
    score += (filledBasicCount / basicFields.length) * 30;
    
    // Experience tracking
    const isFresher = user.socialLinks && (user.socialLinks as any).isFresher;
    if (isFresher || (user.experience && user.experience.length > 0)) score += 20;
    
    // Education tracking
    if (user.education && user.education.length > 0) score += 20;
    
    // Projects tracking
    const noProjects = user.socialLinks && (user.socialLinks as any).noProjects;
    if (noProjects || (user.projects && user.projects.length > 0)) score += 15;
    
    // Skills tracking
    const skillCount = user.skills?.length || 0;
    if (skillCount >= 3) score += 15;
    else if (skillCount > 0) score += 5;
    
    return Math.min(100, Math.round(score)) >= 100;
  };

  // States
  const [viewState, setViewState] = useState<"landing" | "builder">("builder");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(TEMPLATES[0]);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "sections" | "design">("personal");
  const [previewMode, setPreviewMode] = useState<"editor" | "preview">("editor");
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Custom section state
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionLayout, setNewSectionLayout] = useState<"text" | "grid" | "timeline">("grid");

  // Auto-fill Modal State
  const [showAutofillModal, setShowAutofillModal] = useState(false);

  // Upload progress states
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingProjectImages, setUploadingProjectImages] = useState<{ [key: string]: boolean }>({});

  // Dynamic portfolio data and settings
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    JSON.parse(JSON.stringify(TEMPLATES[0].defaultData))
  );
  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings | null>(
    JSON.parse(JSON.stringify(TEMPLATES[0].defaultSettings))
  );

  // Video refs for play on hover
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Fetch profile details to facilitate autofill matching
    dispatch(fetchProfile());
  }, [dispatch]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExistingPortfolio = async () => {
      try {
        const res = await api.get("/portfolio");
        if (res.data) {
          const tpl = TEMPLATES.find(t => t.id === res.data.templateId) || TEMPLATES[0];
          if (tpl) {
            setSelectedTemplate(tpl);
          }
          if (res.data.data) {
            // Safely merge user data with defaults to prevent property-access crashes in editor fields
            const mergedData = {
              ...tpl.defaultData,
              ...res.data.data,
              personalInfo: {
                ...tpl.defaultData.personalInfo,
                ...(res.data.data.personalInfo || {})
              },
              aboutMe: {
                ...tpl.defaultData.aboutMe,
                ...(res.data.data.aboutMe || {})
              }
            };
            setPortfolioData(mergedData);
          }
          if (res.data.settings) {
            setPortfolioSettings(res.data.settings);
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing portfolio:", err);
      }
    };
    fetchExistingPortfolio();
  }, []);

  const handleSavePortfolio = async () => {
    try {
      setIsSaving(true);
      await api.post("/portfolio", {
        templateId: selectedTemplate?.id || "architect-prismatic",
        data: portfolioData,
        settings: portfolioSettings,
      });
      toast.success("Portfolio configurations saved successfully!");
    } catch (err) {
      console.error("Failed to save portfolio:", err);
      toast.error("Failed to save portfolio configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (autofillParam === "true") {
      setShowAutofillModal(true);
    }
  }, [autofillParam]);

  // Validation check: Personal Info needs Name, Title, and Email to unlock Preview
  const isPersonalInfoFilled = (data: PortfolioData | null) => {
    if (!data) return false;
    return (
      data.personalInfo.fullName.trim() !== "" &&
      data.personalInfo.jobTitle.trim() !== "" &&
      data.personalInfo.email.trim() !== ""
    );
  };

  const hasUnlockedPreview = isPersonalInfoFilled(portfolioData);

  // ImageKit file uploader utility
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post<{ success: boolean; url: string }>("/user/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    if (response.data.success && response.data.url) {
      return response.data.url;
    }
    throw new Error("Upload failed");
  };

  // Upload Resume handler
  const onResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingResume(true);
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.personalInfo.resumeUrl = url;
      setPortfolioData(copy);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  // Upload Avatar handler
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingAvatar(true);
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.personalInfo.avatarUrl = url;
      setPortfolioData(copy);
      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Upload Project Image handler
  const onProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string, idx: number) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingProjectImages(prev => ({ ...prev, [projectId]: true }));
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.projects[idx].imageUrl = url;
      setPortfolioData(copy);
      toast.success("Project image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload project image.");
    } finally {
      setUploadingProjectImages(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: TemplateDefinition) => {
    setSelectedTemplate(template);
    setPortfolioData(JSON.parse(JSON.stringify(template.defaultData)));
    setPortfolioSettings(JSON.parse(JSON.stringify(template.defaultSettings)));
    setViewState("builder");
    setPreviewMode("editor");
  };

  // Auto fill confirmation handler
  const confirmAutofill = () => {
    if (!user) {
      toast.error("Please login and sync your profile first!");
      return;
    }

    if (!portfolioData) return;

    // Create a copy of current data
    const updatedData = JSON.parse(JSON.stringify(portfolioData));

    // Map profile values
    updatedData.personalInfo.fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || updatedData.personalInfo.fullName;
    updatedData.personalInfo.jobTitle = user.jobTitle || updatedData.personalInfo.jobTitle;
    updatedData.personalInfo.bio = user.bio || updatedData.personalInfo.bio;
    updatedData.personalInfo.tagline = user.bio ? user.bio.split(".")[0] + "." : updatedData.personalInfo.tagline;
    updatedData.personalInfo.email = user.email || updatedData.personalInfo.email;
    updatedData.personalInfo.phone = user.phone || updatedData.personalInfo.phone;
    updatedData.personalInfo.location = user.location || updatedData.personalInfo.location;
    updatedData.personalInfo.avatarUrl = user.avatarUrl || updatedData.personalInfo.avatarUrl;
    
    if (user.socialLinks) {
      updatedData.personalInfo.socialLinks = {
        github: user.socialLinks.github || updatedData.personalInfo.socialLinks.github,
        linkedin: user.socialLinks.linkedin || updatedData.personalInfo.socialLinks.linkedin,
        twitter: user.socialLinks.twitter || updatedData.personalInfo.socialLinks.twitter,
        portfolioUrl: user.socialLinks.portfolio || user.socialLinks.website || updatedData.personalInfo.socialLinks.portfolioUrl
      };
    }

    // Map skills
    if (user.skills && user.skills.length > 0) {
      const skillsList = user.skills.map((s: any) => s.name);
      const existingGeneral = updatedData.techStack.find((cat: any) => cat.category === "General" || cat.category === "Frontend");
      if (existingGeneral) {
        existingGeneral.items = Array.from(new Set([...existingGeneral.items, ...skillsList]));
      } else {
        updatedData.techStack.push({ category: "General Skills", items: skillsList });
      }
    }

    // Map projects
    if (user.projects && user.projects.length > 0) {
      updatedData.projects = user.projects.map((p: any, idx: number) => ({
        id: p.id || `sync-p-${idx}`,
        name: p.name || "Untitled Project",
        description: p.description || "No description provided.",
        techStack: p.techStack ? p.techStack.split(",").map((s: string) => s.trim()) : ["React", "TypeScript"],
        features: ["Fully integrated", "Cloud deployed", "Optimized metrics"],
        liveUrl: "#",
        githubUrl: "#",
        imageUrl: idx % 2 === 0 
          ? "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60"
          : "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60"
      }));
    }

    // Map experience
    if (user.experience && user.experience.length > 0) {
      updatedData.experience = user.experience.map((exp: any, idx: number) => ({
        id: exp.id || `sync-exp-${idx}`,
        company: exp.company || "Company",
        role: exp.position || "Developer",
        duration: `${exp.startDate || "2024"} – ${exp.isCurrent ? "Present" : exp.endDate || "2025"}`,
        responsibilities: exp.description ? exp.description.split("\n").filter((s: string) => s.trim() !== "") : ["Contributed to software engineering cycles"],
        technologies: exp.technologies || ["JavaScript", "React"]
      }));
    }

    // Map education
    if (user.education && user.education.length > 0) {
      updatedData.education = user.education.map((edu: any, idx: number) => ({
        id: edu.id || `sync-edu-${idx}`,
        degree: edu.degree || "Degree",
        field: edu.field || "Field of Study",
        institution: edu.institution || "University",
        duration: edu.graduationDate || "2026",
        gpa: edu.gpa ? `${edu.gpa} ${edu.graduationType || "GPA"}` : undefined
      }));
    }

    setPortfolioData(updatedData);
    setShowAutofillModal(false);
    toast.success("Synchronized data from your profile!");
  };

  // Accent Presets
  const accentPresets = [
    { name: "Brand Blue", value: "#001BB7" },
    { name: "Sage Green", value: "#10B981" },
    { name: "Neon Purple", value: "#A855F7" },
    { name: "Crimson Rose", value: "#F43F5E" },
    { name: "Amber Orange", value: "#F59E0B" },
    { name: "Cyan Teal", value: "#06B6D4" }
  ];

  const fontPresets = ["Inter", "Space Grotesk", "Outfit", "Fira Code"];

  const handleVideoHover = (id: string, isEnter: boolean) => {
    const video = videoRefs.current[id];
    if (!video) return;
    if (isEnter) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080a] text-slate-800 dark:text-[#E2E8F0] p-6">
      
      {/* 1. LANDING VIEW */}
      {viewState === "landing" && (
        <div className="max-w-6xl mx-auto space-y-12 py-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#001BB7] dark:text-white">
              Create a Portfolio
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Recruiters spend less than a minute evaluating portfolios. Select a modern template to showcase your developer skills visually and beautifully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id}
                className="group relative bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#001BB7]/20 transition-all flex flex-col h-full cursor-pointer"
                onMouseEnter={() => handleVideoHover(template.id, true)}
                onMouseLeave={() => handleVideoHover(template.id, false)}
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Visual Preview on Hover */}
                <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0 z-10"
                  />
                  <video 
                    ref={(el) => {
                      videoRefs.current[template.id] = el;
                    }}
                    src={template.videoUrl}
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#001BB7] text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg">
                      <Play size={12} className="fill-white" /> Select Template
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white group-hover:text-[#001BB7] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-3">
                      {template.description}
                    </p>
                  </div>
                  
                  <button className="w-full h-11 bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-300 group-hover:bg-[#001BB7] group-hover:text-white group-hover:border-[#001BB7] transition-all uppercase tracking-wider">
                    Select Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-6 rounded-2xl max-w-2xl mx-auto flex items-center gap-6 shadow-sm">
            <div className="p-4 bg-[#001BB7]/10 rounded-2xl text-[#001BB7] shrink-0">
              <Sparkles size={32} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">Already sync'd with GitHub?</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                You can auto-fill details from your synced Leet# profile to compile your portfolio instantly. Select any design template above to begin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. BUILDER WORKSPACE VIEW */}
      {viewState === "builder" && portfolioData && portfolioSettings && selectedTemplate && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-black/40 p-4 rounded-2xl backdrop-blur-xl relative z-50">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link 
                href="/dashboard"
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-gray-300"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="flex-1">
                <h2 className="bg-transparent border-none outline-none font-semibold text-lg font-sans dark:text-white w-full focus:ring-0 p-0">
                  Portfolio Builder
                </h2>
                <p className="text-[10px] text-gray-500 font-semibold font-sans uppercase tracking-widest mt-0.5">
                  Syncing to Cloud
                </p>
              </div>
            </div>

            {/* View selectors */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* Template switcher dropdown toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm"
                >
                  <Palette size={16} className="text-purple-500" />
                  <span>{selectedTemplate.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isTemplateDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isTemplateDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-45" onClick={() => setIsTemplateDropdownOpen(false)} />
                    <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[60] py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                      {TEMPLATES.map((t) => (
                        <li
                          key={t.id}
                          className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                            t.id === selectedTemplate.id
                              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-semibold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                          }`}
                          onClick={() => {
                            setSelectedTemplate(t);
                            setPortfolioSettings(JSON.parse(JSON.stringify(t.defaultSettings)));
                            toast.success(`Switched active design to: ${t.name}`);
                            setIsTemplateDropdownOpen(false);
                          }}
                        >
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Autofill Button */}
              {user && isProfileCompleted() && (
                <button 
                  onClick={() => setShowAutofillModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold font-sans text-sm transition-all shadow-sm shadow-purple-500/20 active:scale-[0.99]"
                >
                  <Sparkles size={16} /> Auto Fill
                </button>
              )}

              {/* Save Button */}
              <button 
                onClick={handleSavePortfolio}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:brightness-110 active:scale-[0.99] text-white rounded-xl font-semibold font-sans text-sm transition-all shadow-md shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none h-11"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save</span>
              </button>

              {/* View toggle (Editor vs Preview - Split removed) */}
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 h-11 items-center">
                <button 
                  onClick={() => setPreviewMode("editor")}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${previewMode === "editor" ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-slate-800"}`}
                >
                  <Edit3 size={12} /> Editor
                </button>
                <button 
                  onClick={() => {
                    if (hasUnlockedPreview) setPreviewMode("preview");
                  }}
                  disabled={!hasUnlockedPreview}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 group relative ${previewMode === "preview" ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow" : "text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"}`}
                  title={!hasUnlockedPreview ? "Please complete Personal Info to unlock" : ""}
                >
                  <Eye size={12} /> Preview
                  {!hasUnlockedPreview && (
                    <span className="absolute bottom-[-36px] left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
                      Required Info Missing
                    </span>
                  )}
                </button>
              </div>

              {/* Viewport size switcher */}
              {previewMode === "preview" && (
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 h-11 items-center">
                  <button 
                    onClick={() => setViewportSize("desktop")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "desktop" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Laptop size={14} />
                  </button>
                  <button 
                    onClick={() => setViewportSize("tablet")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "tablet" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Tablet size={14} />
                  </button>
                  <button 
                    onClick={() => setViewportSize("mobile")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "mobile" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main workspace layout */}
          <div className="w-full">
            
            {/* ── EDITOR VIEW ── */}
            {previewMode === "editor" && (
              <div className="bg-white dark:bg-[#08080a] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                {/* Editor Tab Headers */}
                <div className="flex border-b border-black/5 dark:border-white/5 text-sm font-bold bg-slate-50 dark:bg-[#12121A] h-12">
                  <button 
                    onClick={() => setActiveTab("personal")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "personal" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    1. Personal Info
                  </button>
                  <button 
                    onClick={() => setActiveTab("sections")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "sections" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    2. Content & Sections
                  </button>
                  <button 
                    onClick={() => setActiveTab("design")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "design" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    3. Theme Design
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  
                  {/* TAB 1: PERSONAL INFO */}
                  {activeTab === "personal" && (
                    <div className="space-y-6">
                      
                      {/* Name and Job Title */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Full Name *</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            value={portfolioData.personalInfo.fullName}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.fullName = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Rupesh Jagtap"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Job Title *</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            value={portfolioData.personalInfo.jobTitle}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.jobTitle = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Full-Stack Developer"
                          />
                        </div>
                      </div>

                      {/* Tagline */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Tagline / One-Liner</label>
                        <input 
                          type="text" 
                          className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          value={portfolioData.personalInfo.tagline}
                          onChange={(e) => {
                            const copy = { ...portfolioData };
                            copy.personalInfo.tagline = e.target.value;
                            setPortfolioData(copy);
                          }}
                          placeholder="Building scalable web applications..."
                        />
                      </div>

                      {/* Profile avatar uploader (replacing raw url text uploader) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Profile Avatar Image</label>
                        <div className="flex items-center gap-6 p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/10">
                          {portfolioData.personalInfo.avatarUrl ? (
                            <img 
                              src={portfolioData.personalInfo.avatarUrl} 
                              alt="Avatar" 
                              className="w-16 h-16 rounded-full object-cover bg-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border flex items-center justify-center">
                              <Code size={24} className="text-slate-400" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <label className="h-11 px-4 py-2.5 bg-[#001BB7] text-white hover:bg-[#001693] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                                {uploadingAvatar ? (
                                  <>
                                    <Loader2 className="animate-spin" size={14} /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} /> Upload Image
                                  </>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden" 
                                  disabled={uploadingAvatar}
                                  onChange={onAvatarChange}
                                />
                              </label>
                              
                              {portfolioData.personalInfo.avatarUrl && (
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.personalInfo.avatarUrl = "";
                                    setPortfolioData(copy);
                                  }}
                                  className="h-11 px-4 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">PNG, JPG or SVG formats up to 5MB.</p>
                          </div>
                        </div>
                      </div>

                      {/* Resume PDF uploader (making buttons work) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Upload Resume (PDF)</label>
                        <div className="flex items-center gap-4 p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/10">
                          <div className="p-3 bg-white dark:bg-black/35 border rounded-xl text-[#001BB7] shrink-0 shadow-sm">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {portfolioData.personalInfo.resumeUrl && portfolioData.personalInfo.resumeUrl !== "#" ? (
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                  {portfolioData.personalInfo.resumeUrl}
                                </p>
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={portfolioData.personalInfo.resumeUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] font-bold text-[#001BB7] hover:underline flex items-center gap-0.5"
                                  >
                                    View Live <ExternalLink size={10} />
                                  </a>
                                  <span className="text-slate-300">·</span>
                                  <label className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer">
                                    Replace File
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      className="hidden" 
                                      disabled={uploadingResume}
                                      onChange={onResumeChange}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-slate-500 dark:text-gray-400">No resume document uploaded yet.</p>
                                <label className="inline-flex h-9 px-3 items-center bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-lg text-xs font-bold transition-all cursor-pointer gap-1">
                                  {uploadingResume ? (
                                    <>
                                      <Loader2 className="animate-spin" size={12} /> Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <FileUp size={12} /> Upload Resume PDF
                                    </>
                                  )}
                                  <input 
                                    type="file" 
                                    accept="application/pdf"
                                    className="hidden" 
                                    disabled={uploadingResume}
                                    onChange={onResumeChange}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-black/5 dark:border-white/5 pt-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Email *</label>
                          <input 
                            type="email" 
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            value={portfolioData.personalInfo.email}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.email = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="rupesh@example.com"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Phone</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            value={portfolioData.personalInfo.phone || ""}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.phone = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Location</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            value={portfolioData.personalInfo.location}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.location = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Pune, India"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Bio Paragraphs</label>
                          <textarea 
                            rows={3}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white resize-none text-sm"
                            value={portfolioData.personalInfo.bio}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.bio = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="About details..."
                          />
                        </div>
                      </div>

                      {/* Social handles */}
                      <div className="border-t border-black/5 dark:border-white/5 pt-6 space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Social Handles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium font-sans text-gray-700 dark:text-gray-300">GitHub Link</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                              value={portfolioData.personalInfo.socialLinks.github || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.github = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium font-sans text-gray-700 dark:text-gray-300">LinkedIn Link</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                              value={portfolioData.personalInfo.socialLinks.linkedin || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.linkedin = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium font-sans text-gray-700 dark:text-gray-300">Twitter/X Link</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                              value={portfolioData.personalInfo.socialLinks.twitter || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.twitter = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://twitter.com/..."
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: SECTIONS */}
                  {activeTab === "sections" && (
                    <div className="space-y-6">
                      
                      {/* Projects Section */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Projects list</h3>
                            <p className="text-[10px] text-slate-400">Featured items shown in projects grid.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              const newProj: Project = {
                                id: `proj-${Date.now()}`,
                                name: "Untitled Project",
                                description: "Enter project details...",
                                techStack: ["React", "TypeScript"],
                                features: ["Key feature checklist item"],
                                liveUrl: "#",
                                githubUrl: "#"
                              };
                              copy.projects.push(newProj);
                              setPortfolioData(copy);
                              toast.success("Added new project slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Project
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.projects.map((proj, idx) => (
                            <div key={proj.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-5 rounded-xl space-y-4 relative group shadow-sm">
                              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-white/5">
                                <div className="flex-1 mr-4">
                                  <input 
                                    type="text" 
                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm font-bold"
                                    value={proj.name}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].name = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="Project Name"
                                  />
                                </div>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.projects = copy.projects.filter(p => p.id !== proj.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed project.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {/* Project description */}
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Description</label>
                                <textarea 
                                  rows={2}
                                  className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white resize-none text-sm"
                                  value={proj.description}
                                  onChange={(e) => {
                                    const copy = { ...portfolioData };
                                    copy.projects[idx].description = e.target.value;
                                    setPortfolioData(copy);
                                  }}
                                  placeholder="Enter project description..."
                                />
                              </div>

                              {/* Project Image Uploader */}
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Project Screenshot Image</label>
                                <div className="flex items-center gap-4 p-3 border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 rounded-xl">
                                  {proj.imageUrl ? (
                                    <img 
                                      src={proj.imageUrl} 
                                      alt={proj.name}
                                      className="w-14 h-14 rounded-lg object-cover bg-slate-200"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 border rounded-lg flex items-center justify-center">
                                      <ImageIcon size={18} className="text-slate-400" />
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <label className="h-9 px-3 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                                        {uploadingProjectImages[proj.id] ? (
                                          <>
                                            <Loader2 className="animate-spin" size={12} /> Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload size={12} /> Select Screen
                                          </>
                                        )}
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          className="hidden" 
                                          disabled={uploadingProjectImages[proj.id]}
                                          onChange={(e) => onProjectImageChange(e, proj.id, idx)}
                                        />
                                      </label>
                                      {proj.imageUrl && (
                                        <button 
                                          onClick={() => {
                                            const copy = { ...portfolioData };
                                            copy.projects[idx].imageUrl = "";
                                            setPortfolioData(copy);
                                          }}
                                          className="text-xs text-red-500 hover:underline animate-fade-in"
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tech Stack list inputs */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Tech Stack (comma separated)</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                                    value={proj.techStack.join(", ")}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].techStack = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="React, TypeScript, CSS"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Live URL</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                                    value={proj.liveUrl || ""}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].liveUrl = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="https://example.com"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Category manager */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Tech stacks & categorizations</h3>
                            <p className="text-[10px] text-slate-400">Add tool lists by group.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              copy.techStack.push({ category: "Database tools", items: ["PostgreSQL"] });
                              setPortfolioData(copy);
                              toast.success("Added category slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Category
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.techStack.map((cat, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <input 
                                  type="text" 
                                  className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-xs font-bold"
                                  value={cat.category}
                                  onChange={(e) => {
                                    const copy = { ...portfolioData };
                                    copy.techStack[idx].category = e.target.value;
                                    setPortfolioData(copy);
                                  }}
                                />
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.techStack = copy.techStack.filter((_, i) => i !== idx);
                                    setPortfolioData(copy);
                                    toast.success("Removed category.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <input 
                                type="text"
                                className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                                value={cat.items.join(", ")}
                                onChange={(e) => {
                                  const copy = { ...portfolioData };
                                  copy.techStack[idx].items = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                  setPortfolioData(copy);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Work Experience Section */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Work Experience</h3>
                            <p className="text-[10px] text-slate-400">Manage your employment history and achievements.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              const newExp: ExperienceItem = {
                                id: `exp-${Date.now()}`,
                                company: "Company Name",
                                role: "Job Title",
                                duration: "2023 - Present",
                                responsibilities: ["Developed core product features..."],
                                technologies: ["React", "TypeScript"]
                              };
                              if (!copy.experience) copy.experience = [];
                              copy.experience.push(newExp);
                              setPortfolioData(copy);
                              toast.success("Added experience slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Experience
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.experience?.map((exp, idx) => (
                            <div key={exp.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-5 rounded-xl space-y-4 relative group shadow-sm">
                              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-white/5">
                                <div className="grid grid-cols-2 gap-4 w-full mr-4">
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                    value={exp.company}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.experience[idx].company = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="Company Name"
                                  />
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                    value={exp.role}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.experience[idx].role = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="Role Title"
                                  />
                                </div>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.experience = copy.experience.filter(e => e.id !== exp.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed experience.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                    value={exp.duration}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.experience[idx].duration = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="e.g. 2021 - Present"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Technologies (comma separated)</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                    value={exp.technologies?.join(", ") || ""}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.experience[idx].technologies = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="React, AWS, Node.js"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsibilities</label>
                                <textarea 
                                  rows={3}
                                  className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm resize-none"
                                  value={exp.responsibilities?.join("\n") || ""}
                                  onChange={(e) => {
                                    const copy = { ...portfolioData };
                                    copy.experience[idx].responsibilities = e.target.value.split("\n");
                                    setPortfolioData(copy);
                                  }}
                                  placeholder="List responsibilities, one per line..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education Section */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Education</h3>
                            <p className="text-[10px] text-slate-400">Manage your college, degree, and academic history.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              const newEdu: EducationItem = {
                                id: `edu-${Date.now()}`,
                                degree: "Degree Name",
                                field: "Computer Science",
                                institution: "University Name",
                                duration: "2018 - 2022",
                                gpa: "9.0"
                              };
                              if (!copy.education) copy.education = [];
                              copy.education.push(newEdu);
                              setPortfolioData(copy);
                              toast.success("Added education slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Education
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.education?.map((edu, idx) => (
                            <div key={edu.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-5 rounded-xl space-y-4 relative group shadow-sm">
                              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-white/5">
                                <div className="grid grid-cols-2 gap-4 w-full mr-4">
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                    value={edu.institution}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.education[idx].institution = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="University / College"
                                  />
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
                                    value={edu.degree}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.education[idx].degree = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="e.g. Bachelor of Technology"
                                  />
                                </div>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.education = copy.education.filter(e => e.id !== edu.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed education.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-2 col-span-1">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                    value={edu.field}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.education[idx].field = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="e.g. Computer Science"
                                  />
                                </div>
                                <div className="flex flex-col gap-2 col-span-1">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                    value={edu.duration}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.education[idx].duration = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="e.g. 2018 - 2022"
                                  />
                                </div>
                                <div className="flex flex-col gap-2 col-span-1">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GPA / Grade</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                    value={edu.gpa || ""}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.education[idx].gpa = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                    placeholder="e.g. 9.2 CGPA or 85%"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Section insert block */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Dynamic Custom Sections</h3>
                            <p className="text-[10px] text-slate-400">Introduce custom timeline lists, grid lists or plain text blocks.</p>
                          </div>
                          <button 
                            onClick={() => setIsAddingSection(true)}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> New Custom Section
                          </button>
                        </div>

                        {isAddingSection && (
                          <div className="bg-white dark:bg-[#12121A] border border-[#001BB7]/30 p-5 rounded-xl space-y-4 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#001BB7]">Configure Section</h4>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Section Title</label>
                              <input 
                                type="text" 
                                className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                placeholder="E.g. Services, Publications"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Layout Format</label>
                              <select 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm focus:border-primary"
                                value={newSectionLayout}
                                onChange={(e) => setNewSectionLayout(e.target.value as any)}
                              >
                                <option value="grid" className="text-slate-800 dark:text-white dark:bg-[#12121A]">Grid (Cards)</option>
                                <option value="timeline" className="text-slate-800 dark:text-white dark:bg-[#12121A]">Timeline</option>
                                <option value="text" className="text-slate-800 dark:text-white dark:bg-[#12121A]">Text block list</option>
                              </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  setIsAddingSection(false);
                                  setNewSectionTitle("");
                                }}
                                className="h-11 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-500"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => {
                                  if (newSectionTitle.trim() === "") {
                                    toast.error("Please enter section name.");
                                    return;
                                  }
                                  const copy = { ...portfolioData };
                                  copy.customSections.push({
                                    id: `custom-${Date.now()}`,
                                    title: newSectionTitle,
                                    layout: newSectionLayout,
                                    items: [{ id: `c-item-${Date.now()}`, title: "Untitled Item", description: "Insert details..." }]
                                  });
                                  setPortfolioData(copy);
                                  setIsAddingSection(false);
                                  setNewSectionTitle("");
                                  toast.success(`Created custom section "${newSectionTitle}"!`);
                                }}
                                className="h-11 px-4 rounded-xl text-xs font-bold bg-[#001BB7] text-white"
                              >
                                Create Section
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {portfolioData.customSections?.map((section, idx) => (
                            <div key={section.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-4">
                              <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-white/5">
                                <span className="text-xs font-bold text-[#001BB7] uppercase tracking-wider">{section.title} ({section.layout})</span>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.customSections = copy.customSections.filter(s => s.id !== section.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed section.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {section.items.map((item, itemIdx) => (
                                  <div key={item.id} className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg space-y-2 border border-black/5">
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                                        value={item.title}
                                        onChange={(e) => {
                                          const copy = { ...portfolioData };
                                          copy.customSections[idx].items[itemIdx].title = e.target.value;
                                          setPortfolioData(copy);
                                        }}
                                        placeholder="Title"
                                      />
                                      <button 
                                        onClick={() => {
                                          const copy = { ...portfolioData };
                                          copy.customSections[idx].items = copy.customSections[idx].items.filter(it => it.id !== item.id);
                                          setPortfolioData(copy);
                                        }}
                                        className="text-red-500 font-bold px-2 hover:bg-red-100 dark:hover:bg-red-950/20 rounded-md"
                                      >
                                        ×
                                      </button>
                                    </div>
                                    <textarea 
                                      rows={2}
                                      className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white resize-none text-sm"
                                      value={item.description || ""}
                                      onChange={(e) => {
                                        const copy = { ...portfolioData };
                                        copy.customSections[idx].items[itemIdx].description = e.target.value;
                                        setPortfolioData(copy);
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                ))}
                              </div>

                              <button 
                                onClick={() => {
                                  const copy = { ...portfolioData };
                                  copy.customSections[idx].items.push({
                                    id: `c-item-${Date.now()}`,
                                    title: "Untitled Item",
                                    description: "Insert details..."
                                  });
                                  setPortfolioData(copy);
                                }}
                                className="w-full text-center py-2 bg-slate-50 dark:bg-black/20 border border-black/5 hover:bg-slate-100 rounded-lg text-xs text-[#001BB7] font-bold"
                              >
                                + Add List Item
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: DESIGN */}
                  {activeTab === "design" && (
                    <div className="space-y-6">
                      
                      {/* Theme selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Palette Accent Color</label>
                        <div className="grid grid-cols-3 gap-3">
                          {accentPresets.map((preset) => (
                            <button 
                              key={preset.value}
                              onClick={() => {
                                const copy = { ...portfolioSettings };
                                copy.accentColor = preset.value;
                                setPortfolioSettings(copy);
                              }}
                              className={`h-11 px-4 border rounded-xl flex items-center justify-between text-xs transition-all ${portfolioSettings.accentColor === preset.value ? "border-[#001BB7] bg-[#001BB7]/5 font-semibold text-slate-800 dark:text-white" : "border-black/10 dark:border-white/5 bg-transparent"}`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: preset.value }} />
                              {preset.name.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                                        {/* Custom color picker */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Custom Accent Color</label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            className="w-11 h-11 border-0 rounded-xl cursor-pointer"
                            value={portfolioSettings.accentColor}
                            onChange={(e) => {
                              const copy = { ...portfolioSettings };
                              copy.accentColor = e.target.value;
                              setPortfolioSettings(copy);
                            }}
                          />
                          <input 
                            type="text" 
                            className="px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm text-center font-mono w-28"
                            value={portfolioSettings.accentColor}
                            onChange={(e) => {
                              const copy = { ...portfolioSettings };
                              copy.accentColor = e.target.value;
                              setPortfolioSettings(copy);
                            }}
                          />
                        </div>
                      </div>

                      {/* Font selector */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium font-sans text-gray-700 dark:text-gray-300">Font Family</label>
                        <select
                          value={portfolioSettings?.fontFamily || "Inter"}
                          onChange={(e) => {
                            if (!portfolioSettings) return;
                            const copy = { ...portfolioSettings };
                            copy.fontFamily = e.target.value;
                            setPortfolioSettings(copy);
                          }}
                          className="w-full px-5 py-3 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#001BB7]/20 outline-none text-black dark:text-white"
                        >
                          <option value="Inter">Inter (Clean Sans)</option>
                          <option value="Space Grotesk">Space Grotesk (Tech Sans)</option>
                          <option value="Outfit">Outfit (Geometric Modern)</option>
                          <option value="Fira Code">Fira Code (Developer Mono)</option>
                        </select>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ── LIVE PREVIEW VIEW (FULL-SCREEN PREVIEW Toggled) ── */}
            {previewMode === "preview" && (
              <div className="bg-white dark:bg-[#08080a] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[78vh] max-w-5xl mx-auto w-full">
                
                {/* Viewport container */}
                <div className="flex-1 overflow-auto bg-slate-900 relative">
                  
                  {!hasUnlockedPreview ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-center p-6 text-white space-y-4">
                      <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
                        <EyeOff size={32} />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-bold">Preview Locked</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          To unlock the live portfolio preview, please fill out the required values in the **Personal Info** form tab:
                        </p>
                      </div>
                      <div className="space-y-1.5 text-left text-xs bg-white/5 p-4 rounded-xl border border-white/5 w-full max-w-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.fullName.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.fullName.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Name: {portfolioData.personalInfo.fullName.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.jobTitle.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.jobTitle.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Job Title: {portfolioData.personalInfo.jobTitle.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.email.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.email.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Email: {portfolioData.personalInfo.email.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${viewportSize === "desktop" ? "p-0 bg-transparent" : "p-4 bg-slate-950/20"}`}>
                      <div 
                        className={`h-full w-full bg-white dark:bg-black overflow-y-auto transition-all duration-300 ${
                          viewportSize === "mobile" ? "max-w-[375px] rounded-xl shadow-2xl" : 
                          viewportSize === "tablet" ? "max-w-[768px] rounded-xl shadow-2xl" : "w-full rounded-none shadow-none"
                        }`}
                      >
                        <TemplateRenderer 
                          templateId={selectedTemplate.id} 
                          data={portfolioData} 
                          settings={portfolioSettings} 
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ── AUTOFILL CONFIRMATION MODAL ( Sleek popup uploader/modal ) ── */}
      <AnimatePresence>
        {showAutofillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAutofillModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#12121A] border border-black/10 dark:border-white/5 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Auto Fill Portfolio?</h3>
                </div>
                <button 
                  onClick={() => setShowAutofillModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed space-y-2">
                <p>
                  This action imports and synchronizes your developer details (name, job bio, email, social links, experience logs, projects, and education history) from your synced profile.
                </p>
                <p className="text-xs text-amber-500 font-medium">
                  ⚠️ Warning: Any edits you have manually entered in the current workspace forms might be overwritten.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAutofillModal(false)}
                  className="flex-1 h-11 border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAutofill}
                  className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase shadow-md shadow-purple-500/20 active:scale-[0.99] transition-all"
                >
                  Yes, Auto Fill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
