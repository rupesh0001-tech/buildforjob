"use client";

import React from "react";
import { CoverLetterState } from "@/lib/store/features/cover-letter-slice";
import { Mail, Phone, MapPin, Link as LinkIcon, Github } from '@/lib/icons';

interface TemplateProps {
  data: CoverLetterState;
}

const ModernTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, date, employerInfo, salutation, body, signOff, mode, manualContent } = data;

  return (
    <div className="w-full min-h-[1123px] bg-white text-gray-900 font-sans flex border-l-32 border-purple-600">
      <div className="flex-1 p-[15mm] flex flex-col">
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-5xl font-black uppercase text-gray-950 tracking-tighter mb-4">
              {personalInfo.fullName?.split(" ")[0]}
              <span className="text-purple-600 block leading-none">{personalInfo.fullName?.split(" ").slice(1).join(" ")}</span>
            </h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest pt-4 border-t-2 border-gray-200">
                {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} className="text-purple-600" />{personalInfo.email}</div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-purple-600" />{personalInfo.phone}</div>}
                {personalInfo.address && <div className="flex items-center gap-2"><MapPin size={14} className="text-purple-600" />{personalInfo.address}</div>}
            </div>
        </div>

        <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
                <p className="text-xs font-black uppercase text-purple-600 tracking-widest mb-2">Attention To:</p>
                <p className="text-lg font-bold text-gray-950 leading-none">{employerInfo.managerName}</p>
                <p className="text-sm font-medium text-gray-500">{employerInfo.teamName}</p>
                <p className="text-sm font-bold text-gray-900">{employerInfo.companyName}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-black uppercase text-purple-600 tracking-widest mb-2">Dated:</p>
                <p className="text-sm font-bold text-gray-950 uppercase">{date}</p>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-950 mb-6 italic">{salutation}</h2>
            <div className="text-[14px] leading-relaxed text-gray-700 text-justify space-y-5">
                {mode === "structured" ? (
                    <>
                        <p>{body.intro}</p>
                        <p>{body.body1}</p>
                        {body.body2 && <p>{body.body2}</p>}
                        {body.body3 && <p>{body.body3}</p>}
                        <p>{body.conclusion}</p>
                    </>
                ) : (
                    <div className="whitespace-pre-line">{manualContent}</div>
                )}
            </div>
        </div>

        {/* Signature */}
        <div className="mt-16 pt-8 border-t-2 border-gray-200 flex justify-between items-end">
            <div>
                <p className="text-xs font-black uppercase text-purple-600 tracking-widest mb-3">{signOff}</p>
                <p className="text-2xl font-black uppercase text-gray-950 tracking-tighter">{personalInfo.fullName}</p>
            </div>
            <div className="flex gap-4">
                {personalInfo.linkedin && <LinkIcon size={20} className="text-gray-400" />}
                {personalInfo.github && <Github size={20} className="text-gray-400" />}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
