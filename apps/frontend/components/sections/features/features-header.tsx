"use client";
import React from "react";
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";

export function FeaturesHeader() {
  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white tracking-tight">
        The ultimate toolkit <br/> for your job hunt.
      </h2>
      <ScrollRevealParagraph 
        className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl"
        paragraph="We replaced multiple scattered tools with one powerful platform. Everything you need to land interviews, organized in one place."
      />
    </div>
  );
}
