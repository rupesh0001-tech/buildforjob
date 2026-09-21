import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.config';
import { checkAndExpireUserPlan } from '../../utils/plan.utils';

export async function createCoverLetter(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await checkAndExpireUserPlan(userId);

    if (user?.plan !== 'PRO') {
      const count = await prisma.coverLetter.count({ where: { userId } });
      if (count >= 3) {
        return res.status(403).json({
          success: false,
          requiresPro: true,
          code: 'COVER_LETTER_LIMIT_REACHED',
          message: 'Free plan is limited to a maximum of 3 cover letters. Upgrade to Pro for unlimited cover letters!'
        });
      }
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        ...req.body,
        userId,
      },
    });

    return res.status(201).json(coverLetter);
  } catch (error) {
    next(error);
  }
}
