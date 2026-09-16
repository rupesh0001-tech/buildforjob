"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from '@/lib/icons';

export function FaqSection() {
  const faqs = [
    {
      q: "How does the ATS score checker work?",
      a: "Our AI scans your resume against the provided job description and compares keywords, formatting, and industry standards used by popular Applicant Tracking Systems (ATS) like Workday, Greenhouse, and Lever. It then provides an actionable score to improve your match rate."
    },
    {
      q: "Can I export my resume to Word format?",
      a: "Yes! While PDF is highly recommended for submitting applications to ensure formatting remains pristine, we fully support exporting any template to .DOCX format for full editability in Microsoft Word or Google Docs."
    },
    {
      q: "Is my personal data safe?",
      a: "Absolutely. We do not sell your personal data, job queries, or resume information to third parties or recruiters. Your data is encrypted at rest and solely used to power your AI generation tools."
    },
    {
      q: "How does the GitHub portfolio sync work?",
      a: "Once you connect your GitHub account via OAuth, we automatically fetch your public pinned repositories, extract the languages/technologies used, and pull the README descriptions to generate a stunning, deployed personal portfolio without you writing a single line of code."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 max-w-4xl mx-auto px-6">
      <div className="text-center mb-16">
         <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">Frequently Asked Questions</h2>
         <p className="text-gray-600 dark:text-gray-400 text-lg">Got a different question? Reach out to support.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/20 overflow-hidden transition-all duration-300"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-hidden"
            >
              <span className="font-semibold text-black dark:text-white text-lg">{faq.q}</span>
              <div className={`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 ${openIndex === i ? 'bg-black text-white dark:bg-white dark:text-black rotate-180' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
