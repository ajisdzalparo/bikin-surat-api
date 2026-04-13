import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verifyToken } from '../utils/jwt';

// extend Request biar ada user
export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				code: 401,
				status: 'error',
				message: 'Unauthorized',
			});
		}

		// ambil token
		const token = authHeader.split(' ')[1];

		// verify token
		const decoded = verifyToken(token);

		// inject ke request
		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).json({
			code: 401,
			status: 'error',
			message: 'Unauthorized',
		});
	}
};
