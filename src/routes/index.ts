import express from 'express';
import authRouter from '../modules/auth/auth.route';
import { authMiddleware } from '../middleware/auth.middleware';
import userRouter from '../modules/user/user.route';
import subscriptionRouter from '../modules/subscribtion/subcription.route';
import organizationRouter from '../modules/organization/organization.route';
import paymentRouter from '../modules/payment/payment.route';
import documentRouter from '../modules/document/document.route';
import adminRouter from '../modules/admin/admin.route';

const router = express.Router();

// Public routes
router.use('/auth', authRouter);
router.use('/payment', paymentRouter);

// Protected routes
router.use('/user', authMiddleware, userRouter);
router.use('/subscription', authMiddleware, subscriptionRouter);
router.use('/organizations', authMiddleware, organizationRouter);
router.use('/documents', authMiddleware, documentRouter);
router.use('/admin', authMiddleware, adminRouter);

export default router;
