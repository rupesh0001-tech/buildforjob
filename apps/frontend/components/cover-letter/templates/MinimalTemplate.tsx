"use client";

import React from "react";
import { CoverLetterState } from "@/lib/store/features/cover-letter-slice";

interface TemplateProps {
  data: CoverLetterState;
}

const MinimalTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, date, employerInfo, salutation, body, signOff, mode, manualContent } = data;

  return (
    <div className="w-full min-h-[1123px] p-[25mm] bg-white text-zinc-950 font-sans tracking-tight">
      {/* Name and Header */}
      <header className="mb-16 border-l-4 border-zinc-950 pl-8">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-x-4 text-[11px] font-bold uppercase text-zinc-500 tracking-widest">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </header>

      {/* Meta Info */}
      <div className="flex justify-between items-end mb-12 border-b border-zinc-300 pb-8">
          <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2 font-mono">Recipient</p>
              <p className="font-black text-lg">{employerInfo.managerName}</p>
              <p className="font-bold text-zinc-500">{employerInfo.companyName}</p>
          </div>
          <div className="text-right">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2 font-mono">Submission</p>
              <p className="font-bold text-purple-600">{date}</p>
          </div>
      </div>

      <main className="mb-12">
          <p className="text-xl font-black mb-8 italic">{salutation}</p>
          <div className="text-[15px] leading-[1.8] text-zinc-700 text-justify space-y-6 lg:max-w-prose">
              {mode === "structured" ? (
                  <div className="space-y-6">
                      <p>{body.intro}</p>
                      <p>{body.body1}</p>
                      {body.body2 && <p>{body.body2}</p>}
                      {body.body3 && <p>{body.body3}</p>}
                      <p>{body.conclusion}</p>
                  </div>
              ) : (
                  <div className="whitespace-pre-line leading-[1.8]">
                      {manualContent}
                  </div>
              )}
          </div>
      </main>

      <footer className="mt-20">
          <p className="font-bold text-zinc-400 mb-2 uppercase tracking-widest text-xs font-mono">{signOff}</p>
          <p className="text-3xl font-black tracking-tighter uppercase">{personalInfo.fullName}</p>
      </footer>
    </div>
  );
};

export default MinimalTemplate;
