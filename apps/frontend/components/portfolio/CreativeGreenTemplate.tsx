"use client";

import React, { useState } from "react";
import { PortfolioData, PortfolioSettings } from "@/lib/portfolio-defaults";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Send, 
  ExternalLink,
  Sparkles,
  User,
  CheckCircle,
  FileCheck
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function CreativeGreenTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#10B981"; // Pastel Green/Sage
  const fontClass = 
    settings.fontFamily === "Fira Code" ? "font-mono" :
    settings.fontFamily === "Space Grotesk" ? "font-sans tracking-tight" :
    settings.fontFamily === "Outfit" ? "font-sans antialiased" : "font-sans";

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'twitter': return <Twitter size={16} />;
      default: return <Code size={16} />;
    }
  };

  return (
    <div 
      className={`min-h-screen bg-[#F4F9F6] text-[#2C3E35] pb-24 scroll-smooth ${fontClass}`}
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Light Sage Green Top Banner */}
      <div className="bg-[#E2EFE7] border-b border-[#D0E2D6] px-6 py-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2 text-[#1E3A2F]">
            <span 
              className="w-3.5 h-3.5 rounded-full inline-block" 
              style={{ backgroundColor: accent }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#465E51]">
            <a href="#about" className="hover:text-[#1E3A2F] transition-colors">About Us</a>
            <a href="#tech-stack" className="hover:text-[#1E3A2F] transition-colors">Expertise</a>
            <a href="#projects" className="hover:text-[#1E3A2F] transition-colors">Projects</a>
            <a href="#experience" className="hover:text-[#1E3A2F] transition-colors">Career Path</a>
            {data.customSections?.map(s => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-[#1E3A2F] transition-colors">{s.title}</a>
            ))}
            <a href="#contact" className="hover:text-[#1E3A2F] transition-colors">Contact</a>
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-24">
        {/* 1. Hero Section */}
        <section id="hero" className="grid md:grid-cols-12 gap-8 items-center py-6">
          <div className="md:col-span-7 space-y-6">
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#D0E2D6]"
              style={{ color: accent }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              {data.personalInfo.isOpenToWork ? "Open to Work & Freelance" : "Developer Portfolio"}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A2F] tracking-tight leading-[1.05]">
              {data.personalInfo.tagline}
            </h1>
            
            <p className="text-[#465E51] text-lg leading-relaxed max-w-xl">
              {data.personalInfo.bio}
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="#contact"
                className="px-6 py-3 rounded-2xl font-bold text-white shadow-md hover:translate-y-[-1px] active:translate-y-0 transition-all text-sm"
                style={{ backgroundColor: accent }}
              >
                Hire Me
              </a>
              {data.personalInfo.resumeUrl && (
                <a 
                  href={data.personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl font-bold bg-white hover:bg-gray-50 border border-[#C5DCD0] text-[#1E3A2F] shadow-sm transition-all text-sm flex items-center gap-1.5"
                >
                  Download Resume <FileText size={16} />
                </a>
              )}
            </div>

            {/* Social handles */}
            <div className="flex items-center gap-4 text-[#465E51] pt-4">
              {data.personalInfo.socialLinks.github && (
                <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-[#1E3A2F] transition-colors">
                  <Github size={20} />
                </a>
              )}
              {data.personalInfo.socialLinks.linkedin && (
                <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#1E3A2F] transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {data.personalInfo.socialLinks.twitter && (
                <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-[#1E3A2F] transition-colors">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#E2EFE7] to-white border border-[#C5DCD0] -rotate-3 z-0" />
            <div className="relative z-10 w-full max-w-[320px] bg-white border border-[#C5DCD0] rounded-[40px] p-4 shadow-xl">
              {data.personalInfo.avatarUrl ? (
                <img 
                  src={data.personalInfo.avatarUrl} 
                  alt={data.personalInfo.fullName}
                  className="w-full h-auto aspect-square rounded-[30px] object-cover bg-[#F0F5F2]"
                />
              ) : (
                <div className="w-full aspect-square rounded-[30px] bg-[#F0F5F2] flex items-center justify-center">
                  <User size={64} className="text-[#A2C0B0]" />
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="font-bold text-[#1E3A2F] text-lg">{data.personalInfo.fullName}</h3>
                <p className="text-xs text-[#5D7A6B] font-medium mt-0.5">{data.personalInfo.jobTitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. About Me */}
        <section id="about" className="bg-white border border-[#C5DCD0] rounded-[32px] p-8 md:p-12 space-y-6 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D7A6B]">About Me</span>
          <h2 className="text-3xl font-extrabold text-[#1E3A2F] mt-1">
            Let's build something remarkable
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 text-[#465E51] text-base leading-relaxed">
              {data.aboutMe.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="bg-[#F4F9F6] border border-[#C5DCD0] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-[#1E3A2F] text-sm tracking-wider uppercase">Contact Info</h3>
              <ul className="space-y-3 text-sm text-[#465E51]">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#88A696]" />
                  <span>{data.personalInfo.location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-[#88A696]" />
                  <span>{data.personalInfo.email}</span>
                </li>
                {data.personalInfo.phone && (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-[#88A696]" />
                    <span>{data.personalInfo.phone}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Tech Stack */}
        <section id="tech-stack" className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D7A6B]">Expertise</span>
            <h2 className="text-3xl font-extrabold text-[#1E3A2F]">Tech Stack & Core Tools</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.techStack?.map((cat, idx) => (
              <div key={idx} className="bg-white border border-[#C5DCD0] rounded-2xl p-5 hover:shadow-md transition-all">
                <h3 className="font-bold text-[#1E3A2F] text-sm tracking-wider uppercase mb-3 border-b border-[#EDF4F0] pb-2">{cat.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-[#F4F9F6] text-xs font-bold rounded-lg text-[#374E41] border border-[#C5DCD0]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Featured Projects */}
        <section id="projects" className="space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D7A6B]">My Works</span>
            <h2 className="text-3xl font-extrabold text-[#1E3A2F]">Featured Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.projects?.map((project) => {
              const isHovered = false;
              return (
                <div 
                  key={project.id}
                  className="bg-white border border-[#C5DCD0] rounded-[28px] overflow-hidden flex flex-col h-full group"
                >
                  <div className="relative h-52 w-full bg-[#E2EFE7] overflow-hidden shrink-0 border-b border-[#C5DCD0]">
                    {isHovered && project.videoUrl ? (
                      <video 
                        src={project.videoUrl}
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                    ) : project.imageUrl ? (
                      <img 
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A2C0B0]">
                        <Code size={40} />
                      </div>
                    )}
                    {project.videoUrl && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[9px] font-extrabold bg-[#1E3A2F] text-white rounded-md tracking-wider">
                        PREVIEW VIDEO
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 
                          className="text-lg font-extrabold text-[#1E3A2F] transition-colors"
                          style={{ color: isHovered ? accent : undefined }}
                        >
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[#5D7A6B] hover:text-[#1E3A2F] transition-colors">
                              <Github size={18} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[#5D7A6B] hover:text-[#1E3A2F] transition-colors">
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-[#465E51] leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {project.features && project.features.length > 0 && (
                        <div className="space-y-1 bg-[#F4F9F6] p-3.5 rounded-xl border border-[#EDF4F0] text-xs text-[#374E41]">
                          {project.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-emerald-600 text-xs shrink-0">✔</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#EDF4F0] text-[10px] font-bold text-[#374E41] rounded border border-[#C5DCD0]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Experience */}
        {data.experience && data.experience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D7A6B]">Career Path</span>
              <h2 className="text-3xl font-extrabold text-[#1E3A2F]">Professional Experience</h2>
            </div>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              {data.experience.map((exp) => (
                <div key={exp.id} className="bg-white border border-[#C5DCD0] rounded-2xl p-6 hover:shadow-sm transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#EDF4F0] pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#1E3A2F]">{exp.role}</h3>
                      <p className="text-sm font-bold text-[#5D7A6B] flex items-center gap-1.5 mt-0.5">
                        <Briefcase size={14} className="text-[#88A696]" />
                        {exp.company}
                      </p>
                    </div>
                    <span 
                      className="text-xs font-extrabold px-3 py-1 bg-[#F4F9F6] rounded-full text-emerald-800 border border-[#C5DCD0] h-fit"
                      style={{ color: accent, borderColor: `${accent}33` }}
                    >
                      {exp.duration}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-[#465E51] list-inside">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-emerald-500 font-bold shrink-0">›</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#F4F9F6] text-xs font-bold text-[#374E41] rounded border border-[#C5DCD0]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Education */}
        {data.education && data.education.length > 0 && (
          <section id="education" className="space-y-6 pt-12 border-t border-[#C5DCD0]">
            <h2 className="text-2xl font-extrabold text-[#1E3A2F] flex items-center gap-2">
              <span className="p-2 bg-[#E2EFE7] rounded-xl text-[#374E41]">
                <GraduationCap size={20} />
              </span>
              Education History
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-white border border-[#C5DCD0] rounded-2xl p-5 hover:shadow-sm transition-all space-y-2">
                  <span className="text-xs text-gray-500 font-medium">{edu.duration}</span>
                  <h3 className="font-extrabold text-[#1E3A2F] text-base">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-[#465E51]">{edu.institution}</p>
                  {edu.gpa && (
                    <span 
                      className="inline-block text-[11px] px-2 py-0.5 font-bold rounded-md bg-[#EDF4F0]"
                      style={{ color: accent }}
                    >
                      Score: {edu.gpa}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <section id="achievements" className="space-y-6 pt-12 border-t border-[#C5DCD0]">
            <h2 className="text-2xl font-extrabold text-[#1E3A2F] flex items-center gap-2">
              <span className="p-2 bg-[#E2EFE7] rounded-xl text-[#374E41]">
                <Award size={20} />
              </span>
              Key Milestones
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 bg-white border border-[#C5DCD0] rounded-2xl p-4 items-center">
                  <CheckCircle size={18} className="shrink-0" style={{ color: accent }} />
                  <p className="text-sm font-bold text-[#374E41]">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Coding Profiles */}
        {data.codingProfiles && data.codingProfiles.length > 0 && (
          <section id="coding-profiles" className="space-y-6 pt-12 border-t border-[#C5DCD0]">
            <h2 className="text-2xl font-extrabold text-[#1E3A2F] flex items-center gap-2">
              <span className="p-2 bg-[#E2EFE7] rounded-xl text-[#374E41]">
                <Code size={20} />
              </span>
              Coding Benchmarks
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.codingProfiles.map((profile, i) => (
                <div key={i} className="bg-white border border-[#C5DCD0] rounded-2xl p-5 space-y-3 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-[#F4F9F6] rounded-lg text-[#374E41]">
                        {getIconForPlatform(profile.platform)}
                      </span>
                      <h3 className="font-extrabold text-[#1E3A2F] text-sm">{profile.platform}</h3>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#465E51]">
                    <p className="text-[10px] text-gray-500 font-mono">@{profile.username}</p>
                    {profile.solved && (
                      <p className="flex justify-between">
                        <span>Solved:</span>
                        <span className="font-extrabold text-[#1E3A2F]">{profile.solved}</span>
                      </p>
                    )}
                    {profile.rating && (
                      <p className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-extrabold text-[#1E3A2F]">{profile.rating}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Custom Sections */}
        {data.customSections?.map((section) => (
          <section 
            key={section.id} 
            id={section.id} 
            className="space-y-6 pt-12 border-t border-[#C5DCD0]"
          >
            <h2 className="text-2xl font-extrabold text-[#1E3A2F] flex items-center gap-2">
              <span className="p-2 bg-[#E2EFE7] rounded-xl text-[#374E41] w-8 h-8 flex items-center justify-center">
                ★
              </span>
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-[#5D7A6B] max-w-xl">{section.description}</p>
            )}

            {section.layout === 'grid' && (
              <div className="grid md:grid-cols-2 gap-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="bg-white border border-[#C5DCD0] rounded-2xl p-5 hover:shadow-sm transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#1E3A2F]">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500 font-mono">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-[#5D7A6B] font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-[#465E51] leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'timeline' && (
              <div className="space-y-4 pl-4 border-l-2 border-[#C5DCD0]">
                {section.items?.map((item) => (
                  <div key={item.id} className="relative pl-6 space-y-1">
                    <span className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#5D7A6B]" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#1E3A2F]">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500 font-mono">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-[#5D7A6B] font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-[#465E51] leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'text' && (
              <div className="bg-white border border-[#C5DCD0] rounded-2xl p-6 space-y-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="space-y-1.5 border-b border-[#EDF4F0] last:border-0 pb-4 last:pb-0">
                    <h3 className="font-extrabold text-[#1E3A2F] text-base">{item.title}</h3>
                    {item.subtitle && <p className="text-xs text-[#5D7A6B] font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-[#465E51] leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* 9. Contact */}
        <section id="contact" className="space-y-6 pt-12 border-t border-[#C5DCD0]">
          <div className="grid md:grid-cols-2 gap-8 bg-white border border-[#C5DCD0] rounded-[32px] p-8 md:p-12 shadow-sm">
            <div className="space-y-6 self-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D7A6B]">Inquiries</span>
              <h2 className="text-3xl font-extrabold text-[#1E3A2F]">Let's build a software solution together.</h2>
              <p className="text-[#465E51] leading-relaxed">
                Contact me directly using the information or submit the form, and I will get back to you with custom estimates.
              </p>
              
              <div className="space-y-3.5 text-sm text-[#374E41]">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#88A696]" />
                  <a href={`mailto:${data.personalInfo.email}`} className="font-bold underline">{data.personalInfo.email}</a>
                </div>
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#88A696]" />
                    <span className="font-medium">{data.personalInfo.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#88A696]" />
                  <span className="font-medium">{data.personalInfo.location}</span>
                </div>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message Sent! (Form demo execution)");
              }} 
              className="space-y-4 bg-[#F4F9F6] border border-[#C5DCD0] rounded-2xl p-6"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374E41]">Your Name</label>
                <input required type="text" className="w-full bg-white border border-[#C5DCD0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-[#1E3A2F]" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374E41]">Email Address</label>
                <input required type="email" className="w-full bg-white border border-[#C5DCD0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-[#1E3A2F]" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374E41]">Project Brief</label>
                <textarea required rows={3} className="w-full bg-white border border-[#C5DCD0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-[#1E3A2F] resize-none" placeholder="We need to build a React dashboard..." />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-bold text-white transition-all text-sm hover:brightness-105"
                style={{ backgroundColor: accent }}
              >
                Send Brief
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 mt-16 text-center text-xs text-[#5D7A6B] flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
