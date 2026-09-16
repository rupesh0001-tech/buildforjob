"use client";
import React from "react";
import { Star } from '@/lib/icons';

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-12 text-black dark:text-white">Thousands of offers secured.</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            name: "Sarah Chen",
            role: "Frontend Engineer @ Stripe",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
            text: "The ATS score checker completely changed my approach. I realized my previous resume wasn't even passing the automated filters. Got 3 interviews in my first week using BuildForJob."
          },
          {
            name: "Michael Rodriguez",
            role: "Product Manager @ Airbnb",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
            text: "Generated a tailored cover letter in 30 seconds that perfectly matched the PM job description. The hiring manager explicitly brought it up in my interview."
          },
          {
            name: "David Kim",
            role: "Recent Grad",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
            text: "The GitHub portfolio sync is magic. I literally clicked one button and had a beautiful personal website with all my side projects laid out perfectly."
          }
        ].map((t, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:bg-white/10 transition-all">
            <div className="flex text-yellow-500 mb-4 gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
               <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-black/5 dark:border-white/20" />
               <div>
                 <div className="font-semibold text-black dark:text-white">{t.name}</div>
                 <div className="text-xs text-gray-500">{t.role}</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
