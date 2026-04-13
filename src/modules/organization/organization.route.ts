import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { ValidateMiddleware } from '../../middleware/validate';
import { createOrganizationSchema } from './organization.validation';

const router = Router();
const organizationController = new OrganizationController();

router.post(
	'/',
	ValidateMiddleware.validate(createOrganizationSchema),
	organizationController.createOrganization,
);
router.get('/', organizationController.findAll);
router.get('/:id', organizationController.findById);
router.put(
	'/:id',
	ValidateMiddleware.validate(createOrganizationSchema.partial()),
	organizationController.update,
);
router.delete('/:id', organizationController.delete);

export default router;
