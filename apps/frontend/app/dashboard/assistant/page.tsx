"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Search,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  Check,
  Copy,
  Briefcase,
  FileCheck,
  FilePlus,
  Globe,
  Loader2,
  HelpCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "@/lib/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUserMessage, sendMessage, clearChat } from "@/store/slices/chatSlice";
import type { ChatMessageItem } from "@/apis/chat.api";

const SUGGESTED_PROMPTS = [
  {
    title: "How to use ATS Checker?",
    prompt: "Explain how to calculate my ATS match score and unlock detailed improvement suggestions.",
    icon: FileCheck,
    badge: "ATS Guide",
  },
  {
    title: "Build Developer Portfolio",
    prompt: "Where can I customize my portfolio and how do I publish it live?",
    icon: Globe,
    badge: "Portfolio Guide",
  },
  {
    title: "LaTeX Resume Builder",
    prompt: "How does the LaTeX resume builder work and how do I export my PDF?",
    icon: FilePlus,
    badge: "Resume Guide",
  },
  {
    title: "Connect GitHub Account",
    prompt: "How do I connect my GitHub profile to sync my repositories and skills?",
    icon: Globe,
    badge: "Integration",
  },
  {
    title: "Application Versions",
    prompt: "Where can I track tailored resumes and cover letters for different companies?",
    icon: Briefcase,
    badge: "Versions",
  },
];

export default function AssistantPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { messages, isLoading } = useAppSelector((state) => state.chat);

  const [inputValue, setInputValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    if (!customText) setInputValue("");
    dispatch(addUserMessage(textToSend));
    dispatch(sendMessage({ text: textToSend }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    dispatch(clearChat());
    toast.success("Chat history reset.");
  };

  const handleImportToATS = (scrapedJob: NonNullable<ChatMessageItem["scrapedJob"]>) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ats_prefill_jd", scrapedJob.jobDescription);
      sessionStorage.setItem("ats_prefill_company", scrapedJob.company);
      sessionStorage.setItem("ats_prefill_role", scrapedJob.role);
    }
    toast.success(`Loading ${scrapedJob.company} (${scrapedJob.role}) into ATS Checker...`);
    router.push(`/dashboard/resumes/ats?company=${encodeURIComponent(scrapedJob.company)}&role=${encodeURIComponent(scrapedJob.role)}`);
  };

  const renderMessageContent = (content: string) => {
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-xs'>$1</code>")
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-blue-600 dark:text-blue-400 font-semibold underline hover:opacity-80 transition-opacity' target='_self'>$1 ↗</a>");

    return <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                AI Career Navigator
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Persistent Chat
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Preserved across navigation • Live dynamic career scraping tools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={cn("flex gap-3.5", isUser ? "justify-end" : "justify-start")}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "px-4 py-3.5 rounded-2xl relative group",
                      isUser
                        ? "bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/10"
                        : "bg-gray-50 dark:bg-[#121216] border border-black/5 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-xs shadow-sm"
                    )}
                  >
                    {renderMessageContent(msg.content)}

                    {/* Scraped Job Action Card if available */}
                    {msg.scrapedJob && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 rounded-xl bg-white dark:bg-[#18181f] border border-blue-500/30 dark:border-blue-500/20 shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                {msg.scrapedJob.role}
                              </h4>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {msg.scrapedJob.company} • {msg.scrapedJob.location || "Careers Portal"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Live Scraped
                          </span>
                        </div>

                        {msg.scrapedJob.requirements && msg.scrapedJob.requirements.length > 0 && (
                          <div className="mt-2.5">
                            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Extracted Requirements:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 pl-4 list-disc">
                              {msg.scrapedJob.requirements.slice(0, 3).map((req, rIdx) => (
                                <li key={rIdx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-3">
                          <button
                            onClick={() => handleImportToATS(msg.scrapedJob!)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            Load into ATS Checker
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Copy button */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id || `${idx}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === (msg.id || `${idx}`) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3.5 justify-start"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#121216] border border-black/5 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-xs flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Thinking & executing LangGraph tools...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length <= 2 && (
        <div className="pb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Suggested Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SUGGESTED_PROMPTS.slice(0, 4).map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/70 dark:bg-[#101014] hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {item.badge}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-gray-50 dark:bg-[#121216] rounded-2xl border border-black/10 dark:border-white/10 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all p-1.5 shadow-sm"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the platform, or ask 'Scrape Software Engineer roles at Google'..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 max-h-32 min-h-[40px]"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0",
              inputValue.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 cursor-pointer"
                : "bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-2">
          <span>Press <kbd className="font-mono bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send, <kbd className="font-mono bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded text-[10px]">Shift+Enter</kbd> for new line</span>
          <span>Preserved across sidebar navigation</span>
        </div>
      </div>
    </div>
  );
}
