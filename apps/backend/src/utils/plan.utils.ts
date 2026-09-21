import prisma from '../config/db.config';

/**
 * Checks if a user's PRO subscription has expired.
 * If expired, automatically downgrades to FREE, clears planExpiresAt,
 * and ensures NO bonus 5 credits are injected.
 */
export async function checkAndExpireUserPlan(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        plan: true,
        planExpiresAt: true,
        tokens: true,
      },
    });

    if (!user) return null;

    if (user.plan === 'PRO' && user.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
      // Subscription has expired. Downgrade to FREE without injecting extra credits.
      const downgradedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'FREE',
          planExpiresAt: null,
          // Preserve leftover tokens capped at 5.0, do NOT add +5 bonus credits
          tokens: Math.min(user.tokens, 5.0),
        },
        select: {
          id: true,
          plan: true,
          planExpiresAt: true,
          tokens: true,
        },
      });

      console.log(`[PlanExpiry] User ${userId} PRO subscription expired. Downgraded to FREE.`);
      return downgradedUser;
    }

    return user;
  } catch (error) {
    console.error(`[PlanExpiry] Error checking plan expiry for user ${userId}:`, error);
    return null;
  }
}
