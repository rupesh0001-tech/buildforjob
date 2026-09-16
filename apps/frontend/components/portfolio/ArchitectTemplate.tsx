"use client";

import React from "react";
import { PortfolioData, PortfolioSettings } from "@/lib/portfolio-defaults";
import { 
  Terminal, 
  Settings, 
  Globe, 
  Cloud, 
  Layers, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  Phone,
  FileText,
  ExternalLink
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function ArchitectTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#4648d4";
  
  // Prismatic gradient style helper
  const prismaticGradient = `linear-gradient(45deg, ${accent}, #39b8fd)`;

  const fontClass = 
    settings.fontFamily === "Fira Code" ? "font-mono" :
    settings.fontFamily === "Space Grotesk" ? "font-sans tracking-tight" :
    settings.fontFamily === "Outfit" ? "font-sans antialiased" : "font-sans";

  return (
    <div className={`min-h-screen bg-[#f7f9fb] text-[#191c1e] relative overflow-hidden antialiased ${fontClass}`} style={{ fontFamily: settings.fontFamily }}>
      {/* Background Grid Decoration */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(${accent}22 0.5px, transparent 0.5px)`,
          backgroundSize: "24px 24px",
          opacity: 0.3
        }}
      />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 w-full z-40 bg-[#f7f9fb]/70 backdrop-blur-md border-b border-gray-200/50 shadow-xs">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          {/* Logo Dot only - Name removed per user request */}
          <div className="font-bold flex items-center gap-2 text-lg">
            <span 
              className="w-3.5 h-3.5 rounded-full inline-block animate-pulse" 
              style={{ background: prismaticGradient }}
            />
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-medium text-[#4648d4] hover:text-[#39b8fd] transition-colors" href="#projects">Projects</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#experience">Experience</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#stack">Stack</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#contact">Contact</a>
          </div>
          {data.personalInfo.resumeUrl && (
            <a 
              href={data.personalInfo.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2 rounded-full text-white text-sm font-semibold transition-transform active:scale-95 text-center shadow-md hover:brightness-105"
              style={{ background: prismaticGradient }}
            >
              Resume
            </a>
          )}
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <span 
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: accent }}
              >
                {data.personalInfo.jobTitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight text-gray-900">
                {data.personalInfo.tagline}
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                {data.personalInfo.bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#projects"
                  className="px-8 py-4 rounded-lg text-white font-bold hover:shadow-lg transition-all active:scale-95 shadow-md"
                  style={{ background: prismaticGradient }}
                >
                  View Engineering Portfolio
                </a>
                <a 
                  href="#contact"
                  className="px-8 py-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                  Let's Connect
                </a>
              </div>
            </div>

            {/* Graphic Visual */}
            <div className="md:col-span-5 relative mt-12 md:mt-0 flex justify-center">
              <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
                <div className="absolute w-[90%] h-[90%] border border-gray-200 rounded-2xl rotate-12" />
                <div className="absolute w-[90%] h-[90%] border border-gray-200 rounded-2xl -rotate-12" />
                <div 
                  className="w-64 h-64 rounded-2xl opacity-10 absolute blur-3xl"
                  style={{ background: prismaticGradient }}
                />
                <svg className="w-full h-full relative z-10 drop-shadow-xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    style={{ color: accent }}
                    d="M44.7,-76.4C58.1,-69.2,69.2,-57.1,76.4,-43.3C83.5,-29.5,86.7,-14.8,85.2,-0.9C83.7,13,77.5,26.1,69.5,38.5C61.4,51,51.5,62.8,39.3,71.2C27.1,79.6,12.5,84.7,-2.1,88.4C-16.7,92.1,-31.2,94.3,-44.6,89.5C-58,84.7,-70.3,72.9,-77.7,59C-85.1,45.1,-87.6,29.1,-87.4,13.7C-87.2,-1.7,-84.3,-16.5,-78.6,-30.3C-72.9,-44.1,-64.4,-56.9,-52.7,-64.9C-41.1,-72.9,-26.3,-76.1,-11.4,-78.1C3.5,-80.1,18.4,-80.9,32.3,-79.8C46.3,-78.8,59.3,-75.8,44.7,-76.4Z" 
                    fill="currentColor" 
                    transform="translate(100 100)"
                  />
                  <rect className="fill-white dark:fill-zinc-950" height="80" rx="8" transform="rotate(15 100 100)" width="80" x="60" y="60" />
                  <circle className="fill-blue-50 dark:fill-blue-950/50" cx="100" cy="100" r="30" style={{ fill: `${accent}15`, stroke: accent, strokeWidth: 1.5 }} />
                  <text fill={accent} fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" x="100" y="105">{"</>"}</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white border-y border-gray-200/50 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col gap-2">
                <span 
                  className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: prismaticGradient }}
                >
                  {data.experience?.length ? `${data.experience.length * 2}+` : "5+"}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Projects Managed</span>
              </div>
              <div className="flex flex-col gap-2">
                <span 
                  className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: prismaticGradient }}
                >
                  {data.skills?.reduce((acc, g) => acc + g.items.length, 0) || "12+"}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Tools & Technologies</span>
              </div>
              <div className="flex flex-col gap-2">
                <span 
                  className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: prismaticGradient }}
                >
                  99.9%
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Service SLA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Expertise */}
        <section id="stack" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <span 
                className="text-xs font-bold uppercase tracking-widest mb-4 block"
                style={{ color: accent }}
              >
                The Toolbox
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Battle-tested stacks for high-scale environments.
              </h2>
            </div>
            <p className="text-sm text-gray-500 md:w-1/3 leading-relaxed">
              Focused on performance optimization, robust automation, and enterprise-grade system engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.skills?.slice(0, 4).map((group, index) => (
              <div 
                key={index}
                className="p-8 rounded-xl bg-white border border-gray-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 mb-6 flex items-center justify-center text-[#4648d4]">
                  {index % 4 === 0 ? <Settings size={24} style={{ color: accent }} /> :
                   index % 4 === 1 ? <Globe size={24} style={{ color: accent }} /> :
                   index % 4 === 2 ? <Cloud size={24} style={{ color: accent }} /> :
                                     <Layers size={24} style={{ color: accent }} />}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{group.category}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {group.items.map((s, idx) => (
                    <span key={idx} className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section - Static cards with no hover transitions */}
        <section id="projects" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="mb-12">
            <span 
              className="text-xs font-bold uppercase tracking-widest mb-4 block"
              style={{ color: accent }}
            >
              Engineering Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data.projects?.map((project) => (
              <div 
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-full"
              >
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Terminal size={48} />
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-semibold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold flex items-center gap-1 hover:underline"
                        style={{ color: accent }}
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-900 hover:underline"
                      >
                        Codebase <Github size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="mb-12">
            <span 
              className="text-xs font-bold uppercase tracking-widest mb-4 block"
              style={{ color: accent }}
            >
              Career Path
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Work Experience</h2>
          </div>

          <div className="space-y-6">
            {data.experience?.map((exp) => (
              <div 
                key={exp.id}
                className="p-8 rounded-xl bg-white border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-start gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: accent }}>{exp.company}</p>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">{exp.responsibilities?.join(" ")}</p>
                </div>
                <div className="text-xs font-semibold text-gray-500 shrink-0 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-lg">
                  {exp.duration}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section id="education" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
            <div className="mb-12">
              <span 
                className="text-xs font-bold uppercase tracking-widest mb-4 block"
                style={{ color: accent }}
              >
                Academic Background
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Education</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.education.map((edu, idx) => (
                <div 
                  key={edu.id || idx}
                  className="p-8 rounded-xl bg-white border border-gray-200 flex flex-col justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: accent }}>{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500 mt-2 font-mono">Grade: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 shrink-0 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                    {edu.duration}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xs">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900">Ready to build? Let's talk.</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Have a challenging project, open position, or just want to swap ideas on high-availability infrastructures? Drop a line here.
                </p>
                <div className="space-y-3 pt-4 text-xs font-medium text-gray-600">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {data.personalInfo.email}</p>
                  {data.personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {data.personalInfo.phone}</p>}
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {data.personalInfo.location}</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Transmission Sent successfully!");
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
                    <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="John" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                    <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="john@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Message</label>
                  <textarea required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none resize-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Detail your transmission protocol..." />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-lg text-white text-xs font-bold tracking-wider uppercase active:scale-[0.99] transition-all shadow-md hover:brightness-105"
                  style={{ background: prismaticGradient }}
                >
                  Send Transmission
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200/50 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-xs uppercase tracking-widest" style={{ color: accent }}>
              © {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.
            </span>
          </div>
          <div className="flex gap-8">
            {data.personalInfo.socialLinks.github && (
              <a 
                href={data.personalInfo.socialLinks.github} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs uppercase font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            )}
            {data.personalInfo.socialLinks.linkedin && (
              <a 
                href={data.personalInfo.socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs uppercase font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a 
                href={data.personalInfo.socialLinks.twitter} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs uppercase font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
