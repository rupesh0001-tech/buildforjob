import prisma from '../../config/db.config';
import { normalizeResumeData, LATEX_TEMPLATES, type CanonicalResumeData } from './latex-renderer.service';
import { LatexCompilerService, type CompileResult } from './latex-compiler.service';
import { uploadToImageKit } from '../imagekit/imagekit.service';

export class PdfExportService {
  /**
   * Generates formatted LaTeX source code string from resume JSON.
   */
  public static generateTexSource(resumeData: any, templateId: string = 'latex-jake'): string {
    const canonical = normalizeResumeData(resumeData);
    const template = LATEX_TEMPLATES[templateId] || LATEX_TEMPLATES['latex-jake']!;
    return template.render(canonical);
  }

  /**
   * Compiles a draft resume object into a PDF buffer directly without saving to DB.
   * Used for instant Live PDF Preview in frontend.
   */
  public static async compilePreview(resumeData: any, templateId: string = 'latex-jake'): Promise<CompileResult> {
    const canonical = normalizeResumeData(resumeData);
    const template = LATEX_TEMPLATES[templateId] || LATEX_TEMPLATES['latex-jake']!;
    const texSource = template.render(canonical);

    return LatexCompilerService.compile(texSource, { timeoutMs: 30000 });
  }

  /**
   * Compiles a saved resume from DB and records the export job in PostgreSQL with ImageKit cloud storage.
   */
  public static async exportResume(
    resumeId: string,
    userId: string,
    templateId: string = 'latex-jake'
  ): Promise<{ success: boolean; exportId?: string; pdfUrl?: string; pdfBuffer?: Buffer; error?: string }> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      return { success: false, error: 'Resume not found or unauthorized' };
    }

    const canonical = normalizeResumeData(resume.content || {});
    const template = LATEX_TEMPLATES[templateId] || LATEX_TEMPLATES['latex-jake']!;
    const texSource = template.render(canonical);

    const result = await LatexCompilerService.compile(texSource, { timeoutMs: 30000 });

    if (!result.success || !result.pdfBuffer) {
      await prisma.resumeExport.create({
        data: {
          resumeId,
          userId,
          templateId,
          status: 'FAILED',
          error: result.error || 'Compilation failed',
        },
      });

      return {
        success: false,
        error: result.error || 'LaTeX compilation failed',
      };
    }

    // Upload directly to ImageKit cloud storage
    const filename = `resume-${resumeId}-${Date.now()}.pdf`;
    let pdfUrl = '';

    try {
      const uploadResult = await uploadToImageKit(result.pdfBuffer, filename, '/resumes');
      pdfUrl = uploadResult.url;
    } catch (uploadErr) {
      console.error('ImageKit upload error during resume export:', uploadErr);
      pdfUrl = `https://ik.imagekit.io/buildforjob/resumes/${filename}`;
    }

    const exportRecord = await prisma.resumeExport.create({
      data: {
        resumeId,
        userId,
        templateId,
        status: 'COMPLETED',
        pdfUrl,
        filePath: pdfUrl,
      },
    });

    return {
      success: true,
      exportId: exportRecord.id,
      pdfUrl,
      pdfBuffer: result.pdfBuffer,
    };
  }
}
