"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from '@/lib/icons';
import { TemplateProps } from "@/types/resume";

const ImpactTemplate = ({ data, accentColor }: TemplateProps) => {
  const { personal_info, professional_summary, experience, education, project, skills } = data;

  return (
    <div className="bg-white text-gray-900 font-sans flex h-full">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-950 text-white p-8 flex flex-col gap-8">
        {personal_info.image && (
          <img 
            src={personal_info.image} 
            alt={personal_info.full_name} 
            className="w-32 h-32 rounded-2xl object-cover border-4 border-white/10 mx-auto"
          />
        )}
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-white/20 pb-2 uppercase tracking-widest text-purple-400">Contact</h2>
          <div className="space-y-3 text-sm text-gray-300">
            {personal_info.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <a href={`mailto:${personal_info.email}`} className="hover:underline hover:text-white">
                  {personal_info.email}
                </a>
              </div>
            )}
            {personal_info.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <a href={`tel:${personal_info.phone}`} className="hover:underline hover:text-white">
                  {personal_info.phone}
                </a>
              </div>
            )}
            {personal_info.location && (
              <div className="flex items-center gap-3">
                <MapPin size={16} />
                <span>{personal_info.location}</span>
              </div>
            )}
            {personal_info.linkedin && (
              <div className="flex items-center gap-3">
                <Linkedin size={16} />
                <a
                  href={personal_info.linkedin.startsWith("http") ? personal_info.linkedin : `https://${personal_info.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white break-all"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {personal_info.website && (
              <div className="flex items-center gap-3">
                <Globe size={16} />
                <a
                  href={personal_info.website.startsWith("http") ? personal_info.website : `https://${personal_info.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white break-all"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>

        {data.sectionVisibility.skills && skills && skills.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-white/20 pb-2 uppercase tracking-widest text-purple-400">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-white/10 px-3 py-1 rounded-md text-xs capitalize">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {data.sectionVisibility.education && education && education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-white/20 pb-2 uppercase tracking-widest text-purple-400">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-bold text-sm tracking-tight">{edu.degree}</p>
                <p className="text-xs text-gray-400">{edu.institution}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                  <span>{edu.graduation_date}</span>
                  {edu.gpa && <span>{edu.graduationType === "cgpa" ? "GPA" : "%"}: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-50 uppercase-none">
        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase text-gray-900 tracking-tighter mb-2">
            {personal_info.full_name?.split(" ")[0]}
            <span className="text-purple-600 block">{personal_info.full_name?.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="text-lg font-medium text-gray-500 uppercase tracking-[0.2em]">{personal_info.profession}</p>
        </div>

        {data.sectionVisibility.summary && professional_summary && (
          <div className="mb-10">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">About Me</h2>
             <p className="text-gray-600 italic leading-relaxed normal-case whitespace-pre-line">{professional_summary}</p>
          </div>
        )}

        {data.sectionVisibility.experience && experience && experience.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-xl font-bold text-gray-900 normal-case">{exp.position}</h3>
                    <span className="text-xs font-bold text-gray-400">{exp.startDate} - {exp.is_current ? "Present" : exp.endDate}</span>
                  </div>
                  <p className="font-bold text-purple-600 mb-3 uppercase tracking-wider text-xs">{exp.company}</p>
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed normal-case">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.sectionVisibility.projects && project && project.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Recent Work</h2>
            <div className="grid grid-cols-1 gap-6">
              {project.map((proj, idx) => (
                <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 normal-case">{proj.name}</h3>
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{proj.techStack}</span>
                  </div>
                  <p className="text-sm text-gray-600 normal-case">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactTemplate;
