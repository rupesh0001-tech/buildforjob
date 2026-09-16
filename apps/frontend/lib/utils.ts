import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date range string with a hyphen separator for ATS compatibility.
 * Uses ASCII hyphen-minus (-) instead of en-dash for reliable PDF text extraction.
 */
export function formatDateRange(dateString: string | undefined | null): string {
  if (!dateString) return '';

  // Normalize any existing dashes (en-dash, em-dash) to hyphen-minus for ATS compatibility
  let formatted = dateString.replace(/[–—]/g, '-');

  // Normalize spacing around existing hyphens
  formatted = formatted.replace(/\s*-\s*/g, ' - ');

  // Handle "Jun 2025 Aug 2025" pattern (month year month year without separator)
  formatted = formatted.replace(/([A-Za-z]+\.?\s+\d{4})\s+([A-Za-z]+\.?\s+\d{4})/g, '$1 - $2');

  // Handle "2023 2025" pattern (year year without separator)
  formatted = formatted.replace(/(\d{4})\s+(\d{4})/g, '$1 - $2');

  // Handle "Jun 2025 Present" pattern
  formatted = formatted.replace(
    /([A-Za-z]+\.?\s+\d{4})\s+(Present|Current|Now|Ongoing)/gi,
    '$1 - $2'
  );

  return formatted;
}

/**
 * Parses and returns a user-friendly error message from an API error response.
 * Especially handles validation errors returned as an array of field-level issues.
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  if (!error) return fallbackMessage;

  // Handle Axios/HTTP response error structure
  const err = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Array<{ field?: string; message: string }>;
      };
    };
    message?: string;
  };

  // If there are detailed validation errors, parse and format them
  if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
    return err.response.data.errors
      .map((e) => {
        if (e.field) {
          const parts = e.field.split('.');
          const lastPart = parts[parts.length - 1];
          const fieldLabel = parts
            .map((part) => {
              if (/^\d+$/.test(part)) {
                return `[${part}]`;
              }
              return part.replace(/([A-Z])/g, ' $1').trim();
            })
            .join(' ➔ ')
            .replace(/\s➔\s\[/g, '[');

          const capitalizedField = fieldLabel
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          const lastPartLabel = lastPart.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
          const startsWithField = e.message.toLowerCase().startsWith(lastPartLabel) || 
                              e.message.toLowerCase().startsWith(fieldLabel.toLowerCase());

          return startsWithField ? e.message : `${capitalizedField}: ${e.message}`;
        }
        return e.message;
      })
      .join('\n');
  }

  // Fallback to top-level backend error message
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // Fallback to JS standard error message
  if (err.message) {
    return err.message;
  }

  return fallbackMessage;
}

