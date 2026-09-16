"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

const CoverLetterPreview = ({ stateOverride }: { stateOverride?: any }) => {
  const reduxState = useSelector((state: RootState) => state.coverLetter);
  const state = stateOverride || reduxState;
  const { template } = state;

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={state} />;
      case "minimal":
        return <MinimalTemplate data={state} />;
      default:
        return <ClassicTemplate data={state} />;
    }
  };

  return (
    <div className="cover-letter-preview-container bg-white border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="mobile-scale-wrapper">
        <div id="cover-letter-preview" className="print:shadow-none print:border-none w-full min-h-[1123px]">
          {renderTemplate()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* --- A4 PAGE SETTINGS --- */
        @page {
          size: A4;
          margin: 0;
        }

        /* A4 dimensions for preview (desktop) */
        .cover-letter-preview-container {
          width: 210mm;
          min-height: 297mm;
          padding: 0;
          margin: 0 auto;
          background: white;
        }

        #cover-letter-preview {
          width: 210mm;
          min-height: 297mm;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        @media screen and (max-width: 1200px) {
          .cover-letter-preview-container {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .mobile-scale-wrapper {
            transform: scale(0.65);
            transform-origin: top center;
            width: 210mm;
            margin: 0 auto;
          }
        }

        @media screen and (max-width: 768px) {
          .mobile-scale-wrapper {
            transform: scale(0.45);
          }
        }

        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
          }
          body * {
            visibility: hidden;
          }
          #cover-letter-preview,
          #cover-letter-preview * {
            visibility: visible;
          }
          #cover-letter-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm !important;
            height: 297mm !important;
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
};

export default CoverLetterPreview;
