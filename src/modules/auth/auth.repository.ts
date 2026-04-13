import { prisma } from '../../config/database';
import { UserRole } from '../../generated/prisma';

export interface CreateUserData {
	full_name: string;
	email: string;
	password: string;
	role?: UserRole;
}

export class AuthRepository {
	async findUserByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		return user;
	}

	async createUser(data: CreateUserData) {
		const user = await prisma.user.create({
			data: {
				full_name: data.full_name,
				email: data.email,
				password: data.password,
				role: data.role ?? UserRole.USER,
			},
		});
		return user;
	}

	async findUserById(id: string) {
		return prisma.user.findUnique({
			where: { id },
		});
	}

	async createResetToken(userId: string, token: string, expiresAt: Date) {
		return prisma.passwordResetToken.create({
			data: {
				user_id: userId,
				token,
				expires_at: expiresAt,
			},
		});
	}

	async findValidResetToken(token: string) {
		return prisma.passwordResetToken.findFirst({
			where: {
				token,
				used_at: null,
				expires_at: {
					gt: new Date(),
				},
			},
		});
	}

	async markResetTokenAsUsed(id: string) {
		return prisma.passwordResetToken.update({
			where: { id },
			data: {
				used_at: new Date(),
			},
		});
	}

	async updateUserPassword(userId: string, passwordHash: string) {
		return prisma.user.update({
			where: { id: userId },
			data: {
				password: passwordHash,
			},
		});
	}
}
