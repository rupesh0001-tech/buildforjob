import type { Request, Response, NextFunction } from 'express';
import { PdfExportService } from '../../services/latex/pdf-export.service';
import { LATEX_TEMPLATES } from '../../services/latex/latex-renderer.service';
import prisma from '../../config/db.config';

export async function exportResumePdf(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { templateId, download } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!id) {
      return res.status(400).json({ success: false, message: 'Resume ID is required' });
    }

    const selectedTemplate = templateId && LATEX_TEMPLATES[templateId] ? templateId : 'latex-jake';

    const result = await PdfExportService.exportResume(id, userId, selectedTemplate);

    if (!result.success || !result.pdfBuffer) {
      return res.status(422).json({
        success: false,
        message: result.error || 'Failed to compile resume PDF',
      });
    }

    if (download) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="resume-${id}.pdf"`);
      return res.send(result.pdfBuffer);
    }

    return res.json({
      success: true,
      message: 'Resume exported successfully',
      data: {
        exportId: result.exportId,
        pdfUrl: result.pdfUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function compilePreviewPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { content, templateId } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Resume content is required' });
    }

    const selectedTemplate = templateId && LATEX_TEMPLATES[templateId] ? templateId : 'latex-jake';

    const result = await PdfExportService.compilePreview(content, selectedTemplate);

    if (!result.success || !result.pdfBuffer) {
      return res.status(422).json({
        success: false,
        message: result.error || 'Failed to compile resume preview',
        logs: result.logs,
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    return res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
}

export async function getResumeTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    const templates = Object.values(LATEX_TEMPLATES).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
    }));

    return res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLatestResumeExport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const latestExport = await prisma.resumeExport.findFirst({
      where: { resumeId: id, userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestExport || !latestExport.pdfUrl) {
      return res.status(404).json({ success: false, message: 'No exported PDF found for this resume' });
    }

    return res.json({
      success: true,
      data: latestExport,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResumeLatexSource(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { content, templateId } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Resume content is required' });
    }

    const selectedTemplate = templateId && LATEX_TEMPLATES[templateId] ? templateId : 'latex-jake';
    const source = PdfExportService.generateTexSource(content, selectedTemplate);

    return res.json({
      success: true,
      data: {
        latexSource: source,
        templateId: selectedTemplate,
      },
    });
  } catch (error) {
    next(error);
  }
}

