"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, MoreHorizontal, ChevronLeft, ChevronRight } from '@/lib/icons';

const testimonials = [
  {
    id: 1,
    title: "Got 97% ATS Score using Resume Builder",
    quote: "Robin consistently delivers clean, intuitive designs that strike the perfect balance between aesthetic and usability. Whether it's for a complex workflow or a lightweight self-service feature, the user experience always feels effortless and refined.",
    name: "Dave Salvant",
    role: "Co-founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: 2,
    title: "Got 98% ATS Score & Secured 3 Interviews in Week 1",
    quote: "The ATS score checker completely changed my job search strategy. I realized my previous resume wasn't passing automated filters. Secured 3 interviews in my very first week using BuildForJob.",
    name: "Sarah Chen",
    role: "Staff Frontend Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: 3,
    title: "Got 95% Match Tailored Cover Letter in 30s",
    quote: "Generated a tailored cover letter in 30 seconds that matched the PM job description with extreme precision. The recruiter explicitly highlighted it during my final loop.",
    name: "Michael Rodriguez",
    role: "Senior Product Manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: 4,
    title: "Got 1-Click GitHub Portfolio Sync & Aced Tech Round",
    quote: "The GitHub portfolio sync is pure magic. One click imported all my open-source projects and created a stunning personal website that helped me land my dream role.",
    name: "David Kim",
    role: "Full Stack Engineer",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80"
  }
];

export function TestimonialsSection() {
  const [stack, setStack] = useState(testimonials);
  const [exitDirection, setExitDirection] = useState<"left" | "right">("right");

  const handleNext = () => {
    setExitDirection("right");
    setStack((prev) => {
      const copy = [...prev];
      const first = copy.shift();
      if (first) copy.push(first);
      return copy;
    });
  };

  const handlePrev = () => {
    setExitDirection("left");
    setStack((prev) => {
      const copy = [...prev];
      const last = copy.pop();
      if (last) copy.unshift(last);
      return copy;
    });
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > 80 || info.velocity.x > 300) {
      handleNext();
    } else if (info.offset.x < -80 || info.velocity.x < -300) {
      handleNext();
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-slate-50/50 dark:bg-[#090712]/50">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e1a34_1px,transparent_1px),linear-gradient(to_bottom,#1e1a34_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section Heading & Swipe Controls Above Card */}
        <div className="mb-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              candidate champions.
            </span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-6">
            Swipe through stories from candidates who landed top tier offers with BuildForJob.
          </p>

          {/* Navigation Controls Above Cards Stack */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white dark:bg-purple-950 border border-slate-200 dark:border-purple-800 text-slate-700 dark:text-white flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-purple-900 transition-colors focus:outline-none"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white dark:bg-purple-950 border border-slate-200 dark:border-purple-800 text-slate-700 dark:text-white flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-purple-900 transition-colors focus:outline-none"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Stacked Badge Cards Container */}
        <div className="relative w-full max-w-xl mx-auto min-h-[460px] flex items-center justify-center">
          
          {/* Lanyard Strap & Top Clip (Hanging down from top center) */}
          <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
            {/* Lanyard Strap Ribbon */}
            <div className="w-9 h-14 bg-gradient-to-b from-slate-300/80 via-slate-200/90 to-slate-300 dark:from-purple-900/60 dark:via-purple-800/80 dark:to-purple-900/60 rounded-b-md shadow-md border-x border-white/50" />
            {/* Metal Lanyard Clip */}
            <div className="w-12 h-6 -mt-1 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 dark:from-slate-600 dark:via-slate-300 dark:to-slate-600 rounded-lg shadow-lg border border-slate-300 dark:border-slate-500 flex items-center justify-center">
              <div className="w-6 h-2 rounded-full bg-slate-700/80 dark:bg-slate-900/90" />
            </div>
          </div>

          {/* Cards Stack */}
          <div className="relative w-full h-[420px] flex items-center justify-center">
            {stack.map((item, index) => {
              const isFront = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              let scale = 1;
              let translateY = 0;
              let rotate = 0;
              let opacity = 1;
              let zIndex = stack.length - index;

              if (isSecond) {
                scale = 0.96;
                translateY = 14;
                rotate = -3;
                opacity = 0.92;
              } else if (isThird) {
                scale = 0.92;
                translateY = 28;
                rotate = 3;
                opacity = 0.82;
              } else if (index > 2) {
                scale = 0.88;
                translateY = 40;
                rotate = 0;
                opacity = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  style={{ zIndex }}
                  animate={{
                    scale,
                    y: translateY,
                    rotate: isFront ? 0 : rotate,
                    opacity
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24
                  }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={isFront ? handleDragEnd : undefined}
                  whileGrab={{ cursor: "grabbing" }}
                  className={`absolute w-full max-w-lg p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#131024] border border-slate-200/90 dark:border-purple-900/40 shadow-2xl shadow-slate-900/10 dark:shadow-purple-950/50 text-left select-none ${
                    isFront ? "cursor-grab" : "pointer-events-none"
                  }`}
                >
                  {/* Badge Hole Punch Slot at top center */}
                  <div className="w-12 h-3.5 mx-auto -mt-2 mb-4 rounded-full bg-slate-200/80 dark:bg-purple-950 border border-slate-300/80 dark:border-purple-800/60 shadow-inner flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-300 dark:bg-purple-900 rounded-full" />
                  </div>

                  {/* Header Row: Title & Swipe Indicator */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug tracking-tight pr-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {isFront && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-[11px] font-semibold flex items-center gap-1.5 animate-pulse shadow-2xs">
                          <span>👈 Swipe 👉</span>
                        </span>
                      )}
                      <button className="text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Large Quote Mark */}
                  <div className="text-2xl font-serif text-slate-400 dark:text-gray-500 leading-none mb-1">
                    “
                  </div>

                  {/* Testimonial Quote Text */}
                  <p className="text-slate-700 dark:text-gray-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {item.quote}
                  </p>

                  {/* Footer Row: Candidate Avatar & Info + LinkedIn Icon */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-purple-900 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                          {item.role}
                        </div>
                      </div>
                    </div>

                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-purple-950/80 border border-slate-200/80 dark:border-purple-800/50 flex items-center justify-center text-[#0a66c2] hover:scale-105 transition-transform shadow-2xs"
                    >
                      <Linkedin size={15} fill="#0a66c2" className="text-[#0a66c2]" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

