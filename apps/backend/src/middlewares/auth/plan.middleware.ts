import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.config';
import { checkAndExpireUserPlan } from '../../utils/plan.utils';

export async function requirePro(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await checkAndExpireUserPlan(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.plan !== 'PRO') {
      return res.status(403).json({
        success: false,
        requiresPro: true,
        errorType: 'PLAN_GATED',
        message: 'This feature is only available on the PRO plan. Please upgrade your subscription to gain access.'
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
