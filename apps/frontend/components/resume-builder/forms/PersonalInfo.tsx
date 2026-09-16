"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setPersonalInfo } from "@/lib/store/features/resume-slice";
import FormInput from "../FormInput";
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase } from '@/lib/icons';
import ProfileImageUploader from "./ProfileImageUploader";

interface PersonalInfoProps {
  setFormTab: (tab: number) => void;
}

const PersonalInfo = ({ setFormTab }: PersonalInfoProps) => {
  const dispatch = useDispatch();
  const { personalInfoData } = useSelector((state: RootState) => state.resume);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setPersonalInfo({
        ...personalInfoData,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API removal as requested
    setFormTab(2);
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us about yourself and how recruiters can contact you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <ProfileImageUploader /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="full_name"
            label="Full Name"
            icon={<User size={16} />}
            value={personalInfoData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
          />

          <FormInput
            name="profession"
            label="Profession"
            icon={<Briefcase size={16} />}
            value={personalInfoData.profession}
            onChange={handleChange}
            placeholder="Full Stack Developer"
          />

          <FormInput
            name="email"
            label="Email"
            icon={<Mail size={16} />}
            value={personalInfoData.email}
            onChange={handleChange}
            type="email"
            placeholder="john@example.com"
          />

          <FormInput
            name="phone"
            label="Phone"
            icon={<Phone size={16} />}
            value={personalInfoData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="+1 234 567 890"
          />
        </div>

        <FormInput
          name="location"
          label="Location"
          icon={<MapPin size={16} />}
          value={personalInfoData.location}
          onChange={handleChange}
          placeholder="New York, USA"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="linkedin"
            label="LinkedIn"
            icon={<Linkedin size={16} />}
            value={personalInfoData.linkedin}
            onChange={handleChange}
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
          />

          <FormInput
            name="website"
            label="Website"
            icon={<Globe size={16} />}
            value={personalInfoData.website}
            onChange={handleChange}
            type="url"
            placeholder="https://johndoe.dev"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25 mt-4"
        >
          Proceed to Summary
        </button>
      </form>
    </div>
  );
};

export default PersonalInfo;
