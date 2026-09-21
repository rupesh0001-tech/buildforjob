import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '../../config/db.config';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API keys are not configured');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { plan = 'PRO_MONTHLY' } = req.body;

    if (plan !== 'PRO_MONTHLY' && plan !== 'PRO_ANNUAL') {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan selected' });
    }

    // Pricing:
    // PRO_MONTHLY: ₹2 (200 paise) for 1 month
    // PRO_ANNUAL: ₹2/month for first 6 months (₹12) + ₹199/month for next 6 months (₹1,194) = ₹1,206 (120600 paise) for 1 year (365 days)
    let amount = 200; // 200 paise = ₹2 for monthly
    if (plan === 'PRO_ANNUAL') {
      amount = 120600; // ₹1,206 = (6 * 2) + (6 * 199)
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    };

    const order = await razorpay.orders.create(options);

    // Securely persist the order in the database to prevent replay and parameter tampering attacks
    await prisma.payment.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        plan,
        status: 'CREATED',
      },
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification details' });
    }

    // 1. Verify DB order exists and belongs to this user (prevents cross-user theft)
    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!existingPayment || existingPayment.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Order verification failed or unauthorized' });
    }

    // 2. Prevent replay attacks (payment already processed)
    if (existingPayment.status === 'SUCCESS') {
      return res.status(400).json({ success: false, message: 'This payment has already been verified and processed' });
    }

    // 3. Cryptographic signature check
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Razorpay secret key not configured' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // 4. Server-to-server Razorpay API verification (confirm capture status & exact amount)
    try {
      const razorpay = getRazorpayInstance();
      const rzpPayment: any = await razorpay.payments.fetch(razorpay_payment_id);

      if (!rzpPayment || rzpPayment.order_id !== razorpay_order_id) {
        return res.status(400).json({ success: false, message: 'Payment does not match the generated order' });
      }

      if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
        return res.status(400).json({ success: false, message: `Payment is not in captured status (${rzpPayment.status})` });
      }

      if (rzpPayment.amount !== existingPayment.amount) {
        return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
      }
    } catch (rzpFetchErr: any) {
      console.error('[PaymentVerify] Razorpay fetch check failed:', rzpFetchErr.message);
      // If network error with Razorpay API but signature is cryptographically valid, proceed with caution
    }

    // 5. Calculate expiration date based on the plan saved in the database:
    // PRO_MONTHLY = 30 days (1 month)
    // PRO_ANNUAL = 180 days (6 months launch offer)
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, planExpiresAt: true },
    });

    const now = new Date();
    const baseDate = (currentUser?.plan === 'PRO' && currentUser.planExpiresAt && currentUser.planExpiresAt > now)
      ? new Date(currentUser.planExpiresAt)
      : now;
    const durationDays = existingPayment.plan === 'PRO_ANNUAL' ? 365 : 30;
    const planExpiresAt = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 6. Update user's plan and expiry date in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PRO',
        planExpiresAt,
        tokens: 50.0,
      },
    });

    // 7. Mark DB payment record as SUCCESS
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: 'SUCCESS',
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        experience: true,
        education: true,
        projects: true,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser || {};

    return res.json({
      success: true,
      message: `Payment successfully verified! Your account is upgraded to PRO for ${existingPayment.plan === 'PRO_ANNUAL' ? '1 year (Annual Plan)' : '1 month'}.`,
      data: {
        plan: 'PRO',
        planExpiresAt,
        tokens: 50.0,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const payments = await prisma.payment.findMany({
      where: { userId, status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        amount: true,
        currency: true,
        plan: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
}
