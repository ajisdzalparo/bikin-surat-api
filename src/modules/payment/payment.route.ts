import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.services';
import { SubcriptionService } from '../subscribtion/subcription.services';
import { SubcriptionRepository } from '../subscribtion/subcription.repository';

const router = Router();

const subscriptionRepository = new SubcriptionRepository();
const subscriptionService = new SubcriptionService(subscriptionRepository);
const paymentService = new PaymentService(subscriptionService);
const paymentController = new PaymentController(paymentService);

router.post('/midtrans/webhook', paymentController.midtransWebhook);

export default router;
