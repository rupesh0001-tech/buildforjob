"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TEMPLATES } from "@/lib/portfolio-defaults";
import TemplateRenderer from "@/components/portfolio/TemplateRenderer";
import { Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/apis/axiosInstance";
import { toast } from "sonner";

export default function HostedPortfolioPage() {
  const params = useParams();
  const [showBanner, setShowBanner] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [portfolioSettings, setPortfolioSettings] = useState<any>(null);
  const [templateId, setTemplateId] = useState("architect-prismatic");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username as string;
  const id = params.id as string;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get(`/portfolio/public/${id}`);
        if (res.data && res.data.portfolio) {
          const portfolio = res.data.portfolio;
          setTemplateId(portfolio.templateId || "architect-prismatic");
          if (portfolio.data) {
            setPortfolioData(portfolio.data);
          } else {
            const tpl = TEMPLATES.find(t => t.id === portfolio.templateId) || TEMPLATES[0];
            setPortfolioData(tpl.defaultData);
          }
          if (portfolio.settings) {
            setPortfolioSettings(portfolio.settings);
          } else {
            const tpl = TEMPLATES.find(t => t.id === portfolio.templateId) || TEMPLATES[0];
            setPortfolioSettings(tpl.defaultSettings);
          }
        } else {
          setError("Portfolio not configured");
        }
      } catch (err: any) {
        console.error("Error fetching public portfolio:", err);
        setError(err.response?.data?.error || "Portfolio not found");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const handleSubmitResponse = async (formData: { name: string; email: string; message: string }) => {
    try {
      await api.post(`/portfolio/public/${id}/respond`, formData);
      toast.success("Message sent successfully!");
    } catch (err: any) {
      console.error("Error submitting response:", err);
      toast.error("Failed to send message. Please try again.");
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-semibold uppercase tracking-wider animate-pulse">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white px-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto border border-red-500/25">
            <X size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Portfolio Not Found</h1>
            <p className="text-sm text-gray-400">
              The portfolio hosted at this address is not configured or does not exist.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
          >
            Create Your Portfolio
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Template Renderer */}
      <TemplateRenderer 
        templateId={templateId} 
        data={portfolioData} 
        settings={portfolioSettings} 
        onSubmitResponse={handleSubmitResponse}
      />

      {/* Sticky Premium Sticker Banner at the bottom */}
      {showBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-slate-900/90 dark:bg-black/90 text-white backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 animate-pulse text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100 leading-tight">
                Made with Build For Job
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                Create your engineering portfolio in 1 minute.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/"
              className="px-4 py-2 bg-primary hover:brightness-105 transition-all text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 text-white shrink-0"
            >
              Build Yours <ArrowRight size={10} />
            </Link>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
