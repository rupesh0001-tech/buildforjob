"use client";

import React from "react";
import { CoverLetterState } from "@/lib/store/features/cover-letter-slice";

interface TemplateProps {
  data: CoverLetterState;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, date, employerInfo, salutation, body, signOff, mode, manualContent } = data;

  return (
    <div className="w-full min-h-[1123px] p-[20mm] bg-white text-gray-900 font-serif leading-relaxed">
      {/* Header / Personal Info */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] mb-2">
          {personalInfo.fullName}
        </h1>
        <div className="text-[11px] text-gray-500 flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 uppercase font-medium tracking-wider">
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.phone && (
            <>
              {personalInfo.address && <span className="text-gray-300">•</span>}
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.email && (
            <>
              {(personalInfo.address || personalInfo.phone) && <span className="text-gray-300">•</span>}
              <span className="normal-case">{personalInfo.email}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              {(personalInfo.address || personalInfo.phone || personalInfo.email) && <span className="text-gray-300">•</span>}
              <span className="normal-case">{personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "")}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              {(personalInfo.address || personalInfo.phone || personalInfo.email || personalInfo.linkedin) && <span className="text-gray-300">•</span>}
              <span className="normal-case">{personalInfo.github.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "")}</span>
            </>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mb-8 text-[15px] font-medium">
        {date}
      </div>

      {/* Employer Info */}
      <div className="mb-8 text-[15px] space-y-1">
        <p className="font-bold text-lg">{employerInfo.managerName}</p>
        <p className="text-gray-600">{employerInfo.teamName}</p>
        <p className="font-bold text-purple-600">{employerInfo.companyName}</p>
      </div>

      {/* Salutation */}
      <div className="mb-6 text-[16px] font-bold">
        {salutation}
      </div>

      {/* Body */}
      <div className="text-[15px] text-justify leading-relaxed">
        {mode === "structured" ? (
          <div className="space-y-5">
            <p>{body.intro}</p>
            <p>{body.body1}</p>
            {body.body2 && <p>{body.body2}</p>}
            {body.body3 && <p>{body.body3}</p>}
            <p>{body.conclusion}</p>
          </div>
        ) : (
          <div className="whitespace-pre-line">
            {manualContent}
          </div>
        )}
      </div>

      {/* Closing */}
      <div className="mt-12 text-[15px]">
        <p className="mb-10 font-bold">{signOff}</p>
        
      </div>
    </div>
  );
};

export default ClassicTemplate;
