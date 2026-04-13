import jwt from 'jsonwebtoken';
import { UserRole } from '../generated/prisma';

const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET;
	if (secret) {
		return secret;
	}

	if (process.env.NODE_ENV !== 'production') {
		return 'dev-jwt-secret';
	}

	throw new Error('JWT_SECRET is not defined');
};

const getJwtExpiry = (): jwt.SignOptions['expiresIn'] =>
	(process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';

export interface JwtPayload {
	id: string;
	email: string;
	role: UserRole;
}

export const signToken = (payload: JwtPayload) => {
	return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiry() });
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
