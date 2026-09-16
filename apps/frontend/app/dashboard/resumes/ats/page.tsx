"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  RotateCcw,
  Info,
  X,
  History,
  Download,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Building2,
  ChevronDown,
  Check,
  Search,
} from '@/lib/icons';
import { checkATSScore, getATSSuggestions, getATSReports, unlockReportSuggestions } from "@/apis/ats.api";
import type { ATSResult, ATSSuggestions } from "@/apis/ats.api";
import { getCompanies } from "@/apis/companies.api";
import { generateJobDescription } from "@/apis/ai.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";

// ─── Score colour helpers ──────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 80) return { label: "Excellent Match", emoji: "🎯" };
  if (score >= 65) return { label: "Good Match", emoji: "✅" };
  if (score >= 45) return { label: "Average Match", emoji: "⚠️" };
  return { label: "Poor Match", emoji: "❌" };
}

function getScoreGradient(score: number) {
  if (score >= 75) return "from-emerald-500/20 to-emerald-500/5";
  if (score >= 50) return "from-amber-500/20 to-amber-500/5";
  return "from-red-500/20 to-red-500/5";
}

// ─── Score Gauge ──────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = Math.PI * radius; 
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const gradientId = "gauge-gradient";

  return (
    <div className="relative flex items-center justify-center w-80 h-48">
      <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-gray-100 dark:text-white/5"
        />
        {/* Progress */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </svg>
      
      {/* Center Score */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-baseline"
        >
          <span className="text-6xl font-semibold text-black dark:text-white tracking-tighter">
            {score}
          </span>
          <span className="text-xl font-semibold text-gray-400 dark:text-gray-500 ml-1">%</span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Drop-zone component ───────────────────────────────────────────────────

function DropZone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onFile(f);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer min-h-[160px] flex flex-col items-center justify-center gap-4 p-6
        ${
          file
            ? "border-purple-500/50 bg-purple-50/50 dark:bg-purple-500/5 cursor-default"
            : isDragging
            ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10 scale-[1.01]"
            : "border-gray-300 dark:border-white/15 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-500/5"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
        id="ats-pdf-input"
      />

      {file ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 w-full"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={22} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-black dark:text-white text-sm truncate">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {(file.size / 1024).toFixed(0)} KB · PDF
            </p>
          </div>
          {onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
            ${isDragging ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500"}`}
          >
            <Upload size={24} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-md text-black dark:text-white">
              Drop your resume PDF here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or{" "}
              <span className="text-purple-500 font-semibold">browse files</span>
              {" "}· Max 5 MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function ATSCheckerPage() {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [suggestions, setSuggestions] = useState<ATSSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // History & Tab Navigation State
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  const [history, setHistory] = useState<ATSResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Company Profiles for Auto-Fill
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [jdGenerating, setJdGenerating] = useState(false);

  // Dropdown Refs & States
  const companyRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies();
        if (response.success) {
          // Filter to show only CompanyProfile (isCustom === false)
          const globalCompanies = response.data.filter((c: any) => !c.isCustom);
          setCompanies(globalCompanies);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleGenerateCompanyRoleJD = async () => {
    if (!selectedCompanyId || !selectedRole) {
      toast.error("Please select a target company and role.");
      return;
    }
    const selectedCompany = companies.find(c => c.id === selectedCompanyId);
    if (!selectedCompany) return;

    try {
      setJdGenerating(true);
      const generatedText = await generateJobDescription(selectedCompany.name, [selectedRole]);
      setJd(generatedText);
      toast.success(`Generated optimized ${selectedRole} job description for ${selectedCompany.name}!`);
    } catch (error: any) {
      const msg = getErrorMessage(error, "Failed to generate job description with AI.");
      toast.error(msg);
    } finally {
      setJdGenerating(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getATSReports();
      setHistory(data);
    } catch (err: unknown) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleCheck = async () => {
    if (!file || jd.trim().length < 20) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions(null);
    setIsUnlocked(false);

    try {
      const data = await checkATSScore(file, jd);
      setResult(data);
      dispatch(fetchProfile() as any);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Something went wrong. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAndAnalyze = async () => {
    setIsUnlocked(true);
    setSuggestionsLoading(true);
    try {
      let suggestionsData;
      if (result?.id) {
        suggestionsData = await unlockReportSuggestions(result.id);
      } else {
        suggestionsData = await getATSSuggestions(file!, jd);
      }
      setSuggestions(suggestionsData);
      
      // Update result state suggestions to preserve cache when switching tabs
      if (result) {
        setResult({
          ...result,
          suggestions: suggestionsData,
        });
      }
      dispatch(fetchProfile() as any);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to get AI suggestions.");
      setError(msg);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJd("");
    setResult(null);
    setSuggestions(null);
    setError(null);
    setIsUnlocked(false);
    
    // Refresh history if they returned from history view
    if (activeTab === "history") {
      fetchHistory();
    }
  };

  const handleDownloadPDF = async () => {
    if (!result || !suggestions) return;
    
    try {
      // Dynamic import of jsPDF to prevent SSR issues during build time
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const margin = 20;
      let y = 20;
      const pageWidth = doc.internal.pageSize.width;
      
      // Header Banner
      doc.setFillColor(124, 58, 237); // Primary Purple color (purple-600)
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("ATS Score Match Report", margin, 26);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date(result.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, margin, 34);
      
      y = 55;
      
      // Resume & Job Description Details
      doc.setTextColor(31, 41, 55); // gray-800
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Scan Summary", margin, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99); // gray-600
      
      doc.text(`Resume File: ${result.resumeName || "Scanned PDF"}`, margin, y);
      y += 6;
      doc.text(`Match Score: ${result.score}%`, margin, y);
      y += 6;
      doc.text(`Resume Word Count: ${result.resumeWordCount} words`, margin, y);
      y += 6;
      doc.text(`Job Description Word Count: ${result.jdWordCount} words`, margin, y);
      y += 12;
      
      // Line separator
      doc.setDrawColor(229, 231, 235); // gray-200
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      
      // Match Analysis Details
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Match Analysis Justification", margin, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const justificationLines = doc.splitTextToSize(result.details || "", pageWidth - (margin * 2));
      doc.text(justificationLines, margin, y);
      y += (justificationLines.length * 5) + 12;
      
      // Line separator
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      
      // Impactful Improvements
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("AI Recommended Improvements", margin, y);
      y += 8;
      
      suggestions.improvements?.forEach((imp, i) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(124, 58, 237); // purple-600
        doc.text(`${i + 1}. ${imp.title} (Impact: +${imp.impact}%)`, margin, y);
        y += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        const descLines = doc.splitTextToSize(imp.description, pageWidth - (margin * 2) - 5);
        doc.text(descLines, margin + 4, y);
        y += (descLines.length * 5) + 8;
      });
      
      y += 4;
      
      // Missing Keywords & Skills
      if (y > 220) {
        doc.addPage();
        y = 20;
      }
      
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Missing Keywords & Skills", margin, y);
      y += 8;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text("Missing Keywords for ATS Optimization:", margin, y);
      y += 5;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      const keywordList = suggestions.missingKeywords?.join(", ") || "None identified";
      const keywordLines = doc.splitTextToSize(keywordList, pageWidth - (margin * 2));
      doc.text(keywordLines, margin, y);
      y += (keywordLines.length * 5) + 8;
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(219, 39, 119); // pink-600
      doc.text("Missing Professional Skills / Experiences:", margin, y);
      y += 5;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      const skillList = suggestions.missingSkills?.join(", ") || "None identified";
      const skillLines = doc.splitTextToSize(skillList, pageWidth - (margin * 2));
      doc.text(skillLines, margin, y);
      y += (skillLines.length * 5) + 12;
      
      doc.save(`ATS_Report_${result.resumeName?.replace(".pdf", "") || "Report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const getIndustryLabel = (industry: string) => {
    switch (industry) {
      case 'Big Tech':
        return 'Big Tech';
      case 'FinTech':
        return 'FinTech';
      case 'SaaS':
        return 'SaaS / Product';
      case 'Unicorn':
        return 'Startups / Unicorns';
      default:
        return industry;
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const groupedCompanies = filteredCompanies.reduce((acc: any, company: any) => {
    const industry = company.industry || "Other";
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(company);
    return acc;
  }, {});

  const improvementCount = result ? Math.max(3, Math.floor((105 - result.score) / 6)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      {/* ── Tabs Header ── */}
      {!result && (
        <div className="flex border-b border-gray-200 dark:border-white/10 mb-4">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all cursor-pointer ${
              activeTab === "scan"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <FileCheck size={16} /> Scan Resume
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all cursor-pointer ${
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <History size={16} /> Scan History
          </button>
        </div>
      )}

      {/* ── Form, History, or Results ── */}
      <AnimatePresence mode="wait">
        {!result ? (
          activeTab === "scan" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* PDF Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                  Resume PDF
                </label>
                <DropZone
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                />
              </div>

              {/* Auto-Fill Job Description */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                  Auto-Fill Job Description
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Company Dropdown */}
                  <div className="relative flex-1" ref={companyRef}>
                    <button
                      type="button"
                      onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all cursor-pointer"
                    >
                      <span className="truncate">
                        {selectedCompanyId ? companies.find(c => c.id === selectedCompanyId)?.name : <span className="text-gray-400">Select Company</span>}
                      </span>
                      <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${companyDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {companyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.99 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#0a0a10] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[60] overflow-hidden flex flex-col max-h-72"
                        >
                          {/* Search */}
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                            <Search size={14} className="text-gray-400 shrink-0" />
                            <input
                              type="text"
                              placeholder="Search company..."
                              value={companySearch}
                              onChange={(e) => setCompanySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                            />
                          </div>

                          <div className="flex-1 overflow-y-auto">
                            {Object.keys(groupedCompanies).length > 0 ? (
                              Object.keys(groupedCompanies).map(industry => (
                                <div key={industry}>
                                  <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 select-none">
                                    {getIndustryLabel(industry)}
                                  </div>
                                  {groupedCompanies[industry].map((company: any) => {
                                    const isSelected = selectedCompanyId === company.id;
                                    return (
                                      <button
                                        key={company.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCompanyId(company.id);
                                          setCompanyDropdownOpen(false);
                                          setCompanySearch("");
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                                          isSelected ? "text-[#001BB7] dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5" : "text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        <span className="truncate">{company.name}</span>
                                        {isSelected && <Check size={14} className="text-[#001BB7] dark:text-blue-400 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-8 text-center text-sm text-gray-400">
                                No companies found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Job Role Dropdown */}
                  <div className="relative flex-1" ref={roleRef}>
                    <button
                      type="button"
                      onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all cursor-pointer"
                    >
                      <span className="truncate">
                        {selectedRole ? selectedRole : <span className="text-gray-400">Select Job Role</span>}
                      </span>
                      <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {roleDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.99 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#0a0a10] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[60] overflow-hidden flex flex-col max-h-72"
                        >
                          <div className="overflow-y-auto py-1">
                            {[
                              "Software Engineer",
                              "Frontend Engineer",
                              "Backend Engineer",
                              "Fullstack Engineer",
                              "Mobile Engineer",
                              "DevOps Engineer",
                              "Data Scientist",
                              "Product Manager",
                              "QA Engineer"
                            ].map((role) => {
                              const isSelected = selectedRole === role;
                              return (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRole(role);
                                    setRoleDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                                    isSelected ? "text-[#001BB7] dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5" : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  <span>{role}</span>
                                  {isSelected && <Check size={14} className="text-[#001BB7] dark:text-blue-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    disabled={!selectedCompanyId || !selectedRole || jdGenerating}
                    onClick={handleGenerateCompanyRoleJD}
                    className="px-5 py-4 bg-[#001BB7] hover:bg-[#0020d4] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    {jdGenerating ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        Auto-Fill
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label
                  htmlFor="ats-jd-input"
                  className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1"
                >
                  Job Description
                </label>
                <textarea
                  id="ats-jd-input"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the full job description here or use Auto-Fill above..."
                  rows={10}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 transition-all resize-none"
                />
                <p className="text-[10px] font-medium text-gray-400 text-right px-1">
                  {jd.trim().split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                id="ats-check-btn"
                onClick={handleCheck}
                disabled={!file || jd.trim().length < 20 || loading}
                className={`w-full py-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  !file || jd.trim().length < 20 || loading
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analysing with AI…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Analyse Match Score
                  </>
                )}
              </button>

              {/* Tip */}
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 justify-center">
                <Info size={12} />
                Uses the{" "}
                <span className="font-medium">sentence-transformers/all-MiniLM-L6-v2</span>{" "}
                model via HuggingFace.
              </p>
            </motion.div>
          ) : (
            /* ── History Panel ── */
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-semibold">Loading your scan history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-black/40 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History size={24} />
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">No Scan History Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                    Once you scan your first resume against a job description, your reports will be saved here.
                  </p>
                  <button
                    onClick={() => setActiveTab("scan")}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Scan Resume Now
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#08080a] rounded-2xl border border-gray-300 dark:border-white/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-300 dark:border-white/10">
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resume File</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Description</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {history.map((report, idx) => (
                          <motion.tr
                            key={report.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-100 dark:border-white/5 last:border-0"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                  <FileText size={20} />
                                </div>
                                <div className="min-w-0 max-w-[200px]">
                                  <span className="font-semibold text-black dark:text-white truncate block text-sm" title={report.resumeName || "Resume PDF"}>
                                    {report.resumeName || "Resume PDF"}
                                  </span>
                                  {report.resumeUrl && (
                                    <a
                                      href={report.resumeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Download size={12} /> Download PDF
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm text-gray-800 dark:text-gray-400 line-clamp-2 max-w-xs font-normal leading-relaxed">
                                {report.jobDescription}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <div className={`inline-flex px-3 py-1.5 rounded-lg font-semibold text-sm border ${
                                report.score >= 75 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                report.score >= 50 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                "bg-red-500/10 text-red-500 border-red-500/20"
                              }`}>
                                {report.score}%
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500 text-sm">
                                <Calendar size={14} />
                                {report.createdAt ? new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setResult(report);
                                    setIsUnlocked(!!report.suggestions);
                                    setSuggestions(report.suggestions || null);
                                    setFile(new File([], report.resumeName || "Resume.pdf", { type: "application/pdf" }));
                                    setJd(report.jobDescription);
                                  }}
                                  className="px-3 py-2 bg-gray-50 hover:bg-primary hover:text-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer  dark:text-white"
                                >
                                  View Report <ArrowRight size={14} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )
        ) : (
          /* ── Results Panel ── */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Back to list button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to {activeTab === "history" ? "History" : "Scan"}
            </button>

            {/* Score card */}
            <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white leading-none mb-1">ATS Match Analysis</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Analysis Score</p>
                </div>
                <div className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                  <Info size={18} />
                </div>
              </div>

              {/* Card Body - Gauge */}
              <div className="px-10 pt-10 pb-8 relative">
                <div className="flex flex-col items-center mb-8">
                  <ScoreGauge score={result.score} />
                </div>
                
                {/* Qualitative Footer */}
                <div className="space-y-2 border-t border-gray-100 dark:border-white/10 pt-8">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    {result.score >= 80 ? "Excellent profile match" : result.score >= 60 ? "Strong candidate match" : "Profile requires tailoring"}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your resume has achieved a {result.score}% match with the job requirements. 
                    {result.score < 90 ? " To stand out to recruiters, we recommend addressing the critical improvements listed below." : " Your profile is highly competitive and ready for submission."}
                  </p>
                  
                  {/* Download link for uploaded resume in Results view too */}
                  {result.resumeUrl && (
                    <div className="pt-2">
                      <a
                        href={result.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <Download size={14} /> Download scanned resume ({result.resumeName})
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Banner */}
              {result.score < 90 && (
                <div className="mx-10 mb-10 py-4 px-6 bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20 rounded-2xl flex items-center gap-4">
                   <div className="w-10 h-10 bg-white dark:bg-black/20 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <AlertCircle size={20} className="text-purple-600 dark:text-purple-400" />
                   </div>
                   <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                     {improvementCount} critical improvements needed to reach 90+ score.
                   </p>
                </div>
              )}
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm relative min-h-[400px] flex flex-col">
              <div className="px-8 py-6 flex items-center justify-between shrink-0 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                   </div>
                   <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-400 uppercase tracking-wider">AI Analysis & Suggestions</h3>
                </div>
                
                {/* Download PDF Report button */}
                {isUnlocked && suggestions && (
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download size={14} /> Download Report PDF
                  </button>
                )}
              </div>

              <div className="flex-1 relative px-8 py-12 overflow-hidden bg-gray-50/30 dark:bg-black/20">
                {/* Suggestions Container */}
                <div className="relative z-10">
                  {suggestionsLoading && isUnlocked ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-6">
                      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
                      <div className="text-center space-y-2">
                        <p className="text-xl font-semibold text-black dark:text-white">AI Analysis in progress...</p>
                        <p className="text-sm text-gray-500 font-semibold tracking-wide">Evaluating impact and identifying key gaps</p>
                      </div>
                    </div>
                  ) : !isUnlocked ? (
                    /* Locked State - Placeholder UI */
                    <div className="space-y-12 blur-[6px] opacity-60 select-none pointer-events-none">
                      {Array(6).fill(null).map((_, i) => (
                        <div key={i} className="flex gap-6 max-w-3xl mx-auto w-full">
                          <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 shrink-0" />
                          <div className="flex-1 space-y-3 pt-2">
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-1/3" />
                            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions && (
                    /* Unlocked State - Structured UI */
                    <div className="max-w-4xl mx-auto space-y-12">
                      {/* Critical Improvements with Progress Bars */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                           <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Impactful Improvements</h4>
                        </div>
                        <div className="grid gap-4">
                          {suggestions.improvements?.map((item, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={18} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-lg font-semibold text-black dark:text-white truncate">{item.title}</h5>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-14 leading-relaxed font-medium">
                                {item.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </section>

                      {/* Keyword & Skill Gaps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Missing Keywords */}
                        <section className="space-y-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Missing Keywords</h4>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {suggestions.missingKeywords?.map((tag, i) => (
                                <motion.span 
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.05 }}
                                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-500/20"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                           </div>
                        </section>

                        {/* Missing Skills */}
                        <section className="space-y-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Missing Skills</h4>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {suggestions.missingSkills?.map((tag, i) => (
                                <motion.span 
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.05 }}
                                  className="px-4 py-2 bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 rounded-xl text-sm font-semibold border border-pink-100 dark:border-pink-500/20"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                           </div>
                        </section>
                      </div>
                    </div>
                  )}
                </div>

                {/* Paywall Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-white/20 dark:bg-black/40">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-[#161618] p-12 rounded-2xl border border-gray-200 dark:border-white/10 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.4)] text-center max-w-md w-full relative overflow-hidden"
                     >
                        <h4 className="text-2xl font-semibold text-black dark:text-white mb-4">Unlock Pro Analysis</h4>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-10 leading-relaxed px-4">
                           Get exact keywords, content gaps, and achievement-based improvements to beat the ATS.
                        </p>
                        
                        <button 
                          onClick={handleUnlockAndAnalyze}
                          className="w-full py-5 bg-primary hover:brightness-110 text-white rounded-[24px] font-semibold shadow-xl shadow-primary/30 transition-all active:scale-[0.97] cursor-pointer flex items-center justify-center gap-3 group text-lg"
                        >
                           Purchase Pro · ₹9 ($0.11)
                           <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                        
                        <div className="mt-6 flex items-center justify-center gap-6">
                           <div className="flex flex-col items-center">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Payment</p>
                              <p className="text-xs text-gray-500 font-semibold">One-time</p>
                           </div>
                           <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                           <div className="flex flex-col items-center">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Access</p>
                              <p className="text-xs text-gray-500 font-semibold">1 Month</p>
                           </div>
                        </div>
                     </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset */}
            <button
              id="ats-reset-btn"
              onClick={handleReset}
              className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={14} /> Check Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
