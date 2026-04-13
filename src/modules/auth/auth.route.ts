import { Router } from 'express';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.services';
import { AuthController } from './auth.controller';
import { ValidateMiddleware } from '../../middleware/validate';
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
} from './auth.validation';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

const repo = new AuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post(
	'/register',
	ValidateMiddleware.validate(registerSchema),
	controller.register,
);
router.post(
	'/login',
	ValidateMiddleware.validate(loginSchema),
	controller.login,
);

router.get(
	'/me',
	authMiddleware,
	controller.me,
);
router.post(
	'/forgot-password',
	ValidateMiddleware.validate(forgotPasswordSchema),
	controller.forgotPassword,
);
router.post(
	'/reset-password',
	ValidateMiddleware.validate(resetPasswordSchema),
	controller.resetPassword,
);

export default router;
