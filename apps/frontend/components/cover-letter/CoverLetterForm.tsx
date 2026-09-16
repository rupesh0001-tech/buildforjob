"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { 
  updatePersonalInfo, 
  updateDate, 
  updateEmployerInfo, 
  updateSalutation, 
  updateBody, 
  updateSignOff,
  updateMode,
  updateManualContent,
} from "@/lib/store/features/cover-letter-slice";
import FormInput from "../resume-builder/FormInput";
import FormTextArea from "../resume-builder/FormTextArea";
import CoverLetterThemeSelector from "./CoverLetterThemeSelector";
import { User, MapPin, Phone, Mail, Link, Calendar, Briefcase, Building, PenTool, Layout, Github, Type, FileText } from '@/lib/icons';

const CoverLetterForm = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.coverLetter);

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePersonalInfo({ [e.target.name]: e.target.value }));
  };

  const handleEmployerInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateEmployerInfo({ [e.target.name]: e.target.value }));
  };

  const handleBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBody({ [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
      <div className="flex justify-between items-center w-full mb-6 gap-4 flex-wrap">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            Cover Letter Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to generate your cover letter
          </p>
        </div>
        <CoverLetterThemeSelector />
      </div>

      <div className="space-y-8 pt-6 border-t border-gray-100 dark:border-white/5">
        
        {/* Personal Info */}
        <section className="space-y-6">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
               Personal Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Your contact details and professional profiles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="fullName" label="Full Name" value={state.personalInfo.fullName || ""} onChange={handlePersonalInfo} icon={<User size={16}/>} />
            <FormInput name="address" label="Address" value={state.personalInfo.address || ""} onChange={handlePersonalInfo} icon={<MapPin size={16}/>} />
            <FormInput name="phone" label="Phone" value={state.personalInfo.phone || ""} onChange={handlePersonalInfo} icon={<Phone size={16}/>} />
            <FormInput name="email" label="Email" value={state.personalInfo.email || ""} onChange={handlePersonalInfo} icon={<Mail size={16}/>} />
            <FormInput name="linkedin" label="LinkedIn URL" value={state.personalInfo.linkedin || ""} onChange={handlePersonalInfo} icon={<Link size={16}/>} />
            <FormInput name="github" label="GitHub URL" value={state.personalInfo.github || ""} onChange={handlePersonalInfo} icon={<Github size={16}/>} />
            <FormInput 
              name="date" 
              label="Date" 
              value={state.date} 
              onChange={(e) => dispatch(updateDate(e.target.value))} 
              icon={<Calendar size={16}/>} 
            />
          </div>
        </section>

        {/* Employer Info */}
        <section className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Briefcase size={20} className="text-primary" /> Employer Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Information about the company and hiring manager
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="managerName" label="Hiring Manager Name" value={state.employerInfo.managerName || ""} onChange={handleEmployerInfo} icon={<User size={16}/>} />
            <FormInput name="teamName" label="Team/Department Name" value={state.employerInfo.teamName || ""} onChange={handleEmployerInfo} icon={<Briefcase size={16}/>} />
            <FormInput name="companyName" label="Company Name" value={state.employerInfo.companyName || ""} onChange={handleEmployerInfo} icon={<Building size={16}/>} />
            <FormInput 
              name="salutation" 
              label="Salutation" 
              value={state.salutation} 
              onChange={(e) => dispatch(updateSalutation(e.target.value))} 
              icon={<PenTool size={16}/>} 
            />
          </div>
        </section>

        {/* Letter Body */}
        <section className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Layout size={20} className="text-primary" /> Letter Content
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Choose between a guided structure or manual writing
              </p>
            </div>
            
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl self-start">
              <button
                onClick={() => dispatch(updateMode("structured"))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  state.mode === "structured" 
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Type size={14} /> Structured
              </button>
              <button
                onClick={() => dispatch(updateMode("manual"))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  state.mode === "manual" 
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FileText size={14} /> Manual
              </button>
            </div>
          </div>

          {state.mode === "structured" ? (
            <div className="space-y-6">
              <FormTextArea 
                name="intro" 
                label="P1: The Hook" 
                value={state.body.intro || ""} 
                onChange={handleBody} 
                placeholder="State position and why you want it..."
              />
              <FormTextArea 
                name="body1" 
                label="P2: Technical Impact" 
                value={state.body.body1 || ""} 
                onChange={handleBody} 
                placeholder="Quantifiable achievements..."
              />
              <FormTextArea 
                name="body2" 
                label="P3: Tech Stack & Teamwork" 
                value={state.body.body2 || ""} 
                onChange={handleBody} 
                placeholder="Languages and collaboration..."
              />
              <FormTextArea 
                name="body3" 
                label="P4: Why This Company?" 
                value={state.body.body3 || ""} 
                onChange={handleBody} 
                placeholder="Specific research..."
              />
              <FormTextArea 
                name="conclusion" 
                label="P5: Closing Statement" 
                value={state.body.conclusion || ""} 
                onChange={handleBody} 
                placeholder="Final enthusiasm..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FormTextArea 
                name="manualContent" 
                label="Whole Letter Body" 
                value={state.manualContent} 
                onChange={(e) => dispatch(updateManualContent(e.target.value))} 
                placeholder="Write your entire cover letter body freely..."
                rows={18}
              />
            </div>
          )}

          <FormInput 
            name="signOff" 
            label="Sign-Off" 
            value={state.signOff} 
            onChange={(e) => dispatch(updateSignOff(e.target.value))} 
            icon={<PenTool size={16}/>} 
          />
        </section>
      </div>
    </div>
  );
};

export default CoverLetterForm;
