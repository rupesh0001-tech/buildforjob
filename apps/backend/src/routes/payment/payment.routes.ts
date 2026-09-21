import { Router } from 'express';
import { createOrder, verifyPayment, getPaymentHistory } from '../../controllers/payment/payment.controller';
import { authenticateJWT } from '../../middlewares/auth/jwt.middleware';

export const paymentRouter = Router();

paymentRouter.post('/create-order', authenticateJWT, createOrder);
paymentRouter.post('/verify', authenticateJWT, verifyPayment);
paymentRouter.get('/history', authenticateJWT, getPaymentHistory);

export default paymentRouter;
