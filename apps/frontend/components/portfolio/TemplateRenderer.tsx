"use client";

import React from "react";
import { PortfolioData, PortfolioSettings } from "@/lib/portfolio-defaults";
import SleekDarkTemplate from "./SleekDarkTemplate";
import CreativeGreenTemplate from "./CreativeGreenTemplate";
import RetroTerminalTemplate from "./RetroTerminalTemplate";
import GlassCreativeTemplate from "./GlassCreativeTemplate";
import ArchitectTemplate from "./ArchitectTemplate";
import EngineeringSleekTemplate from "./EngineeringSleekTemplate";

interface TemplateRendererProps {
  templateId: string;
  data: PortfolioData;
  settings: PortfolioSettings;
  onSubmitResponse?: (formData: { name: string; email: string; message: string }) => Promise<void>;
}

export default function TemplateRenderer({ templateId, data, settings, onSubmitResponse }: TemplateRendererProps) {
  const handleFormSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    if (!onSubmitResponse) return;

    e.preventDefault();
    e.stopPropagation();

    const formElement = e.target as HTMLFormElement;

    // Get input values from form element
    const inputs = Array.from(formElement.querySelectorAll("input, textarea"));
    let name = "";
    let email = "";
    let message = "";

    inputs.forEach((input: any) => {
      const type = input.type;
      const placeholder = (input.placeholder || "").toLowerCase();
      const nameAttr = (input.name || "").toLowerCase();

      if (input.tagName.toLowerCase() === "textarea" || placeholder.includes("message") || nameAttr.includes("message")) {
        message = input.value;
      } else if (type === "email" || placeholder.includes("email") || nameAttr.includes("email")) {
        email = input.value;
      } else if (type === "text" && (placeholder.includes("name") || nameAttr.includes("name") || placeholder.includes("first") || placeholder.includes("john"))) {
        name = input.value;
      }
    });

    if (!name || !email || !message) {
      const textInputs = inputs.filter((inp: any) => inp.tagName.toLowerCase() === "input" && inp.type !== "submit");
      const textareaInput = inputs.find((inp: any) => inp.tagName.toLowerCase() === "textarea");

      if (textInputs[0]) name = (textInputs[0] as any).value;
      if (textInputs[1]) email = (textInputs[1] as any).value;
      if (textareaInput) message = (textareaInput as any).value;
    }

    if (name && email && message) {
      try {
        await onSubmitResponse({ name, email, message });
        formElement.reset();
      } catch (err) {
        console.error("Submission failed:", err);
      }
    }
  };

  // Safely construct normalized data to prevent runtime crashes from partial/empty DB fields
  const normalizedData: PortfolioData = {
    personalInfo: {
      fullName: data?.personalInfo?.fullName || "",
      jobTitle: data?.personalInfo?.jobTitle || "",
      tagline: data?.personalInfo?.tagline || "",
      bio: data?.personalInfo?.bio || "",
      email: data?.personalInfo?.email || "",
      phone: data?.personalInfo?.phone || "",
      location: data?.personalInfo?.location || "",
      avatarUrl: data?.personalInfo?.avatarUrl || "",
      resumeUrl: data?.personalInfo?.resumeUrl,
      isOpenToWork: typeof data?.personalInfo?.isOpenToWork === "boolean" ? data.personalInfo.isOpenToWork : true,
      socialLinks: data?.personalInfo?.socialLinks || {}
    },
    aboutMe: {
      paragraphs: data?.aboutMe?.paragraphs || (data?.personalInfo?.bio ? [data.personalInfo.bio] : [])
    },
    techStack: data?.techStack || data?.skills || [],
    projects: data?.projects || [],
    experience: data?.experience || [],
    education: data?.education || [],
    skills: data?.skills || data?.techStack || [],
    achievements: data?.achievements || [],
    codingProfiles: data?.codingProfiles || [],
    customSections: data?.customSections || []
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'sleek-dark':
        return <SleekDarkTemplate data={normalizedData} settings={settings} />;
      case 'creative-green':
        return <CreativeGreenTemplate data={normalizedData} settings={settings} />;
      case 'retro-terminal':
        return <RetroTerminalTemplate data={normalizedData} settings={settings} />;
      case 'glass-creative':
        return <GlassCreativeTemplate data={normalizedData} settings={settings} />;
      case 'architect-prismatic':
        return <ArchitectTemplate data={normalizedData} settings={settings} />;
      case 'engineering-sleek':
        return <EngineeringSleekTemplate data={normalizedData} settings={settings} />;
      default:
        return <SleekDarkTemplate data={normalizedData} settings={settings} />;
    }
  };

  return (
    <div onSubmit={handleFormSubmit}>
      {renderTemplate()}
    </div>
  );
}
