import { Response, NextFunction } from 'express';
import { UserRole } from '../generated/prisma';
import { AuthRequest } from './auth.middleware';

export const requireRole = (allowedRoles: UserRole[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		const role = req.user?.role as UserRole | undefined;

		if (!role || !allowedRoles.includes(role)) {
			return res.status(403).json({
				code: 403,
				status: 'Failed',
				data: 'Forbidden',
			});
		}

		next();
	};
};
