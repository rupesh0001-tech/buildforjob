"use client";

import React, { useState, useEffect } from "react";
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
  Terminal,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function RetroTerminalTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#22C55E"; // Terminal Green
  const [blink, setBlink] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(b => !b);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      case 'twitter': return <Twitter size={14} />;
      default: return <Code size={14} />;
    }
  };

  const fontClass = 
    settings.fontFamily === "Fira Code" ? "font-mono" :
    settings.fontFamily === "Space Grotesk" ? "font-sans tracking-tight" :
    settings.fontFamily === "Outfit" ? "font-sans antialiased" : "font-sans";

  return (
    <div 
      className={`min-h-screen bg-[#080E08] text-[#22C55E] pb-24 p-6 relative overflow-hidden select-none selection:bg-[#22C55E]/30 selection:text-[#22C55E] scroll-smooth ${fontClass}`}
      style={{ color: accent, fontFamily: settings.fontFamily }}
    >
      {/* CRT Scanline Overlay Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(to_right,rgba(255,0,0,0.06)+33%,rgba(0,255,0,0.02)+33%,rgba(0,0,255,0.06)+66%)] bg-[size:100%_4px,6px_100%] pointer-events-none z-50 opacity-15" />
      
      {/* Terminal Window Frame */}
      <div className="max-w-4xl mx-auto border-2 rounded-lg bg-[#080E08]/95 overflow-hidden shadow-2xl relative z-10" style={{ borderColor: accent }}>
        
        {/* Terminal Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between text-xs" style={{ borderColor: accent, backgroundColor: `${accent}0D` }}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 opacity-80 flex items-center gap-1">
              <Terminal size={12} />
              guest@localhost:~
            </span>
          </div>
          <span className="opacity-60 text-[10px]">BAUD: 9600 | TERM: VT100</span>
        </div>

        {/* Console Content */}
        <div className="p-6 md:p-8 space-y-12">
          
          {/* Header Command */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-sm md:text-base opacity-90">
              <span className="text-[#FBBF24]">$</span>
              <span>neofetch --user {data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
            
            <div className="grid md:grid-cols-12 gap-6 p-4 border border-dashed rounded-lg" style={{ borderColor: `${accent}33` }}>
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border-r border-dashed" style={{ borderColor: `${accent}33` }}>
                {data.personalInfo.avatarUrl ? (
                  <img 
                    src={data.personalInfo.avatarUrl} 
                    alt="avatar" 
                    className="w-32 h-32 rounded-lg border object-cover bg-black"
                    style={{ borderColor: accent }}
                  />
                ) : (
                  <div className="w-32 h-32 border rounded-lg flex items-center justify-center bg-black" style={{ borderColor: accent }}>
                    <Code size={40} />
                  </div>
                )}
                {data.personalInfo.isOpenToWork && (
                  <span className="text-[10px] mt-3 animate-pulse border px-2 py-0.5 rounded uppercase" style={{ color: '#10B981', borderColor: '#10B981' }}>
                    [ STATUS: ACTIVE_HIRE ]
                  </span>
                )}
              </div>

              <div className="md:col-span-8 space-y-2 text-xs md:text-sm">
                <p className="font-bold text-white text-lg">{data.personalInfo.fullName}</p>
                <p><span className="opacity-60">ROLE:</span> {data.personalInfo.jobTitle}</p>
                <p><span className="opacity-60">LOC :</span> {data.personalInfo.location}</p>
                <p><span className="opacity-60">EML :</span> {data.personalInfo.email}</p>
                {data.personalInfo.phone && <p><span className="opacity-60">TEL :</span> {data.personalInfo.phone}</p>}
                <p className="leading-relaxed pt-2 border-t border-dashed" style={{ borderColor: `${accent}22` }}>
                  {data.personalInfo.tagline}
                </p>
                
                <div className="flex flex-wrap gap-3 pt-3">
                  <a href="#contact" className="hover:bg-white/10 border px-3 py-1 text-xs rounded transition-all">
                    [ Contact ]
                  </a>
                  {data.personalInfo.resumeUrl && (
                    <a href={data.personalInfo.resumeUrl} target="_blank" rel="noreferrer" className="hover:bg-white/10 border px-3 py-1 text-xs rounded transition-all">
                      [ Resume.txt ]
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. About Me */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm opacity-90">
              <span className="text-[#FBBF24]">$</span>
              <span>cat about_me.md</span>
            </div>
            <div className="p-4 bg-black/40 border rounded-lg space-y-4 text-xs md:text-sm leading-relaxed" style={{ borderColor: `${accent}33` }}>
              {data.aboutMe.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-300">{p}</p>
              ))}
            </div>
          </div>

          {/* 3. Tech Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm opacity-90">
              <span className="text-[#FBBF24]">$</span>
              <span>query_sys_capabilities --all</span>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.techStack?.map((cat, idx) => (
                <div key={idx} className="border rounded-lg p-3.5 space-y-2.5 text-xs bg-black/20" style={{ borderColor: `${accent}22` }}>
                  <h3 className="font-bold border-b pb-1 uppercase tracking-wider text-white" style={{ borderColor: `${accent}22` }}>
                    &gt; {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item, i) => (
                      <span key={i} className="px-1.5 py-0.5 border text-[11px] rounded bg-black/60" style={{ borderColor: `${accent}44` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-sm opacity-90">
              <span className="text-[#FBBF24]">$</span>
              <span>list_projects --featured</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {data.projects?.map((project) => {
                const isHovered = false;
                return (
                  <div 
                    key={project.id}
                    className="border rounded-lg bg-black/20 overflow-hidden transition-all flex flex-col justify-between"
                    style={{ borderColor: `${accent}33` }}
                  >
                    <div className="h-40 w-full relative bg-black/60 border-b flex items-center justify-center" style={{ borderColor: `${accent}33` }}>
                      {isHovered && project.videoUrl ? (
                        <video 
                          src={project.videoUrl}
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <Code size={36} className="opacity-40 animate-pulse" />
                      )}
                      {project.videoUrl && (
                        <span className="absolute bottom-2 right-2 text-[9px] border px-1 rounded bg-black text-xs" style={{ borderColor: accent }}>
                          [ STREAM ]
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-sm">{project.name}</h3>
                          <div className="flex items-center gap-2">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                                <Github size={16} />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-400 line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-dashed" style={{ borderColor: `${accent}22` }}>
                        {project.features && project.features.length > 0 && (
                          <div className="text-[10px] space-y-0.5 text-gray-300">
                            {project.features.slice(0, 3).map((feat, i) => (
                              <p key={i} className="flex gap-1.5 items-center">
                                <span>*</span>
                                <span className="line-clamp-1">{feat}</span>
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech, i) => (
                            <span key={i} className="text-[9px] border px-1 py-0.2 rounded bg-black/60" style={{ borderColor: `${accent}22` }}>
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
          </div>

          {/* 5. Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <span className="text-[#FBBF24]">$</span>
                <span>cat history/experience.log</span>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-3 bg-black/30" style={{ borderColor: `${accent}33` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-dashed pb-2" style={{ borderColor: `${accent}22` }}>
                      <div>
                        <h3 className="font-bold text-white text-sm">{exp.role}</h3>
                        <p className="text-xs opacity-75">&gt; {exp.company}</p>
                      </div>
                      <span className="text-[11px] opacity-60">[{exp.duration}]</span>
                    </div>

                    <ul className="text-xs space-y-1 text-gray-300 list-inside">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="shrink-0">-</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="opacity-50">STACK:</span>
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="border px-1 rounded bg-black/60" style={{ borderColor: `${accent}22` }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Education */}
          {data.education && data.education.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <span className="text-[#FBBF24]">$</span>
                <span>cat academic_record.txt</span>
              </div>
              <div className="p-4 border rounded-lg space-y-4 bg-black/20 text-xs md:text-sm" style={{ borderColor: `${accent}33` }}>
                {data.education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <p className="text-white font-bold">{edu.degree} in {edu.field}</p>
                    <p className="opacity-80">{edu.institution} | {edu.duration}</p>
                    {edu.gpa && <p className="text-[#FBBF24]">Score: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <span className="text-[#FBBF24]">$</span>
                <span>cat milestones.txt</span>
              </div>
              <div className="p-4 border rounded-lg space-y-2 bg-black/10 text-xs md:text-sm" style={{ borderColor: `${accent}33` }}>
                {data.achievements.map((ach, idx) => (
                  <p key={idx} className="flex gap-2">
                    <span>*</span>
                    <span>{ach}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 8. Coding Profiles */}
          {data.codingProfiles && data.codingProfiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <span className="text-[#FBBF24]">$</span>
                <span>fetch_coding_ratings</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.codingProfiles.map((profile, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2.5 bg-black/40 text-xs" style={{ borderColor: `${accent}22` }}>
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      {getIconForPlatform(profile.platform)}
                      <span>{profile.platform}</span>
                    </div>
                    <p className="text-[10px] opacity-60">ID: @{profile.username}</p>
                    {profile.solved && <p><span className="opacity-60">SOLVED:</span> {profile.solved}</p>}
                    {profile.rating && <p><span className="opacity-60">RATING:</span> {profile.rating}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Custom Sections */}
          {data.customSections?.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center gap-1 text-sm opacity-90">
                <span className="text-[#FBBF24]">$</span>
                <span>run print_{section.id}.sh</span>
              </div>
              
              <div className="p-4 border rounded-lg space-y-4 bg-black/20" style={{ borderColor: `${accent}33` }}>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider">{section.title}</h3>
                  {section.description && <p className="text-xs opacity-75 mt-1">{section.description}</p>}
                </div>

                <div className="space-y-3.5 pt-2">
                  {section.items?.map((item) => (
                    <div key={item.id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">&gt; {item.title}</span>
                        {item.meta && <span className="opacity-60">{item.meta}</span>}
                      </div>
                      {item.subtitle && <p className="opacity-75">{item.subtitle}</p>}
                      {item.description && <p className="text-gray-300 pl-4">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 9. Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm opacity-90">
              <span className="text-[#FBBF24]">$</span>
              <span>initialize_secure_comms</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-lg bg-black/10" style={{ borderColor: `${accent}33` }}>
              <div className="space-y-4 text-xs md:text-sm self-center">
                <p>Establishing communication parameters...</p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><Mail size={14} /> {data.personalInfo.email}</p>
                  {data.personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14} /> {data.personalInfo.phone}</p>}
                  <p className="flex items-center gap-2"><MapPin size={14} /> {data.personalInfo.location}</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message Sent! (Form demo execution)");
                }} 
                className="space-y-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="opacity-60">SENDER_EMAIL:</label>
                  <input required type="email" className="w-full bg-black border rounded px-3 py-1.5 text-xs focus:outline-none text-[#22C55E]" style={{ borderColor: `${accent}66` }} placeholder="you@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="opacity-60">MESSAGE_PAYLOAD:</label>
                  <textarea required rows={3} className="w-full bg-black border rounded px-3 py-1.5 text-xs focus:outline-none text-[#22C55E] resize-none" style={{ borderColor: `${accent}66` }} placeholder="Write transmission here..." />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2 border rounded font-bold hover:bg-white/10 transition-all"
                  style={{ borderColor: accent }}
                >
                  [ TRANSMIT ]
                </button>
              </form>
            </div>
          </div>

          {/* Prompt at bottom */}
          <div className="flex items-center gap-1 text-sm md:text-base">
            <span className="text-[#FBBF24]">$</span>
            <span className="text-white">_</span>
            {blink && <span className="w-2.5 h-4 inline-block align-middle" style={{ backgroundColor: accent }} />}
          </div>

        </div>
      </div>
    </div>
  );
}
