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
  Download, 
  Send, 
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function SleekDarkTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#3B82F6";
  const fontClass = 
    settings.fontFamily === "Fira Code" ? "font-mono" :
    settings.fontFamily === "Space Grotesk" ? "font-sans tracking-tight" :
    settings.fontFamily === "Outfit" ? "font-sans antialiased" : "font-sans";

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Helper for render categories
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
      className={`min-h-screen bg-[#0B0B0F] text-[#F3F4F6] pb-24 scroll-smooth ${fontClass}`}
      style={{ fontFamily: settings.fontFamily }}
    >
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B0B0F]/70 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ backgroundColor: accent }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#tech-stack" className="hover:text-white transition-colors">Stack</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            {data.customSections?.map(s => (
              <a key={s.id} href={`#${s.id}`} className="hover:text-white transition-colors">{s.title}</a>
            ))}
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          {data.personalInfo.isOpenToWork && (
            <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Available for Hire
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-24">
        {/* 1. Hero Section */}
        <section id="hero" className="flex flex-col md:flex-row items-center gap-12 py-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <Sparkles size={12} className="text-amber-400 animate-spin" />
              <span>Full-Stack Developer Portfolio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">{data.personalInfo.fullName}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300" style={{ color: hoveredProject ? accent : undefined }}>
              {data.personalInfo.jobTitle}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              {data.personalInfo.tagline}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#contact"
                className="px-6 py-3 rounded-xl font-medium text-white transition-all flex items-center gap-2 hover:brightness-110 shadow-lg"
                style={{ backgroundColor: accent, boxShadow: `0 4px 20px ${accent}33` }}
              >
                Get In Touch <Send size={16} />
              </a>
              {data.personalInfo.resumeUrl && (
                <a 
                  href={data.personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-2"
                >
                  View Resume <FileText size={16} />
                </a>
              )}
            </div>

            {/* Social profiles */}
            <div className="flex items-center gap-4 pt-4 text-gray-400">
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
              {data.personalInfo.socialLinks.portfolioUrl && (
                <a href={data.personalInfo.socialLinks.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  <Globe size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-[30px] opacity-30" style={{ backgroundColor: accent }} />
            {data.personalInfo.avatarUrl ? (
              <img 
                src={data.personalInfo.avatarUrl} 
                alt={data.personalInfo.fullName}
                className="w-56 h-56 rounded-full border-2 border-white/10 relative z-10 bg-[#161622] object-cover p-2 shadow-2xl"
              />
            ) : (
              <div className="w-56 h-56 rounded-full border border-white/10 bg-[#161622] flex items-center justify-center relative z-10">
                <Code size={48} className="text-gray-600" />
              </div>
            )}
          </div>
        </section>

        {/* 2. About Me */}
        <section id="about" className="space-y-6 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
            About Me
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 text-gray-400 text-base leading-relaxed">
              {data.aboutMe.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-white">Details</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{data.personalInfo.location || "Location not provided"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-gray-500" />
                  <span>{data.personalInfo.email}</span>
                </li>
                {data.personalInfo.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone size={16} className="text-gray-500" />
                    <span>{data.personalInfo.phone}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Tech Stack */}
        <section id="tech-stack" className="space-y-6 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
            Tech Stack & Tools
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.techStack?.map((cat, idx) => (
              <div key={idx} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <h3 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase opacity-85">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs font-medium rounded-lg text-gray-300 border border-white/5 hover:border-white/10 transition-all cursor-default"
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
        <section id="projects" className="space-y-6 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.projects?.map((project) => {
              const isHovered = false;
              return (
                <div 
                  key={project.id}
                  className="group relative bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden transition-all flex flex-col h-full shadow-2xl"
                >
                  <div className="relative h-48 w-full bg-[#1A1A26] overflow-hidden shrink-0">
                    {/* Hover Video feature */}
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
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Code size={40} />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors" style={{ color: isHovered ? accent : undefined }}>
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
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {project.features && project.features.length > 0 && (
                        <ul className="space-y-1 text-xs text-gray-400 bg-black/20 p-3 rounded-lg border border-white/5">
                          {project.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 text-xs">✔</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 text-[11px] rounded text-gray-300">
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
          <section id="experience" className="space-y-6 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative bg-[#12121A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                        <Briefcase size={14} className="text-gray-500" />
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-400 border border-white/5 h-fit sm:self-start">
                      {exp.duration}
                    </span>
                  </div>

                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1.5">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-xs text-gray-500 mr-1.5 self-center">Tech:</span>
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 text-xs text-gray-300 rounded border border-white/5">
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
          <section id="education" className="space-y-6 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Education & Certs
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex gap-4">
                  <div className="p-3 bg-white/5 rounded-xl h-fit">
                    <GraduationCap size={24} className="text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <p className="text-sm text-gray-300">{edu.field}</p>
                    <p className="text-xs text-gray-500">{edu.institution} | {edu.duration}</p>
                    {edu.gpa && (
                      <span className="inline-block text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md mt-1">
                        {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <section id="achievements" className="space-y-6 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Key Achievements
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 bg-[#12121A] border border-white/5 rounded-2xl p-4 items-center">
                  <Award size={20} className="shrink-0" style={{ color: accent }} />
                  <p className="text-sm text-gray-300">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Coding Profiles */}
        {data.codingProfiles && data.codingProfiles.length > 0 && (
          <section id="coding-profiles" className="space-y-6 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              Coding Profiles
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.codingProfiles.map((profile, i) => (
                <div key={i} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-white/5 rounded-lg text-gray-300">
                        {getIconForPlatform(profile.platform)}
                      </span>
                      <h3 className="font-bold text-white">{profile.platform}</h3>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">@{profile.username}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-400">
                    {profile.solved && (
                      <p className="flex justify-between">
                        <span>Solved:</span>
                        <span className="text-white font-medium">{profile.solved}</span>
                      </p>
                    )}
                    {profile.rating && (
                      <p className="flex justify-between">
                        <span>Rating:</span>
                        <span className="text-white font-medium">{profile.rating}</span>
                      </p>
                    )}
                    {profile.badge && (
                      <p className="flex justify-between">
                        <span>Badge:</span>
                        <span className="text-amber-400 font-medium">{profile.badge}</span>
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
            className="space-y-6 pt-12 border-t border-white/5"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-gray-400 max-w-xl">{section.description}</p>
            )}

            {section.layout === 'grid' && (
              <div className="grid md:grid-cols-2 gap-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-gray-400 font-medium">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'timeline' && (
              <div className="space-y-4 pl-4 border-l-2 border-white/5">
                {section.items?.map((item) => (
                  <div key={item.id} className="relative pl-6 space-y-1">
                    <span className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#12121A] border-2 border-gray-600" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      {item.meta && <span className="text-xs text-gray-500">{item.meta}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs text-gray-400 font-medium">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {section.layout === 'text' && (
              <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-4">
                {section.items?.map((item) => (
                  <div key={item.id} className="space-y-1.5 border-b border-white/5 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-white text-base">{item.title}</h3>
                    {item.subtitle && <p className="text-xs text-gray-400 font-medium">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* 9. Contact */}
        <section id="contact" className="space-y-6 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-gray-400">
                I am always open to exploring new job opportunities, collaborations, or simply answering your technical questions. Drop me an email or find me on socials!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <a href={`mailto:${data.personalInfo.email}`} className="text-sm hover:underline">{data.personalInfo.email}</a>
                  </div>
                </div>
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 rounded-xl text-gray-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <span className="text-sm">{data.personalInfo.phone}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <span className="text-sm">{data.personalInfo.location || "Earth"}</span>
                  </div>
                </div>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message Sent! (Form demo execution)");
              }} 
              className="bg-[#12121A] border border-white/5 rounded-2xl p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Name</label>
                  <input required type="text" className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400">Email</label>
                  <input required type="email" className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Subject</label>
                <input required type="text" className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white" placeholder="Project collaboration" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Message</label>
                <textarea required rows={4} className="w-full bg-[#1C1C26] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white resize-none" placeholder="Let's build something..." />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-medium text-white transition-all text-sm hover:brightness-110 flex items-center justify-center gap-2"
                style={{ backgroundColor: accent }}
              >
                Send Message <Send size={14} />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 text-center text-xs text-gray-500 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
