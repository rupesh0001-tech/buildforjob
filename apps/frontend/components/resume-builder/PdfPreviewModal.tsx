"use client";

import React, { useState } from "react";
import { X, Download, RefreshCw, Loader2, Sparkles, FileText, Printer, Code2, Copy, Check, FileCode, Lock } from '@/lib/icons';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlobUrl: string | null;
  latexSource?: string | null;
  isLoading: boolean;
  errorMessage?: string | null;
  onRefresh: () => void;
  resumeTitle?: string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  pdfBlobUrl,
  latexSource,
  isLoading,
  errorMessage,
  onRefresh,
  resumeTitle = "Resume",
}: PdfPreviewModalProps) {
  const [viewMode, setViewMode] = useState<"pdf" | "code">("pdf");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = `${resumeTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadTex = () => {
    if (!latexSource) return;
    const blob = new Blob([latexSource], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeTitle.toLowerCase().replace(/\s+/g, "_")}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("LaTeX source file (.tex) downloaded!");
  };

  const handleCopyCode = async () => {
    if (!latexSource) return;
    try {
      await navigator.clipboard.writeText(latexSource);
      setCopied(true);
      toast.success("LaTeX source code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code to clipboard");
    }
  };

  const handlePrint = () => {
    if (!pdfBlobUrl) return;
    const iframe = document.getElementById("pdf-preview-frame") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    } else {
      window.open(pdfBlobUrl, "_blank");
    }
  };

  const lines = latexSource ? latexSource.split("\n") : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-[#0f0f15] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-black/40 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                {viewMode === "pdf" ? <FileText size={18} /> : <Code2 size={18} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  LaTeX Engine Preview
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                    ATS 100% Vector
                  </span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {viewMode === "pdf" ? "Compiled vector PDF document" : "Auto-generated read-only LaTeX source code"}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-200/70 dark:bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("pdf")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "pdf"
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FileText size={13} />
                <span>PDF View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "code"
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Code2 size={13} />
                <span>LaTeX Code</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {viewMode === "code" ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    disabled={!latexSource}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTex}
                    disabled={!latexSource}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
                  >
                    <Download size={14} />
                    <span>Download .tex</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    title="Recompile PDF"
                    className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={!pdfBlobUrl || isLoading}
                    title="Print PDF"
                    className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 hidden sm:block"
                  >
                    <Printer size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={!pdfBlobUrl || isLoading}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#001BB7] hover:bg-[#001BB7]/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Viewer */}
          <div 
            className="flex-1 bg-slate-100 dark:bg-[#08080c] relative overflow-hidden flex flex-col rounded-b-2xl"
            style={{ isolation: 'isolate', transform: 'translateZ(0)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          >
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Compiling LaTeX Engine...
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                    Processing form fields, escaping special characters, and generating vector output.
                  </p>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                  <X size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
                    Compilation Issue
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {errorMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white rounded-xl text-xs font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  Try Recompiling
                </button>
              </div>
            ) : viewMode === "pdf" ? (
              pdfBlobUrl ? (
                <iframe
                  id="pdf-preview-frame"
                  src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0 block rounded-b-2xl"
                  style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
                  title="LaTeX PDF Preview"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-gray-400">No PDF available yet.</p>
                </div>
              )
            ) : (
              /* Code View */
              <div className="flex-1 flex flex-col h-full bg-[#11111b] overflow-hidden text-gray-300 font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-white/5 text-[11px] text-gray-400 select-none">
                  <span className="flex items-center gap-1.5">
                    <FileCode size={13} className="text-blue-400" />
                    resume.tex • Read-Only
                  </span>
                  <span className="text-gray-500">Auto-generated from form values</span>
                </div>
                <div className="flex-1 overflow-auto p-4 custom-scrollbar select-text">
                  <table className="w-full border-collapse">
                    <tbody>
                      {lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="w-12 pr-4 text-right text-gray-600 select-none align-top font-mono text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="text-gray-200 whitespace-pre font-mono text-xs leading-relaxed">
                            {line || " "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
