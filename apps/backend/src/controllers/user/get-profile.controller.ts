import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.config';
import { checkAndRefreshTokens } from '../../utils/token.utils';
import { checkAndExpireUserPlan } from '../../utils/plan.utils';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check and downgrade expired subscriptions
    try {
      await checkAndExpireUserPlan(userId);
    } catch (planErr) {
      console.error("Failed to check plan expiry:", planErr);
    }

    // Refresh tokens dynamically if monthly refresh is due
    try {
      await checkAndRefreshTokens(userId);
    } catch (tokenErr) {
      console.error("Failed to refresh user tokens:", tokenErr);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        experience: true,
        education: true,
        projects: true,
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
}
