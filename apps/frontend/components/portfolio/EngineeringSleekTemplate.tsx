"use client";

import React from "react";
import { PortfolioData, PortfolioSettings } from "@/lib/portfolio-defaults";
import { 
  Code, 
  Smartphone, 
  Palette as PaletteIcon, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  MapPin, 
  ChevronDown, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Zap,
  Terminal,
  Layers,
  Clock
} from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function EngineeringSleekTemplate({ data, settings }: TemplateProps) {
  const accent = settings.accentColor || "#3525cd";

  const fontClass = 
    settings.fontFamily === "Fira Code" ? "font-mono" :
    settings.fontFamily === "Space Grotesk" ? "font-sans tracking-tight" :
    settings.fontFamily === "Outfit" ? "font-sans antialiased" : "font-sans";

  return (
    <div className={`min-h-screen bg-[#f7f9fb] text-[#191c1e] relative antialiased scroll-smooth ${fontClass}`} style={{ fontFamily: settings.fontFamily }}>
      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-40 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-gray-200/50 shadow-xs">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Logo Dot only - Name removed per user request */}
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: accent }} />
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#services">Services</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#projects">Projects</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#why-me">Expertise</a>
            <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#contact">Contact</a>
            <a 
              className="ml-4 text-white text-xs font-mono uppercase px-4 py-2 rounded-lg transition-opacity hover:opacity-90 shadow-md" 
              href="#contact"
              style={{ backgroundColor: accent }}
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-[85vh] flex items-center py-16"
          style={{
            backgroundImage: `radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px)`,
            backgroundSize: "24px 24px"
          }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-mono text-xs mb-6 font-semibold border border-blue-100 uppercase tracking-wider">
                AVAILABLE FOR NEW PROJECTS
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-gray-900">
                {data.personalInfo.tagline}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                {data.personalInfo.bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  className="text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all shadow-md" 
                  href="#contact"
                  style={{ backgroundColor: accent }}
                >
                  Get In Touch
                  <ArrowRight size={16} />
                </a>
                <a className="border border-gray-300 bg-white px-8 py-4 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-xs" href="#projects">
                  View Works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="py-8 bg-white border-y border-gray-200/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-4">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest text-center">
              Engineered with Modern Stack
            </p>
          </div>
          
          <div className="flex whitespace-nowrap overflow-hidden py-4 select-none">
            <div className="flex gap-16 animate-marquee items-center text-gray-400 font-mono text-base font-bold uppercase">
              {data.skills?.flatMap(g => g.items).slice(0, 10).map((skill, idx) => (
                <span key={idx} className="hover:text-gray-900 transition-colors">{skill}</span>
              )) || (
                <>
                  <span>REACT</span> <span>NEXT.JS</span> <span>TYPESCRIPT</span> <span>GO</span> <span>BUN</span> <span>DOCKER</span> <span>AWS</span> <span>POSTGRESQL</span>
                </>
              )}
            </div>
          </div>
          
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: inline-flex;
              animation: marquee 25s linear infinite;
            }
          `}</style>
        </section>

        {/* Services Section */}
        <section className="py-24" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Our Services</h2>
              <p className="text-gray-500">We provide best-in-class engineering & development services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Web Development */}
              <div className="p-8 bg-white border border-gray-200 rounded-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6" style={{ color: accent }}>
                  <Code size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Web Development</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Full-stack web applications built for speed, SEO, and massive scalability.</p>
              </div>

              {/* Mobile Application */}
              <div className="p-8 bg-white border border-gray-200 rounded-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6" style={{ color: accent }}>
                  <Smartphone size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Mobile Apps</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Cross-platform mobile apps that feel native and perform beautifully on all devices.</p>
              </div>

              {/* UI/UX Interface Design */}
              <div className="p-8 bg-white border border-gray-200 rounded-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6" style={{ color: accent }}>
                  <PaletteIcon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">UI/UX Design</h3>
                <p className="text-sm text-gray-500 leading-relaxed">User-centric designs that convert visitors into loyal customers through logic and art.</p>
              </div>

              {/* Devops & Cloud */}
              <div className="p-8 bg-white border border-gray-200 rounded-xl transition-all">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6" style={{ color: accent }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Cloud & DevOps</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Automated pipelines, high-availability deployments, and robust security parameters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section - Static cards with no hover transitions */}
        <section className="py-24 bg-white border-y border-gray-200/50" id="projects">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Selected Projects & Works</h2>
              <p className="text-gray-500 mt-2">A showcase of engineering excellence and digital craftsmanship.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects?.map((project, idx) => (
                <div key={project.id || idx} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="h-72 relative overflow-hidden bg-gray-50 border-b border-gray-100">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Code size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      {project.techStack?.slice(0, 2).map((tech, tIdx) => (
                        <span key={tIdx} className="bg-black/75 text-white px-2.5 py-1 rounded font-mono text-[10px] uppercase backdrop-blur-xs font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow justify-between space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                      {project.liveUrl && (
                        <a 
                          className="font-mono text-xs font-bold flex items-center gap-1.5 hover:underline" 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: accent }}
                        >
                          VIEW LIVE SITE <ExternalLink size={12} />
                        </a>
                      )}
                      <span className="text-gray-300 font-mono text-[10px]">0{idx + 1} / PROJECT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Work With Me */}
        <section className="py-24" id="why-me">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Why Work With Me?</h2>
              <p className="text-gray-500">We combine engineering precision with creative vision to deliver results that exceed expectations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                <div className="text-white p-2.5 rounded shrink-0" style={{ backgroundColor: accent }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Fast Communication</h4>
                  <p className="text-sm text-gray-500">I prioritize clear, frequent updates. You'll never be in the dark about your project's status.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                <div className="text-white p-2.5 rounded shrink-0" style={{ backgroundColor: accent }}>
                  <Terminal size={18} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Clean Code</h4>
                  <p className="text-sm text-gray-500">Production-ready, maintainable, and well-documented code that your team can easily build upon.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                <div className="text-white p-2.5 rounded shrink-0" style={{ backgroundColor: accent }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Scalable Architecture</h4>
                  <p className="text-sm text-gray-500">Systems designed to handle growth from 100 to 1,000,000 users without breaking a sweat.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                <div className="text-white p-2.5 rounded shrink-0" style={{ backgroundColor: accent }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">On-Time Delivery</h4>
                  <p className="text-sm text-gray-500">We respect deadlines. Your product launches on schedule, every single time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section className="py-24 bg-white border-t border-gray-200/50" id="experience">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Work Experience</h2>
                <p className="text-gray-500">My employment history and engineering roles.</p>
              </div>

              <div className="space-y-8">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 p-8 border border-gray-200 rounded-xl bg-[#f7f9fb]">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: accent }}>{exp.company}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc pl-5 mt-4 space-y-1 text-sm text-gray-500">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {exp.technologies.map((tech, tIdx) => (
                            <span key={tIdx} className="bg-gray-200/50 dark:bg-white/5 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-white px-3 py-1.5 rounded" style={{ backgroundColor: accent }}>
                      {exp.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section className="py-24" id="education">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Education</h2>
                <p className="text-gray-500">Academic qualifications and educational background.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-8 bg-white border border-gray-200 rounded-xl flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: accent }}>{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-500 mt-2 font-mono">Grade: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-gray-500 shrink-0 border border-gray-100 bg-[#f7f9fb] px-3 py-1.5 rounded w-fit">
                      {edu.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="py-24 bg-white border-t border-gray-200/50" id="contact">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Ready to bring your ideas to life?</h2>
                <p className="text-base text-gray-500 mb-10 leading-relaxed">
                  Whether you have a fully-fledged specification or just a rough concept, I'm here to help you navigate the development cycle. Let's make it real.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center" style={{ color: accent }}>
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{data.personalInfo.email}</span>
                  </div>
                  {data.personalInfo.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center" style={{ color: accent }}>
                        <Mail size={16} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{data.personalInfo.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center" style={{ color: accent }}>
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{data.personalInfo.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f7f9fb] p-8 rounded-xl border border-gray-200 shadow-xs">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Message Sent! (Form demo execution)");
                  }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input required className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-3 outline-none text-xs transition-all" placeholder="John Doe" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input required className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-3 outline-none text-xs transition-all" placeholder="john@example.com" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Message</label>
                    <textarea required rows={4} className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-3 outline-none text-xs resize-none transition-all" placeholder="Tell me about your project..." />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 text-white text-xs font-mono uppercase rounded-lg shadow-md transition-all active:scale-[0.99] font-bold"
                    style={{ backgroundColor: accent }}
                  >
                    Send Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f7f9fb] py-12 border-t border-gray-200/50">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
              © {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.
            </span>
          </div>
          <div className="flex gap-8">
            {data.personalInfo.socialLinks.github && (
              <a 
                href={data.personalInfo.socialLinks.github} 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            )}
            {data.personalInfo.socialLinks.linkedin && (
              <a 
                href={data.personalInfo.socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {data.personalInfo.socialLinks.twitter && (
              <a 
                href={data.personalInfo.socialLinks.twitter} 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
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
