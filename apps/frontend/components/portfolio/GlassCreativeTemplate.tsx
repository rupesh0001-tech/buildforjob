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
  Zap,
  MousePointer
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function GlassCreativeTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#A855F7"; // Purple/Violet
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
      className={`min-h-screen bg-[#0A071B] text-[#E0E0E8] pb-24 scroll-smooth overflow-x-hidden relative ${fontClass}`}
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Moving Colorful Mesh Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-600/20 to-purple-600/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/[0.03] backdrop-blur-lg border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
            <span 
              className="w-3.5 h-3.5 rounded-full inline-block animate-pulse shadow-md" 
              style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300 font-medium">
            <a href="#about" className="hover:text-white transition-colors">Aria</a>
            <a href="#tech-stack" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Labs</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            {data.customSections?.map(s => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-white transition-colors">{s.title}</a>
            ))}
            <a href="#contact" className="hover:text-white transition-colors">Connect</a>
          </nav>
          
          {data.personalInfo.isOpenToWork && (
            <div className="text-xs px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-white rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
              Ready to Innovate
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-24">
        {/* 1. Hero Section */}
        <section id="hero" className="flex flex-col md:flex-row items-center gap-12 py-6">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs backdrop-blur-md">
              <Zap size={12} className="text-purple-400" />
              <span className="text-gray-300">Intelligent Agent Platform Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#D8B4FE] to-[#A78BFA]">{data.personalInfo.fullName}</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              {data.personalInfo.jobTitle}
            </h2>
            
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
              {data.personalInfo.tagline}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#contact"
                className="px-6 py-3 rounded-2xl font-bold text-white transition-all text-sm hover:brightness-110 shadow-lg"
                style={{ backgroundColor: accent, boxShadow: `0 4px 20px ${accent}40` }}
              >
                Hire Scientist
              </a>
              {data.personalInfo.resumeUrl && (
                <a 
                  href={data.personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl font-bold bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white transition-all text-sm flex items-center gap-1.5 backdrop-blur-sm"
                >
                  View Profile.pdf <FileText size={16} />
                </a>
              )}
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-4 text-gray-400 pt-4">
              {data.personalInfo.socialLinks.github && (
                <a href={data.personalInfo.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Github size={20} />
                </a>
              )}
              {data.personalInfo.socialLinks.linkedin && (
                <a href={data.personalInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {data.personalInfo.socialLinks.twitter && (
                <a href={data.personalInfo.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full blur-[40px] opacity-25" 
              style={{ backgroundColor: accent }} 
            />
            {data.personalInfo.avatarUrl ? (
              <img 
                src={data.personalInfo.avatarUrl} 
                alt={data.personalInfo.fullName}
                className="w-56 h-56 rounded-full border border-white/[0.08] relative z-10 bg-white/[0.02] backdrop-blur-md object-cover p-3 shadow-2xl"
              />
            ) : (
              <div className="w-56 h-56 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md flex items-center justify-center relative z-10">
                <Code size={48} className="text-gray-500" />
              </div>
            )}
          </div>
        </section>

        {/* 2. About Me */}
        <section id="about" className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-[28px] p-8 md:p-12 space-y-6 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Biography</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Bridging Cognitive Science and Software
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 text-gray-300 text-base leading-relaxed">
              {data.aboutMe.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm tracking-wider uppercase">Vitals</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{data.personalInfo.location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{data.personalInfo.email}</span>
                </li>
                {data.personalInfo.phone && (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
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
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Inventory</span>
            <h2 className="text-3xl font-extrabold text-white">Advanced Tech Stack</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.techStack?.map((cat, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5 hover:border-white/[0.12] transition-all">
                <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-3 border-b border-white/[0.04] pb-2">{cat.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-white/[0.03] text-xs rounded-lg text-gray-300 border border-white/[0.06]"
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
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Research & Labs</span>
            <h2 className="text-3xl font-extrabold text-white">Core AI Systems</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.projects?.map((project) => {
              const isHovered = false;
              return (
                <div 
                  key={project.id}
                  className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl overflow-hidden transition-all flex flex-col h-full shadow-2xl group"
                >
                  <div className="relative h-48 w-full bg-[#1A1A2F] overflow-hidden shrink-0 border-b border-white/[0.06]">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Code size={40} />
                      </div>
                    )}
                    {project.videoUrl && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[9px] font-bold bg-white/10 text-white rounded backdrop-blur-md tracking-wider">
                        LAB MONITOR
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 
                          className="text-lg font-bold text-white transition-colors"
                          style={{ color: isHovered ? accent : undefined }}
                        >
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                              <Github size={18} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {project.features && project.features.length > 0 && (
                        <div className="space-y-1 bg-white/[0.01] p-3 rounded-lg border border-white/[0.04] text-xs text-gray-300">
                          {project.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 text-xs shrink-0">✔</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/[0.04] text-[10px] text-gray-300 rounded border border-white/[0.06]">
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
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Timeline</span>
              <h2 className="text-3xl font-extrabold text-white">Experience & Deployments</h2>
            </div>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              {data.experience.map((exp) => (
                <div key={exp.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-6 hover:border-white/[0.12] transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.04] pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <p className="text-sm font-semibold text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Briefcase size={14} className="text-gray-500" />
                        {exp.company}
                      </p>
                    </div>
                    <span 
                      className="text-xs font-bold px-3 py-1 bg-white/[0.03] rounded-full text-white border border-white/[0.08] h-fit"
                    >
                      {exp.duration}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-300 list-inside">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-purple-400 font-bold shrink-0">·</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/[0.03] text-xs text-gray-300 rounded border border-white/[0.06]">
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
          <section id="education" className="space-y-6 pt-12 border-t border-white/[0.06]">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gray-300">
                <GraduationCap size={20} />
              </span>
              Academic Foundation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5 hover:border-white/[0.12] transition-all space-y-2">
                  <span className="text-xs text-gray-400 font-medium">{edu.duration}</span>
                  <h3 className="font-bold text-white text-base">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-gray-300">{edu.institution}</p>
                  {edu.gpa && (
                    <span 
                      className="inline-block text-[11px] px-2 py-0.5 font-bold rounded bg-purple-500/10 text-purple-300"
                    >
                      Grade: {edu.gpa}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <section id="achievements" className="space-y-6 pt-12 border-t border-white/[0.06]">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gray-300">
                <Award size={20} />
              </span>
              Awards & Citations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-4 items-center">
                  <Sparkles size={18} className="shrink-0" style={{ color: accent }} />
                  <p className="text-sm font-semibold text-gray-200">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Coding Profiles */}
        {data.codingProfiles && data.codingProfiles.length > 0 && (
          <section id="coding-profiles" className="space-y-6 pt-12 border-t border-white/[0.06]">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gray-300">
                <Code size={20} />
              </span>
              Developer Metadata
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.codingProfiles.map((profile, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5 space-y-3 hover:border-white/[0.12] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-white/[0.03] rounded-lg text-gray-300">
                        {getIconForPlatform(profile.platform)}
                      </span>
                      <h3 className="font-bold text-white text-sm">{profile.platform}</h3>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <p className="text-[10px] text-gray-500 font-mono">@{profile.username}</p>
                    {profile.solved && (
                      <p className="flex justify-between">
                        <span>Solved:</span>
                        <span className="font-bold text-white">{profile.solved}</span>
                      </p>
                    )}
                    {profile.rating && (
                      <p className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-bold text-white">{profile.rating}</span>
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
            className="space-y-6 pt-12 border-t border-white/[0.06]"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gray-300 w-8 h-8 flex items-center justify-center">
                ★
              </span>
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-gray-400 max-w-xl">{section.description}</p>
            )}

            {section.layout === 'grid' && (
              <div className="grid md:grid-cols-2 gap-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5 hover:border-white/[0.12] transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500 font-mono">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-gray-400 font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'timeline' && (
              <div className="space-y-4 pl-4 border-l-2 border-white/[0.06]">
                {section.items?.map((item) => (
                  <div key={item.id} className="relative pl-6 space-y-1">
                    <span className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0A071B] border-2 border-white/30" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500 font-mono">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-gray-400 font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'text' && (
              <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-6 space-y-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="space-y-1.5 border-b border-white/[0.04] last:border-0 pb-4 last:pb-0">
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    {item.subtitle && <p className="text-xs text-gray-400 font-bold">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* 9. Contact */}
        <section id="contact" className="space-y-6 pt-12 border-t border-white/[0.06]">
          <div className="grid md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-[28px] p-8 md:p-12 shadow-2xl">
            <div className="space-y-6 self-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Collaboration</span>
              <h2 className="text-3xl font-extrabold text-white">Let's design a futuristic solution.</h2>
              <p className="text-gray-300 leading-relaxed">
                Connect for research queries, system integrations, or development consultancy.
              </p>
              
              <div className="space-y-3.5 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <a href={`mailto:${data.personalInfo.email}`} className="font-bold underline hover:text-white">{data.personalInfo.email}</a>
                </div>
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <span className="font-medium">{data.personalInfo.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="font-medium">{data.personalInfo.location}</span>
                </div>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message Sent! (Form demo execution)");
              }} 
              className="space-y-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Identifier</label>
                <input required type="text" className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="Dr. John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Network Address</label>
                <input required type="email" className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Inquiry Brief</label>
                <textarea required rows={3} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white resize-none" placeholder="Details of project goals..." />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-bold text-white transition-all text-sm hover:brightness-110"
                style={{ backgroundColor: accent }}
              >
                Send Request
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 mt-16 text-center text-xs text-gray-500 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
