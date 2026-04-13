import {
	ForgotPasswordInput,
	LoginInput,
	RegisterInput,
	ResetPasswordInput,
} from './auth.type';
import { AuthRepository } from './auth.repository';
import { comparePassword, hashPassword } from '../../utils/auth.helper';
import { signToken } from '../../utils/jwt';
import { Prisma, UserRole } from '../../generated/prisma';
import crypto from 'crypto';

export class AuthService {
	constructor(private repo: AuthRepository) {}

	async register(data: RegisterInput) {
		const isExist = await this.repo.findUserByEmail(data.email);
		if (isExist) {
			throw new Error('User already exist');
		}

		try {
			const password = await hashPassword(data.password);
			const user = await this.repo.createUser({
				full_name: data.full_name,
				email: data.email,
				password,
				role: UserRole.USER,
			});

			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new Error('Email already registered');
				}

				if (error.code === 'P2011') {
					throw new Error('Invalid user payload: required field is missing');
				}
			}

			throw error;
		}
	}

	async login(data: LoginInput) {
		const user = await this.repo.findUserByEmail(data.email);
		if (!user) {
			throw new Error('Invalid credentials');
		}
		if (user.is_suspended) {
			throw new Error('User is suspended');
		}
		const isValid = await comparePassword(data.password, user.password);
		if (!isValid) {
			throw new Error('Invalid credentials');
		}

		const { password, ...safeUser } = user;
		const accessToken = signToken({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		return {
			accessToken,
			user: safeUser,
		};
	}

	async me(userId: string) {
		const user = await this.repo.findUserById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const { password, ...safeUser } = user;
		return safeUser;
	}

	async requestPasswordReset(data: ForgotPasswordInput) {
		const user = await this.repo.findUserByEmail(data.email);
		// Prevent user enumeration.
		if (!user) {
			return { message: 'If email exists, reset token has been generated' };
		}

		const rawToken = crypto.randomBytes(32).toString('hex');
		const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
		const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

		await this.repo.createResetToken(user.id, tokenHash, expiresAt);

		return {
			message: 'If email exists, reset token has been generated',
			reset_token: rawToken,
			expires_at: expiresAt,
		};
	}

	async resetPassword(data: ResetPasswordInput) {
		const tokenHash = crypto
			.createHash('sha256')
			.update(data.token)
			.digest('hex');

		const storedToken = await this.repo.findValidResetToken(tokenHash);
		if (!storedToken) {
			throw new Error('Invalid or expired reset token');
		}

		const passwordHash = await hashPassword(data.new_password);
		await this.repo.updateUserPassword(storedToken.user_id, passwordHash);
		await this.repo.markResetTokenAsUsed(storedToken.id);

		return { message: 'Password reset successfully' };
	}
}
