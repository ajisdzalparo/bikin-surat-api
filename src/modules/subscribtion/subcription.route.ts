import { Router } from 'express';
import { SubcriptionController } from './subcription.controller';
import { SubcriptionRepository } from './subcription.repository';
import { SubcriptionService } from './subcription.services';
import { createCheckoutSchema } from './subscription.validation';
import { ValidateMiddleware } from '../../middleware/validate';

const router = Router();
const repo = new SubcriptionRepository();
const service = new SubcriptionService(repo);
const controller = new SubcriptionController(service);

router.get('/plans', controller.listPlans);
router.get('/current', controller.getCurrent);
router.post(
	'/checkout',
	ValidateMiddleware.validate(createCheckoutSchema),
	controller.createCheckout,
);
router.post('/cancel', controller.cancel);

export default router;
