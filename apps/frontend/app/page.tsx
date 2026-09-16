"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/sections/navbar/navbar";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { LogosSection } from "@/components/sections/logos/logos-section";
import { FeaturesBentoGrid } from "@/components/sections/features/features-bento-grid";
import { ShowcaseSection } from "@/components/sections/showcase/showcase-section";
import { TestimonialsSection } from "@/components/sections/testimonials/testimonials-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { CtaSection } from "@/components/sections/cta/cta-section";
import { FooterSection } from "@/components/sections/footer/footer-section";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        theme={theme}
        setTheme={setTheme}
      />
      
      <main className="relative z-10 pt-24 pb-16">
        <HeroSection />
        
        <FeaturesBentoGrid />
        {/* <ShowcaseSection /> */}
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>

      <FooterSection />
    </div>
  );
}