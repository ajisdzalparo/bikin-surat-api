import { Router } from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.services';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '../../generated/prisma';
import { ValidateMiddleware } from '../../middleware/validate';
import { templateSchema } from './admin.validation';

const router = Router();
const service = new AdminService();
const controller = new AdminController(service);

router.use(requireRole([UserRole.ADMIN]));

router.get('/stats', controller.stats);
router.get('/users', controller.listUsers);
router.post('/users/:userId/suspend', controller.suspendUser);
router.post('/users/:userId/activate', controller.activateUser);

router.get('/transactions', controller.listTransactions);
router.post('/transactions/:transactionId/verify', controller.verifyTransaction);

router.get('/templates', controller.listTemplates);
router.post(
	'/templates',
	ValidateMiddleware.validate(templateSchema),
	controller.createTemplate,
);
router.put(
	'/templates/:templateId',
	ValidateMiddleware.validate(templateSchema.partial()),
	controller.updateTemplate,
);
router.delete('/templates/:templateId', controller.deleteTemplate);

export default router;
