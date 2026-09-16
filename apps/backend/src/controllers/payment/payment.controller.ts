import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '../../config/db.config';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}


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

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { plan = 'PRO_MONTHLY' } = req.body;

    let amount = 200; // Special Discount ₹2 (200 paise)
    if (plan === 'PRO_ANNUAL') {
      amount = 200; // Special Discount ₹2
    } else if (plan === 'SINGLE_ATS') {
      amount = 200; // ₹2
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

export async function verifyPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification details' });
    }

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

    // Payment signature is valid! Upgrade user plan or tokens in database
    if (plan === 'SINGLE_ATS') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: 1.0 },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'PRO',
          tokens: 50.0,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Payment successfully verified! Your account has been upgraded.',
      data: { plan: plan === 'SINGLE_ATS' ? 'SINGLE_ATS' : 'PRO' },
    });
  } catch (error) {
    next(error);
  }
}
