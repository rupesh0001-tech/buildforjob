import { Router } from 'express';
import { createOrder, verifyPayment } from '../../controllers/payment/payment.controller';
import { authenticateJWT } from '../../middlewares/auth/jwt.middleware';

export const paymentRouter = Router();

paymentRouter.post('/create-order', authenticateJWT, createOrder);
paymentRouter.post('/verify', authenticateJWT, verifyPayment);

export default paymentRouter;
