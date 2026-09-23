import type { Request, Response, NextFunction } from 'express';
import { CoverLetterPdfExportService } from '../../services/latex/cover-letter-pdf-export.service';
import { getCoverLetterTemplate } from '../../services/latex/cover-letter-latex-renderer.service';

const DISTINCT_TEMPLATES = [
  { id: 'latex-executive', name: 'Executive Column', description: 'Clean header columns with contact metadata and bold header accent' },
  { id: 'latex-moderncv', name: 'ModernCV Casual', description: 'Contemporary European standard with clean header and recipient alignment' },
  { id: 'latex-classic', name: 'Classic Minimalist', description: 'Timeless Harvard-style centered header with elegant typography' },
  { id: 'latex-tech', name: 'Modern Tech Accent', description: 'Bold colored accent bar with structured metadata for tech applicants' },
];

export async function compileCoverLetterPreviewPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { content, templateId } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Cover letter content is required' });
    }

    const targetTemplate = getCoverLetterTemplate(templateId);

    const result = await CoverLetterPdfExportService.compilePreview(content, targetTemplate.id);

    if (!result.success || !result.pdfBuffer) {
      return res.status(422).json({
        success: false,
        message: result.error || 'Failed to compile cover letter preview',
        logs: result.logs,
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="cover-letter-preview.pdf"');
    return res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
}

export async function getCoverLetterLatexSource(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { content, templateId } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Cover letter content is required' });
    }

    const targetTemplate = getCoverLetterTemplate(templateId);
    const source = CoverLetterPdfExportService.generateTexSource(content, targetTemplate.id);

    return res.json({
      success: true,
      data: {
        latexSource: source,
        templateId: targetTemplate.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCoverLetterTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({
      success: true,
      data: DISTINCT_TEMPLATES,
    });
  } catch (error) {
    next(error);
  }
}
