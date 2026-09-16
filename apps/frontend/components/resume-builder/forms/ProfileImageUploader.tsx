"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setPersonalInfo } from "@/lib/store/features/resume-slice";
import { Camera, Check, X } from '@/lib/icons';

const ProfileImageUploader = () => {
  const dispatch = useDispatch();
  const { personalInfoData } = useSelector((state: RootState) => state.resume);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (previewImg) {
      dispatch(
        setPersonalInfo({
          ...personalInfoData,
          image: previewImg,
        })
      );
      setPreviewImg(null);
    }
  };

  const handleCancel = () => {
    setPreviewImg(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <label
          htmlFor="profile-upload"
          className="cursor-pointer group relative"
        >
          <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex justify-center items-center overflow-hidden bg-gray-50 dark:bg-white/5 transition-all group-hover:border-purple-500">
            {previewImg || personalInfoData.image ? (
              <img
                src={previewImg || personalInfoData.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="text-gray-400 group-hover:text-purple-500 transition-colors" size={32} />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-medium">Change Photo</p>
            </div>
          </div>
        </label>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Profile Photo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF. Max 2MB.</p>
          
          {previewImg && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                title="Save"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
    </div>
  );
};

export default ProfileImageUploader;
