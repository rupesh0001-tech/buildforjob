import { normalizeCoverLetterData, getCoverLetterTemplate } from './cover-letter-latex-renderer.service';
import { LatexCompilerService, type CompileResult } from './latex-compiler.service';

export class CoverLetterPdfExportService {
  /**
   * Generates formatted LaTeX source code string from cover letter JSON.
   */
  public static generateTexSource(coverLetterData: any, templateId: string = 'latex-executive'): string {
    const canonical = normalizeCoverLetterData(coverLetterData);
    const template = getCoverLetterTemplate(templateId);
    return template.render(canonical);
  }

  /**
   * Compiles a draft cover letter object into a PDF buffer directly without saving to DB.
   * Used for instant Live PDF Preview in frontend.
   */
  public static async compilePreview(coverLetterData: any, templateId: string = 'latex-executive'): Promise<CompileResult> {
    const canonical = normalizeCoverLetterData(coverLetterData);
    const template = getCoverLetterTemplate(templateId);
    const texSource = template.render(canonical);

    return LatexCompilerService.compile(texSource, { timeoutMs: 30000 });
  }
}
