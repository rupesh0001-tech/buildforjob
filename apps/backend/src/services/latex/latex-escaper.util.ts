/**
 * LaTeX Escaping & Sanitization Utility
 * Safely escapes user input to prevent LaTeX injection or compilation syntax errors.
 */

export function escapeLatex(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  const text = String(str);
  if (!text) return '';

  return text
    // Replace backslashes first with placeholder
    .replace(/\\/g, '\\textbackslash{}')
    // Escape standard special LaTeX characters
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    // Escape smart quotes and quotes
    .replace(/“|”/g, "''")
    .replace(/‘|’/g, "'")
    // Escape angle brackets
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}')
    // Non-breaking spaces and clean whitespace
    .replace(/\u00A0/g, ' ');
}

export function escapeLatexUrl(url: string | null | undefined): string {
  if (!url) return '';
  // URLs in \href{url}{text} need % and # escaped or formatted safely
  return url.trim().replace(/%/g, '\\%').replace(/#/g, '\\#');
}

export function formatMonthYear(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const clean = dateStr.trim();
  // If already formatted like "Aug. 2018", "2018 - 2021", or "Present", escape and return
  return escapeLatex(clean);
}
