import type { Request, Response, NextFunction } from 'express';
import { extractTextFromPDF, computeATSScore } from '../../services/ats/ats.service';
import { uploadToImageKit } from '../../services/imagekit/imagekit.service';
import prisma from '../../config/db.config';
import { deductTokens } from '../../utils/token.utils';
import { checkAndExpireUserPlan } from '../../utils/plan.utils';

export async function checkATS(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file!;
    const { jobDescription } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await checkAndExpireUserPlan(userId);

    const isPro = user?.plan === 'PRO';

    if (!isPro) {
      const lifetimeScans = await prisma.atsReport.count({ where: { userId } });
      if (lifetimeScans >= 5) {
        return res.status(403).json({
          success: false,
          requiresPro: true,
          code: 'ATS_LIMIT_REACHED',
          message: 'You have reached your limit of 5 ATS scans on the Free plan. Upgrade to Pro for 50 scans monthly!'
        });
      }
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyScans = await prisma.atsReport.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo }
        }
      });
      if (monthlyScans >= 50) {
        return res.status(403).json({
          success: false,
          code: 'MONTHLY_LIMIT_REACHED',
          message: 'You have reached your limit of 50 ATS scans for this month.'
        });
      }
    }

    // Deduct 1 token for an ATS scan
    try {
      await deductTokens(userId, 1.0);
    } catch (tokenErr: any) {
      return res.status(403).json({ 
        success: false, 
        errorType: 'INSUFFICIENT_TOKENS', 
        message: tokenErr.message 
      });
    }

    const resumeText = await extractTextFromPDF(file.buffer);
    const { score, details } = await computeATSScore(resumeText, jobDescription.trim());

    let resumeUrl: string | null = null;
    try {
      const uploadResult = await uploadToImageKit(
        file.buffer,
        `ats_${Date.now()}_${file.originalname}`,
        "/ats_resumes"
      );
      resumeUrl = uploadResult.url;
    } catch (uploadErr: unknown) {
      const err = uploadErr as Error;
      console.error("Failed to upload resume to ImageKit:", err.message);
    }

    const report = await prisma.atsReport.create({
      data: {
        userId,
        resumeName: file.originalname,
        resumeUrl,
        resumeText,
        jobDescription: jobDescription.trim(),
        score,
        details,
        resumeWordCount: resumeText.split(/\s+/).filter(Boolean).length,
        jdWordCount: jobDescription.trim().split(/\s+/).filter(Boolean).length,
      },
    });

    return res.json({
      success: true,
      data: {
        id: report.id,
        score: report.score,
        details: report.details,
        resumeWordCount: report.resumeWordCount,
        jdWordCount: report.jdWordCount,
        resumeUrl: report.resumeUrl,
        resumeName: report.resumeName,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
