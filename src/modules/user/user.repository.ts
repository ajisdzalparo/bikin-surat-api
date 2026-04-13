import { prisma } from '../../config/database';
import { UpdateProfileInput } from './user.type';

export class UserRepository {
	async findUserById(id: string) {
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		return user;
	}

	async updateProfile(id: string, data: UpdateProfileInput) {
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				full_name: data.full_name,
				avatar_url: data.avatar_url,
			},
		});
		return user;
	}

	async listUser() {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				full_name: true,
				email: true,
				role: true,
				avatar_url: true,
				created_at: true,
				updated_at: true,
			},
		});
		return users;
	}

	async deleteUser(id: string) {
		return prisma.user.delete({
			where: { id },
		});
	}
}
