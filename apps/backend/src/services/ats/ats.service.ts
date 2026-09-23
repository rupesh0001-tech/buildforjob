import type { IATSSuggestionsResult, IATSScoreResult } from '../../interfaces/ats.interface';
import { PDFParse } from 'pdf-parse';
import { runATSScoreGraph, runATSSuggestionsGraph } from '../langgraph/ats.graph';

/**
 * Extracts plain text from a PDF buffer using pdf-parse
 */
export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  const parser = new PDFParse({ data: pdfBuffer });
  try {
    const data = await parser.getText();
    const text = data.text?.trim();
    if (!text) {
      throw new Error('Could not extract any text from the PDF. The file may be scanned or image-based.');
    }
    return text;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(`Failed to parse PDF: ${err.message}`);
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      await parser.destroy();
    }
  }
};

/**
 * Normalizes text for comparison.
 */
const normalizeText = (text: string): string => text.toLowerCase().replace(/[^\w\s]/g, '');

/**
 * Fallback keyword score calculation.
 */
const calculateKeywordScore = (resume: string, jd: string): number => {
  const jdKeywords = jd.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const uniqueKeywords = Array.from(new Set(jdKeywords));
  const foundCount = uniqueKeywords.filter(w => resume.toLowerCase().includes(w)).length;
  return Math.round((foundCount / Math.max(1, uniqueKeywords.length)) * 100);
};

/**
 * Computes ATS similarity score between resume text and job description using LangGraph.
 */
export const computeATSScore = async (
  resumeText: string,
  jobDescription: string
): Promise<IATSScoreResult> => {
  if (!resumeText || !jobDescription) {
    return { score: 0, details: "Missing resume or job description text." };
  }

  const cleanResume = normalizeText(resumeText);
  const cleanJD = normalizeText(jobDescription);

  if (cleanResume === cleanJD || cleanResume.includes(cleanJD) || cleanJD.includes(cleanResume)) {
    return { score: 100, details: "Perfect content match detected." };
  }

  try {
    return await runATSScoreGraph(resumeText, jobDescription);
  } catch (langgraphError: any) {
    console.warn("LangGraph ATS scoring failed, falling back to local keyword calculation:", langgraphError.message);
    const keywordScore = calculateKeywordScore(resumeText, jobDescription);
    return {
      score: keywordScore,
      details: "Calculated via local keyword overlap (fallback)."
    };
  }
};

/**
 * Gets structured improvement suggestions using LangGraph.
 */
export const getImprovementSuggestions = async (
  resumeText: string,
  jobDescription: string
): Promise<IATSSuggestionsResult> => {
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    throw new Error('No AI API keys configured.');
  }

  return await runATSSuggestionsGraph(resumeText, jobDescription);
};

/**
 * Backward compatibility export
 */
export const getGroqSuggestions = async (
  prompt: string
): Promise<IATSSuggestionsResult> => {
  return await runATSSuggestionsGraph(prompt, "");
};
