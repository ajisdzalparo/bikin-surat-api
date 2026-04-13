import { Router } from 'express';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '../../generated/prisma';
import { ValidateMiddleware } from '../../middleware/validate';
import { updateProfileSchema } from './user.validation';

const router = Router();
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

router.put(
	'/profile',
	ValidateMiddleware.validate(updateProfileSchema),
	controller.updateProfile,
);
router.get('/list', requireRole([UserRole.ADMIN]), controller.listUser);
router.get('/:id', requireRole([UserRole.ADMIN]), controller.getUser);
router.delete('/:id', requireRole([UserRole.ADMIN]), controller.deleteUser);

export default router;
