"use client";

import React from "react";
import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}

const ProfessionalTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  return (
    <div className="bg-white text-[#111] font-serif p-[0.75in] leading-relaxed text-sm">
      {/* Header */}
      <div className="flex justify-between items-start border-b-0 pb-1 mb-2">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-black">
            {personal_info.full_name || "Your Name"}
          </h1>
          {personal_info.website && (
            <p className="text-blue-700 hover:underline text-xs mt-1">
              <a
                href={personal_info.website.startsWith("http") ? personal_info.website : `https://${personal_info.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {personal_info.website}
              </a>
            </p>
          )}
        </div>
        <div className="text-right text-xs text-gray-700">
          {personal_info.email && (
            <p>
              Email:{" "}
              <a href={`mailto:${personal_info.email}`} className="text-blue-700 hover:underline">
                {personal_info.email}
              </a>
            </p>
          )}
          {personal_info.phone && (
            <p>
              Mobile:{" "}
              <a href={`tel:${personal_info.phone}`} className="text-blue-700 hover:underline">
                {personal_info.phone}
              </a>
            </p>
          )}
          {personal_info.location && <p>{personal_info.location}</p>}
          {personal_info.linkedin && (
            <p>
              LinkedIn:{" "}
              <a
                href={personal_info.linkedin.startsWith("http") ? personal_info.linkedin : `https://${personal_info.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                {personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.sectionVisibility.summary && professional_summary && (
        <div className="mt-4">
          <h2 className="uppercase font-bold border-b border-gray-400 text-base mb-2 tracking-widest">Summary</h2>
          <p className="text-[13px] text-gray-700 whitespace-pre-line">{professional_summary}</p>
        </div>
      )}

      {/* Education */}
      {data.sectionVisibility.education && education && education.length > 0 && (
        <div className="mt-4">
          <h2 className="uppercase font-bold border-b border-gray-400 text-base mb-2 tracking-widest">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3 text-[13px]">
              <div className="flex justify-between font-bold">
                <span>● {edu.institution}</span>
              </div>
              <div className="flex justify-between italic">
                <span>{edu.degree}{edu.field ? `, ${edu.field}` : ""} {edu.gpa ? `; ${edu.graduationType === "cgpa" ? "GPA" : "Percentage"}: ${edu.gpa}` : ""}</span>
                <span>{edu.graduation_date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.sectionVisibility.experience && experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="uppercase font-bold border-b border-gray-400 text-base mb-2 tracking-widest">Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between font-bold text-[13px]">
                <span>● {exp.company}</span>
              </div>
              <div className="flex justify-between italic text-[13px] mb-1">
                <span>{exp.position}</span>
                <span>{exp.startDate} – {exp.is_current ? "Present" : exp.endDate}</span>
              </div>
              <ul className="list-none pl-4 space-y-1 text-[13px]">
                {exp.description.split('\n').filter(l => l.trim()).map((line, lIdx) => (
                  <li key={lIdx} className="relative before:content-['○'] before:absolute before:-left-4 before:text-[10px] before:top-0.5">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.sectionVisibility.projects && project && project.length > 0 && (
        <div className="mt-4">
          <h2 className="uppercase font-bold border-b border-gray-400 text-base mb-2 tracking-widest">Projects</h2>
          <ul className="list-none pl-4 space-y-1 text-[13px]">
            {project.map((proj, idx) => (
              <li key={idx} className="relative before:content-['●'] before:absolute before:-left-4 before:text-[10px] before:top-0.5">
                <span className="font-bold">{proj.name}:</span> {proj.techStack} - {proj.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {data.sectionVisibility.skills && skills && skills.length > 0 && (
        <div className="mt-4">
          <h2 className="uppercase font-bold border-b border-gray-400 text-base mb-2 tracking-widest">Skills</h2>
          <div className="text-[13px] leading-6">
            {skills.map((skill, idx) => (
              <span key={idx} className="capitalize">{skill}{idx < skills.length - 1 ? ", " : ""}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
